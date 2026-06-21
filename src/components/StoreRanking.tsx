import { Fragment, useState } from 'react'
import { Store, ChevronDown, ChevronUp, CheckCircle2, XCircle, Package, Phone, UserCheck, Truck } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import type { FollowUpAction } from '@/lib/mockData'

const actionOptions: { value: FollowUpAction; label: string; icon: typeof Phone }[] = [
  { value: '再次电话', label: '再次电话', icon: Phone },
  { value: '转门店店长', label: '转门店店长', icon: UserCheck },
  { value: '补货跟进', label: '补货跟进', icon: Truck },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white">{rank}</span>
  if (rank === 2) return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-400 text-sm font-bold text-white">{rank}</span>
  if (rank === 3) return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">{rank}</span>
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-200 text-sm font-medium text-surface-600">{rank}</span>
}

function ProgressBar({ value, thresholds }: { value: number; thresholds: { good: number; warn: number } }) {
  const color = value >= thresholds.good ? 'bg-brand-500' : value >= thresholds.warn ? 'bg-warn-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="font-mono-num text-sm text-surface-600">{(value * 100).toFixed(0)}%</span>
    </div>
  )
}

function ActionButton({ storeName, itemType, itemName, onActioned }: {
  storeName: string
  itemType: 'unreachable' | 'reminder' | 'outOfStock'
  itemName: string
  onActioned: () => void
}) {
  const [open, setOpen] = useState(false)
  const { actionRecords, addActionRecord } = useDashboardStore()
  const existingAction = actionRecords.find(
    (r) => r.storeName === storeName && r.itemType === itemType && r.itemName === itemName
  )

  if (existingAction) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
        <CheckCircle2 className="h-3 w-3" />
        {existingAction.action}
      </span>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="inline-flex items-center gap-1 rounded-md border border-surface-200 bg-white px-2 py-0.5 text-xs text-surface-600 hover:bg-surface-50"
      >
        标记处理
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
          <div className="absolute left-0 top-full z-50 mt-1 flex flex-col rounded-lg bg-white py-1 shadow-lg" onClick={(e) => e.stopPropagation()}>
            {actionOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  addActionRecord({ storeName, itemType, itemName, action: value })
                  setOpen(false)
                  onActioned()
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-surface-50"
              >
                <Icon className="h-3.5 w-3.5 text-surface-500" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DetailPanel() {
  const { storeData, expandedStore } = useDashboardStore()
  const [, forceUpdate] = useState(0)
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
                  <div className="flex-1">
                    <div className="text-surface-800">
                      {r.memberName}
                      <span className="ml-2 text-surface-400">{r.dueDate}</span>
                    </div>
                    {r.completed && r.completedDate && (
                      <div className="text-xs text-surface-400">已完成于 {r.completedDate}</div>
                    )}
                    {!r.completed && (
                      <div className="mt-1">
                        <ActionButton storeName={store.storeName} itemType="reminder" itemName={r.memberName} onActioned={() => forceUpdate((n) => n + 1)} />
                      </div>
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
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${m.attempts >= 3 ? 'bg-warn-500/10 text-warn-500' : 'bg-surface-200 text-surface-600'}`}>
                        {m.attempts}次
                      </span>
                      <span>最后尝试 {m.lastAttempt}</span>
                    </div>
                    <div className="mt-1">
                      <ActionButton storeName={store.storeName} itemType="unreachable" itemName={m.memberName} onActioned={() => forceUpdate((n) => n + 1)} />
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
                  <div className="flex-1">
                    <div className="text-surface-800">{d.drugName}</div>
                    <div className="mt-0.5 text-xs text-surface-400">
                      影响 {d.affectedMembers} 人
                      <span className="ml-2">
                        {d.restockDate ? `预计到货 ${d.restockDate}` : <span className="text-red-500">待确认</span>}
                      </span>
                    </div>
                    <div className="mt-1">
                      <ActionButton storeName={store.storeName} itemType="outOfStock" itemName={d.drugName} onActioned={() => forceUpdate((n) => n + 1)} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ActionHistory storeName={store.storeName} />
      </td>
    </tr>
  )
}

function ActionHistory({ storeName }: { storeName: string }) {
  const { actionRecords } = useDashboardStore()
  const records = actionRecords.filter((r) => r.storeName === storeName)
  if (records.length === 0) return null

  return (
    <div className="mt-4 border-t border-surface-200 pt-3">
      <h4 className="mb-2 text-sm font-medium text-surface-700">已标记的跟进动作</h4>
      <div className="flex flex-wrap gap-2">
        {records.map((r) => {
          const typeLabel = r.itemType === 'unreachable' ? '未接通' : r.itemType === 'reminder' ? '未完成提醒' : '缺货'
          return (
            <span key={r.id} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs shadow-sm">
              <span className="font-medium text-surface-700">{r.itemName}</span>
              <span className="text-surface-400">·</span>
              <span className="text-surface-500">{typeLabel}</span>
              <span className="text-surface-400">→</span>
              <span className="font-medium text-brand-700">{r.action}</span>
              <span className="text-surface-300">{r.timestamp}</span>
            </span>
          )
        })}
      </div>
    </div>
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
                    className="cursor-pointer border-t border-surface-100 transition-colors hover:bg-surface-50"
                    onClick={() => toggleExpand(store.rank)}
                  >
                    <td className="px-4 py-3"><RankBadge rank={store.rank} /></td>
                    <td className="px-4 py-3 font-medium text-surface-800">{store.storeName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600">{store.region}</span>
                    </td>
                    <td className="px-4 py-3"><ProgressBar value={store.reminderCompletionRate} thresholds={{ good: 0.8, warn: 0.7 }} /></td>
                    <td className="px-4 py-3"><ProgressBar value={store.repurchaseSuccessRate} thresholds={{ good: 0.75, warn: 0.65 }} /></td>
                    <td className="px-4 py-3">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-surface-400" /> : <ChevronDown className="h-4 w-4 text-surface-400" />}
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
