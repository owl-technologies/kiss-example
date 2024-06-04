import { fileURLToPath } from "url";
import path from "path";
import { LlamaModel, LlamaJsonSchemaGrammar, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import { Service } from "kiss-framework";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "models", "codellama-13b.Q3_K_M.gguf")
})
const grammar = new LlamaJsonSchemaGrammar({
    "type": "object",
    "properties": {
        "responseMessage": {
            "type": "string"
        },
        "requestPositivityScoreFromOneToTen": {
            "type": "number"
        }
    }
} as const);
const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });


const q1 = 'How are you doing?';
console.log("User: " + q1);

const a1 = await session.prompt(q1, {
    grammar,
    maxTokens: context.getContextSize()
});
console.log("AI: " + a1);

const parsedA1 = grammar.parse(a1);
console.log(
    parsedA1.responseMessage,
    parsedA1.requestPositivityScoreFromOneToTen
);

@Service
export class LlamaService {
}