import { PublicKey } from "@solana/web3.js";

import { getConnection } from "./utils";
import { whitelistNftHolder } from "./whitelistNftHolders";
import { whitelistTokenHolder } from "./whitelistTokenHolders";

async function main() {
	const connection = getConnection("devnet");

	const zebecAirdropPda = new PublicKey("7yeGm8LN6Kd3s7i3jgBkJy4eJepqkDvy4djkQPn3xXeQ");
	const zebecAirdropTokenDecimals = 9;
	const chunkSize = 10;

	// await createLookupTableAccount(connection, zebecAirdropPda);

	// const lookupTableAddress = new PublicKey("ALhW7w7qY9Yrf5wF59M6JDzrqna7N5oEpMbwkKCRBwmT");

	await whitelistTokenHolder(
		connection,
		zebecAirdropPda,
		"tokenHolders.csv",
		chunkSize,
		zebecAirdropTokenDecimals,
	);

	await whitelistNftHolder(connection, zebecAirdropPda, "nftHolders.csv", chunkSize);
}

main();
