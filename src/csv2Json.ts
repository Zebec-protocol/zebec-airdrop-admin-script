import assert from "assert";

export function nftHoldersCsvToObject(file: string) {
	const lines = file.split("\r\n");
	const headers = lines[0].split(",");
	assert(headers.length === 2, "csv have invalid headers");
	assert(headers[0] === "nftHolder", "csv have invalid headers: missing 'nftHolder'");
	assert(headers[1] === "nftCount", "csv have invalid headers: missing 'nftCount'");

	let result: {
		nftHolder: string;
		nftCount: string;
	}[] = [];

	for (let i = 1; i < lines.length; i++) {
		let obj: { [key: string]: string } = {};

		var currentline = lines[i].split(",");
		assert(currentline.length === 2, "Invalid data in csv");

		for (var j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}

		result.push(obj as any);
	}

	return result;
}

export function tokenHoldersCsvToObject(file: string) {
	const lines = file.split("\r\n");
	const headers = lines[0].split(",");
	// console.log("headers", headers);
	assert(headers.length === 2, "csv have invalid headers");
	assert(headers[0] === "tokenHolder", "csv have invalid headers: missing 'tokenHolder'");
	assert(headers[1] === "amount", "csv have invalid headers: missing 'amount'");

	let result: {
		tokenHolder: string;
		amount: string;
	}[] = [];

	for (let i = 1; i < lines.length; i++) {
		let obj: { [key: string]: string } = {};

		var currentline = lines[i].split(",");
		// console.log("currentline", currentline);
		assert(currentline.length === 2, "Invalid data in csv");

		for (var j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}

		result.push(obj as any);
	}

	return result;
}
