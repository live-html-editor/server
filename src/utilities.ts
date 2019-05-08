/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/1/31 (2019/4/20).
 */

/**
 * https://stackoverflow.com/a/55682038/5318303
 */
export function deepGet(root: {}, path: string[]): any {
	let output: any = root;
	for (const e of path) output = output[e];
	return output;
}

export class SimpleLogger {
	logs: string[] = [];
	
	log(message: string): void {
		console.info(`\n${message}`);
		this.logs.push(message);
	}
}

export function getAsArray(x: any): any[] {
	return Array.isArray(x) ? x : [x];
}

/**
 * https://stackoverflow.com/a/55661801/5318303
 */
export function getLineBreakChar(str: string): string {
	const indexOfLF = str.indexOf('\n', 1);  // No need to check first-character
	
	if (indexOfLF === -1) {
		if (str.indexOf('\r') !== -1) return '\r';
		
		return '\n';
	}
	
	if (str[indexOfLF - 1] === '\r') return '\r\n';
	
	return '\n';
}

export function getLineBreakName(lineBreakChar: string): string {
	return lineBreakChar === '\n' ? 'LF' : lineBreakChar === '\r' ? 'CR' : 'CRLF';
}
