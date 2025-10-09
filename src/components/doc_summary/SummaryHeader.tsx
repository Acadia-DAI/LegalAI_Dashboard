import { Download, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "../modern/Button";
import type { Document, DocumentSummary } from "@/types/api-models";

interface Props {
  selectedDocument: Document | null;
  selectedSummary: DocumentSummary | null;
  loadDocumentSummary: (id: string) => void;
  exportSummary: (id: string) => void;
  isLoadingSummary: boolean;
}

export function SummaryHeader({
  selectedDocument,
  selectedSummary,
  loadDocumentSummary,
  exportSummary,
  isLoadingSummary,
}: Props) {
  if (!selectedDocument || selectedDocument.process_state.toLowerCase() !== "completed") return null;
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{selectedDocument.filename}</h4>
            <p className="text-sm text-muted-foreground">AI-generated summary</p>
          </div>
        </div>
        {selectedSummary && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => exportSummary(selectedDocument.doc_id)}>
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDocumentSummary(selectedDocument.doc_id)}
              disabled={isLoadingSummary}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingSummary ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
