import { Pill, BarChart3, Store, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeSection: 'category' | 'store' | 'churn'
  onSectionChange: (section: string) => void
}

const navItems = [
  { key: 'category', label: '品类概览', icon: BarChart3 },
  { key: 'store', label: '门店排行', icon: Store },
  { key: 'churn', label: '流失预警', icon: AlertTriangle },
] as const

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-16 flex-col bg-[#0f172a] lg:w-60">
      <div className="flex h-16 items-center justify-center gap-2 px-3 lg:justify-start lg:px-5">
        <Pill className="h-6 w-6 shrink-0 text-white" />
        <span className="hidden text-lg font-semibold text-white lg:inline">
          续购看板
        </span>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-2">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={cn(
              'flex h-10 items-center justify-center rounded-lg transition-colors lg:justify-start lg:gap-3 lg:px-4',
              activeSection === key
                ? 'bg-brand-700 text-white'
                : 'text-slate-400 hover:bg-surface-800 hover:text-white',
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
