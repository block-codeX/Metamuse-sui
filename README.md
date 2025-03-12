

PITCH DECK: https://eu.docs.wps.com/module/common/loadPlatform/?sid=sIAfN-caKAqDylrkG&v=v2



General Overview

This project aims to create a collaborative platform for digital artists, allowing them to create, mint, and share digital artwork as a fractionalized NFT, facilitating shared ownership and royalties among collaborators. Built on the SUI networks, the platform emphasizes decentralized storage via Walrus to ensure metadata and artwork snapshots are securely stored.

Project Goal
Objective: Enable artists to collaborate on digital artwork in real-time and mint the final piece as an NFT. Through fractional ownership, contributors can enjoy ongoing royalties whenever the artwork is sold or resold. Core Features: Collaborative Canvas: A real-time drawing canvas where artists can work simultaneously. NFT Minting (Lisk): The completed artwork is minted on SUI as an NFT. Fractional Ownership (SUI): Royalties are distributed among contributors on SUI.  Storage: Stores artwork and metadata for decentralization and permanence.

Architecture & Tech Stack
Backend: SUI Manages NFT minting and ownership contracts. Move contract: Manages fractional ownership and royalty distribution. Frontend: React.js with Canvas API or Fabric.js: For the interactive, collaborative canvas. WebSockets (Socket.io): Ensures real-time collaboration across sessions. Storage: Walrus: Stores artwork snapshots and metadata, ensuring secure access and decentralized storage.

Key Features
A. Real-Time Collaborative Canvas: Artists can select brushes, colors, undo actions, and see updates live. Snapshots are periodically stored on IPFS, allowing version control and attribution. 
B. NFT Minting on SUI 
C. Fractional Ownership on Arbitrum: Ownership shares are assigned based on contribution. A smart contract on SUI manages royalties, allowing automated redistribution upon resale.
D. Walrus Integration: Artwork snapshots and the final version are stored on walrus, linking to the NFT for reliable access and storage.

Development Workflow
Canvas Setup: Build the interactive canvas with WebSockets for real-time updates. NFT Integration: Use SUI SDK to enable NFT minting post-creation and link Walrus storage. Ownership & Royalty Distribution: Develop move smart contracts to manage royalties, linking with the NFT. 

Stretch Features
Artist Profiles: Allow artists to showcase past collaborations. Version Control: Artists can revert to earlier canvas states. Social Engagement: Enable likes, comments, and sharing to increase exposure.

