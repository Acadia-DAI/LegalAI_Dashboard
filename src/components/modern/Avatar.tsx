import { forwardRef, useState } from 'react'
import { motion } from 'motion/react'
import { User } from 'lucide-react'
import { cn } from '../ui/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const [imageError, setImageError] = useState(false)
    
    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl'
    }

    const statusColors = {
      online: 'bg-success',
      offline: 'bg-muted',
      busy: 'bg-error',
      away: 'bg-warning'
    }

    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4'
    }

    return (
      <div className={cn('relative inline-block', className)} ref={ref} {...props}>
        <motion.div
          className={cn(
            'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-solid to-secondary-solid',
            sizes[size]
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : fallback ? (
            <span className="font-medium text-white">
              {fallback}
            </span>
          ) : (
            <User className="h-1/2 w-1/2 text-white" />
          )}
        </motion.div>
        
        {status && (
          <motion.div
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              statusColors[status],
              statusSizes[size]
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"