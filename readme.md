# LangChain RAG Mini Project

A question-answering prototype using LangChain with Retrieval-Augmented Generation (RAG) on a custom Node.js knowledge base.

## Overview

This project implements a complete RAG pipeline that:
- Ingests and indexes multiple documents (PDFs and text files)
- Uses vector embeddings for semantic search
- Retrieves relevant context from the knowledge base
- Generates grounded answers with source citations

## Architecture

```
User Question
    ↓
RetrievalQA Chain
    ↓
Vector Store (Qdrant) → Retrieve relevant chunks
    ↓
LLM (GPT-4o-mini) → Generate answer with context
    ↓
Answer + Source Citations
```

### Components

1. **Document Loading**: Supports PDF files and text files
2. **Text Splitting**: RecursiveCharacterTextSplitter for chunking documents
3. **Embeddings**: OpenAI text-embedding-3-large model
4. **Vector Store**: Qdrant (running via Docker)
5. **Retrieval**: Semantic search with top-k retrieval (k=3)
6. **Generation**: GPT-4o-mini for answer generation
7. **Interface**: CLI for interactive question-answering

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- OpenAI API key

## Setup

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start Qdrant vector database**
   ```bash
   docker-compose up -d
   ```
   This starts Qdrant on `http://localhost:6333`

5. **Index documents**
   ```bash
   npm run index
   ```
   This will:
   - Load the PDF file (`nodejs.pdf`)
   - Load all text files from the `data/` folder
   - Split documents into chunks
   - Generate embeddings
   - Store in Qdrant vector database

## Usage

### Start the chat interface
```bash
npm run chat
```

### Ask questions
Once the chatbot is ready, you can ask questions about Node.js:
- "What is Node.js?"
- "How do I create an HTTP server?"
- "Explain async programming in Node.js"
- "What are streams in Node.js?"

Type `exit` to quit the chat.

### Example Session
```
RAG Chatbot ready! Ask questions about Node.js.

Ask a question (or type 'exit' to quit): What is Node.js?

--- Answer ---
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side. Key features include being asynchronous and event-driven, single-threaded with event loop, NPM for package management, and built-in modules for file system, HTTP, and more.

--- Sources ---
1. data/nodejs-basics.txt
2. nodejs.pdf (page 1)
```

## Project Structure

```
.
├── data/                  # Text documents (18 files)
├── nodejs.pdf            # PDF document
├── indexing.js           # Document loading and indexing
├── chat.js               # RAG chat interface
├── package.json          # Dependencies and scripts
├── docker-compose.yml    # Qdrant configuration
├── .env                  # Environment variables (create this)
└── readme.md            # This file
```

## Features

✅ **Document Loading**: Supports PDF and text files  
✅ **Multiple Documents**: Indexes 10-20 documents  
✅ **Vector Embeddings**: OpenAI embeddings for semantic search  
✅ **Retrieval Chain**: LangChain RetrievalQAChain  
✅ **Source Citations**: Shows which documents were used  
✅ **CLI Interface**: Simple interactive command-line interface  
✅ **Modular Code**: Clean, well-structured codebase  

## Technical Details

### Document Processing
- Documents are split into chunks of 1000 characters with 200 character overlap
- Each chunk is embedded using OpenAI's text-embedding-3-large model
- Chunks are stored in Qdrant vector database

### Retrieval
- Top 3 most relevant chunks are retrieved for each question
- Semantic similarity search using vector embeddings

### Generation
- GPT-4o-mini model with temperature 0 for consistent answers
- Context from retrieved chunks is used to generate grounded responses

## Troubleshooting

**Qdrant connection error**
- Make sure Docker is running
- Check if Qdrant is up: `docker ps`
- Verify port 6333 is available

**OpenAI API errors**
- Verify your API key in `.env` file
- Check your OpenAI account has credits

**No documents found**
- Run `npm run index` first
- Check that `data/` folder contains text files
- Verify `nodejs.pdf` exists in root directory

## License

ISC

