

PITCH DECK: https://eu.docs.wps.com/module/common/loadPlatform/?sid=sIAfN-caKAqDylrkG&v=v2

DEMO VIDEO: https://drive.google.com/file/d/1Vi4PFfVHbgpegiZW66w2mPCGL1vTnS8J/view?usp=drivesdk

DOCUMENTATION: https://meta-dcs-inky.vercel.app/

LIVE LINK: https://muse-364595.netlify.app/


General Overview

This project aims to create a collaborative platform for digital artists, allowing them to create, mint, and share digital artwork as a fractionalized NFT, facilitating shared ownership and royalties among collaborators. Built on the Lisk and Arbitrum networks, the platform emphasizes decentralized storage via IPFS to ensure metadata and artwork snapshots are securely stored.

Project Goal
Objective: Enable artists to collaborate on digital artwork in real-time and mint the final piece as an NFT. Through fractional ownership, contributors can enjoy ongoing royalties whenever the artwork is sold or resold. Core Features: Collaborative Canvas: A real-time drawing canvas where artists can work simultaneously. NFT Minting (Lisk): The completed artwork is minted on Lisk as an NFT. Fractional Ownership (Arbitrum): Royalties are distributed among contributors on Arbitrum. IPFS Storage: Stores artwork and metadata for decentralization and permanence.

Architecture & Tech Stack
Backend: Lisk SDK: Manages NFT minting and ownership contracts. Arbitrum: Manages fractional ownership and royalty distribution. Frontend: React.js with Canvas API or Fabric.js: For the interactive, collaborative canvas. WebSockets (Socket.io): Ensures real-time collaboration across sessions. Storage: IPFS: Stores artwork snapshots and metadata, ensuring secure access and decentralized storage.

Key Features
A. Real-Time Collaborative Canvas: Artists can select brushes, colors, undo actions, and see updates live. Snapshots are periodically stored on IPFS, allowing version control and attribution. B. NFT Minting on Lisk: Finalized artwork is minted as an NFT using Lisk’s SDK, with IPFS storing metadata like contributors and artwork details. C. Fractional Ownership on Arbitrum: Ownership shares are assigned based on contribution. A smart contract on Arbitrum manages royalties, allowing automated redistribution upon resale. D. IPFS Integration: Artwork snapshots and the final version are stored on IPFS, linking to the NFT for reliable access and storage.

Development Workflow
Canvas Setup: Build the interactive canvas with WebSockets for real-time updates. NFT Integration: Use Lisk SDK to enable NFT minting post-creation and link IPFS storage. Ownership & Royalty Distribution: Develop Arbitrum smart contracts to manage royalties, linking with the NFT. Cross-Chain Testing: Validate seamless integration between Lisk, Arbitrum, and IPFS.

Stretch Features
Artist Profiles: Allow artists to showcase past collaborations. Version Control: Artists can revert to earlier canvas states. Social Engagement: Enable likes, comments, and sharing to increase exposure.

Presentation Tips
Demo: Show the collaborative process from creation to minting, highlighting fractional ownership setup. Tech Stack Overview: Explain Lisk’s NFT minting, Arbitrum’s role in ownership/royalties, and IPFS’s decentralization benefits. Artist Benefits: Emphasize revenue potential through royalties and secure, verifiable ownership records. This platform redefines collaboration, ownership, and earnings in digital art, leveraging blockchain's decentralized, transparent framework to benefit artists.

