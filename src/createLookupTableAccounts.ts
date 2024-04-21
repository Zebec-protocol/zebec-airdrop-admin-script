import * as fs from "fs";
import path from "path";

import { Program } from "@coral-xyz/anchor";
import {
	AddressLookupTableProgram,
	Connection,
	PublicKey,
	SystemProgram,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { AIRDROP_PROGRAM_ID } from "./constants";
import { IDL } from "./idl";
import { getProvider, tryParseError } from "./utils";

export async function createLookupTableAccount(connection: Connection) {
	const provider = getProvider(connection);
	const program = new Program(IDL, AIRDROP_PROGRAM_ID, provider);

	const admin = provider.publicKey;

	const pdaFile = fs.readFileSync(
		path.resolve(__dirname, "zebecAirdropPda", "address.json"),
		"utf-8",
	);
	const zebecAirdropPda = new PublicKey(JSON.parse(pdaFile).zebecAirdropPda);

	const slot = await connection.getSlot();
	const [createLookupTableIx, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
		authority: admin,
		payer: admin,
		recentSlot: slot,
	});
	console.log("lookupTableAddress:", lookupTableAddress.toString());

	const extendLookupTableIx = AddressLookupTableProgram.extendLookupTable({
		authority: admin,
		payer: admin,
		lookupTable: lookupTableAddress,
		addresses: [admin, SystemProgram.programId, zebecAirdropPda],
	});

	const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
	const message = new TransactionMessage({
		instructions: [createLookupTableIx, extendLookupTableIx],
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

	return lookupTableAddress;
}
