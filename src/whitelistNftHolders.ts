import * as fs from "fs";
import path from "path";

import { Address, BN, Program, translateAddress } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

import { AIRDROP_PROGRAM_ID, PROGRAM_SEEDS } from "./constants";
import { nftHoldersCsvToObject } from "./csv2Json";
import { IDL } from "./idl";
import { chunkArray, getProvider, tryParseError } from "./utils";

function deriveZebecNftHolderPda(
	zebecAirdropPda: Address,
	nftHolder: Address,
	programId: Address,
): PublicKey {
	const _zebecAirdropPda = translateAddress(zebecAirdropPda);
	const _programId = translateAddress(programId);
	const _nftHolder = translateAddress(nftHolder);

	const [address] = PublicKey.findProgramAddressSync(
		[Buffer.from(PROGRAM_SEEDS.nftHolderPda), _zebecAirdropPda.toBuffer(), _nftHolder.toBuffer()],
		_programId,
	);
	return address;
}

export async function whitelistNftHolder(
	connection: Connection,
	zebecAirdropPda: PublicKey,
	csvFileName: string,
	chunkSize: number,
) {
	const provider = getProvider(connection);
	const program = new Program(IDL, AIRDROP_PROGRAM_ID, provider);

	const admin = provider.publicKey;

	const file = fs.readFileSync(path.resolve(__dirname, "inputs", csvFileName), "utf-8");
	const nftHoldersDataList = nftHoldersCsvToObject(file);
	console.log("nft holders data list count:", nftHoldersDataList.length);

	const chunkList = chunkArray(nftHoldersDataList, chunkSize);
	console.log("chunk list count:", chunkList.length);

	for (let i = 0; i < chunkList.length; i++) {
		const chunk = chunkList[i];
		const ixs = await Promise.all(
			chunk.map(async (data) => {
				const zbcNftHolderPda = deriveZebecNftHolderPda(
					zebecAirdropPda,
					data.nftHolder,
					program.programId,
				);
				return program.methods
					.whitelistNftHolder({
						eligible: true,
						nftCount: new BN(data.nftCount),
					})
					.accounts({
						admin,
						systemProgram: SystemProgram.programId,
						zbcNftHolder: new PublicKey(data.nftHolder),
						zbcNftHolderPda,
						zebecAirdropPda,
					})
					.instruction();
			}),
		);
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
		const tx = new Transaction().add(...ixs);
		tx.feePayer = provider.publicKey;
		tx.recentBlockhash = blockhash;
		tx.lastValidBlockHeight = lastValidBlockHeight;

		const signed = await provider.wallet.signTransaction(tx);

		try {
			const signature = await connection.sendRawTransaction(signed.serialize());
			console.log("signature:", signature);

			await connection.confirmTransaction(
				{ blockhash, lastValidBlockHeight, signature },
				"confirmed",
			);
		} catch (err) {
			throw tryParseError(err, program.idl.errors);
		}
	}
}
