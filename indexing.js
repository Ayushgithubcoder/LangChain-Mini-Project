import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import "dotenv/config.js";
async function init() {
  const pdfFilePath = "./nodejs.pdf";
  const loader = new PDFLoader(pdfFilePath);
  const docs = await loader.load();

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "langchain",
  });
  console.log("Indexing completed.");
}
init();
