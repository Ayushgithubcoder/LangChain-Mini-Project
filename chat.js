import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import "dotenv/config.js";
import { OpenAI } from "openai";

const client = new OpenAI();

async function chat() {
  const userQuery = "Can you tell me about debugging in Node.js?";

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "langchain",
    }
  );
  const vectorSearcher = vectorStore.asRetriever({
    k: 3,
  });

  const releventChunk = await vectorSearcher.invoke(userQuery);

  const SYSTEM_PROMPT = `You are a helpful AI assistant. Use the following context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
  
  Context: ${JSON.stringify(releventChunk)}`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userQuery },
    ],
  });
  console.log(`${response.choices[0].message.content}`);
}

chat();
