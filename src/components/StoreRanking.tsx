import { Fragment } from 'react'
import { Store, ChevronDown, ChevronUp, CheckCircle2, XCircle, Package } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white">
        {rank}
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-sm font-bold text-white">
        {rank}
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">
        {rank}
      </span>
    )
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-200 text-sm font-medium text-surface-600">
      {rank}
    </span>
  )
}

function ProgressBar({ value, thresholds }: { value: number; thresholds: { good: number; warn: number } }) {
  const color =
    value >= thresholds.good
      ? 'bg-brand-500'
      : value >= thresholds.warn
        ? 'bg-warn-500'
        : 'bg-red-500'

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="font-mono-num text-sm text-surface-600">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

function DetailPanel() {
  const { storeData, expandedStore } = useDashboardStore()
  const store = storeData.find((s) => s.rank === expandedStore)
  if (!store) return null

  const { reminders, unreachableMembers, outOfStockDrugs } = store.details

  return (
    <tr>
      <td colSpan={6} className="border-t border-surface-200 bg-surface-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <h4 className="mb-2 font-medium text-surface-700">提醒完成情况</h4>
            <ul className="space-y-2">
              {reminders.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {r.completed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  )}
                  <div>
                    <div className="text-surface-800">
                      {r.memberName}
                      <span className="ml-2 text-surface-400">{r.dueDate}</span>
                    </div>
                    {r.completed && r.completedDate && (
                      <div className="text-xs text-surface-400">已完成于 {r.completedDate}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-surface-700">多次未接通会员</h4>
            <ul className="space-y-2">
              {unreachableMembers.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <div className="flex-1">
                    <div className="text-surface-800">
                      {m.memberName}
                      <span className="ml-2 text-surface-400">{m.phone}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-surface-400">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.attempts >= 3
                            ? 'bg-warn-500/10 text-warn-500'
                            : 'bg-surface-200 text-surface-600'
                        }`}
                      >
                        {m.attempts}次
                      </span>
                      <span>最后尝试 {m.lastAttempt}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-surface-700">缺货导致续购失败</h4>
            <ul className="space-y-2">
              {outOfStockDrugs.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-surface-400" />
                  <div>
                    <div className="text-surface-800">{d.drugName}</div>
                    <div className="mt-0.5 text-xs text-surface-400">
                      影响 {d.affectedMembers} 人
                      <span className="ml-2">
                        {d.restockDate ? (
                          `预计到货 ${d.restockDate}`
                        ) : (
                          <span className="text-red-500">待确认</span>
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function StoreRanking() {
  const { storeData, expandedStore, setExpandedStore } = useDashboardStore()

  const toggleExpand = (rank: number) => {
    setExpandedStore(expandedStore === rank ? null : rank)
  }

  return (
    <section>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Store className="h-5 w-5" />
        门店跟进排行
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-100 text-sm text-surface-600">
              <th className="px-4 py-3 font-medium">排名</th>
              <th className="px-4 py-3 font-medium">门店名称</th>
              <th className="px-4 py-3 font-medium">区域</th>
              <th className="px-4 py-3 font-medium">提醒完成率</th>
              <th className="px-4 py-3 font-medium">续购成功率</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {storeData.map((store) => {
              const isExpanded = expandedStore === store.rank
              return (
                <Fragment key={store.rank}>
                  <tr
                    key={store.rank}
                    className="cursor-pointer border-t border-surface-100 transition-colors hover:bg-surface-50"
                    onClick={() => toggleExpand(store.rank)}
                  >
                    <td className="px-4 py-3">
                      <RankBadge rank={store.rank} />
                    </td>
                    <td className="px-4 py-3 font-medium text-surface-800">{store.storeName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600">
                        {store.region}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar
                        value={store.reminderCompletionRate}
                        thresholds={{ good: 0.8, warn: 0.7 }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar
                        value={store.repurchaseSuccessRate}
                        thresholds={{ good: 0.75, warn: 0.65 }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-surface-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-surface-400" />
                      )}
                    </td>
                  </tr>
                  {isExpanded && <DetailPanel key={`detail-${store.rank}`} />}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
