import { Search, Filter, MoreVertical, Clock, Users, FileText, TrendingUp, Grid3X3, List, Eye, Plus, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from './modern/Button'
import { Card } from './modern/Card'
import { Badge } from './modern/Badge'
import { Input } from './modern/Input'
import { useState } from 'react'
import { formatDateTimeToDate } from '../utils/datetime'

interface CasesDashboardProps {
  cases: Case[]
  loading?: boolean
  onOpenCase: (caseItem: Case) => void
  onNewCase: () => void
}

const statusColors = {
  OPEN: 'bg-blue-500',
  IN_PROGRESS: 'bg-yellow-500',
  RESOLVED: 'bg-green-500',
  CLOSED: 'bg-gray-500'
}

const priorityColors = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-blue-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500'
}

export function CasesDashboard({ cases, loading, onOpenCase, onNewCase }: CasesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Pagination state
  const [visibleCards, setVisibleCards] = useState(3) // for grid
  const [currentPage, setCurrentPage] = useState(1) // for table
  const pageSize = 10

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || caseItem.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredCases.length / pageSize)

  const stats = [
    {
      title: 'Active Cases',
      value: cases.filter(c => c.status === 'OPEN').length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Documents',
      value: cases.reduce((acc, c) => acc + c.document_count, 0) || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'In Progress',
      value: `${Math.round((cases.filter(c => c.status === 'IN_PROGRESS').length / cases.length) * 100) || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((cases.filter(c => c.status === 'CLOSED').length / cases.length) * 100) || 0}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ]

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Case Management</h1>
          <p className="text-muted-foreground mt-2">Manage your cases, documents, and client communications</p>
        </div>
        <Button onClick={onNewCase} className="gradient-primary text-white mt-1">
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
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

          {/* Toggle */}
          <div className="flex items-center border border-surface-border rounded-lg overflow-hidden bg-surface">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-none border-0 ${viewMode === 'grid' ? 'bg-primary-solid text-white' : ''}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={`rounded-none border-0 ${viewMode === 'table' ? 'bg-primary-solid text-white' : ''}`}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cases */}
      {loading ? (
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading cases...</p>
        </Card>
      ) : filteredCases.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-muted mb-2" />
          <h3 className="text-lg font-semibold">No cases found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No cases available'}
          </p>
        </Card>
      ) : viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCases.slice(0, visibleCards).map((caseItem) => (
              <Card key={caseItem.case_id} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={() => onOpenCase(caseItem)}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold group-hover:text-primary-solid transition-colors line-clamp-1">{caseItem.title}</h3>
                  <Badge className={`${statusColors[caseItem.status]} text-white text-xs`}>{caseItem.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{caseItem.description}</p>
                {caseItem.summary && (
                  <div className="mb-4 p-3 bg-muted/5 rounded-lg border border-muted/10">
                    <p className="text-xs text-muted-foreground mb-1">Latest Summary</p>
                    <p className="text-sm line-clamp-2">{caseItem.summary}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> {caseItem.document_count} docs
                  </span>
                  <Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>{caseItem.priority}</Badge>
                  <span>Updated {formatDateTimeToDate(caseItem.updated_at)}</span>
                </div>
              </Card>
            ))}
          </div>
          {visibleCards < filteredCases.length && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => setVisibleCards(prev => prev + 3)}
                className="gradient-secondary text-white px-6 py-2 flex items-center gap-2"
              >
                Load More <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/5">
                <tr className="border-b border-surface-border">
                  <th className="text-left py-4 px-6">Case</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Priority</th>
                  <th className="text-left py-4 px-6">Documents</th>
                  <th className="text-left py-4 px-6">Updated</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases
                  .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                  .map((caseItem) => (
                    <tr key={caseItem.case_id} onClick={() => onOpenCase(caseItem)} className="hover:bg-muted/10 transition cursor-pointer">
                      <td className="py-4 px-6 font-medium">{caseItem.title}</td>
                      <td className="py-4 px-6"><Badge className={`${statusColors[caseItem.status]} text-white text-xs`}>{caseItem.status}</Badge></td>
                      <td className="py-4 px-6"><Badge className={`${priorityColors[caseItem.priority]} text-white text-xs`}>{caseItem.priority}</Badge></td>
                      <td className="py-4 px-6 flex items-center gap-1"><FileText className="w-4 h-4" />{caseItem.document_count}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{formatDateTimeToDate(caseItem.updated_at)}</td>
                      <td className="py-4 px-6">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onOpenCase(caseItem) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-border">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
