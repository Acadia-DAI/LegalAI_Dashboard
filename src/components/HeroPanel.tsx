import { TrendingUp, FileText, Users, Target, Award, ArrowUpRight, ArrowDownRight, Plus, Scan } from 'lucide-react'
import { Card } from './modern/Card'
import { Button } from './modern/Button'
import { motion } from 'motion/react'

const statsData = [
  {
    id: 1,
    title: '2,350',
    subtitle: 'Bill Total',
    trend: '+24.2%',
    isPositive: true,
    bgColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 2,
    title: '450',
    subtitle: 'In Review',
    trend: '+49.2%',
    isPositive: true,
    bgColor: 'from-purple-500 to-pink-600'
  },
  {
    id: 3,
    title: '1,900',
    subtitle: 'Passed House',
    trend: '+24.4%',
    isPositive: true,
    bgColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    title: '85%',
    subtitle: 'Compliance Rate',
    trend: '+24.3%',
    isPositive: true,
    bgColor: 'from-orange-500 to-red-600'
  }
]

export function HeroPanel({ onScanBill }: { onScanBill?: () => void }) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Healthcare legislation tracking and management system
          </p>
        </div>
        <Button 
          onClick={onScanBill}
          className="bg-primary-solid text-white hover:bg-primary-solid/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Scan className="mr-2 h-4 w-4" />
          Scan New Bill
        </Button>
      </div>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Trend Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-white/20">
                  <ArrowUpRight className="h-3 w-3 text-emerald-600 mr-1" />
                  <span className="text-xs font-medium text-emerald-700">{stat.trend}</span>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">{stat.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}