import ReactMarkdown from "react-markdown";

export function MarkdownFormatter({ text }: { text: string }) {
  return (
      <div className="prose prose-sm max-w-none dark:prose-invert leading-tight text-left">
        <ReactMarkdown components={{
          h1: ({ children }) => (
            <h1 className="text-foreground mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-foreground mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-foreground mb-2 mt-4">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="text-foreground mb-4 space-y-2">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="text-foreground">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-solid pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
        }}>{text}</ReactMarkdown>
      </div>
  );
}
