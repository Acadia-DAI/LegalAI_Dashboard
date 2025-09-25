import type { Case } from "@/types/api-models"
import { Card } from "../modern/Card"
import { Clock, FileText, TrendingUp } from "lucide-react"

export function CaseStats({ cases }: { cases: Case[] }) {
  const stats = [
    {
      title: "Active Cases",
      value: cases.filter((c) => c.status === "OPEN").length,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Documents",
      value: cases.reduce((acc, c) => acc + c.document_count, 0) || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "In Progress",
      value: `${Math.round((cases.filter((c) => c.status === "IN_PROGRESS").length / cases.length) * 100) || 0}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Completion Rate",
      value: `${Math.round((cases.filter((c) => c.status === "CLOSED").length / cases.length) * 100) || 0}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ]

  return (
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
  )
}
