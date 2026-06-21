import { Zap, ArrowRight } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'

export default function OperationsSummary() {
  const categoryData = useDashboardStore((s) => s.categoryData)
  const storeData = useDashboardStore((s) => s.storeData)
  const churnData = useDashboardStore((s) => s.churnData)
  const navigateToCategory = useDashboardStore((s) => s.navigateToCategory)
  const navigateToStore = useDashboardStore((s) => s.navigateToStore)
  const navigateToChurnWithLabel = useDashboardStore((s) => s.navigateToChurnWithLabel)

  const maxNonRepurchaseCategory = categoryData.reduce<{ category: string; gap: number } | null>(
    (acc, item) => {
      const gap = item.expectedCount - item.actualCount
      if (!acc || gap > acc.gap) return { category: item.category, gap }
      return acc
    },
    null,
  )

  const lowestRateStore = storeData.reduce<{ storeName: string; rate: number; rank: number } | null>(
    (acc, item) => {
      if (!acc || item.reminderCompletionRate < acc.rate) {
        return { storeName: item.storeName, rate: item.reminderCompletionRate, rank: item.rank }
      }
      return acc
    },
    null,
  )

  const riskLabelCounts = churnData.reduce<Record<string, number>>((acc, member) => {
    for (const label of member.riskLabels) {
      acc[label] = (acc[label] || 0) + 1
    }
    return acc
  }, {})

  const topRiskLabel = Object.entries(riskLabelCounts).reduce<{ label: string; count: number } | null>(
    (acc, [label, count]) => {
      if (!acc || count > acc.count) return { label, count }
      return acc
    },
    null,
  )

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Zap className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold">运营摘要</h2>
      </div>
      <p className="text-sm text-surface-400 mb-4">当前筛选条件下的关键指标汇总</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => {
            if (maxNonRepurchaseCategory) navigateToCategory(maxNonRepurchaseCategory.category)
          }}
          className="group w-full cursor-pointer rounded-xl border-l-4 border-l-warn-500 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-surface-500">未回购人数最多品类</p>
          <p className="mt-1 text-xl font-bold text-warn-600">
            {maxNonRepurchaseCategory?.category ?? '-'}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-mono-num text-sm text-warn-500">
              {maxNonRepurchaseCategory ? `${maxNonRepurchaseCategory.gap}人未回购` : '-'}
            </p>
            <span className="flex items-center gap-0.5 text-xs text-surface-400 opacity-0 transition-opacity group-hover:opacity-100">
              查看详情 <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            if (lowestRateStore) navigateToStore(lowestRateStore.rank)
          }}
          className="group w-full cursor-pointer rounded-xl border-l-4 border-l-red-500 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-surface-500">提醒完成率最低门店</p>
          <p className="mt-1 truncate text-xl font-bold text-red-600">
            {lowestRateStore?.storeName ?? '-'}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-mono-num text-sm text-red-500">
              {lowestRateStore ? `完成率 ${Math.round(lowestRateStore.rate * 100)}%` : '-'}
            </p>
            <span className="flex items-center gap-0.5 text-xs text-surface-400 opacity-0 transition-opacity group-hover:opacity-100">
              展开详情 <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </button>

        <button
          onClick={() => {
            if (topRiskLabel) navigateToChurnWithLabel(topRiskLabel.label as any)
          }}
          className="group w-full cursor-pointer rounded-xl border-l-4 border-l-purple-500 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-surface-500">最高风险标签</p>
          <p className="mt-1 text-xl font-bold text-purple-600">
            {topRiskLabel?.label ?? '-'}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-mono-num text-sm text-purple-500">
              {topRiskLabel ? `${topRiskLabel.count}位会员` : '-'}
            </p>
            <span className="flex items-center gap-0.5 text-xs text-surface-400 opacity-0 transition-opacity group-hover:opacity-100">
              查看会员 <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
