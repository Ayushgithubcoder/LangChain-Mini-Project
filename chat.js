import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import "dotenv/config.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
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

  const retriever = vectorStore.asRetriever({
    k: 3,
  });

  const llm = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  function askQuestion() {
    rl.question(
      "\nAsk a question (or type 'exit' to quit): ",
      async (userQuery) => {
        if (userQuery.toLowerCase() === "exit") {
          rl.close();
          return;
        }

        try {
          // Retrieve relevant documents
          const relevantDocs = await retriever.invoke(userQuery);

          // Build context from retrieved documents
          const context = relevantDocs
            .map((doc, index) => `[Document ${index + 1}]\n${doc.pageContent}`)
            .join("\n\n");

          // Create prompt with context
          const prompt = `You are a helpful AI assistant. Use the following context from the knowledge base to answer the question. If the answer is not in the context, say that you don't know.

Context:
${context}

Question: ${userQuery}

Answer:`;

          // Generate answer using LLM
          const response = await llm.invoke(prompt);

          console.log("\n--- Answer ---");
          console.log(response.content);

          // Show sources
          if (relevantDocs.length > 0) {
            console.log("\n--- Sources ---");
            relevantDocs.forEach((doc, index) => {
              const source = doc.metadata.source || "Unknown";
              const page =
                doc.metadata.page !== undefined
                  ? ` (page ${doc.metadata.page + 1})`
                  : "";
              console.log(`${index + 1}. ${source}${page}`);
            });
          }
        } catch (error) {
          console.error("Error:", error.message);
        }

        askQuestion();
      }
    );
  }

  console.log("RAG Chatbot ready! Ask questions about Node.js.");
  askQuestion();
}

chat();
