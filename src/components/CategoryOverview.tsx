import { useState, useEffect } from 'react'
import { PieChart, X } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import type { CategoryRepurchase } from '@/lib/mockData'

function RingChart({ item }: { item: CategoryRepurchase }) {
  const ratio = item.actualCount / item.expectedCount
  const percentage = (ratio * 100).toFixed(1)
  const isWarning = item.nonRepurchaseRate > 0.35
  const size = 80
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(ratio, 1))

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-surface-200" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={isWarning ? 'text-warn-500' : 'text-brand-600'} />
      </svg>
      <span className={`absolute font-mono-num font-bold text-lg ${isWarning ? 'text-warn-500' : 'text-brand-600'}`}>{percentage}%</span>
    </div>
  )
}

export default function CategoryOverview() {
  const { categoryData, selectedCategory, setSelectedCategory } = useDashboardStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<CategoryRepurchase | null>(null)

  useEffect(() => {
    if (selectedCategory && !modalOpen) {
      const item = categoryData.find((c) => c.category === selectedCategory)
      if (item) {
        setActiveItem(item)
        setModalOpen(true)
      }
    }
  }, [selectedCategory])

  const handleCardClick = (item: CategoryRepurchase) => {
    setSelectedCategory(item.category)
    setActiveItem(item)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setSelectedCategory(null)
    setActiveItem(null)
  }

  return (
    <section>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <PieChart className="h-5 w-5" />
        品类续购概览
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categoryData.map((item) => {
          const isWarning = item.nonRepurchaseRate > 0.35
          const isHighlighted = selectedCategory === item.category
          return (
            <div
              key={item.category}
              onClick={() => handleCardClick(item)}
              className={`cursor-pointer rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md ${isHighlighted ? 'ring-2 ring-warn-400 ring-offset-2' : ''}`}
            >
              <div className="font-medium">{item.category}</div>

              <div className="mt-3 flex justify-center">
                <RingChart item={item} />
              </div>

              <div className="mt-3 space-y-1 text-sm text-surface-600">
                <div className="flex justify-between">
                  <span>预计续购</span>
                  <span className="font-mono-num">{item.expectedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>实际回购</span>
                  <span className="font-mono-num">{item.actualCount}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-surface-500">
                  <span>未回购比例</span>
                  <span className="font-mono-num">{(item.nonRepurchaseRate * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
                  <div className={`h-full rounded-full ${isWarning ? 'bg-warn-500' : 'bg-brand-500'}`} style={{ width: `${item.nonRepurchaseRate * 100}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {modalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={handleClose}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{activeItem.category} - 续购趋势</h3>
              <button onClick={handleClose} className="text-surface-400 hover:text-surface-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeItem.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="expected" stroke="#5eead4" fill="#5eead4" fillOpacity={0.2} name="预计续购" />
                  <Area type="monotone" dataKey="actual" stroke="#0f766e" fill="#0f766e" fillOpacity={0.2} name="实际回购" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
