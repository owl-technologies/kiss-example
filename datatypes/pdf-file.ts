import { CID } from "multiformats";
import { InitJson, KissData, Length, Required } from "kiss-framework";

export class PdfFile extends KissData {

    @InitJson()
    @Length(2, 32)
    @Required()
    name: string;

    @InitJson()
    @Required()
    ownerId: string; // or CID

    @InitJson()
    @Required()
    content : CID
    
}