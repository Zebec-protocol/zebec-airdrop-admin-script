import { PublicKey } from "@solana/web3.js";

export const AIRDROP_PROGRAM_ID = new PublicKey("5UycQcVU1X6YKxktaPCFEW5maerKCzNSkrdH1VFTSEJD");

export const PROGRAM_SEEDS = {
	airdropPda: "airdrop",
	airdropVault: "airdrop_vault",
	nftHolderPda: "nft_holder",
	tokenHolderPda: "token_holder",
};
