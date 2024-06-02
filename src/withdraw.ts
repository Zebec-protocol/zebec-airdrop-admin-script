import BigNumber from "bignumber.js";
import * as fs from "fs";
import path from "path";

import { BN, Program } from "@coral-xyz/anchor";
import {
	Connection,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { AIRDROP_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "./constants";
import { IDL } from "./idl";
import { deriveZebecAirdropVaultPda } from "./initAirdrop";
import { getAssociatedTokenAddressSync, getProvider, tryParseError } from "./utils";

export async function withdraw(
	connection: Connection,
	airdropToken: PublicKey,
	airdropTokenDecimals: number,
	withdrawAmount?: string,
) {
	const provider = getProvider(connection);
	const program = new Program(IDL, AIRDROP_PROGRAM_ID, provider);

	const pdaFile = fs.readFileSync(
		path.resolve(__dirname, "zebecAirdropPda", "address.json"),
		"utf-8",
	);
	const zebecAirdropPda = new PublicKey(JSON.parse(pdaFile).zebecAirdropPda);

	const admin = provider.publicKey;
	const adminAta = getAssociatedTokenAddressSync(airdropToken, admin);
	const airdropVault = deriveZebecAirdropVaultPda(zebecAirdropPda, program.programId);
	const airdropVaultAta = getAssociatedTokenAddressSync(airdropToken, airdropVault, true);

	let amount = new BN(0);
	if (!withdrawAmount) {
		const { value } = await connection.getTokenAccountBalance(airdropVaultAta);
		amount = new BN(value.amount);
	} else {
		amount = new BN(
			BigNumber(withdrawAmount)
				.times(10 ** airdropTokenDecimals)
				.toFixed(0),
		);
	}

	const ix = await program.methods
		.withdrawAirdrop(new BN(amount))
		.accounts({
			admin,
			adminAta,
			airdropToken,
			airdropVault,
			airdropVaultAta,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
			systemProgram: SystemProgram.programId,
			tokenProgram: TOKEN_PROGRAM_ID,
			zebecAirdropPda,
		})
		.instruction();

	const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
	const message = new TransactionMessage({
		instructions: [ix],
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
