import { useState } from 'react'
import { MoreHorizontal, ArrowUpDown, Search, Filter, Download, Eye, Edit, Trash2, ChevronDown } from 'lucide-react'
import { Card } from './modern/Card'
import { Button } from './modern/Button'
import { Input } from './modern/Input'
import { Badge } from './modern/Badge'
import { motion } from 'motion/react'

// Mock data for healthcare bills
const entries = [
  {
    id: 1,
    billId: "HB2001",
    name: "Universal Primary Care Access Act",
    summary: "Establishes free primary care slots for uninsured populations under 200% of FPL",
    billProgress: "In Committee",
    status: "New",
    priority: "70%",
    delivery: "New"
  },
  {
    id: 2,
    billId: "HB2002", 
    name: "Prescription Drug Price Transparency",
    summary: "Requires drug manufacturers to disclose manufacturing costs and has rationale",
    billProgress: "Passed House",
    status: "Closed",
    priority: "72%",
    delivery: "Closed"
  },
  {
    id: 3,
    billId: "HB2003",
    name: "Telehealth Coverage Parity",
    summary: "Mandates private insurers to reimburse telehealth at the same rate as in-person care",
    billProgress: "Passed Both Chambers",
    status: "New",
    priority: "84%",
    delivery: "New"
  },
  {
    id: 4,
    billId: "HB2004",
    name: "Rural Hospital Support and Community Aid",
    summary: "Provides emergency funding to rural hospitals supporting local communities",
    billProgress: "In Committee",
    status: "Follow-up",
    priority: "78%",
    delivery: "Follow-up"
  },
  {
    id: 5,
    billId: "HB2005",
    name: "Behavioral Health Crisis Response Teams",
    summary: "Expands mental health crisis teams in urban and rural counties",
    billProgress: "Introduced",
    status: "Follow-up",
    priority: "71%",
    delivery: "Follow-up"
  },
  {
    id: 6,
    billId: "HB2006",
    name: "Medicaid Expansion for Dental and Vision",
    summary: "Extends Medicaid to cover preventative dental and vision services",
    billProgress: "Passed House",
    status: "Follow-up",
    priority: "73%",
    delivery: "Follow-up"
  },
  {
    id: 7,
    billId: "HB2007",
    name: "Nurse Staffing Ratio Regulation",
    summary: "Sets patient-to-nurse ratios in ICU, ER, and med-surg units",
    billProgress: "In Committee",
    status: "Follow-up",
    priority: "66%",
    delivery: "Follow-up"
  }
]

const getStatusBadge = (status: string) => {
  const colors = {
    "New": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Closed": "bg-red-100 text-red-800 border-red-200", 
    "Follow-up": "bg-blue-100 text-blue-800 border-blue-200"
  }
  
  return (
    <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
      {status}
    </Badge>
  )
}

const getProgressBadge = (progress: string) => {
  const colors = {
    "In Committee": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Passed House": "bg-blue-100 text-blue-800 border-blue-200",
    "Passed Both Chambers": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Introduced": "bg-gray-100 text-gray-800 border-gray-200"
  }
  
  return (
    <Badge className={colors[progress as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
      {progress}
    </Badge>
  )
}

export function EntriesTable({ onViewDocument }: { onViewDocument?: (billId: string, name: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("Lorem Ipsum")

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="overflow-hidden">
      {/* Header with Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Bill Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-solid/20"
              >
                <option value="all">All</option>
                <option value="New">New</option>
                <option value="Closed">Closed</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <select className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-solid/20">
                <option>All</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-solid/20"
            >
              <option>Lorem Ipsum</option>
              <option>Bill Number</option>
              <option>Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Outta Z
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Bill Number
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Summary
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Bill Progress
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                  Delivery
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-border hover:bg-surface/50 transition-colors group"
              >
                <td className="p-4">
                  <span className="text-sm font-medium">All</span>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => onViewDocument?.(entry.billId, entry.name)}
                    className="text-sm font-medium text-primary-solid hover:underline transition-colors"
                  >
                    {entry.billId}
                  </button>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium">{entry.name}</span>
                </td>
                <td className="p-4 max-w-md">
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.summary}</p>
                </td>
                <td className="p-4">
                  {getProgressBadge(entry.billProgress)}
                </td>
                <td className="p-4">
                  {getStatusBadge(entry.status)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-emerald-700">{entry.priority}</span>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1-7 out of 572
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            2
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            3
          </Button>
          <span className="text-muted-foreground">...</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            →
          </Button>
        </div>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bills found matching your criteria.</p>
        </div>
      )}
    </Card>
  )
}