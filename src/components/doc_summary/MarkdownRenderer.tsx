import type { DocumentSummary } from "@/types/api-models";
import ReactMarkdown from "react-markdown";

export function MarkdownRenderer({ summary }: { summary: DocumentSummary }) {
  return (
    <div className="p-6">
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
          <ReactMarkdown>{summary.summary}</ReactMarkdown>
      </div>
    </div>
  );
}
