import {
  FileText,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  FileIcon,
} from "lucide-react";
import { Button } from "../modern/Button";
import { Card } from "../modern/Card";
import { Badge } from "../modern/Badge";
import { Input } from "../modern/Input";
import type { Document } from "@/types/api-models";

interface Props {
  documents: Document[];
  selectedDocumentId: string | null;
  searchQuery: string;
  filterStatus: "all" | "completed" | "processing" | "error";
  onSelect: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterStatus: (s: "all" | "completed" | "processing" | "error") => void;
}

export function DocumentList({
  documents,
  selectedDocumentId,
  searchQuery,
  filterStatus,
  onSelect,
  setSearchQuery,
  setFilterStatus,
}: Props) {
  const getStatusIcon = (status: Document["process_state"]) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

const getStatusBadge = (status: Document["process_state"]) => {
  const variants: Record<Document["process_state"], string> = {
    COMPLETED: "bg-green-100 text-green-700 border-green-200",
    PROCESSING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    ERROR: "bg-red-100 text-red-700 border-red-200",
    UPLOADING: "bg-yellow-100 text-yellow-700 border-yellow-200"
  };

  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <Badge className={`${variants[status]} text-xs px-2 py-1`}>
      {label}
    </Badge>
  );
};

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-foreground">
            Documents ({documents.length})
          </h4>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-1">
          {(["all", "completed", "processing", "error"] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="text-xs"
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <FileIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No documents found</p>
          </div>
        ) : (
          <div className="p-2">
            {documents.map((doc) => (
              <div
                key={doc.doc_id}
                onClick={() => onSelect(doc.doc_id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-surface/50 mb-2 ${
                  selectedDocumentId === doc.id
                    ? "border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800"
                    : "border-border hover:border-purple-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(doc.process_state)}
                      <p className="font-medium text-foreground text-sm truncate">{doc.filename}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(doc.process_state)}
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>
                  {selectedDocumentId === doc.id && (
                    <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
