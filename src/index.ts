import { PublicKey } from "@solana/web3.js";

import { initAirdrop } from "./initAirdrop";
import { getConnection } from "./utils";

async function main() {
	const connection = getConnection("devnet");

	const eventName = "Zebec Giveaway Airdrop 002";
	const airdropToken = new PublicKey("5qEhjfVc5C6bz1Vi7Uj5SiSeDvqsMtZwuVS9njoVPcRr");
	const airdropTokenDecimals = 9;
	const airdropAmountPerNft = 1000;

	await initAirdrop(connection, eventName, airdropToken, airdropTokenDecimals, airdropAmountPerNft);

	// await createLookupTableAccount(connection);
	// const lookupTableAddress = new PublicKey("ALhW7w7qY9Yrf5wF59M6JDzrqna7N5oEpMbwkKCRBwmT");

	// const chunkSize = 10;
	// await whitelistTokenHolder(connection, "tokenHolders.csv", chunkSize, airdropTokenDecimals);

	// await whitelistNftHolder(connection, "nftHolders.csv", chunkSize);
}

main();
