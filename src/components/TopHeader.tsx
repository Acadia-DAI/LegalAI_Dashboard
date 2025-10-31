import { Button } from './modern/Button'
import { Bell } from 'lucide-react'
import { Badge } from './modern/Badge'

export function TopHeader() {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-glass-border">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">Dashboard Overview</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative inline-flex">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            {/* <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-xs bg-error text-white rounded-full">
              3
            </Badge> */}
          </div>
        </div>
      </div>
    </header>
  )
}