import BigNumber from "bignumber.js";
import * as fs from "fs";
import path from "path";

import { BN, Program, utils } from "@coral-xyz/anchor";
import {
	Connection,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

import { AIRDROP_PROGRAM_ID, PROGRAM_SEEDS } from "./constants";
import { IDL } from "./idl";
import {
	createAssociatedTokenAccountInstruction,
	getAssociatedTokenAddressSync,
	getProvider,
	tryParseError,
} from "./utils";

function deriveZebecAirdropPda(airdropEventName: string, programId: PublicKey): PublicKey {
	const [address] = PublicKey.findProgramAddressSync(
		[Buffer.from(PROGRAM_SEEDS.airdropPda), utils.bytes.utf8.encode(airdropEventName)],
		programId,
	);
	return address;
}

function deriveZebecAirdropVaultPda(zebecAirdropPda: PublicKey, programId: PublicKey): PublicKey {
	const [address] = PublicKey.findProgramAddressSync(
		[Buffer.from(PROGRAM_SEEDS.airdropVault), zebecAirdropPda.toBuffer()],
		programId,
	);
	return address;
}

export async function initAirdrop(
	connection: Connection,
	eventName: string,
	airdropToken: PublicKey,
	airdropTokenDecimals: number,
	airdropAmountPerNft: number,
) {
	const provider = getProvider(connection);
	const program = new Program(IDL, AIRDROP_PROGRAM_ID, provider);

	const admin = provider.publicKey;

	const zebecAirdropPda = deriveZebecAirdropPda(eventName, program.programId);
	const airdropVault = deriveZebecAirdropVaultPda(zebecAirdropPda, program.programId);

	const parsedAirdropAmountPerNft = new BN(
		BigNumber(airdropAmountPerNft)
			.times(10 ** airdropTokenDecimals)
			.toFixed(0),
	);

	const ixs: TransactionInstruction[] = [];
	const ix = await program.methods
		.initAirdrop({
			admin,
			airdropAmountPerNft: parsedAirdropAmountPerNft,
			airdropToken,
			name: eventName,
		})
		.accounts({
			admin,
			airdropVault,
			systemProgram: SystemProgram.programId,
			zebecAirdropPda,
		})
		.instruction();

	ixs.push(ix);

	const airdropVaultAta = getAssociatedTokenAddressSync(airdropToken, airdropVault, true);
	const airdropVaultAtaInfo = await connection.getAccountInfo(airdropVaultAta, "confirmed");

	if (!airdropVaultAtaInfo) {
		ixs.push(
			createAssociatedTokenAccountInstruction(admin, airdropVaultAta, airdropVault, airdropToken),
		);
	}

	const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
	const message = new TransactionMessage({
		instructions: ixs,
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

	fs.writeFileSync(
		path.resolve(__dirname, "zebecAirdropPda", "address.json"),
		JSON.stringify({ zebecAirdropPda: zebecAirdropPda.toString() }),
		"utf-8",
	);
}
