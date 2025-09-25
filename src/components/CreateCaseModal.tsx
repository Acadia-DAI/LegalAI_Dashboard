import { useState } from 'react'
import { X, User, FileText, AlertCircle, Calendar } from 'lucide-react'
import { Modal } from './modern/Modal'
import { Button } from './modern/Button'
import { Input } from './modern/Input'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/AuthStore'

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (caseData: {
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    created_by?: string;
    assigned_to?: string;
    user_id?: string;
  }) => void;
}


export function CreateCaseModal({ isOpen, onClose, onCaseCreated }: CreateCaseModalProps) {
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN" as const,
    priority: "MEDIUM" as const,
  });
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

        await onCaseCreated({
      ...formData,
      created_by: user?.displayName || "Demo User",
      user_id: user?.displayName || "Demo User",
    });
      toast.success('Case created successfully!')

      // Reset form
      setFormData({
      title: "",
      description: "",
      status: "OPEN",
      priority: "MEDIUM",
    });

      onClose()
    } catch (error) {
      toast.error('Failed to create case')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-solid/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-solid" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Case</h2>
            <p className="text-sm text-muted-foreground">Add a new case to start managing documents and communications</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Case Title *
          </label>
          <Input
            placeholder="Enter a descriptive case title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        {/* Client Name */}
        {/* <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Client Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Enter client or organization name"
              value={formData.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div> */}

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Case Description *
          </label>
          <textarea
            placeholder="Provide a detailed description of the case..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-surface border border-surface-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-surface-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-transparent"
            >
              <option value="OPEN">Active</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-surface-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-solid focus:border-transparent"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 dark:text-blue-200 font-medium">Case Management</p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              After creating this case, you'll be able to upload documents, generate AI summaries, and start Q&A conversations about the case materials.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="gradient-primary text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Create Case
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}