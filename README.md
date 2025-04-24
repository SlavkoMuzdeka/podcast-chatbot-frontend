# Podcaster-Chatbot

A `Next.js` application that uses `Retrieval Augmented Generation (RAG)` with `Pinecone` vector database to create `AI chatbots` with domain-specific knowledge. This application allows you to chat with multiple `AI` personas that have access to specialized knowledge stored in `Pinecone`.

![Pinecone RAG Chatbot](/public/chatbot_app.png?height=400&width=800)

## Features

- 🤖 Multiple `AI personas` with different knowledge domains
- 📚 `Retrieval Augmented Generation (RAG)` using `Pinecone` vector database
- 🔄 Compare responses from different `AI personas` side-by-side
- 🔍 Search and filter available bots
- 💬 Markdown support for rich text responses
- 📱 Responsive design for all devices

## Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **AI**: OpenAI API, AI SDK, LangChain
- **Vector Database**: Pinecone
- **Styling**: Tailwind CSS, shadcn/ui components
- **Markdown**: React Markdown with syntax highlighting

## Prerequisites

- Node.js 18+ and npm/pnpm
- OpenAI API key
- Pinecone API key and index
- Populated Pinecone index with your domain-specific knowledge

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SlavkoMuzdeka/Podcaster-Chatbot.git
    cd Podcaster-Chatbot
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    pnpm install
    ```

3. Create a `.env.local` file in the root directory with the following variables:
    
    ```
    OPENAI_API_KEY=your_openai_api_key
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_INDEX=your_pinecone_index_name
    OPENAI_EMBEDDINGS_MODEL=text-embedding-3-large
    OPENAI_CHAT_MODEL=gpt-4o-mini
    ```

4. Start the development server:

    ```
    npm run dev
    # or
    pnpm dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Architecture

1. **User Interface**: React components for chat interface and bot selection
2. **API Routes**: Next.js API routes handle chat requests
3. **Vector Search**: Pinecone queries for relevant context based on user questions
4. **AI Response Generation**: OpenAI generates responses using retrieved context


### RAG Process Flow

1. User sends a message
2. The application converts the message to an embedding using OpenAI
3. Pinecone searches for similar vectors in the specified namespace
4. Retrieved context is added to the prompt sent to OpenAI
5. OpenAI generates a response based on the context and user message
6. The response is streamed back to the user interface

### Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/           # React components
│   ├── chat.tsx          # Chat interface
│   ├── sidebar.tsx       # Bot selection sidebar
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utility functions
│   ├── bots.ts           # Bot configurations
│   ├── pinecone.ts       # Pinecone integration
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Customizing Bots

You can customize the available bots by editing the `lib/bots.ts` file. Each bot has the following properties:

- `id`: Unique identifier for the bot
- `name`: Display name
- `description`: Short description
- `namespace`: Pinecone namespace to query for this bot
- `icon`: Icon component to display
- `systemPrompt`: System prompt to guide the AI's behavior

## Populating Pinecone

Before using this application, you need to populate your `Pinecone index` with domain-specific knowledge. This typically involves:

1. Processing your text data (articles, documentation, etc.)
2. Generating embeddings for each chunk of text
3. Storing the embeddings in Pinecone with appropriate metadata
4. Organizing data into namespaces that correspond to your bots


You can use my another project that addresses this taks. More info on: [Pinecone embeddings chatbot](https://github.com/SlavkoMuzdeka/Pinecone-embeddings-chatbot)