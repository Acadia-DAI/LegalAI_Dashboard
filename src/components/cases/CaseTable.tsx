import type { Case } from "@/types/api-models"
import { Button } from "../modern/Button"
import { Card } from "../modern/Card"
import { CaseTableRow } from "./CaseTableRow"

interface CaseTableProps {
  cases: Case[]
  currentPage: number
  setCurrentPage: (n: number) => void
  pageSize: number
  onOpenCase: (caseItem: Case) => void
  loading?: boolean
}

export function CaseTable({ cases, currentPage, setCurrentPage, pageSize, onOpenCase, loading }: CaseTableProps) {
  const totalPages = Math.ceil(cases.length / pageSize)
  const paginatedCases = cases.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/5">
            <tr className="border-b border-surface-border">
              <th className="text-left py-4 px-6 font-medium text-foreground">Case</th>
              <th className="text-left py-4 px-6 font-medium text-foreground">Status</th>
              <th className="text-left py-4 px-6 font-medium text-foreground">Priority</th>
              <th className="text-left py-4 px-6 font-medium text-foreground">Documents</th>
              <th className="text-left py-4 px-6 font-medium text-foreground">Updated</th>
              <th className="text-left py-4 px-6 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCases.map((caseItem) => (
              <CaseTableRow key={caseItem.case_id} caseItem={caseItem} onOpenCase={onOpenCase} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 border-t border-surface-border">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}
