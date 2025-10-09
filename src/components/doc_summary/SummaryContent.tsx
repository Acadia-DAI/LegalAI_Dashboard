import { Sparkles, Clock, AlertCircle, Eye } from "lucide-react";
import { Button } from "../modern/Button";
import type { Document, DocumentSummary } from "@/types/api-models";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Props {
  selectedDocument: Document | null;
  selectedSummary: DocumentSummary | null;
  isLoadingSummary: boolean;
  summaryError: string | null;
  loadDocumentSummary: (id: string) => void;
}

export function SummaryContent({
  selectedDocument,
  selectedSummary,
  isLoadingSummary,
  summaryError,
  loadDocumentSummary,
}: Props) {
  if (!selectedDocument)
    return <EmptyState icon={<Eye />} title="Select a document" text="Choose a document to view its summary" />;

  if (selectedDocument.process_state.toLowerCase() === "processing")
    return <EmptyState icon={<Clock />} title="Document Processing" text="Summary will be available soon" />;

  if (selectedDocument.process_state.toLowerCase() === "error")
    return <EmptyState icon={<AlertCircle />} title="Processing Error" text="Error processing document" />;

  if (isLoadingSummary)
    return (
      <CenteredLoader
        icon={<Sparkles className="animate-pulse" />}
        title="Generating Summary"
        text="Analyzing document with AI..."
      />
    );

  if (summaryError)
    return (
      <EmptyState
        icon={<AlertCircle className="text-red-600" />}
        title="Summary Generation Failed"
        text={summaryError}
      >
        <Button onClick={() => loadDocumentSummary(selectedDocument.doc_id)} className="gradient-secondary text-white mt-3">
          <Sparkles className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </EmptyState>
    );

  if (!selectedSummary)
    return (
      <EmptyState icon={<Sparkles />} title="Generate Summary" text="Click below to generate an AI summary">
        <Button onClick={() => loadDocumentSummary(selectedDocument.doc_id)} className="gradient-secondary text-white mt-3">
          <Sparkles className="w-4 h-4 mr-2" /> Generate Summary
        </Button>
      </EmptyState>
    );

  return <MarkdownRenderer summary={selectedSummary} />;
}

function CenteredLoader({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  children,
}: {
  icon: JSX.Element;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50">{icon}</div>
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <p className="text-muted-foreground mb-4">{text}</p>
        {children}
      </div>
    </div>
  );
}
