import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Sparkles, FileText, AlertCircle, Download, RefreshCw, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import toast from 'react-hot-toast'
import type { Document, OverallSummary } from '@/types/api-models'
import { useApi } from '@/hooks/UseApi'


interface CaseOverviewSummaryProps {
  documents: Document[]
  caseId: Number
  overallSummary: OverallSummary | null
  setOverallSummary: (summary: OverallSummary) => void
}

export function CaseOverviewSummary({ documents, caseId, overallSummary, setOverallSummary }: CaseOverviewSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchData, loading } = useApi<string>(`cases/${caseId}/summary`)

  const completedDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'completed')
  const processingDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'processing')
  const hasDocuments = documents.length > 0
  const canGenerateSummary = completedDocuments.length > 0

  // Auto-load summary if completed documents exist
  useEffect(() => {
    if (canGenerateSummary && !overallSummary && !loading) {
      // Auto-generate on mount if we have completed documents
      // Comment this out if you don't want auto-generation
      // handleGenerateSummary()
    }
  }, [])

  const handleGenerateSummary = async () => {
    setError(null)

    try {
      const result = await fetchData()

      if (result) {
        const combined: OverallSummary = {
          overallSummary: result,
          generatedAt: new Date().toISOString(),
          documentsAnalyzed: completedDocuments.length,
        }
        setOverallSummary(combined)
        toast.success('Overall summary generated successfully!')
      } else {
        setError('Failed to generate Overall summary. Please try again.')
        toast.error('Failed to generate summary.')
      }
    } catch (err) {
      setError('Failed to generate Overall summary. Please try again.')
      toast.error('Failed to generate Overall summary')
      console.error('Overall Summary generation error:', err)
    }
  }

  const handleExportSummary = () => {
    if (!overallSummary) return
    const exportContent = `# Case Overall Summary
Generated: ${new Date(overallSummary.generatedAt).toLocaleString()}
Documents Analyzed: ${overallSummary.documentsAnalyzed}

${overallSummary.overallSummary}
`

    const blob = new Blob([exportContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `case-${caseId}-combined-summary.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Summary exported successfully!')
  }

  if (!hasDocuments) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">No Documents Available</h4>
            <p className="text-muted-foreground mt-2">
              Upload documents to generate a comprehensive case summary
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Combined Case Summary</h3>
            <p className="text-muted-foreground">AI-powered analysis of all case documents</p>
          </div>
          <div className="flex items-center gap-3">
            {overallSummary && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSummary}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
            <Button
              onClick={handleGenerateSummary}
              disabled={!canGenerateSummary || loading}
              className="gradient-secondary text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {overallSummary ? 'Regenerate' : 'Generate'} Summary
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{completedDocuments.length}</p>
              <p className="text-sm text-muted-foreground">Ready for Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{processingDocuments.length}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </div>
        </div>

        {processingDocuments.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {processingDocuments.length} document(s) still processing. Summary will be more comprehensive once all documents are ready.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-200">Error Generating Summary</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Generating Combined Summary</h4>
              <p className="text-muted-foreground mt-2">
                Analyzing {completedDocuments.length} documents with AI...
              </p>
            </div>
            <div className="w-full max-w-md bg-surface rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"
                style={{ width: '70%' }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Summary Content */}
      {!loading && overallSummary && (
        <div className="space-y-6">
          {/* Main Summary with Markdown */}
          <Card className="overflow-hidden">
            <div
              className="p-6 border-b border-surface-border cursor-pointer hover:bg-surface/50 transition-colors"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Overall Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on {overallSummary.documentsAnalyzed} documents
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
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
                    }}
                  >
                    {overallSummary.overallSummary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </Card>

          {/* Metadata Footer */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Analysis Metadata</h4>
            <div className="flex justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Documents Analyzed</p>
                <p className="font-medium text-foreground">{overallSummary.documentsAnalyzed} of {documents.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Generated</p>
                <p className="font-medium text-foreground">
                  {new Date(overallSummary.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State - No Summary Yet */}
      {!loading && !overallSummary && !error && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Ready to Generate Combined Summary</h4>
              <p className="text-muted-foreground mt-2">
                {completedDocuments.length} document(s) ready for comprehensive AI analysis
              </p>
            </div>
            <Button
              onClick={handleGenerateSummary}
              disabled={!canGenerateSummary}
              className="gradient-secondary text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Combined Summary
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
