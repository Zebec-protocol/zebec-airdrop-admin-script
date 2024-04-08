import BigNumber from "bignumber.js";
import { BN } from "bn.js";
import * as fs from "fs";
import path from "path";

import { Address, Program, translateAddress } from "@coral-xyz/anchor";
import {
	ComputeBudgetProgram,
	Connection,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { AIRDROP_PROGRAM_ID, PROGRAM_SEEDS } from "./constants";
import { tokenHoldersCsvToObject } from "./csv2Json";
import { IDL } from "./idl";
import { chunkArray, getProvider, tryParseError } from "./utils";

function deriveZebecTokenHolderPda(
	zebecAirdropPda: Address,
	tokenHolder: Address,
	programId: Address,
): PublicKey {
	const _zebecAirdropPda = translateAddress(zebecAirdropPda);
	const _programId = translateAddress(programId);
	const _tokenHolder = translateAddress(tokenHolder);

	const [address] = PublicKey.findProgramAddressSync(
		[
			Buffer.from(PROGRAM_SEEDS.tokenHolderPda),
			_zebecAirdropPda.toBuffer(),
			_tokenHolder.toBuffer(),
		],
		_programId,
	);
	return address;
}

export async function whitelistTokenHolder(
	connection: Connection,
	zebecAirdropPda: PublicKey,
	csvFileName: string,
	chunkSize: number,
	airdrpTokenDecimals: number,
) {
	const provider = getProvider(connection);
	const program = new Program(IDL, AIRDROP_PROGRAM_ID, provider);

	const admin = provider.publicKey;

	const file = fs.readFileSync(path.resolve(__dirname, "inputs", csvFileName), "utf-8");
	const tokenHoldersDataList = tokenHoldersCsvToObject(file);
	console.log("tokenHoldersDataList count:", tokenHoldersDataList.length);

	const chunkList = chunkArray(tokenHoldersDataList, chunkSize);
	console.log("chunk list count:", chunkList.length);

	for (let i = 0; i < chunkList.length; i++) {
		const chunk = chunkList[i];
		const ixs = await Promise.all(
			chunk.map(async (data) => {
				const parsedAmount = BigNumber(data.amount)
					.times(10 ** airdrpTokenDecimals)
					.toFixed(0);
				const zbcTokenHolderPda = deriveZebecTokenHolderPda(
					zebecAirdropPda,
					data.tokenHolder,
					program.programId,
				);
				return program.methods
					.whitelistTokenHolder({
						eligible: true,
						amount: new BN(parsedAmount),
					})
					.accounts({
						admin,
						systemProgram: SystemProgram.programId,
						zbcTokenHolder: new PublicKey(data.tokenHolder),
						zbcTokenHolderPda,
						zebecAirdropPda,
					})
					.instruction();
			}),
		);
		const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
			units: 160000,
		});
		const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
			microLamports: 1800000,
		});
		const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
		const message = new TransactionMessage({
			instructions: [modifyComputeUnits, addPriorityFee, ...ixs],
			payerKey: provider.publicKey,
			recentBlockhash: blockhash,
		}).compileToV0Message();

		const tx = new VersionedTransaction(message);

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
