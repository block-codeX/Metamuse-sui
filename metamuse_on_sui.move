/*
/// Module: metamuse_on_sui
module metamuse_on_sui::metamuse_on_sui;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


/*
/// Module: sui_metamuse
module sui_metamuse::sui_metamuse;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions


module 0x0::artwork;



public struct ArtworkMetadata has key, store {
    id: UID,
    title: std::string::String,
    ipfs_hash: std::string::String,
    creator: address,
    contributors: vector<address>,
    contribution_shares: sui::table::Table<address, u64>,
    total_shares: u64,
    is_minted: bool,
    creation_time: u64
}

public struct ArtworkNFT has key, store {
    id: UID,
    metadata_id: ID,
    royalty_percentage: u64
}

public struct ContributorCap has key, store {
    id: UID,
    artwork_id: ID,
    share_percentage: u64
}

// Events
#[allow(unused_field)]
public struct ArtworkCreated has drop, copy{
    artwork_id: ID,
    creator: address,
}

#[allow(unused_field)]
public struct ContributorAdded has copy, drop{
    artwork_id: ID,
    contributor: address,
    share_percentage: u64
}

#[allow(unused_field)]
public struct ArtworkMinted has copy, drop {
    nft_id: ID,
    metadata_id: ID
}

// initial new artwork
#[allow(unused_variable)]
public entry fun create_artwork(
    title: std::string::String,
    ipfs_hash: std::string::String,
    ctx: &mut TxContext
) {
    let metadata = ArtworkMetadata {
        id: object::new(ctx),
        title,
        ipfs_hash,
        creator: tx_context::sender(ctx),
        contributors: vector::empty(),
        contribution_shares: sui::table::new(ctx),
        total_shares: 0,
        is_minted: false,
        creation_time: tx_context::epoch(ctx),
    };

    let artwork_id = object::id(&metadata);
    // transfer to creator
    
    transfer::share_object(metadata);
    
    // emit create artwork event 
    sui::event::emit(ArtworkCreated { artwork_id , creator: tx_context::sender(ctx) })
}

// add contributors to artwork
public entry fun add_contributor(
    metadata: &mut ArtworkMetadata,
    contributor: address,
    share_percentage: u64,
    ctx: &mut TxContext
) {
    assert!(!metadata.is_minted, 0); // Cannot modify after minting
    assert!(tx_context::sender(ctx) == metadata.creator, 1);

    vector::push_back(&mut metadata.contributors, contributor);
    sui::table::add(&mut metadata.contribution_shares, contributor, share_percentage);
    metadata.total_shares = metadata.total_shares + share_percentage;

    // create and share contributor capability
    let contributor_cap = ContributorCap {
        id: object::new(ctx),
        artwork_id: object::id(metadata),
        share_percentage,
    };
    transfer::transfer(contributor_cap, contributor);

    // emit added contributor event
    sui::event::emit(ContributorAdded {
        artwork_id: object::id(metadata),
        contributor,
        share_percentage,
    })
}


// mint the nft from artwork
public fun mint_nft(
    metadata: &mut ArtworkMetadata,
    royalty_percentage: u64,
    ctx: &mut TxContext
): ArtworkNFT {
    assert!(!metadata.is_minted, 0);
    assert!(tx_context::sender(ctx) == metadata.creator, 1);

    metadata.is_minted = true;

    let minted_artwork = ArtworkNFT {
        id:object::new(ctx),
        metadata_id: object::id(metadata),
        royalty_percentage,
    };
    // sui::event::emit(ArtworkMinted { 
    //     nft_id: object::id(&minted_artwork), 
    //     metadata_id: object::id(metadata) 
    //     });
    minted_artwork
}

// distribute royalty to contributors
public entry fun distribute_royalties(
    metadata: &mut ArtworkMetadata,
    mut payment: sui::coin::Coin<sui::sui::SUI>,
    ctx: &mut TxContext
) {
    let  payment_value = sui::coin::value(&payment);
    let mut i = 0;
    let len = vector::length(&metadata.contributors);

    while (i < len) {
        let contributor = *vector::borrow(&metadata.contributors, i);
        let share = *sui::table::borrow(&metadata.contribution_shares, contributor);
        let amount = (payment_value * share)/ metadata.total_shares;

        if (amount > 0){
            let split_coin = sui::coin::split(&mut payment, amount, ctx);
            transfer::public_transfer(split_coin, contributor);
        };
        i = i + 1;
    };
    // transfer any remaining dust to the creator
    if (sui::coin::value(&payment) > 0){
        transfer::public_transfer(payment, metadata.creator);
    }else {
        sui::coin::destroy_zero(payment);
    };
}


// get contributor share
public entry fun get_shared_percentage(cap: &ContributorCap): u64 {
    cap.share_percentage
}

// check if an artwork is minted
public fun is_minted(metadata: &ArtworkMetadata): bool{
    metadata.is_minted
}

