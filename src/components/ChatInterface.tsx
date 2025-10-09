import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare, Sparkles, FileText, AlertCircle, PrinterIcon, Download, FileDown, Printer, FileDownIcon, ChevronDown, Settings } from 'lucide-react'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Input } from './modern/Input'
import toast from 'react-hot-toast'
import type { Case, Document, Message } from '../types/api-models'
import { useApi } from '../hooks/UseApi'
import { useAuthStore } from '../store/AuthStore'
import { renderStyledMessages } from './PrintRenderer'
import { set } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'


interface ChatInterfaceProps {
  caseData: Case
  documents: Document[]
}

const suggestedQuestions = [
  "What are the key strengths of this case?",
  "Are there any potential weaknesses I should be aware of?",
  "What additional documentation might be helpful?",
  "How strong is the evidence for our position?",
  "What are the relevant policy provisions?",
  "What precedents might apply to this case?"
]

export function ChatInterface({ caseData, documents }: ChatInterfaceProps) {
  const user = useAuthStore((state) => state.user)
  // const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI case analyst for "${caseData.title}". I've analyzed the uploaded documents and I'm ready to answer questions about this case. What would you like to know?`,
      timestamp: new Date().toISOString(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const [sessionId] = useState(() => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
    return `${caseData.case_id}_${timestamp}`;
  });
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [isDocumentSelectorOpen, setIsDocumentSelectorOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { postData: sendChat } = useApi<{
    ai_message: string
    citations: { chunk_text: string; doc_name: string }[]
    session_id: string
  }>("chat")

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDocumentSelectorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


  useEffect(() => {
    const completedDocs = documents.filter(
      (doc) => doc.process_state.toLowerCase() === "completed"
    );
    const completedDocIds = completedDocs.map((doc) => doc.doc_id);

    setSelectedDocuments((prev) => {
      const prevIds = prev.map((doc) => doc.doc_id);

      const stillCompleted = prev.filter((doc) =>
        completedDocIds.includes(doc.doc_id)
      );
      const newOnes = completedDocs.filter(
        (doc) => !prevIds.includes(doc.doc_id)
      );

      return [...stillCompleted, ...newOnes];
    });
  }, [documents]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // if (!caseData.summary) {
    //   toast.error('Please generate a case summary first before starting Q&A')
    //   return
    // }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const doc_Ids = selectedDocuments.map(doc => doc.doc_id)
      if (doc_Ids.length === 0) {
        toast.error('Please select at least one document for context')
        setIsTyping(false)
        return
      }
      const res = await sendChat({
        user_message: userMessage.content,
        user_id: user?.displayName || 'System',
        case_id: String(caseData.case_id),
        session_id: String(sessionId),
        document_ids: doc_Ids
      });


      if (res) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: res.ai_message,
          timestamp: new Date().toISOString(),
          sources: Array.from(
            new Set(
              res.citations.map(ct => {
                if (!ct?.doc_name) return "";
                const fileName = ct.doc_name.split(/[\\/]/).pop()!;
                return fileName.includes("_")
                  ? fileName.substring(fileName.indexOf("_") + 1)
                  : fileName;
              })
            )
          ),
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (err: any) {
      toast.error(err.message || "Chat failed")
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const completedDocuments = documents.filter(doc => doc.process_state.toLowerCase() === 'completed')

  const handleDocumentToggle = (document: Document) => {
    setSelectedDocuments(prev =>
      prev.some(d => d.doc_id === document.doc_id)
        ? prev.filter(d => d.doc_id !== document.doc_id)
        : [...prev, document]
    )
    setIsDocumentSelectorOpen(false) // 👈 close after toggle
  }

  const handleSelectAllDocuments = () => {
    setSelectedDocuments(completedDocuments)
  }

  const handleDeselectAllDocuments = () => {
    setSelectedDocuments([])
  }

  const getContextDescription = () => {
    if (completedDocuments.length === selectedDocuments.length) {
      return `all ${completedDocuments.length} documents`
    }
    if (selectedDocuments.length === 1) {
      return `"${selectedDocuments[0].filename}"`
    }
    return `${selectedDocuments.length} selected documents`
  }

  const getSelectedDocumentNamesShort = () => {
    if (completedDocuments.length === selectedDocuments.length) {
      return `All documents (${completedDocuments.length})`
    }

    const selectedCount = selectedDocuments.length
    if (selectedCount === 0) return 'No documents selected'

    if (selectedCount === 1) {
      return selectedDocuments[0]?.filename || 'Selected document'
    }
    return `${selectedCount} documents selected`
  }

  if (!documents || documents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Summary Required</h3>
            <p className="text-muted-foreground mt-2">
              Please generate an AI summary of the case documents before starting Q&A conversations.
            </p>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            The AI needs to analyze your documents first to provide accurate and contextual answers about your case.
          </p>
        </div>
      </Card>
    )
  }

  // const toggleExpand = (index: number) => {
  //   setExpandedSources((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  const handlePrint = (message?: Message) => {
    const html = message
      ? renderStyledMessages([message])
      : renderStyledMessages(messages);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 500);
    };
  };



  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 mb-4 justify-between">
        <div className="flex-1 flex items-center gap-3 ">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Q&A Chat</h3>
            <p className="text-sm text-muted-foreground">Ask questions about {caseData.title}</p>
          </div>
        </div>
        <Button
          onClick={() => handlePrint()}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          disabled={messages.length <= 2}
        >
          <Printer className="w-5 h-5 mr-2" />
          Print Chat
        </Button>
      </div>

      {/* Compact Document Selection */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg border border-primary-solid/40 bg-surface ">
        <div className="flex items-center gap-2 text-sm text-bold">
          <FileText className="w-4 h-4" />
          <span>Context:</span>
        </div>

        <div className="relative flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDocumentSelectorOpen(!isDocumentSelectorOpen)}
            className="flex items-center cursor-pointer justify-between w-full px-3 py-2 text-sm bg-surface hover:bg-surface-hover border border-surface-border rounded-lg transition-colors"
          >
            <span className="text-foreground truncate">{getSelectedDocumentNamesShort()}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
          </button>

          {isDocumentSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">

              {(
                <div className="p-3">
                  <div className="flex gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSelectAllDocuments}
                      disabled={selectedDocuments.length === completedDocuments.length}
                      className="text-xs h-7"
                    >
                      Select All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeselectAllDocuments}
                      disabled={selectedDocuments.length === 0}
                      className="text-xs h-7"
                    >
                      Deselect All
                    </Button>
                  </div>

                  <div className="max-h-64 overflow-y-auto"
                    style={{ height: '256px' }}>
                    {completedDocuments.map((document) => (
                      <label
                        key={document.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document)}
                          onChange={() => handleDocumentToggle(document)}
                          className="w-4 h-4 text-primary-solid rounded border-muted focus:ring-primary-solid focus:ring-2"
                        />
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate text-sm">{document.filename}</p>
                          <p className="text-xs text-muted-foreground">{document.size} • {document.mime_type}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {completedDocuments.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <FileText className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No completed documents available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[70%] relative group ${message.type === "user" ? "order-2" : ""}`}
              >
                <div
                  className={`p-3 rounded-2xl shadow-sm transition-all ${message.type === "user"
                    ? "bg-primary-solid text-white"
                    : "bg-surface border border-surface-border"
                    }`}
                >
                    <ReactMarkdown className='text-sm leading-relaxed'>{message.content}</ReactMarkdown>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-surface-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                      <div className="flex flex-col gap-2">
                        {message.sources.map((source, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-muted/10 rounded text-xs text-muted-foreground"
                          >
                            <FileText className="w-3 h-3" />
                            {source}
                          </span>
                        ))}
                        {/* {message.sources.map((source, index) => (
                          <div
                            key={index}
                            className="inline-flex flex-col bg-muted/10 rounded-lg p-2 text-xs text-muted-foreground"
                          >
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">Source {index + 1}</span>
                            </div>
                            <p className="mt-1 whitespace-pre-wrap text-foreground/80">
                              {expandedSources[index]
                                ? source
                                : source.slice(0, 100) + (source.length > 100 ? "..." : "")}
                            </p>
                            {source.length > 100 && (
                              <button
                                onClick={() => toggleExpand(index)}
                                className="text-blue-500 hover:underline text-xs mt-1 self-start"
                              >
                                {expandedSources[index] ? "Show less" : "Show more"}
                              </button>
                            )}
                          </div>
                        ))} */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Actions */}
                {message.id !== "1" && message.type === "ai" && (
                  <div
                    className="absolute -bottom-7 right-3 opacity-0 group-hover:opacity-100
                     flex gap-2 bg-background/80 backdrop-blur-md
                     px-2 py-1 rounded-full shadow-md transition-opacity"
                  >
                    <button
                      onClick={() => handlePrint(message)}
                      className="p-1 hover:bg-muted/20 rounded-full transition-colors"
                      title="Print this AI message"
                    >
                      <Printer className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 order-3">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-surface border border-surface-border p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-surface-border">
            <p className="text-sm text-muted-foreground mb-3">Suggested questions to get started:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4  border-t border-surface-border">
          <div className="flex gap-2 w-full">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedDocuments.length === 0 ? 'Please select at least one document for context' : `Ask a question about ${getContextDescription()}...`}
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="gradient-primary text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </Card>
    </div>
  )
}