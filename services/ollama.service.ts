import axios from "axios";
import { Service } from "kiss-framework";
import { base64 } from "multiformats/bases/base64";

type CollectionData = {
    collection_name: string,
    filename: string,
    known_type: boolean,
    status: boolean
}

@Service
export class OllamaProxyService {


    async extractEmailsFromPdf(pdfText): Promise<string[]> {
        // Make a POST request to the Ollama API
        const response = await axios.post('http://192.168.178.208:11434/api/generate', {
            model: 'extract-emails',
            prompt: pdfText,
            stream: false,
            // images: [base64PdfData] // Assuming the API accepts the PDF data as a field in the JSON payload
        });
        console.debug(`response.data:`, response.data);
        // Assume the API returns a list of emails in the response data
        return response.data;
    }
}