export type ZebecAirdrop = {
	version: "0.1.0";
	name: "zebec_airdrop";
	instructions: [
		{
			name: "initAirdrop";
			accounts: [
				{
					name: "admin";
					isMut: true;
					isSigner: true;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVault";
					isMut: true;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [
				{
					name: "params";
					type: {
						defined: "InitAirdropParams";
					};
				},
			];
		},
		{
			name: "claimAirdropNft";
			accounts: [
				{
					name: "zebecNftHolder";
					isMut: true;
					isSigner: true;
				},
				{
					name: "zebecNftHolderAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVault";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVaultAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropToken";
					isMut: false;
					isSigner: false;
				},
				{
					name: "zebecNftHolderPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "tokenProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "associatedTokenProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [];
		},
		{
			name: "claimAirdropToken";
			accounts: [
				{
					name: "zebecTokenHolder";
					isMut: true;
					isSigner: true;
				},
				{
					name: "zebecTokenHolderAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVault";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVaultAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropToken";
					isMut: false;
					isSigner: false;
				},
				{
					name: "zebecTokenHolderPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "tokenProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "associatedTokenProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [];
		},
		{
			name: "whitelistNftHolder";
			accounts: [
				{
					name: "admin";
					isMut: true;
					isSigner: true;
				},
				{
					name: "zbcNftHolder";
					isMut: false;
					isSigner: false;
				},
				{
					name: "zbcNftHolderPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [
				{
					name: "params";
					type: {
						defined: "NftHolderParams";
					};
				},
			];
		},
		{
			name: "whitelistTokenHolder";
			accounts: [
				{
					name: "admin";
					isMut: true;
					isSigner: true;
				},
				{
					name: "zbcTokenHolder";
					isMut: false;
					isSigner: false;
				},
				{
					name: "zbcTokenHolderPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [
				{
					name: "params";
					type: {
						defined: "TokenHolderParams";
					};
				},
			];
		},
		{
			name: "withdrawAirdrop";
			accounts: [
				{
					name: "admin";
					isMut: true;
					isSigner: true;
				},
				{
					name: "adminAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVault";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropVaultAta";
					isMut: true;
					isSigner: false;
				},
				{
					name: "zebecAirdropPda";
					isMut: true;
					isSigner: false;
				},
				{
					name: "airdropToken";
					isMut: false;
					isSigner: false;
				},
				{
					name: "systemProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "tokenProgram";
					isMut: false;
					isSigner: false;
				},
				{
					name: "associatedTokenProgram";
					isMut: false;
					isSigner: false;
				},
			];
			args: [
				{
					name: "amount";
					type: "u64";
				},
			];
		},
	];
	accounts: [
		{
			name: "zebecNftHolder";
			type: {
				kind: "struct";
				fields: [
					{
						name: "zbcNodeHolderAddress";
						type: "publicKey";
					},
					{
						name: "zbcAirdropPdaAddress";
						type: "publicKey";
					},
					{
						name: "nftCount";
						type: "u64";
					},
					{
						name: "eligibility";
						type: "bool";
					},
					{
						name: "claimed";
						type: "bool";
					},
				];
			};
		},
		{
			name: "zebecTokenHolder";
			type: {
				kind: "struct";
				fields: [
					{
						name: "zbcTokenHolderAddress";
						type: "publicKey";
					},
					{
						name: "zbcAirdropPdaAddress";
						type: "publicKey";
					},
					{
						name: "adAmount";
						type: "u64";
					},
					{
						name: "eligibility";
						type: "bool";
					},
					{
						name: "claimed";
						type: "bool";
					},
				];
			};
		},
		{
			name: "zebecAirdropPda";
			type: {
				kind: "struct";
				fields: [
					{
						name: "name";
						type: "string";
					},
					{
						name: "admin";
						type: "publicKey";
					},
					{
						name: "airdropToken";
						type: "publicKey";
					},
					{
						name: "airdropAmountPerNft";
						type: "u64";
					},
				];
			};
		},
	];
	types: [
		{
			name: "InitAirdropParams";
			type: {
				kind: "struct";
				fields: [
					{
						name: "name";
						type: "string";
					},
					{
						name: "admin";
						type: "publicKey";
					},
					{
						name: "airdropToken";
						type: "publicKey";
					},
					{
						name: "airdropAmountPerNft";
						type: "u64";
					},
				];
			};
		},
		{
			name: "NftHolderParams";
			type: {
				kind: "struct";
				fields: [
					{
						name: "nftCount";
						type: "u64";
					},
					{
						name: "eligible";
						type: "bool";
					},
				];
			};
		},
		{
			name: "TokenHolderParams";
			type: {
				kind: "struct";
				fields: [
					{
						name: "amount";
						type: "u64";
					},
					{
						name: "eligible";
						type: "bool";
					},
				];
			};
		},
	];
	errors: [
		{
			code: 6000;
			name: "InvalidAirdropEvent";
			msg: "Invalid Airdrop Event";
		},
		{
			code: 6001;
			name: "InvalidToken";
			msg: "Invalid Token";
		},
		{
			code: 6002;
			name: "NotEligible";
			msg: "Not Eligible for Airdrop";
		},
		{
			code: 6003;
			name: "Unauthorized";
			msg: "Unauthorized";
		},
		{
			code: 6004;
			name: "AlreadyClaimed";
			msg: "Already Claimed";
		},
	];
};

export const IDL: ZebecAirdrop = {
	version: "0.1.0",
	name: "zebec_airdrop",
	instructions: [
		{
			name: "initAirdrop",
			accounts: [
				{
					name: "admin",
					isMut: true,
					isSigner: true,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVault",
					isMut: true,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [
				{
					name: "params",
					type: {
						defined: "InitAirdropParams",
					},
				},
			],
		},
		{
			name: "claimAirdropNft",
			accounts: [
				{
					name: "zebecNftHolder",
					isMut: true,
					isSigner: true,
				},
				{
					name: "zebecNftHolderAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVault",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVaultAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropToken",
					isMut: false,
					isSigner: false,
				},
				{
					name: "zebecNftHolderPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "tokenProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "associatedTokenProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [],
		},
		{
			name: "claimAirdropToken",
			accounts: [
				{
					name: "zebecTokenHolder",
					isMut: true,
					isSigner: true,
				},
				{
					name: "zebecTokenHolderAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVault",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVaultAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropToken",
					isMut: false,
					isSigner: false,
				},
				{
					name: "zebecTokenHolderPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "tokenProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "associatedTokenProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [],
		},
		{
			name: "whitelistNftHolder",
			accounts: [
				{
					name: "admin",
					isMut: true,
					isSigner: true,
				},
				{
					name: "zbcNftHolder",
					isMut: false,
					isSigner: false,
				},
				{
					name: "zbcNftHolderPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [
				{
					name: "params",
					type: {
						defined: "NftHolderParams",
					},
				},
			],
		},
		{
			name: "whitelistTokenHolder",
			accounts: [
				{
					name: "admin",
					isMut: true,
					isSigner: true,
				},
				{
					name: "zbcTokenHolder",
					isMut: false,
					isSigner: false,
				},
				{
					name: "zbcTokenHolderPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [
				{
					name: "params",
					type: {
						defined: "TokenHolderParams",
					},
				},
			],
		},
		{
			name: "withdrawAirdrop",
			accounts: [
				{
					name: "admin",
					isMut: true,
					isSigner: true,
				},
				{
					name: "adminAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVault",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropVaultAta",
					isMut: true,
					isSigner: false,
				},
				{
					name: "zebecAirdropPda",
					isMut: true,
					isSigner: false,
				},
				{
					name: "airdropToken",
					isMut: false,
					isSigner: false,
				},
				{
					name: "systemProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "tokenProgram",
					isMut: false,
					isSigner: false,
				},
				{
					name: "associatedTokenProgram",
					isMut: false,
					isSigner: false,
				},
			],
			args: [
				{
					name: "amount",
					type: "u64",
				},
			],
		},
	],
	accounts: [
		{
			name: "zebecNftHolder",
			type: {
				kind: "struct",
				fields: [
					{
						name: "zbcNodeHolderAddress",
						type: "publicKey",
					},
					{
						name: "zbcAirdropPdaAddress",
						type: "publicKey",
					},
					{
						name: "nftCount",
						type: "u64",
					},
					{
						name: "eligibility",
						type: "bool",
					},
					{
						name: "claimed",
						type: "bool",
					},
				],
			},
		},
		{
			name: "zebecTokenHolder",
			type: {
				kind: "struct",
				fields: [
					{
						name: "zbcTokenHolderAddress",
						type: "publicKey",
					},
					{
						name: "zbcAirdropPdaAddress",
						type: "publicKey",
					},
					{
						name: "adAmount",
						type: "u64",
					},
					{
						name: "eligibility",
						type: "bool",
					},
					{
						name: "claimed",
						type: "bool",
					},
				],
			},
		},
		{
			name: "zebecAirdropPda",
			type: {
				kind: "struct",
				fields: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "admin",
						type: "publicKey",
					},
					{
						name: "airdropToken",
						type: "publicKey",
					},
					{
						name: "airdropAmountPerNft",
						type: "u64",
					},
				],
			},
		},
	],
	types: [
		{
			name: "InitAirdropParams",
			type: {
				kind: "struct",
				fields: [
					{
						name: "name",
						type: "string",
					},
					{
						name: "admin",
						type: "publicKey",
					},
					{
						name: "airdropToken",
						type: "publicKey",
					},
					{
						name: "airdropAmountPerNft",
						type: "u64",
					},
				],
			},
		},
		{
			name: "NftHolderParams",
			type: {
				kind: "struct",
				fields: [
					{
						name: "nftCount",
						type: "u64",
					},
					{
						name: "eligible",
						type: "bool",
					},
				],
			},
		},
		{
			name: "TokenHolderParams",
			type: {
				kind: "struct",
				fields: [
					{
						name: "amount",
						type: "u64",
					},
					{
						name: "eligible",
						type: "bool",
					},
				],
			},
		},
	],
	errors: [
		{
			code: 6000,
			name: "InvalidAirdropEvent",
			msg: "Invalid Airdrop Event",
		},
		{
			code: 6001,
			name: "InvalidToken",
			msg: "Invalid Token",
		},
		{
			code: 6002,
			name: "NotEligible",
			msg: "Not Eligible for Airdrop",
		},
		{
			code: 6003,
			name: "Unauthorized",
			msg: "Unauthorized",
		},
		{
			code: 6004,
			name: "AlreadyClaimed",
			msg: "Already Claimed",
		},
	],
};
