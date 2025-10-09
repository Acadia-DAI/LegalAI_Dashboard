import { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card } from "../modern/Card";
import { Button } from "../modern/Button";
import type { Case, CaseDocumentSummaryOut, Document } from "@/types/api-models";
import { useApi } from "@/hooks/UseApi";
import { DocumentList } from "./DocumentList";
import { SummaryHeader } from "./SummaryHeader";
import { SummaryContent } from "./SummaryContent";


interface DocumentSummaryData {
  documentId: string;
  summary: string;
  confidence: number;
  generatedAt: string;
  wordCount: number;
  keyPoints: string[];
}

interface DocumentSummaryProps {
  caseData: Case;
  documents: Document[];
}

export function DocumentSummary({
  caseData,
  documents
}: DocumentSummaryProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "processing" | "error">("all");
  const [documentSummaries, setDocumentSummaries] = useState<Record<string, DocumentSummaryData>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [summaryErrors, setSummaryErrors] = useState<Record<string, string>>({});

  // ✅ useApi hook instance for summary API
  const { fetchData } = useApi<CaseDocumentSummaryOut>("cases");

  const completedDocuments = documents.filter((d) => d.process_state.toLowerCase() === "completed");
  const processingDocuments = documents.filter((d) => d.process_state.toLowerCase() === "processing");
  const errorDocuments = documents.filter((d) => d.process_state.toLowerCase() === "error");

  // Filter + auto select
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || doc.process_state.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (!selectedDocumentId && completedDocuments.length > 0) {
      setSelectedDocumentId(completedDocuments[0].doc_id);
    }
  }, [completedDocuments, selectedDocumentId]);

  /**
   * ✅ Fetch summary from backend
   * Replaces mock timeout + markdown with real API call
   */
  const fetchDocumentSummary = async (documentId: string): Promise<DocumentSummaryData> => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc) throw new Error("Document not found");

    const res = await fetchData({}, `cases/${caseData.case_id}/documents/${doc.doc_id}/summary`);
    if (!res) throw new Error("Failed to fetch summary");

    return {
      documentId,
      summary: res.doc_summary || "*No summary available.*",
      keyPoints: [],
      confidence: 95, // optional placeholder (if not provided by API)
      generatedAt: res.uploaded_at,
      wordCount: res.doc_summary ? res.doc_summary.split(/\s+/).length : 0,
    };
  };

  const loadDocumentSummary = async (documentId: string) => {
    if (documentSummaries[documentId] || loadingSummaries[documentId]) return;

    setLoadingSummaries((prev) => ({ ...prev, [documentId]: true }));
    setSummaryErrors((prev) => ({ ...prev, [documentId]: "" }));

    try {
      const summary = await fetchDocumentSummary(documentId);
      setDocumentSummaries((prev) => ({ ...prev, [documentId]: summary }));
    } catch (err: any) {
      setSummaryErrors((prev) => ({
        ...prev,
        [documentId]:
          err?.message || "Failed to load summary. Please try again.",
      }));
    } finally {
      setLoadingSummaries((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  const handleDocumentSelect = (id: string) => {
    setSelectedDocumentId(id);
    const doc = documents.find((d) => d.id === id);
    if (doc?.process_state.toLowerCase() === "completed") loadDocumentSummary(id);
  };

  const selectedDocument = documents.find((d) => d.id === selectedDocumentId) || null;
  const selectedSummary = selectedDocumentId ? documentSummaries[selectedDocumentId] : null;
  const isLoadingSummary = selectedDocumentId ? loadingSummaries[selectedDocumentId] : false;
  const summaryError = selectedDocumentId ? summaryErrors[selectedDocumentId] : null;

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No documents to analyze</h3>
            <p className="text-muted-foreground mt-2">
              Upload PDF documents to generate AI-powered summaries
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Document Summaries</h3>
        <p className="text-muted-foreground">
          AI-powered analysis of individual documents
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{completedDocuments.length} Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span>{processingDocuments.length} Processing</span>
          </div>
          {errorDocuments.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorDocuments.length} Error</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ✅ Main grid layout */}
    <div className="flex gap-6 h-[800px]">
      {/* Left panel (1/3) */}
      <div className="flex">
        <DocumentList
          documents={filteredDocuments}
          selectedDocumentId={selectedDocumentId}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onSelect={handleDocumentSelect}
          setSearchQuery={setSearchQuery}
          setFilterStatus={setFilterStatus}
        />
      </div>

      {/* Right panel (2/3) */}
      <div className="flex-1 flex flex-col border border-border rounded-lg overflow-hidden">
        <SummaryHeader
          selectedDocument={selectedDocument}
          selectedSummary={selectedSummary}
          loadDocumentSummary={loadDocumentSummary}
          exportSummary={(id) => {
            const s = documentSummaries[id];
            const d = documents.find((x) => x.id === id);
            if (s && d) {
              const blob = new Blob([s.summary], { type: "text/markdown" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${d.filename}-summary.md`;
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
          isLoadingSummary={isLoadingSummary}
        />

        <SummaryContent
          selectedDocument={selectedDocument}
          selectedSummary={selectedSummary}
          isLoadingSummary={isLoadingSummary}
          summaryError={summaryError}
          loadDocumentSummary={loadDocumentSummary}
        />
      </div>
    </div>
  </div>
);
}