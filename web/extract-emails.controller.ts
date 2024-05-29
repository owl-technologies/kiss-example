import { json } from '@helia/json';
import { Controller, Get, assert } from "kiss-framework";
import { OllamaProxyService } from "../services/ollama.service.js";
import { HeliaService } from '../services/helia.service.js';
import { base64 } from 'multiformats/bases/base64';
import { CID } from 'multiformats';
import { dagCbor } from '@helia/dag-cbor'
import { unixfs } from '@helia/unixfs';
import pdfParse from 'pdf-parse-fork';

export function isCid(link: string | { [key: string]: string }): boolean {
    // CIDv1: Starts with "b" followed by base encoding character (z or k or m) followed by multihash
    // CIDv0: Multihash encoded in base58btc
    // This is a very basic check and may not cover all possible CID formats
    const cidRegex = /^(b[a-zA-Z0-9]{1,})|([Qm][a-zA-Z0-9]{44})$/;

    if (typeof link === 'string') {
        return cidRegex.test(link);
    } else if (typeof link === 'object' && link !== null) {
        return link.hasOwnProperty('/') && typeof link['/'] === 'string' && cidRegex.test(link['/']);
    }

    return false;
}

@Controller
export class extractEmailsFromPdfController {

    private ollama = new OllamaProxyService()

    private helia = new HeliaService()

    @Get('pdf')
    async extractEmails(pdf: string): Promise<string[]> {
        console.debug(`extractEmails. pdf:`, pdf);
        assert(isCid(pdf), 'pdf is not a valid cid');
        console.debug(`pdf is a valid cid`);
        const heliaNode = this.helia.heliaNode
        const fs = unixfs(heliaNode)
        console.debug(`extractEmails. fs working`);
        const pdfCid = CID.parse(pdf)
        console.debug(`pdfCid:`, pdfCid);
        let pdfData = new Uint8Array();
        for await (const chunk of fs.cat(pdfCid)) {
            // console.debug(`chunk:`, chunk);
            const chunkData = new Uint8Array(chunk);
            // console.debug(`chunkData:`, chunkData);
            pdfData = new Uint8Array([...pdfData, ...chunkData]);
        }
        console.debug(`pdfData length:`, pdfData.length);
        const pdfBuffer = Buffer.from(pdfData);
        const data = await pdfParse(pdfBuffer);
        const textContent = data.text.trim();
        console.debug(`pdfInfo:`, textContent);
        const emails = await this.ollama.extractEmailsFromPdf(textContent);
        // Assume the API returns a list of emails in the response data
        return emails['response'];
    }

}