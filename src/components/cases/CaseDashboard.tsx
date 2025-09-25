import { useState } from "react"
import { Button } from "../modern/Button"
import { Plus } from "lucide-react"
import { CaseStats } from "./CaseStats"
import { CaseFilters } from "./CaseFilters"
import type { Case } from "@/types/api-models"
import { CaseGrid } from "./CaseGrid"
import { CaseTable } from "./CaseTable"

interface CasesDashboardProps {
  cases: Case[]
  loading?: boolean
  onOpenCase: (caseItem: Case) => void
  onNewCase: () => void
}

export function CasesDashboard({ cases, loading, onOpenCase, onNewCase }: CasesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [visibleCards, setVisibleCards] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || c.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Case Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your cases, documents, and client communications
          </p>
        </div>
        <Button onClick={onNewCase} className="gradient-primary text-white mt-1">
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats */}
      <CaseStats cases={cases} />

      {/* Filters */}
      <CaseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Display */}
      {viewMode === "grid" ? (
        <CaseGrid
          cases={filteredCases}
          visibleCards={visibleCards}
          setVisibleCards={setVisibleCards}
          onOpenCase={onOpenCase}
          loading={loading}
        />
      ) : (
        <CaseTable
          cases={filteredCases}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          onOpenCase={onOpenCase}
          loading={loading}
        />
      )}
    </div>
  )
}
