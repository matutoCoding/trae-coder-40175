import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import type { RiskLabel } from '@/lib/mockData'

const riskLabelOptions: (RiskLabel | '全部')[] = ['全部', '连续三次未回购', '处方可能过期', '只在线下买过无法触达']

const riskLabelStyles: Record<RiskLabel, string> = {
  '连续三次未回购': 'bg-red-100 text-red-700',
  '处方可能过期': 'bg-warn-100 text-warn-700',
  '只在线下买过无法触达': 'bg-purple-100 text-purple-700',
}

function getActionStyle(action: string) {
  if (action.includes('补货')) return 'bg-brand-50 text-brand-700 border border-brand-200'
  if (action.includes('电话')) return 'bg-warn-50 text-warn-700 border border-warn-200'
  if (action.includes('关怀')) return 'bg-purple-50 text-purple-700 border border-purple-200'
  return 'bg-surface-100 text-surface-600 border border-surface-200'
}

export default function ChurnWarning() {
  const { churnData, churnLabelFilter, setChurnLabelFilter } = useDashboardStore()

  const filtered = churnLabelFilter === '全部'
    ? churnData
    : churnData.filter((m) => m.riskLabels.includes(churnLabelFilter))

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <AlertTriangle className="h-5 w-5" />
          流失会员预警
        </div>
        <span className="text-sm font-medium text-warn-600">
          {filtered.length} 位高风险会员
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {riskLabelOptions.map((label) => (
          <button
            key={label}
            onClick={() => setChurnLabelFilter(label)}
            className={
              churnLabelFilter === label
                ? 'rounded-full bg-brand-700 px-3 py-1 text-sm text-white'
                : 'rounded-full bg-surface-100 px-3 py-1 text-sm text-surface-600 hover:bg-surface-200'
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <div
            key={member.memberId}
            className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                {member.memberName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-surface-800">{member.memberName}</span>
                  <span className="rounded bg-surface-100 px-1.5 py-0.5 text-xs text-surface-600">
                    {member.category}
                  </span>
                </div>
                <div className="mt-1 font-mono-num text-sm text-surface-400">
                  {member.phone}
                </div>
                <div className="mt-1 text-xs text-surface-400">
                  上次购买: {member.lastPurchaseDate}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex flex-wrap justify-end gap-1">
                  {member.riskLabels.map((label) => (
                    <span
                      key={label}
                      className={`rounded px-1.5 py-0.5 text-xs ${riskLabelStyles[label]}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${getActionStyle(member.suggestedAction)}`}
                >
                  {member.suggestedAction}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
