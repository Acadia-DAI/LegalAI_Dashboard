import { CheckCircle, Clock, Download, FileText, RefreshCw, Sparkles } from 'lucide-react'
import { type Case, type Document } from '../types/api-models'
import { Button } from './modern/Button'
import { Card } from './modern/Card'


interface DocumentSummaryProps {
  caseData: Case
  documents: Document[] | Document[]
  isGeneratingSummary: boolean
  onGenerateSummary: () => void
}

export function DocumentSummary({ caseData, documents, isGeneratingSummary, onGenerateSummary }: DocumentSummaryProps) {
  const completedDocuments = documents.filter(doc => (doc.process_state).toLowerCase() === 'completed')
  const processingDocuments = documents.filter(doc => (doc.process_state).toLowerCase() === 'processing')

  const mockKeyFindings = [
    "Medical records indicate consistent treatment patterns over 6-month period",
    "Insurance policy contains specific exclusions relevant to current claim",
    "Surgical procedure documentation shows standard protocols were followed",
    "Patient consent forms are complete and properly executed",
    "Expert medical opinions support the documented treatment approach"
  ]

  const mockRecommendations = [
    "Obtain additional specialist opinions for comprehensive analysis",
    "Review insurance policy terms for coverage clarification",
    "Request complete hospital administrative records",
    "Consider independent medical examination",
    "Evaluate potential for settlement negotiations"
  ]

  if (documents.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No documents to analyze</h3>
            <p className="text-muted-foreground mt-2">Upload PDF documents to generate an AI-powered case summary</p>
          </div>
          <Button disabled className="gradient-secondary text-white opacity-50">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Summary
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Document Summary</h3>
          <p className="text-muted-foreground">Intelligent analysis of case documents using advanced AI</p>
        </div>
        <div className="flex items-center gap-3">
          {!caseData.summary && (
            <Button  className="gradient-primary text-white">
              <Download className="w-4 h-4 mr-2 " />
              Export Summary
            </Button>
          )}
          <Button
            onClick={onGenerateSummary}
            disabled={completedDocuments.length === 0 || isGeneratingSummary}
            className="gradient-secondary text-white"
          >
            {isGeneratingSummary ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {caseData.summary ? 'Regenerate' : 'Generate'} Summary
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Document Status */}
      <Card className="p-6">
        <h4 className="font-semibold text-foreground mb-4">Document Analysis Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{completedDocuments.length}</p>
              <p className="text-sm text-muted-foreground">Documents Ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{processingDocuments.length}</p>
              <p className="text-sm text-muted-foreground">Processing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </div>
        </div>

        {processingDocuments.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {processingDocuments.length} document(s) are still being processed. Summary will be more comprehensive once all documents are ready.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Generated Summary */}
      {isGeneratingSummary ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-foreground">Generating AI Summary</h4>
              <p className="text-muted-foreground mt-2">Analyzing {completedDocuments.length} documents...</p>
            </div>
            <div className="w-full max-w-md bg-surface rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </Card>
      ) : caseData ? (
        <div className="space-y-6">
          {/* Main Summary */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Executive Summary</h4>
                <p className="text-sm text-muted-foreground">AI-generated analysis based on {completedDocuments.length} documents</p>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">{caseData.summary}</p>
            </div>
          </Card>

          {/* Key Findings */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Key Findings</h4>
            <div className="space-y-3">
              {mockKeyFindings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{finding}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Recommendations</h4>
            <div className="space-y-3">
              {mockRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Confidence & Metadata */}
          <Card className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Analysis Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Confidence Level</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-surface rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-medium text-foreground">85%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                <p className="font-medium text-foreground mt-1">{completedDocuments.length} of {documents.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Generated</p>
                <p className="font-medium text-foreground mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Ready to Generate Summary</h4>
              <p className="text-muted-foreground mt-2">
                {completedDocuments.length} document(s) are ready for AI analysis
              </p>
            </div>
            <Button
              onClick={onGenerateSummary}
              disabled={completedDocuments.length === 0}
              className="gradient-secondary text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Summary
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}