import { Menu, Transition } from "@headlessui/react"
import {
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  Settings,
  User
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useState } from 'react'
import { Avatar } from './modern/Avatar'
import { Badge } from './modern/Badge'
import { Button } from './modern/Button'

interface SidebarProps {
  user: any
  onLogout: () => void
  onNavigateToDashboard?: () => void
  currentView?: 'dashboard' | 'case-details'
}

const getNavigation = (currentView: string, onNavigateToDashboard?: () => void) => [
  {
    name: 'Dashboard',
    icon: Home,
    href: '#',
    active: currentView === 'dashboard',
    onClick: onNavigateToDashboard
  },
  { name: 'Cases', icon: FolderOpen, href: '#', active: false },
]

export function Sidebar({ user, onLogout, onNavigateToDashboard, currentView = 'dashboard' }: SidebarProps) {
  const [isCollapsed] = useState(false)
  const navigation = getNavigation(currentView, onNavigateToDashboard)

  return (
    <motion.div
      className="min-h-screen glass border-r border-glass-border flex flex-col relative z-10"
      animate={{ width: isCollapsed ? 80 : 200 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-8 w-8 rounded-lg gradient-primary shadow-md"></div>
              <span className="font-semibold text-foreground">Legal AI</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl hover:bg-surface-hover"
        >
          <Menu className="h-4 w-4" />
        </Button> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        <div className="py-2">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="px-3 py-2 text-xs uppercase tracking-wider text-muted font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Menu
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={item.active ? "glass" : "ghost"}
                size={isCollapsed ? "icon" : "md"}
                className={`w-full justify-start h-12 rounded-xl ${item.active ? "shadow-md bg-surface border border-surface-border" : ""
                  }`}
                onClick={item.onClick}
              >
                <item.icon className="h-4 w-4" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      className="flex-1 flex items-center justify-between ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>{item.name}</span>

                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-glass-border space-y-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "md"}
            className="w-full justify-start h-12 rounded-xl relative"
          >
            <Settings className="h-4 w-4" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-3"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size={isCollapsed ? "icon" : "md"}
            className="w-full justify-start h-12 rounded-xl relative"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute top-2 right-2">
              {/* <Badge variant="error" size="sm">3</Badge> */}
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  className="ml-3"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Notifications
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* User Menu */}
        <Menu as="div" className="relative">
          {/* Menu Button */}
          <Menu.Button as={Fragment}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                size={isCollapsed ? "icon" : "md"}
                className="w-full justify-start h-12 rounded-xl"
              >
                <Avatar
                  src={user?.avatar}
                  fallback={user?.displayName}
                  size="sm"
                  status="online"
                />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      className="flex-1 flex items-center justify-between ml-3"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-left">
                        <div className="text-sm font-medium">{user?.displayName}</div>
                        <div className="text-xs text-muted">{user?.role}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </Menu.Button>

          {/* Dropdown Menu */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute bottom-full mb-2 z-50 glass bg-white rounded-2xl shadow-xl border border-glass-border overflow-hidden w-64"
            >
              {/* User Info */}
              <div className="p-4 border-b border-glass-border">
                <p className="text-sm font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted">{user?.email}</p>
                <p className="text-xs text-muted">{user?.department}</p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? "bg-surface-hover" : ""
                        } group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors`}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${active ? "bg-surface-hover" : ""
                        } group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors`}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>
                  )}
                </Menu.Item>

                <div className="my-1 border-t border-glass-border" />

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={`${active ? "bg-error/10 text-error" : ""
                        } group flex w-full items-center rounded-xl px-3 py-2 text-sm transition-colors`}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </motion.div>
  )
}