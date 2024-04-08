import { PublicKey } from "@solana/web3.js";

import { getConnection } from "./utils";
import { whitelistNftHolder } from "./whitelistNftHolders";

async function main() {
	const connection = getConnection("devnet");

	const zebecAirdropPda = new PublicKey("7yeGm8LN6Kd3s7i3jgBkJy4eJepqkDvy4djkQPn3xXeQ");
	const zebecAirdropTokenDecimals = 9;
	const chunkSize = 11;

	// await whitelistTokenHolder(
	// 	connection,
	// 	zebecAirdropPda,
	// 	"tokenHolders.csv",
	// 	chunkSize,
	// 	zebecAirdropTokenDecimals,
	// );

	await whitelistNftHolder(connection, zebecAirdropPda, "nftHolders.csv", chunkSize);
}

main();
