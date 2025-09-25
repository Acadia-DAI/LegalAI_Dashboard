export interface Case {
  case_id: number;
  title: string;
  description?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  created_at: string;
  updated_at: string;
  document_count: number;
  summary?: string | null;
}

export interface CaseDetail extends Case {
  documents: Document[];
  summary?: string | null;
}

export interface Document {
  id?: string;
  doc_id: string;
  filename: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  process_state: "PROCESSING" | "COMPLETED" | "ERROR";
  uploaded_by: string;
}


export interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  sources?: string[]
}