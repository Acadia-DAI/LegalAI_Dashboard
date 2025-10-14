import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Sparkles, FileText, TrendingUp, AlertCircle, Download, RefreshCw, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Badge } from './modern/Badge'
import toast from 'react-hot-toast'

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  status: 'processing' | 'completed' | 'error'
}

interface CaseOverviewSummaryProps {
  documents: Document[]
  caseId: string
}

interface CombinedSummary {
  overallSummary: string
  keyInsights: string[]
  riskFactors: string[]
  recommendations: string[]
  confidence: number
  generatedAt: string
  documentsAnalyzed: number
}

export function CaseOverviewSummary({ documents, caseId }: CaseOverviewSummaryProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<CombinedSummary | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const completedDocuments = documents.filter(doc => doc.status === 'completed')
  const processingDocuments = documents.filter(doc => doc.status === 'processing')
  const hasDocuments = documents.length > 0
  const canGenerateSummary = completedDocuments.length > 0

  // Auto-load summary if completed documents exist
  useEffect(() => {
    if (canGenerateSummary && !summary && !isLoading) {
      // Auto-generate on mount if we have completed documents
      // Comment this out if you don't want auto-generation
      // handleGenerateSummary()
    }
  }, [])

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to backend
      // Replace this with your actual API call
      // const response = await fetch(`/api/cases/${caseId}/combined-summary`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ documentIds: completedDocuments.map(d => d.id) })
      // })
      // const data = await response.json()

      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500))

      // Mock response - replace with actual API response
      const mockSummary: CombinedSummary = {
        overallSummary: `# Comprehensive Case Analysis\n\nBased on the analysis of **${completedDocuments.length} documents**, this case presents a complex medical-legal scenario involving detailed medical records, insurance documentation, and surgical reports.\n\n## Executive Summary\n\nThe documentation reveals a **6-month treatment period** with consistent medical interventions. The insurance policy shows specific coverage provisions that are directly relevant to the current claim. Surgical procedures were conducted according to standard medical protocols, with comprehensive documentation supporting the treatment approach.\n\n### Key Observations\n\n- Medical records demonstrate a clear **timeline of treatment** from initial diagnosis through completed procedures\n- Insurance policy contains both coverage provisions and specific exclusions that require careful evaluation\n- All consent forms and administrative documentation are properly executed and legally compliant\n- Expert medical opinions corroborate the treatment plan and outcomes\n\n### Financial Impact\n\nEstimated claim value ranges from **$250,000 to $400,000** based on documented medical expenses, projected ongoing treatment needs, and applicable policy limits.\n\n### Timeline\n\n- **Initial diagnosis**: January 2024\n- **Treatment period**: January - July 2024\n- **Primary surgical procedure**: March 2024\n- **Follow-up care**: Ongoing through present`,

        keyInsights: [
          'Medical records show consistent treatment patterns with no significant gaps in care documentation',
          'Insurance policy provisions indicate potential coverage limitations that may affect claim value',
          'All required consent forms and legal documentation are properly executed and compliant',
          'Surgical procedure reports demonstrate adherence to standard medical protocols',
          'Expert medical opinions support the treatment approach and documented outcomes'
        ],

        riskFactors: [
          'Specific insurance policy exclusions may limit coverage for certain treatment aspects',
          'Gap between initial diagnosis and treatment initiation could be questioned by opposing counsel',
          'Pre-existing condition clauses in policy require careful analysis',
          'Some medical records contain handwritten notes that may require expert interpretation'
        ],

        recommendations: [
          'Obtain independent medical examination to validate treatment necessity and appropriateness',
          'Conduct detailed insurance policy review with focus on exclusion clauses and coverage limits',
          'Secure additional expert medical opinions to strengthen treatment justification',
          'Request complete hospital administrative and billing records for comprehensive cost analysis',
          'Consider early settlement discussions given strength of medical documentation'
        ],

        confidence: 87,
        generatedAt: new Date().toISOString(),
        documentsAnalyzed: completedDocuments.length
      }

      setSummary(mockSummary)
      toast.success('Combined summary generated successfully!')
    } catch (err) {
      setError('Failed to generate combined summary. Please try again.')
      toast.error('Failed to generate summary')
      console.error('Summary generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportSummary = () => {
    if (!summary) return

    const exportContent = `# Case Summary Report
Generated: ${new Date(summary.generatedAt).toLocaleString()}
Documents Analyzed: ${summary.documentsAnalyzed}
Confidence Level: ${summary.confidence}%

${summary.overallSummary}

---

## Key Insights
${summary.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

---

## Risk Factors
${summary.riskFactors.map((risk, i) => `${i + 1}. ${risk}`).join('\n')}

---

## Recommendations
${summary.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
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
            {summary && (
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
              disabled={!canGenerateSummary || isLoading}
              className="gradient-secondary text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {summary ? 'Regenerate' : 'Generate'} Summary
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
      {isLoading && (
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
      {!isLoading && summary && (
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
                      Based on {summary.documentsAnalyzed} documents • {summary.confidence}% confidence
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
                    {summary.overallSummary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </Card>

          {/* Key Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-foreground">Key Insights</h4>
            </div>
            <div className="space-y-3">
              {summary.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-foreground flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-foreground">Risk Factors</h4>
              </div>
              <div className="space-y-3">
                {summary.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-foreground text-sm flex-1">{risk}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground">Recommendations</h4>
              </div>
              <div className="space-y-3">
                {summary.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-foreground text-sm flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Metadata Footer */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Analysis Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-surface rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${summary.confidence}%` }}
                    />
                  </div>
                  <span className="font-medium text-foreground">{summary.confidence}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Documents Analyzed</p>
                <p className="font-medium text-foreground">{summary.documentsAnalyzed} of {documents.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Generated</p>
                <p className="font-medium text-foreground">
                  {new Date(summary.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State - No Summary Yet */}
      {!isLoading && !summary && !error && (
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
