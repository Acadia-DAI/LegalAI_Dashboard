import { Card } from "../modern/Card"
import { Badge } from "../modern/Badge"
import { FileText, MoreVertical } from "lucide-react"
import { formatDateTimeToDate } from "../../utils/datetime"

const statusColors = {
  OPEN: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  RESOLVED: "bg-green-500",
  CLOSED: "bg-gray-500",
}

const priorityColors = {
  LOW: "bg-green-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
}

export function CaseCard({ caseItem, onOpenCase }: { caseItem: Case; onOpenCase: (caseItem: Case) => void }) {
  return (
    <Card
      className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onOpenCase(caseItem)}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary-solid transition-colors line-clamp-1">
          {caseItem.title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge className={`${statusColors[caseItem.status]} text-white text-xs`}>
            {caseItem.status}
          </Badge>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted/10 rounded">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{caseItem.description}</p>

      {caseItem.summary && (
        <div className="mb-4 p-3 bg-muted/5 rounded-lg border border-muted/10">
          <p className="text-xs text-muted-foreground mb-1">Latest Summary</p>
          <p className="text-sm text-foreground line-clamp-2">{caseItem.summary}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {caseItem.document_count} docs
          </span>
          <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>
            {caseItem.priority}
          </Badge>
        </div>
        <span>Updated {formatDateTimeToDate(caseItem.updated_at)}</span>
      </div>
    </Card>
  )
}
