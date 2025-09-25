import { AlertCircle, Calendar, CheckCircle, Clock, DollarSign, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export function SummaryCards() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quick Overview</h2>
        <Badge variant="outline">Last 30 days</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              5 overdue, 18 upcoming
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="destructive" className="text-xs">High Priority: 3</Badge>
              <Badge variant="secondary" className="text-xs">Medium: 8</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +15% from last week
            </p>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                On Track
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$127.4K</div>
            <p className="text-xs text-muted-foreground">
              Expected this quarter
            </p>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                Q1 Target: $150K
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Within next 7 days
            </p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-muted-foreground">Next: Mobile App Release</div>
              <div className="text-xs text-muted-foreground">Due: Tomorrow</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Scheduled this month
            </p>
            <div className="mt-3 space-y-1">
              <div className="text-xs text-muted-foreground">Today: 2 meetings</div>
              <div className="text-xs text-muted-foreground">This week: 5 meetings</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              12 added this week
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline" className="text-xs">Proposals: 8</Badge>
              <Badge variant="outline" className="text-xs">Reports: 23</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}