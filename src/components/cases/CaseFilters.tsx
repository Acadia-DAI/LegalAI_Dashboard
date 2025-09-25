import { Search, Grid3X3, List } from "lucide-react"
import { Input } from "../modern/Input"
import { Button } from "../modern/Button"

interface CaseFiltersProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  viewMode: "grid" | "table"
  setViewMode: (mode: "grid" | "table") => void
}

export function CaseFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  viewMode,
  setViewMode,
}: CaseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          placeholder="Search cases, descriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-surface border border-surface-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-solid"
        >
          <option value="all">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <div className="flex items-center border border-surface-border rounded-lg overflow-hidden bg-surface">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={`rounded-none border-0 ${viewMode === "grid" ? "bg-primary-solid text-white" : ""}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`rounded-none border-0 ${viewMode === "table" ? "bg-primary-solid text-white" : ""}`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
