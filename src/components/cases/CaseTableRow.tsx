import { Badge } from "../modern/Badge"
import { FileText, Eye } from "lucide-react"
import { Button } from "../modern/Button"
import { formatDateTimeToDate } from "../../utils/datetime"
import type { Case } from "@/types/api-models"

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

export function CaseTableRow({ caseItem, onOpenCase }: { caseItem: Case; onOpenCase: (caseItem: Case) => void }) {
  return (
    <tr
      key={caseItem.case_id}
      className="border-b border-surface-border hover:bg-surface-hover transition-colors cursor-pointer"
      onClick={() => onOpenCase(caseItem)}
    >
      <td className="py-4 px-6">
        <div>
          <h4 className="font-medium text-foreground hover:text-primary-solid transition-colors">
            {caseItem.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{caseItem.description}</p>
        </div>
      </td>
      <td className="py-4 px-6">
        <Badge className={`${statusColors[caseItem.status]} text-white text-xs`}>
          {caseItem.status}
        </Badge>
      </td>
      <td className="py-4 px-6">
        <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>
          {caseItem.priority}
        </Badge>
      </td>
      <td className="py-4 px-6 text-sm text-foreground">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          {caseItem.document_count}
        </span>
      </td>
      <td className="py-4 px-6 text-sm text-muted-foreground">
        {formatDateTimeToDate(caseItem.updated_at)}
      </td>
      <td className="py-4 px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onOpenCase(caseItem)
          }}
        >
          <Eye className="w-4 h-4 cursor-pointer" />
        </Button>
      </td>
    </tr>
  )
}
