/*
#[test_only]
module metamuse_on_sui::metamuse_on_sui_tests;
// uncomment this line to import the module
// use metamuse_on_sui::metamuse_on_sui;

const ENotImplemented: u64 = 0;

#[test]
fun test_metamuse_on_sui() {
    // pass
}

#[test, expected_failure(abort_code = ::metamuse_on_sui::metamuse_on_sui_tests::ENotImplemented)]
fun test_metamuse_on_sui_fail() {
    abort ENotImplemented
}
*/
#[test_only]

module 0x0::artwork_tests;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::test_scenario::{Self as ts, Scenario};
use std::string;
use 0x0::artwork::{Self, ArtworkMetadata, ContributorCap};

const CREATOR: address = @0xA;
const CONTRIBUTOR1: address = @0xB;
const CONTRIBUTOR2: address = @0xC;

#[test]
fun test_create_artwork() {
    let mut scenario = ts::begin(CREATOR);

    // create asrtwork
    test_create_artwork_scenario(&mut scenario);
    ts::end(scenario);
}

#[test]
fun test_add_contributor(){
    let mut scenario = ts::begin(CREATOR);

    // fisrt create an artwork
    test_create_artwork_scenario(&mut scenario);

    // add contributor
    ts::next_tx(&mut scenario, CREATOR);
    {
        let mut metadata = ts::take_shared<ArtworkMetadata>(&scenario);
        artwork::add_contributor(
            &mut metadata, 
            CONTRIBUTOR1,
             5000, 
             ts::ctx(&mut scenario)
        );
        ts::return_shared(metadata);
    };
    // verify the contributor recieved their cap
    ts::next_tx(&mut scenario, CONTRIBUTOR1);
    {
        let contributor_cap = ts::take_from_sender<ContributorCap>(&scenario);
        assert!(artwork::get_shared_percentage(&contributor_cap) == 5000, 1);
        ts::return_to_sender(&scenario, contributor_cap);
    };

    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = 1)]
fun test_add_contributor_unauthorised() {
    let mut scenario = ts::begin(CREATOR);

    test_create_artwork_scenario(&mut scenario);

    // try to add contributor from unathorised address
    ts::next_tx(&mut scenario, CONTRIBUTOR1);
    {
        let mut metadata = ts::take_shared<ArtworkMetadata>(&scenario);
        artwork::add_contributor(
            &mut metadata, 
            CONTRIBUTOR2, 
            5000, 
            ts::ctx(&mut scenario)
        );
        ts::return_shared(metadata);
    };
    ts::end(scenario);
}

#[test]
fun test_mint_nft(){
    let mut scenario = ts::begin(CREATOR);

    test_create_artwork_scenario(&mut scenario);

    // mint nft
    ts::next_tx(&mut scenario, CREATOR);
    {
        let mut metadata = ts::take_shared<ArtworkMetadata>(&scenario);
        let nft = artwork::mint_nft(&mut metadata, 500, ts::ctx(&mut scenario));
        std::debug::print(&metadata.is_minted());
        assert!(artwork::is_minted(&metadata), 0);
        // std::debug::print(was_taken_from_address())
        ts::return_shared(metadata);
        // ts::return_to_address(CREATOR, nft);
        ts::return_to_sender(&scenario, nft);
    };

    ts::end(scenario);
}

#[test]
fun test_distribute_royaltes(){
    let mut scenario = ts::begin(CREATOR);

    // setup art work two contributiors
    test_create_artwork_scenario(&mut scenario);

    // add contributors
    ts::next_tx(&mut scenario , CREATOR);
    {
        let mut metadata = ts::take_shared<ArtworkMetadata>(&scenario);
        artwork::add_contributor(
            &mut metadata, 
            CONTRIBUTOR1, 
            4000, 
            ts::ctx(&mut scenario)
            );
            artwork::add_contributor(
                &mut metadata, 
                CONTRIBUTOR2, 
                6000, 
                ts::ctx(&mut scenario));
                ts::return_shared(metadata);
    };

    // create test payment
    ts::next_tx(&mut scenario, CREATOR);

    {
        let mut metadata = ts::take_shared<ArtworkMetadata>(&scenario);
        let payment = coin::mint_for_testing<SUI>(1000, ts::ctx(&mut scenario));

        artwork::distribute_royalties(&mut metadata, payment, ts::ctx(&mut scenario));
        ts::return_shared(metadata);
    };

    // verify balance
    ts::next_tx(&mut scenario, CONTRIBUTOR1);

    {
        let balance = ts::take_from_sender<Coin<SUI>>(&scenario);
        assert!(coin::value(&balance) == 4000, 1);
        ts::return_to_sender(&scenario, balance);
    };

    ts::end(scenario);

}

fun test_create_artwork_scenario(scenario: &mut Scenario) {
    ts::next_tx(scenario, CREATOR);
    {
        artwork::create_artwork(string::utf8(b"Test Artwork"), string::utf8(b"test"), ts::ctx(scenario))
    }
}
