# Podcast Chatbot Frontend

A `Next.js` application that provides a modern, responsive interface for interacting with AI-powered podcast experts. This frontend application connects to a backend service to enable chat-based interactions with specialized AI personas.

## Features

- 🎙️ Chat with AI podcast experts
- 🎨 Modern, responsive UI built with Next.js and Tailwind CSS
- 🔄 Real-time chat interface
- 📱 Mobile-friendly design
- 🎭 Multiple expert personas
- 📝 Markdown support for rich text responses

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **Styling**: Tailwind CSS
- **Markdown**: React Markdown

## Prerequisites

- Node.js 18+
- pnpm (recommended)
- Backend API endpoint (see setup instructions below)

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/SlavkoMuzdeka/podcast-chatbot-frontend.git
    cd podcast-chatbot-frontend
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

4. Update the environment variables in `.env` with your configuration.


5. Start the development server:

    ```bash
    pnpm dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Architecture

1. **Frontend**: Built with Next.js and React
   - Handles user interactions
   - Manages chat state
   - Renders UI components
   - Communicates with the backend API

2. **Backend Integration**:
   - Sends user messages to the backend
   - Receives and displays AI responses
   - Handles streaming responses

### Project Structure

```
├── app/                  # Next.js app directory
│   ├── dashboard/        # Main dashboard page
│   │   └── page.tsx      # Dashboard component
│   ├── clientLayout.tsx  # Client-side layout
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   │   └── ...          # Various UI components
│   ├── expert-chat.tsx   # Expert chat interface
│   └── ...              # Other components
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── lib/                  # Utility functions
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── public/              # Static assets
├── .env.example         # Example environment variables
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Development

### Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint
- `pnpm format`: Format code with Prettier

### Backend Integration

This frontend is designed to work with a backend service that handles the AI processing. The backend should provide the following endpoints:

- `POST /api/chat`: Handle chat messages
- `GET /api/experts`: Retrieve available expert personas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.