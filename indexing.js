import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import "dotenv/config.js";
import fs from "fs";
import path from "path";

async function init() {
  const allDocs = [];

  // Load PDF file
  const pdfFilePath = "./nodejs.pdf";
  if (fs.existsSync(pdfFilePath)) {
    const pdfLoader = new PDFLoader(pdfFilePath);
    const pdfDocs = await pdfLoader.load();
    allDocs.push(...pdfDocs);
    console.log(`Loaded PDF: ${pdfDocs.length} pages`);
  }

  const dataFolder = "./data";
  if (fs.existsSync(dataFolder)) {
    const files = fs.readdirSync(dataFolder);
    for (const file of files) {
      if (file.endsWith(".txt")) {
        const filePath = path.join(dataFolder, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const doc = new Document({
          pageContent: content,
          metadata: { source: filePath },
        });
        allDocs.push(doc);
        console.log(`Loaded: ${file}`);
      }
    }
  }

  console.log(`Total documents loaded: ${allDocs.length}`);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(allDocs);
  console.log(`Total chunks created: ${splitDocs.length}`);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "langchain",
    }
  );

  console.log("Indexing completed.");
}

init();
