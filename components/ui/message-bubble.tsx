import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { getBotById } from "@/lib/bots";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { AlertCircle, User } from "lucide-react";
import type { Components } from "react-markdown";
import { Avatar, AvatarFallback } from "./avatar";

interface MessageBubbleProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    botId?: string;
    pending?: boolean;
    error?: boolean;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const bot = message.botId ? getBotById(message.botId) : null;
  const isUser = message.role === "user";

  // Simple markdown components
  const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isUser
            ? "text-primary-foreground underline"
            : "text-primary underline"
        }
      >
        {children}
      </a>
    ),
    pre: ({ children }) => (
      <pre className="bg-muted-foreground/10 p-2 rounded-md overflow-auto text-xs my-2">
        {children}
      </pre>
    ),
    code: ({ className, children, inline }) => {
      if (inline) {
        return (
          <code
            className={cn(
              "bg-muted-foreground/20 px-1 py-0.5 rounded text-xs",
              isUser && "bg-primary-foreground/20",
              className
            )}
          >
            {children}
          </code>
        );
      }
      return <code className={cn(className)}>{children}</code>;
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        isUser ? "items-end" : "items-start"
      )}
    >
      {/* Bot label for assistant messages */}
      {!isUser && message.botId && (
        <div className="flex items-center gap-1 ml-2 text-xs text-muted-foreground">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">
              {bot ? <bot.icon /> : <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
          <span>{bot?.name || "AI Assistant"}</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : message.error
            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            : "bg-muted text-foreground"
        )}
      >
        {message.pending ? (
          // Loading indicator
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]"></div>
          </div>
        ) : message.error ? (
          // Error message
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{message.content}</span>
          </div>
        ) : (
          // Regular message with markdown
          <div
            className={cn(
              "prose prose-sm max-w-none",
              isUser ? "prose-invert" : "dark:prose-invert"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              components={markdownComponents}
            >
              {typeof message.content === "string"
                ? message.content
                : "Error: Invalid content"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
