import { json } from '@helia/json';
import { unixfs } from '@helia/unixfs';
import { Request } from 'express';
import { Controller, Post, assert } from "kiss-framework";
import { PdfFile } from '../datatypes/pdf-file.js';
import { HeliaService } from "../services/helia.service.js";
import { config } from '../config.js';


@Controller
export class AddFileController {
    constructor(
        private heliaService = new HeliaService()
    ) { }

    @Post(Request)
    async addFile(req: Request) {
        const ownerId = req.headers['ownerid'];
        const filename = req.headers['filename'];
        assert(ownerId, "Request does not contain ownerId");
        assert(filename, "Request does not contain filename");
      
        const heliaNode = this.heliaService.heliaNode
        const fs = unixfs(heliaNode)

        const content = await fs.addByteStream(<any>req);
        const pdfFile = new PdfFile({
            "protocol-version": config.currentVersion,
            name: filename,
            ownerId,
            content: content.toJSON()
        });

        const fileListCid = await this.heliaService.getFileList();
        const nodeJson = json(heliaNode);
        const fileList = await nodeJson.get(fileListCid) as any[]
        fileList.push(pdfFile.toJSON());
        const newfileListCid = await nodeJson.add(fileList);
        this.heliaService.setFileList(newfileListCid);
        return newfileListCid;
      }
}

