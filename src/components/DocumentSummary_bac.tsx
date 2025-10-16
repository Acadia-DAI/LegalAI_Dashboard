import { useState, useEffect } from 'react'
import {
  Sparkles,
  FileText,
  Search,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  FileIcon
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Badge } from './modern/Badge'
import { Input } from './modern/Input'
import type { Case, Document } from '@/types/api-models'



interface DocumentSummary {
  documentId: string
  summary: string
  keyPoints: string[]
  confidence: number
  generatedAt: string
  wordCount: number
}

interface DocumentSummaryProps {
  caseData: Case
  documents: Document[]
  isGeneratingSummary: boolean
  onGenerateSummary: () => void
}

export function DocumentSummary({ caseData, documents, isGeneratingSummary, onGenerateSummary }: DocumentSummaryProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'error'>('all')
  const [documentSummaries, setDocumentSummaries] = useState<Record<string, DocumentSummary>>({})
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({})
  const [summaryErrors, setSummaryErrors] = useState<Record<string, string>>({})

  const completedDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'completed')
  const processingDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'processing')
  const errorDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'error')

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || doc.process_state.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  // Auto-select first completed document
  useEffect(() => {
    if (!selectedDocumentId && completedDocuments.length > 0) {
      setSelectedDocumentId(completedDocuments[0].id)
    }
  }, [completedDocuments, selectedDocumentId])

  // Mock API call to fetch document summary
  const fetchDocumentSummary = async (documentId: string): Promise<DocumentSummary> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock markdown summary
    const mockSummary = `# Document Analysis Summary

## Overview
This document contains **critical information** relevant to the case proceedings. The analysis reveals several key areas that require attention.

## Key Findings

### Medical Documentation
- Comprehensive medical records spanning *6 months*
- Consistent treatment patterns documented
- All procedures follow standard protocols

### Insurance Coverage
- Policy terms clearly defined
- Specific exclusions identified
- Coverage limits documented at **$500,000**

### Legal Considerations
> **Important**: All consent forms are properly executed and legally binding.

## Recommendations

1. **Immediate Actions**
   - Review specialist opinions
   - Validate insurance coverage
   - Obtain additional documentation

2. **Follow-up Requirements**
   - Schedule independent medical examination
   - Contact insurance representatives
   - Prepare settlement documentation

## Risk Assessment

| Factor | Level | Impact |
|--------|-------|--------|
| Documentation | Complete | Low Risk |
| Insurance | Partial | Medium Risk |
| Legal | Adequate | Low Risk |

## Next Steps

- [ ] Obtain specialist opinions
- [ ] Review policy terms
- [ ] Schedule examinations
- [ ] Prepare settlement docs

---

*Analysis generated on ${new Date().toLocaleDateString()} with 94% confidence level.*`

    return {
      documentId,
      summary: mockSummary,
      keyPoints: [
        'Medical records are comprehensive and well-documented',
        'Insurance policy contains specific exclusions',
        'All legal documentation is properly executed',
        'Expert opinions support current treatment approach'
      ],
      confidence: 94,
      generatedAt: new Date().toISOString(),
      wordCount: 245
    }
  }

  const loadDocumentSummary = async (documentId: string) => {
    if (documentSummaries[documentId] || loadingSummaries[documentId]) {
      return
    }

    setLoadingSummaries(prev => ({ ...prev, [documentId]: true }))
    setSummaryErrors(prev => ({ ...prev, [documentId]: '' }))

    try {
      const summary = await fetchDocumentSummary(documentId)
      setDocumentSummaries(prev => ({ ...prev, [documentId]: summary }))
    } catch (error) {
      setSummaryErrors(prev => ({
        ...prev,
        [documentId]: 'Failed to generate summary. Please try again.'
      }))
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [documentId]: false }))
    }
  }

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocumentId(documentId)
    const document = documents.find(d => d.id === documentId)
    if (document?.process_state.toLowerCase() === 'completed') {
      loadDocumentSummary(documentId)
    }
  }

  const exportSummary = (documentId: string) => {
    const summary = documentSummaries[documentId]
    const document = documents.find(d => d.id === documentId)
    if (summary && document) {
      const blob = new Blob([summary.summary], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${document.filename}-summary.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getStatusIcon = (status: Document['process_state']) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: Document['process_state']) => {
    const variants = {
      COMPLETED: 'bg-green-100 text-green-700 border-green-200',
      PROCESSING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      ERROR: 'bg-red-100 text-red-700 border-red-200'
    }

    return (
      <Badge className={`${variants[status]} text-xs px-2 py-1`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No documents to analyze</h3>
            <p className="text-muted-foreground mt-2">Upload PDF documents to generate AI-powered summaries</p>
          </div>
        </div>
      </Card>
    )
  }

  const selectedDocument = selectedDocumentId ? documents.find(d => d.id === selectedDocumentId) : null
  const selectedSummary = selectedDocumentId ? documentSummaries[selectedDocumentId] : null
  const isLoadingSummary = selectedDocumentId ? loadingSummaries[selectedDocumentId] : false
  const summaryError = selectedDocumentId ? summaryErrors[selectedDocumentId] : null

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Document Summaries</h3>
          <p className="text-muted-foreground">AI-powered analysis of individual documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-foreground">{completedDocuments.length} Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-foreground">{processingDocuments.length} Processing</span>
            </div>
            {errorDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-foreground">{errorDocuments.length} Error</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
        {/* Document List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-foreground">Documents ({documents.length})</h4>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-1">
                {(['all', 'completed', 'processing', 'error'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="text-xs"
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <FileIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No documents found</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      onClick={() => handleDocumentSelect(document.doc_id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-surface/50 mb-2 ${
                        selectedDocumentId === document.id
                          ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800'
                          : 'border-border hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(document.process_state)}
                            <p className="font-medium text-foreground text-sm truncate">
                              {document.filename}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(document.process_state)}
                            <span className="text-xs text-muted-foreground">{document.size}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(document.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                        {selectedDocumentId === document.id && (
                          <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Summary Display */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {!selectedDocument ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h4 className="font-semibold text-foreground mb-2">Select a document</h4>
                  <p className="text-muted-foreground">Choose a document from the list to view its AI-generated summary</p>
                </div>
              </div>
            ) : selectedDocument.process_state.toLowerCase() !== 'completed' ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  {selectedDocument.process_state.toLowerCase() === 'processing' ? (
                    <>
                      <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-foreground mb-2">Document Processing</h4>
                      <p className="text-muted-foreground">This document is still being processed. Summary will be available once processing is complete.</p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                      <h4 className="font-semibold text-foreground mb-2">Processing Error</h4>
                      <p className="text-muted-foreground">There was an error processing this document. Please try re-uploading.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Summary Header */}
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
                    <div className="flex items-center gap-2">
                      {selectedSummary && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportSummary(selectedDocument.doc_id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadDocumentSummary(selectedDocument.doc_id)}
                            disabled={isLoadingSummary}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingSummary ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary Content */}
                <div className="flex-1 overflow-y-auto">
                  {isLoadingSummary ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Generating Summary</h4>
                        <p className="text-muted-foreground">Analyzing document with AI...</p>
                        <div className="w-48 bg-surface rounded-full h-2 mx-auto mt-4">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  ) : summaryError ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                        <h4 className="font-semibold text-foreground mb-2">Summary Generation Failed</h4>
                        <p className="text-muted-foreground mb-4">{summaryError}</p>
                        <Button
                          onClick={() => loadDocumentSummary(selectedDocument.doc_id)}
                          className="gradient-secondary text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  ) : selectedSummary ? (
                    <div className="p-6">
                      {/* Summary Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-surface/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="flex-1 bg-surface rounded-full h-2 max-w-[80px]">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${selectedSummary.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">{selectedSummary.confidence}%</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Word Count</p>
                          <p className="font-medium text-foreground mt-1">{selectedSummary.wordCount.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Generated</p>
                          <p className="font-medium text-foreground mt-1">
                            {new Date(selectedSummary.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Markdown Content */}
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-xl font-bold text-foreground mb-4">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-semibold text-foreground mb-3 mt-6">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-semibold text-foreground mb-2 mt-4">{children}</h3>,
                            p: ({ children }) => <p className="text-foreground mb-3 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-foreground">{children}</li>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900/20 my-4 rounded-r-lg">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-4">
                                <table className="min-w-full border border-border rounded-lg">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
                            th: ({ children }) => <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">{children}</th>,
                            td: ({ children }) => <td className="border border-border px-4 py-2 text-foreground">{children}</td>,
                            code: ({ children }) => (
                              <code className="bg-surface px-1 py-0.5 rounded text-sm font-mono text-foreground">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-surface p-4 rounded-lg overflow-x-auto my-4 border border-border">
                                {children}
                              </pre>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                            hr: () => <hr className="border-border my-6" />
                          }}
                        >
                          {selectedSummary.summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h4 className="font-semibold text-foreground mb-2">Generate Summary</h4>
                        <p className="text-muted-foreground mb-4">Click the button below to generate an AI summary for this document</p>
                        <Button
                          onClick={() => loadDocumentSummary(selectedDocument.doc_id)}
                          className="gradient-secondary text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Summary
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}