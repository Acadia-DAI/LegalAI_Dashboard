import { useState, useCallback, useRef } from 'react'
import { X, Upload, FileText, AlertCircle, Check, Link, Plus } from 'lucide-react'
import { Modal } from './modern/Modal'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Input } from './modern/Input'
import toast from 'react-hot-toast'
import { useApi } from '../hooks/UseApi'
import { API_BASE_URL } from "../../config";
import type { Document } from '@/types/api-models'
import { useAuthStore } from '@/store/AuthStore'

interface DocumentUploadProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
  caseId: number;
  existingDocs: Document[]
}

interface FileWithId extends File {
  id: string
}

export function DocumentUpload({ isOpen, onClose, onUpload, caseId, existingDocs }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [urlInput, setUrlInput] = useState('')
  const [urls, setUrls] = useState<{ id: string; url: string; name: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useAuthStore((state) => state.user);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [existingDocs, selectedFiles])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`)
        return false
      }
      if (file.size > 10 * 1024 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large. Maximum size is 100MB`)
        return false
      }
      const alreadyInSelected = selectedFiles.some(f => f.name === file.name && f.size === file.size)
      if (alreadyInSelected) {
        toast.error(`${file.name} is already selected`)
        return false
      }
      const alreadyInCase = existingDocs.some(d => d.filename === file.name)
      if (alreadyInCase) {
        toast.error(`${file.name} already exists in this case`)
        return false
      }
      return true
    })

    const filesWithId: FileWithId[] = validFiles.map(file =>
      Object.assign(file, { id: Date.now().toString() + Math.random().toString(36).substr(2, 9) })
    )

    setSelectedFiles(prev => [...prev, ...filesWithId])
  }

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addUrl = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL')
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    const newUrl = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: urlInput.trim(),
      name: new URL(urlInput.trim()).pathname.split('/').pop() || 'Document'
    }

    setUrls(prev => [...prev, newUrl])
    setUrlInput('')
  }

  const removeUrl = (urlId: string) => {
    setUrls(prev => prev.filter(u => u.id !== urlId))
  }

  const handleUpload = async () => {
    if (uploadMode === 'file' && selectedFiles.length === 0) {
      toast.error('Please select at least one file')
      return
    }
    if (uploadMode === 'url' && urls.length === 0) {
      toast.error('Please add at least one URL')
      return
    }

    setIsUploading(true)
    try {
      if (uploadMode === 'file') {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append('file', file)

          const res = await fetch(`${API_BASE_URL}/cases/${caseId}/documents`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer todoToken`, // replace with real token later
              "user-id": user?.displayName || user?.email || ""
            }
          });

          if (!res) throw new Error(`Upload failed for ${file.name}`)
        }
        toast.success(`${selectedFiles.length} document(s) uploaded successfully`)
      } else {
        // mock URL flow → later implement backend support
        toast.success(`${urls.length} URL(s) added (mocked)`)
      }

      setSelectedFiles([])
      setUrls([])
      setUrlInput('')
      onUpload(selectedFiles)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-solid/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary-solid" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Documents</h2>
            <p className="text-sm text-muted-foreground">Add documents to this case for AI analysis</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center border border-surface-border rounded-lg overflow-hidden bg-surface">
          <Button
            variant={uploadMode === 'file' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setUploadMode('file')}
            className={`rounded-none border-0 ${uploadMode === 'file' ? 'bg-primary-solid text-white' : ''}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            File Upload
          </Button>
          {/* <Button
            variant={uploadode === 'url' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setUploadMode('url')}
            className={`rounded-none border-0 ${uploadMode === 'url' ? 'bg-primary-solid text-white' : ''}`}
          >
            <Link className="w-4 h-4 mr-2" />
            URL Upload
          </Button> */}
        </div>
      </div>

      {/* Upload Area */}
      {uploadMode === 'file' ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${dragActive
            ? 'border-primary-solid bg-primary-solid/5'
            : 'border-surface-border hover:border-primary-solid/50'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="application/pdf,.pdf"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />


          <div className="text-center">
            <div className="w-16 h-16 bg-primary-solid/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary-solid" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {dragActive ? 'Drop files here' : 'Choose files or drag and drop'}
            </h3>
            <p className="text-muted-foreground mb-4">
              PDF files up to 100MB each. You can select multiple files.
            </p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-surface-border rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-solid/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-primary-solid" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Add Document URLs
            </h3>
            <p className="text-muted-foreground">
              Enter URLs of PDF documents for analysis
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter PDF document URL..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
              className="flex-1"
            />
            <Button onClick={addUrl} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Requirements */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              {uploadMode === 'file' ? 'File Upload Requirements' : 'URL Upload Requirements'}
            </h4>
            <ul className="text-blue-700 dark:text-blue-300 space-y-1">
              {uploadMode === 'file' ? (
                <>
                  <li>• Only PDF files are supported</li>
                  <li>• Maximum file size: 100MB per file</li>
                  <li>• Files will be processed automatically for AI analysis</li>
                  <li>• Processing may take a few minutes depending on file size</li>
                </>
              ) : (
                <>
                  <li>• Only PDF document URLs are supported</li>
                  <li>• URLs must be publicly accessible</li>
                  <li>• Documents will be fetched and processed for AI analysis</li>
                  <li>• Processing may take a few minutes depending on document size</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Selected Items */}
      {((uploadMode === 'file' && selectedFiles.length > 0) || (uploadMode === 'url' && urls.length > 0)) && (
        <div className="mt-6">
          <h4 className="font-medium text-foreground mb-3">
            {uploadMode === 'file'
              ? `Selected Files (${selectedFiles.length})`
              : `Added URLs (${urls.length})`
            }
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadMode === 'file'
              ? selectedFiles.map((file) => (
                <Card key={file.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-red-500 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
              : urls.map((urlItem) => (
                <Card key={urlItem.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                        <Link className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{urlItem.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{urlItem.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUrl(urlItem.id)}
                        className="text-muted-foreground hover:text-red-500 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-border mt-6">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={
            (uploadMode === 'file' && selectedFiles.length === 0) ||
            (uploadMode === 'url' && urls.length === 0) ||
            isUploading
          }
          className="gradient-primary text-white"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
              {uploadMode === 'file' ? 'Uploading...' : 'Processing...'}
            </>
          ) : (
            <>
              {uploadMode === 'file' ? <Upload className="w-4 h-4 mr-2" /> : <Link className="w-4 h-4 mr-2" />}
              {uploadMode === 'file'
                ? `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Files`
                : `Process ${urls.length > 0 ? `${urls.length} ` : ''}URLs`
              }
            </>
          )}
        </Button>
      </div>
    </Modal>
  )
}