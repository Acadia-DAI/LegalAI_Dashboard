import type { DocumentSummary } from "@/types/api-models";
import ReactMarkdown from "react-markdown";

export function MarkdownRenderer({ summary }: { summary: DocumentSummary }) {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="flex justify-between gap-4 mb-6 p-4 bg-surface/50 rounded-lg">
        {/* <div className="text-center">
          <p className="text-sm text-muted-foreground">Confidence</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex-1 bg-surface rounded-full h-2 max-w-[80px]">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${summary.confidence}%` }} />
            </div>
            <span className="text-sm font-medium text-foreground">{summary.confidence}%</span>
          </div>
        </div> */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Word Count</p>
          <p className="font-medium text-foreground mt-1">{summary.wordCount.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Generated</p>
          <p className="font-medium text-foreground mt-1">
            {new Date(summary.generatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

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
        }}>{summary.summary}</ReactMarkdown>
      </div>
    </div>
  );
}
