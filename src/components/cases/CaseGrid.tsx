import { Card } from "../modern/Card"
import { Button } from "../modern/Button"
import { CaseCard } from "./CaseCard"
import { Loader2, ChevronDown } from "lucide-react"
import type { Case } from "@/types/api-models"

interface CaseGridProps {
  cases: Case[]
  visibleCards: number
  setVisibleCards: (n: number) => void
  onOpenCase: (caseItem: Case) => void
  loading?: boolean
}

export function CaseGrid({ cases, visibleCards, setVisibleCards, onOpenCase, loading }: CaseGridProps) {
  const displayedCases = cases.slice(0, visibleCards)

  if (loading) {
    return (
      <Card className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-solid mx-auto" />
        <p className="mt-2 text-muted-foreground">Loading cases...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedCases.map((caseItem) => (
          <CaseCard key={caseItem.case_id} caseItem={caseItem} onOpenCase={onOpenCase} />
        ))}
      </div>

      {visibleCards < cases.length && (
        <div className="flex justify-center">
          <Button
            onClick={() => setVisibleCards(visibleCards + 6)}
            className="flex items-center gap-2 gradient-secondary text-white px-6"
          >
            <ChevronDown className="w-4 h-4" />
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
