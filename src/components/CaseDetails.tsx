import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  FileText, MessageSquare,
  Sparkles,
  Trash2,
  Upload,
  User as UserIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useApi } from '../hooks/UseApi'
import { type Case, type Document, type OverallSummary } from '../types/api-models'
import { formatDateTimeToDate, formatFileSize } from '../utils/datetime'
import { ChatInterface } from './ChatInterface'
import { DocumentUpload } from './DocumentUpload'
import { Badge } from './modern/Badge'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
// import { DocumentSummary } from './DocumentSummary'
import { DocumentSummary } from './doc_summary/DocumentSummary'
import { CaseOverviewSummary } from './CaseOverviewSummary'

interface CaseDetailsProps {
  case: Case
  onBack: () => void
  onViewDocument: (documentId: string, documentName: string) => void
  onCaseUpdated: (updatedCase: Case) => void
}

const statusColors = {
  OPEN: 'bg-green-500',
  IN_PROGRESS: 'bg-yellow-500',
  RESOLVED: 'bg-blue-500',
  CLOSED: 'bg-gray-500'
}

const priorityColors = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500'
}

export function CaseDetails({ case: caseData, onBack, onViewDocument, onCaseUpdated }: CaseDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'summary' | 'chat'>('overview')
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)

  const { fetchData: fetchCaseDetails } = useApi<any>(`cases/${caseData.case_id}`)
  const { deleteData: deleteDocument } = useApi("cases");


  useEffect(() => {
    const loadCase = async () => {
      const result = await fetchCaseDetails()
      if (result) {
        setDocuments(
          (result.documents || []).map((doc: any) => ({
            id: doc.doc_id,
            doc_id: doc.doc_id,
            filename: doc.filename,
            mime_type: doc.mime_type?.includes('pdf') ? 'PDF' : 'Unknown',
            size: formatFileSize(doc.size),
            uploaded_at: doc.uploaded_at,
            process_state: doc.process_state,
            uploaded_by: doc.uploaded_by
          }))
        )
        onCaseUpdated({ ...caseData, document_count: result.document_count })
      }
    }
    loadCase()
  }, [caseData.case_id])

  const handleDocumentUpload = async (files: File[]) => {
    const tempDocs = files.map((file) => ({
      id: `temp-${Date.now()}-${file.name}`,
      doc_id: `temp-${Date.now()}-${file.name}`,
      filename: file.name,
      mime_type: file.type?.includes('pdf') ? 'PDF' : 'Unknown',
      size: file.size,
      uploaded_at: new Date().toISOString(),
      process_state: 'UPLOADING' as const,
      uploaded_by: 'Anonymous'
    }));

    setDocuments((prev) => [...prev, ...tempDocs]);
    try {
      const result = await fetchCaseDetails()
      if (result) {
        setDocuments(
          (result.documents || []).map((doc: any) => ({
            id: doc.doc_id,
            doc_id: doc.doc_id,
            filename: doc.filename,
            mime_type: doc.mime_type?.includes('pdf') ? 'PDF' : 'Unknown',
            size: formatFileSize(doc.size),
            uploaded_at: doc.uploaded_at,
            uploaded_by: doc.uploaded_by,
            process_state: doc.process_state
          }))
        )
        onCaseUpdated({ ...caseData, document_count: result.document_count })
      }

      toast.success('Document uploaded successfully')
    } catch (err) {
      toast.error('Failed to refresh case details after upload')
    }
  }

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      const mockSummary = `Based on the analysis of ${documents.length} documents, this case involves a comprehensive review of medical records and insurance documentation. Key findings include evidence of procedural irregularities in the surgical report and potential coverage gaps in the insurance policy. The patient's medical history shows consistent treatment patterns, and the documentation supports the claim for further investigation. Recommendations include obtaining additional specialist opinions and reviewing policy terms for coverage clarification.`
      const updatedCase = { ...caseData, summary: mockSummary }
      onCaseUpdated(updatedCase)
      toast.success('AI summary generated successfully!')
    } catch {
      toast.error('Failed to generate summary')
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    const res = await deleteDocument(`cases/${caseData.case_id}/documents/${docId}`);

    if (res !== null) {
      setDocuments((prev) => prev.filter((doc) => doc.doc_id !== docId));
      onCaseUpdated({
        ...caseData,
        document_count: caseData.document_count - 1,
      });
      toast.success("Document deleted successfully");
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload, badge: documents.length },
    { id: 'summary', label: 'AI Summary', icon: Sparkles },
    { id: 'chat', label: 'Q&A Chat', icon: MessageSquare }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-surface-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cases
              </Button>
              <div className="h-6 w-px bg-surface-border" />
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-solid" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{caseData.title}</h1>
                  <p className="text-muted-foreground">{caseData.title}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusColors[caseData.status]} text-white`}>
                {caseData.status}
              </Badge>
              <Badge className={`${priorityColors[caseData.priority]} text-white`}>
                {caseData.priority}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                  ? 'bg-primary-solid text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-muted/20 text-muted-foreground'
                      }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Case Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-medium">{caseData.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDateTimeToDate(caseData.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDateTimeToDate(caseData.updated_at)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p>{caseData.description}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center justify-center gap-2 p-4 h-auto gradient-primary text-white"
                >
                  <Upload className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Upload Documents</div>
                    <div className="text-sm opacity-90">Add PDFs to the case</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setActiveTab('summary')}
                  disabled={documents.length === 0}
                  className="flex items-center justify-center gap-2 p-4 h-auto gradient-secondary text-white"
                >
                  <Sparkles className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">View Summaries</div>
                    <div className="text-sm opacity-90">Document-wise analysis</div>
                  </div>
                </Button>
                <Button
                  onClick={() => setActiveTab('chat')}
                  // disabled={!caseData.summary}
                  className="flex items-center justify-center gap-2 p-4 h-auto gradient-accent text-white"
                >
                  <MessageSquare className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Start Q&A</div>
                    <div className="text-sm opacity-90">Chat about the case</div>
                  </div>
                </Button>
              </div>
            </Card>

            <CaseOverviewSummary
              documents={documents}
              caseId={caseData.case_id}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Documents ({documents.length})</h3>
              <Button onClick={() => setIsUploadOpen(true)} className="gradient-primary text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>

            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <FileText className="w-8 h-8 text-muted" />
                  <h4 className="font-semibold">No documents uploaded</h4>
                  <p className="text-muted-foreground">Upload PDF documents to start case analysis</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-600" />
                      <div>
                        <h4 className="font-medium">{doc.filename}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{doc.mime_type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.process_state === 'UPLOADING'
                            ? 'Uploading...'
                            : `Uploaded ${formatDateTimeToDate(doc.uploaded_at)}`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.process_state === 'UPLOADING' && (
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                          <div className="w-4 h-4 border-2 border-yellow-600/20 border-t-yellow-600 rounded-full animate-spin" />
                          Uploading
                        </div>
                      )}
                      {doc.process_state === 'PROCESSING' && (
                        <div className="flex items-center gap-2 text-sm text-yellow-600">
                          <div className="w-4 h-4 border-2 border-yellow-600/20 border-t-yellow-600 rounded-full animate-spin" />
                          Processing
                        </div>
                      )}
                      {doc.process_state === 'COMPLETED' && <Badge className="bg-green-500 text-white">Ready</Badge>}
                      {doc.process_state === 'ERROR' && <Badge className="bg-red-500 text-white">Error</Badge>}
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDocument(doc.doc_id, doc.filename)}
                        disabled={doc.process_state !== 'COMPLETED'}
                      >
                        <Eye className="w-4 h-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(doc.doc_id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          // <DocumentSummary
          //   caseData={caseData}
          //   documents={documents}
          // />
            <DocumentSummary caseData={caseData} documents={documents} />
        )}

        {activeTab === 'chat' && <ChatInterface caseData={caseData} documents={documents} />}
      </div>

      <DocumentUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleDocumentUpload}
        caseId={caseData.case_id}
        existingDocs={documents}
      />
    </div>
  )
}
