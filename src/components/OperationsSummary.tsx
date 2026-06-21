import { Zap } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'

export default function OperationsSummary() {
  const categoryData = useDashboardStore((s) => s.categoryData)
  const storeData = useDashboardStore((s) => s.storeData)
  const churnData = useDashboardStore((s) => s.churnData)

  const maxNonRepurchaseCategory = categoryData.reduce<{ category: string; gap: number } | null>(
    (acc, item) => {
      const gap = item.expectedCount - item.actualCount
      if (!acc || gap > acc.gap) return { category: item.category, gap }
      return acc
    },
    null,
  )

  const lowestRateStore = storeData.reduce<{ storeName: string; rate: number } | null>(
    (acc, item) => {
      if (!acc || item.reminderCompletionRate < acc.rate) {
        return { storeName: item.storeName, rate: item.reminderCompletionRate }
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
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-warn-500">
          <p className="text-sm text-surface-500">未回购人数最多品类</p>
          <p className="text-xl font-bold text-warn-600 mt-1">
            {maxNonRepurchaseCategory?.category ?? '-'}
          </p>
          <p className="text-sm font-mono-num text-warn-500 mt-1">
            {maxNonRepurchaseCategory ? `${maxNonRepurchaseCategory.gap}人未回购` : '-'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-surface-500">提醒完成率最低门店</p>
          <p className="text-xl font-bold text-red-600 mt-1 truncate">
            {lowestRateStore?.storeName ?? '-'}
          </p>
          <p className="text-sm font-mono-num text-red-500 mt-1">
            {lowestRateStore ? `完成率 ${Math.round(lowestRateStore.rate * 100)}%` : '-'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-l-purple-500">
          <p className="text-sm text-surface-500">最高风险标签</p>
          <p className="text-xl font-bold text-purple-600 mt-1">
            {topRiskLabel?.label ?? '-'}
          </p>
          <p className="text-sm font-mono-num text-purple-500 mt-1">
            {topRiskLabel ? `${topRiskLabel.count}位会员` : '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
