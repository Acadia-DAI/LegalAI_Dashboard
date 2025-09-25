import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageSquare, Sparkles, FileText, AlertCircle, PrinterIcon, Download, FileDown, Printer, FileDownIcon } from 'lucide-react'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Input } from './modern/Input'
import toast from 'react-hot-toast'
import type { Case, Document, Message } from '../types/api-models'
import { useApi } from '../hooks/UseApi'
import { useAuthStore } from '../store/AuthStore'
import { renderStyledMessages } from './PrintRenderer'


interface ChatInterfaceProps {
  caseData: Case
  documents: Document[]
}

const mockResponses = [
  "Based on the uploaded medical records, the patient's treatment history shows consistent care protocols were followed according to standard medical practices.",
  "The insurance policy documents indicate coverage limitations that may apply to this specific type of claim. I've identified several relevant clauses that should be reviewed.",
  "From the surgical reports, I can see that all pre-operative procedures were properly documented and patient consent was obtained according to required protocols.",
  "The evidence suggests a strong foundation for your case. The documentation supports the timeline of events and shows proper medical decision-making processes.",
  "I've analyzed the contract terms and found potential areas where the coverage interpretation may be disputed. This could be leveraged in negotiations."
]

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
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const [sessionId] = useState(() => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];
    return `${caseData.case_id}_${timestamp}`;
  });

  const { postData: sendChat } = useApi<{
    ai_message: string
    citations: string[]
    session_id: string
  }>("chat")

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      const res = await sendChat({
        user_message: userMessage.content,
        user_id: user?.displayName || 'anonymous',
        case_id: String(caseData.case_id),
        session_id: String(sessionId),
        document_ids: documents.map(d => d.id || d.doc_id)
      })

      if (res) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: res.ai_message,
          timestamp: new Date().toISOString(),
          sources: res.citations
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

  const toggleExpand = (index: number) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
        <div
          className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center cursor-pointer
             hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          onClick={() => handlePrint()}
          title="Export full chat"
          hidden={messages.length <= 2}
        >
          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-surface-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                      <div className="flex flex-col gap-2">
                        {message.sources.map((source, index) => (
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
                        ))}
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
                      <FileDownIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
              placeholder="Ask a question about this case..."
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