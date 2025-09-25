import { Cloud, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './modern/Button'
import { Input } from './modern/Input'
import { Modal } from './modern/Modal'

interface ScanBillModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScanBillModal({ isOpen, onClose }: ScanBillModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      setUploading(false)
      toast.success('Bill uploaded successfully!')
      onClose()
    }, 2000)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleUrlUpload = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    setUploading(true)
    // Simulate URL processing
    setTimeout(() => {
      setUploading(false)
      toast.success('Bill uploaded from URL successfully!')
      setUrlInput('')
      onClose()
    }, 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Scan New Bill</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a bill or link to PDF for processing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="space-y-6">
          {/* Drag and Drop */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
              ${dragActive
                ? 'border-primary-solid bg-primary-solid/5'
                : 'border-border hover:border-primary-solid/50 hover:bg-primary-solid/5'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="p-4 rounded-full bg-primary-solid/10">
                <Cloud className="h-8 w-8 text-primary-solid" />
              </div>

              <div className="space-y-2">
                <p className="font-medium">
                  {uploading ? 'Uploading...' : 'Drag your files or browse'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Only supports .pdf files
                </p>
              </div>

              {uploading && (
                <div className="w-full max-w-xs">
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-solid rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">OR</span>
            </div>
          </div>

          {/* URL Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium">Upload from URL</label>
            <div className="flex space-x-3">
              <Input
                placeholder="https://example.com/file.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
                disabled={uploading}
              />
              <Button
                onClick={handleUrlUpload}
                disabled={uploading || !urlInput.trim()}
                className="px-6"
              >
                {uploading ? 'Processing...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}