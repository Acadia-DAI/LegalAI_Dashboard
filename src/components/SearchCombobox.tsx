import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Clock, TrendingUp, FileText, Users, Building2, X, Command } from 'lucide-react'
import { Modal } from './modern/Modal'
import { Input } from './modern/Input'
import { Button } from './modern/Button'
import { Badge } from './modern/Badge'

interface SearchResult {
  id: string
  title: string
  type: 'project' | 'client' | 'user' | 'document'
  description?: string
  category?: string
  icon: React.ComponentType<any>
}

interface SearchComboboxProps {
  isOpen: boolean
  onClose: () => void
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    type: 'project',
    description: 'TechCorp Inc. - In Progress',
    category: 'Active Projects',
    icon: FileText
  },
  {
    id: '2',
    title: 'Sarah Johnson',
    type: 'user',
    description: 'Lead Designer - Engineering Team',
    category: 'Team Members',
    icon: Users
  },
  {
    id: '3',
    title: 'TechCorp Inc.',
    type: 'client',
    description: '5 active projects, $245K revenue',
    category: 'Clients',
    icon: Building2
  },
  {
    id: '4',
    title: 'Q1 Analytics Report',
    type: 'document',
    description: 'Updated 2 days ago',
    category: 'Documents',
    icon: FileText
  },
  {
    id: '5',
    title: 'Mobile App Development',
    type: 'project',
    description: 'StartupXYZ - Planning Phase',
    category: 'Projects',
    icon: FileText
  }
]

const recentSearches = [
  'E-commerce redesign',
  'Sarah Johnson',
  'Q1 reports',
  'TechCorp projects'
]

const trendingSearches = [
  'Mobile app projects',
  'Revenue analytics',
  'Team productivity',
  'Client meetings'
]

export function SearchCombobox({ isOpen, onClose }: SearchComboboxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const filteredResults = mockResults.filter(
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filteredResults)
      setSelectedIndex(0)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleClose = () => {
    setQuery('')
    setResults([])
    setSelectedIndex(0)
    onClose()
  }

  const handleResultClick = (result: SearchResult) => {
    console.log('Navigate to:', result)
    handleClose()
  }

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case 'project':
        return 'primary'
      case 'user':
        return 'success'
      case 'client':
        return 'secondary'
      case 'document':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" className="p-0">
      <div className="p-6">
        {/* Search Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-solid/10 to-secondary-solid/10">
            <Search className="h-5 w-5 text-primary-solid" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Search Dashboard</h2>
            <p className="text-sm text-muted">Find projects, people, and documents</p>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <Input
            placeholder="Search projects, clients, users, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="pr-12"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
              onClick={() => setQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Search Results */}
          <AnimatePresence mode="wait">
            {query && results.length > 0 && (
              <motion.div
                className="space-y-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-sm font-medium text-muted mb-3 px-2">
                  Search Results ({results.length})
                </h3>
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedIndex === index ? 'bg-surface border border-primary-solid/20' : 'hover:bg-surface'
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary-solid/10 to-secondary-solid/10">
                        <result.icon className="h-4 w-4 text-primary-solid" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{result.title}</span>
                          <Badge variant={getTypeVariant(result.type)} size="sm">
                            {result.type}
                          </Badge>
                        </div>
                        {result.description && (
                          <p className="text-sm text-muted">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* No Results */}
            {query && results.length === 0 && !isSearching && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/10 to-muted/20 inline-block mb-4">
                  <Search className="h-8 w-8 text-muted" />
                </div>
                <p className="text-foreground font-medium mb-1">No results found for "{query}"</p>
                <p className="text-sm text-muted">Try searching for projects, clients, or team members</p>
              </motion.div>
            )}

            {/* Loading State */}
            {isSearching && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-solid border-t-transparent mx-auto mb-4" />
                <p className="text-muted">Searching...</p>
              </motion.div>
            )}

            {/* Default State - Recent and Trending */}
            {!query && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <Clock className="h-4 w-4 text-muted" />
                    <h3 className="text-sm font-medium text-muted">Recent Searches</h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="p-3 rounded-xl hover:bg-surface cursor-pointer transition-all duration-200"
                        onClick={() => handleQuickSearch(search)}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-3 w-3 text-muted" />
                          <span className="text-sm">{search}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-4 px-2">
                    <TrendingUp className="h-4 w-4 text-muted" />
                    <h3 className="text-sm font-medium text-muted">Trending</h3>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((search, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        className="p-3 rounded-xl hover:bg-surface cursor-pointer transition-all duration-200"
                        onClick={() => handleQuickSearch(search)}
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-3 w-3 text-muted" />
                          <span className="text-sm">{search}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-surface/50">
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-surface border border-border rounded">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-surface border border-border rounded">↵</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs bg-surface border border-border rounded">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>Tip: Use @ for users, # for projects</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}