import fs from "fs";
import path from "path";

import {Response} from "express";
import {JSDOM} from "jsdom";

import {deepGet, getAsArray, getLineBreakChar, getLineBreakName, SimpleLogger} from "./utilities";

/**
 * @author [S. Mahdi Mir-Ismaili](https://mirismaili.github.io)
 * Created on 1398/1/31 (2019/4/20).
 */
export default function worker(req: Req, res: Response) { //console.debug(req.sourceFiles);
	const logger = new SimpleLogger();
	try {
		const sourceFiles = req.sourceFiles;
		
		for (const sourceFile of sourceFiles) {
			const sourceFilePath = path.resolve(sourceFile.path); //console.debug(sourceFilePath);
			const ext = path.extname(sourceFilePath).toLowerCase();
			
			let output: string;
			
			const htmlString = fs.readFileSync(sourceFilePath, 'utf8');
			const fileLineBreak = getLineBreakChar(htmlString);
			
			logger.log(`File: "${sourceFilePath}" was read. Detected line-encoding: ${getLineBreakName(fileLineBreak)}`);
			
			const dom = new JSDOM(htmlString, {includeNodeLocations: true});
			logger.log(`File: "${sourceFilePath}" was successfully read by \`JSDOM\`.`);
			
			let newDoc = req.htmlDocument; //console.debug(newDoc);
			const senderLineBreak = getLineBreakChar(newDoc);
			
			if (fileLineBreak !== senderLineBreak)
				newDoc = newDoc.replace(new RegExp(senderLineBreak, 'g'), fileLineBreak);
			
			if (/^\.html?$/.test(ext) && sourceFile.domPath) {
				const document = dom.window.document;
				
				const editableDomPath = sourceFile.domPath;
				const editable = document.querySelector(editableDomPath)!;
				
				const nodeLocation = dom.nodeLocation(editable)!;
				const a = nodeLocation.startTag.endOffset;
				let b = nodeLocation.endTag.startOffset;
				
				logger.log(`Editable element: "${editableDomPath}" was found. Its \`innerHtml\` is in: [${a}, ${b}).`);
				
				// noinspection StatementWithEmptyBodyJS
				while (/\s/.test(htmlString[--b])) ;  // Preserve white-spaces before end-tag
				
				++b;
				
				// tslint:disable-next-line
				if (true)
					output =
							htmlString.substring(0, a) + fileLineBreak +
							newDoc +
							htmlString.substring(b);
				else { // For FUTURE:
					const TODO1: any = null;
					const TODO2: any = null;
					
					const startTagBounds = dom.nodeLocation(TODO1)!.startTag;
					const bounds = startTagBounds.attrs.value;
					
					let a2;
					let b2;
					let altText = `value="${sourceFilePath}"`;
					
					if (bounds === undefined) {
						const i = startTagBounds.startOffset;
						a2 = b2 = i + /^<\w+/.exec(htmlString.substring(i, startTagBounds.endOffset))![0].length;
						altText = ' ' + altText;
					} else {
						a2 = bounds.startOffset;
						b2 = bounds.endOffset;
					}
					
					output = a < a2 ?
							htmlString.substring(0, a) +
							fileLineBreak +
							newDoc +
							htmlString.substring(b, a2) +
							altText +
							htmlString.substring(b2) :
							
							htmlString.substring(0, a2) +
							altText +
							htmlString.substring(b2, a) +
							fileLineBreak +
							newDoc +
							htmlString.substring(b);
					
					console.log(a < a2);
					
					logger.log(`\`value\` attribute of file-path input element: "${TODO2}" will be created or replaced with: "${sourceFilePath}".\nIt was in: [${a2}, ${b2})`);
				}
				
				logger.log(`InnerHtml of Editable element: "${editableDomPath}" will be replaced. Total (net) length of new document is: ${newDoc.length} chars`)
				//} else if (sourceFile.regexp) {
				// 	TODO: Possibility to replace the content based on a RegExp.
			} else {
				output = newDoc;
				logger.log(`Total content of the file will be replaced. Total (net) length of new document is: ${newDoc.length} chars`)
			}
			
			fs.writeFileSync(sourceFilePath, output);
			logger.log(`Contents was replaced. File: "${sourceFilePath}"`);
			//***************************************************************/
			
			// For FUTURE:
			
			const extendedFunctionality: any = undefined; // req.extendedFunctionality;
			if (extendedFunctionality !== undefined) {
				const modulePath = extendedFunctionality.file;
				
				const mod = require(modulePath);
				
				const functions = getAsArray(extendedFunctionality.functions);
				
				for (const func of functions) {
					const functionPath = func.path || [func.name];
					let paramsPaths = func.paramsPaths || func.paramPath && [func.paramPath];
					
					if (!paramsPaths)
						if (func.params) {
							paramsPaths = [];
							for (const param of func.params) paramsPaths.push([param]);
						} else
							paramsPaths = [[func.param]];
					
					const params = [];
					const paramsS = [];
					const paramsN = [];
					
					for (const paramPath of paramsPaths) {
						params.push(deepGet(req, getAsArray(paramPath)));
						paramsS.push(paramPath.join('.'));
						paramsN.push(paramPath[paramPath.length - 1])
					}
					
					logger.log(`Running \`${functionPath.join('.')}(${paramsS.join(', ')})\` [${modulePath}] ...` +
							`\nTLDR; \`${functionPath[functionPath.length - 1]}(${paramsN.join(', ')})\` [${path.basename(modulePath)}]`);
					
					const out = deepGet(mod, functionPath).apply(null, params);
					
					if (out !== undefined) logger.log(out);
				}
			}
		}
	} catch (e) {
		logger.log(e.toString());
	}
	//***************************************************************/
	
	res.status(200).send({
		logs: logger.logs.join('\n\n'),
	});
}

/**
 * Equivalent of `ResolvedSourceFile` on the client side
 */
interface SourceFile {
	path: string;
	domPath: string;
	regexp: string;
}

interface Req {
	htmlDocument: string;
	sourceFiles: SourceFile[];
}
