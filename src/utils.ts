import assert from "assert";
import dotenv from "dotenv";

import { AnchorProvider, translateError, utils, Wallet } from "@coral-xyz/anchor";
import {
	Cluster,
	clusterApiUrl,
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	TransactionInstruction,
} from "@solana/web3.js";

import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "./constants";

dotenv.config();

export function getConnection(cluster?: Cluster) {
	if (cluster === "mainnet-beta") {
		const RPC_URL = process.env.RPC_URL;
		assert(RPC_URL && RPC_URL != "", "missing env var RPC_URL");
		return new Connection(RPC_URL);
	} else {
		return new Connection(clusterApiUrl(cluster));
	}
}

export function getProvider(connection: Connection) {
	const SECRET_KEY = process.env.SECRET_KEY;
	assert(SECRET_KEY && SECRET_KEY != "", "missing env var: SECRET_KEY");
	const keypair = Keypair.fromSecretKey(utils.bytes.bs58.decode(SECRET_KEY));
	const provider = new AnchorProvider(
		connection,
		new Wallet(keypair),
		AnchorProvider.defaultOptions(),
	);

	return provider;
}

export function chunkArray<T>(arr: Array<T>, chunkSize: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		result.push(arr.slice(i, i + chunkSize));
	}
	return result;
}

export function errorListToMap(
	errors: {
		code: number;
		name: string;
		msg: string;
	}[],
) {
	const map: Map<number, string> = new Map();
	for (let i = 0; i < errors.length; i++) {
		map.set(errors[i].code, errors[i].msg);
	}

	return map;
}

export function tryParseError(
	err: any,
	idlErrors: {
		code: number;
		name: string;
		msg: string;
	}[],
) {
	const tErr = translateError(err, errorListToMap(idlErrors));
	if (tErr instanceof Error) {
		return tErr;
	} else {
		console.log(err);
		return new Error("Failed to send transaction");
	}
}

export function getAssociatedTokenAddressSync(
	mint: PublicKey,
	owner: PublicKey,
	allowOwnerOffCurve = false,
	programId = TOKEN_PROGRAM_ID,
	associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): PublicKey {
	if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer()))
		throw new Error("Token owner is off curve.");

	const [address] = PublicKey.findProgramAddressSync(
		[owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
		associatedTokenProgramId,
	);

	return address;
}

export function createAssociatedTokenAccountInstruction(
	payer: PublicKey,
	associatedToken: PublicKey,
	owner: PublicKey,
	mint: PublicKey,
	programId = TOKEN_PROGRAM_ID,
	associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): TransactionInstruction {
	const keys = [
		{ pubkey: payer, isSigner: true, isWritable: true },
		{ pubkey: associatedToken, isSigner: false, isWritable: true },
		{ pubkey: owner, isSigner: false, isWritable: false },
		{ pubkey: mint, isSigner: false, isWritable: false },
		{ pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
		{ pubkey: programId, isSigner: false, isWritable: false },
	];

	return new TransactionInstruction({
		keys,
		programId: associatedTokenProgramId,
		data: Buffer.alloc(0),
	});
}
