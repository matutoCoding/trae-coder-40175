import { AlertTriangle, ArrowRight, CheckSquare, Square, Send, X, Users, FileText, MessageCircle, UserCheck, CheckCircle2, ChevronDown } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'
import type { RiskLabel, CareActivityStatus, ActivityMemberStatus, ChurnMemberSnapshot } from '@/lib/mockData'
import { useState, useRef, useEffect } from 'react'

const riskLabelOptions: (RiskLabel | '全部')[] = ['全部', '连续三次未回购', '处方可能过期', '只在线下买过无法触达']

const riskLabelStyles: Record<RiskLabel, string> = {
  '连续三次未回购': 'bg-red-100 text-red-700',
  '处方可能过期': 'bg-warn-100 text-warn-700',
  '只在线下买过无法触达': 'bg-purple-100 text-purple-700',
}

const statusBadgeStyles: Record<CareActivityStatus, string> = {
  '草稿': 'bg-surface-200 text-surface-700',
  '已发起': 'bg-brand-100 text-brand-700',
  '已完成': 'bg-green-100 text-green-700',
}

const activityMemberStatusStyles: Record<ActivityMemberStatus, string> = {
  '待触达': 'bg-surface-200 text-surface-700',
  '已触达-待回访': 'bg-brand-200 text-brand-700',
  '已转门店': 'bg-warn-200 text-warn-700',
  '已回购': 'bg-green-200 text-green-700',
}

const allActivityStatuses: ActivityMemberStatus[] = ['待触达', '已触达-待回访', '已转门店', '已回购']

function getActionStyle(action: string) {
  if (action.includes('补货')) return 'bg-brand-50 text-brand-700 border border-brand-200'
  if (action.includes('电话')) return 'bg-warn-50 text-warn-700 border border-warn-200'
  if (action.includes('关怀')) return 'bg-purple-50 text-purple-700 border border-purple-200'
  return 'bg-surface-100 text-surface-600 border border-surface-200'
}

function CareDraftModal() {
  const { careDraftModal, churnData, closeCareDraft, confirmCareDraft, clearChurnSelection } = useDashboardStore()
  if (!careDraftModal.isOpen) return null

  const selected = churnData.filter((m) => careDraftModal.selectedMembers.includes(m.memberId))
  const categories = [...new Set(selected.map((m) => m.category))]
  const labelCounts: Record<string, number> = {}
  selected.forEach((m) => m.riskLabels.forEach((l) => { labelCounts[l] = (labelCounts[l] || 0) + 1 }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={closeCareDraft}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Send className="h-5 w-5 text-brand-600" />
            关怀活动草稿
          </h3>
          <button onClick={closeCareDraft} className="text-surface-400 hover:text-surface-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-brand-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
              <Users className="h-4 w-4" />
              已选 {selected.length} 位会员
            </div>
            <div className="mt-1 text-xs text-brand-600">
              覆盖品类：{categories.join('、')}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">风险标签分布</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(labelCounts).map(([label, count]) => (
                <span key={label} className={`rounded px-2 py-0.5 text-xs ${riskLabelStyles[label as RiskLabel] || 'bg-surface-100 text-surface-600'}`}>
                  {label} ({count}人)
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">建议话术</div>
            <div className="rounded-lg bg-surface-50 p-3 text-sm leading-relaxed text-surface-700">
              {careDraftModal.scriptSummary}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">涉及会员</div>
            <div className="max-h-32 overflow-y-auto rounded-lg bg-surface-50 p-2">
              {selected.map((m) => (
                <div key={m.memberId} className="flex items-center gap-2 py-0.5 text-xs">
                  <span className="font-medium text-surface-700">{m.memberName}</span>
                  <span className="text-surface-400">{m.phone}</span>
                  <span className="text-surface-400">· {m.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => { clearChurnSelection(); closeCareDraft() }}
            className="rounded-lg bg-surface-100 px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-200"
          >
            取消
          </button>
          <button
            onClick={confirmCareDraft}
            className="flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            <Send className="h-4 w-4" />
            确认保存草稿
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusDropdown({ activityId, memberId, currentStatus }: { activityId: string; memberId: string; currentStatus: ActivityMemberStatus }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { updateActivityMemberStatus } = useDashboardStore()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (status: ActivityMemberStatus) => {
    updateActivityMemberStatus(activityId, memberId, status)
    setOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded border border-surface-200 bg-white px-2 py-1 text-xs text-surface-600 hover:bg-surface-50"
      >
        <span>变更状态</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
          {allActivityStatuses.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`w-full px-3 py-1.5 text-left text-xs hover:bg-surface-50 ${status === currentStatus ? 'bg-brand-50 text-brand-700' : 'text-surface-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CareActivityDetailModal() {
  const { viewCareActivityId, careActivities, setViewCareActivityId } = useDashboardStore()
  if (!viewCareActivityId) return null

  const activity = careActivities.find((a) => a.id === viewCareActivityId)
  if (!activity) return null

  const countByStatus: Record<ActivityMemberStatus, number> = {
    '待触达': 0,
    '已触达-待回访': 0,
    '已转门店': 0,
    '已回购': 0,
  }
  Object.values(activity.memberStatuses).forEach((s) => {
    if (s in countByStatus) countByStatus[s as ActivityMemberStatus]++
  })

  const members: { snapshot: ChurnMemberSnapshot; status: ActivityMemberStatus }[] = activity.memberIds
    .filter((id) => activity.memberSnapshots[id])
    .map((id) => ({
      snapshot: activity.memberSnapshots[id],
      status: activity.memberStatuses[id] || '待触达',
    }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setViewCareActivityId(null)}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-brand-600" />
            活动详情
          </h3>
          <button onClick={() => setViewCareActivityId(null)} className="text-surface-400 hover:text-surface-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-3 text-sm text-surface-500">
            <span className="font-mono text-xs">{activity.id.slice(0, 12)}…</span>
            <span>{activity.createdAt}</span>
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadgeStyles[activity.status]}`}>
              {activity.status}
            </span>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-surface-700">活动追踪指标</div>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-surface-50 p-3">
                <div className="flex items-center gap-2 text-surface-600">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">待触达</span>
                </div>
                <div className="mt-1.5 text-2xl font-semibold text-surface-800">{countByStatus['待触达']}</div>
              </div>
              <div className="rounded-lg bg-brand-50 p-3">
                <div className="flex items-center gap-2 text-brand-700">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">已触达-待回访</span>
                </div>
                <div className="mt-1.5 text-2xl font-semibold text-brand-700">{countByStatus['已触达-待回访']}</div>
              </div>
              <div className="rounded-lg bg-warn-50 p-3">
                <div className="flex items-center gap-2 text-warn-700">
                  <UserCheck className="h-4 w-4" />
                  <span className="text-xs font-medium">已转门店</span>
                </div>
                <div className="mt-1.5 text-2xl font-semibold text-warn-700">{countByStatus['已转门店']}</div>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-medium">已回购</span>
                </div>
                <div className="mt-1.5 text-2xl font-semibold text-green-700">{countByStatus['已回购']}</div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">覆盖品类</div>
            <div className="flex flex-wrap gap-2">
              {activity.categories.map((cat) => (
                <span key={cat} className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">{cat}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">风险标签分布</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activity.riskLabelCounts).map(([label, count]) => (
                <span key={label} className={`rounded px-2 py-0.5 text-xs ${riskLabelStyles[label as RiskLabel] || 'bg-surface-100 text-surface-600'}`}>
                  {label} ({count}人)
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm font-medium text-surface-700">话术摘要</div>
            <div className="rounded-lg bg-surface-50 p-3 text-sm leading-relaxed text-surface-700">
              {activity.scriptSummary}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-surface-700">会员列表 ({activity.memberIds.length}人)</div>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-surface-200">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-50 text-xs text-surface-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">会员信息</th>
                    <th className="px-3 py-2 text-left font-medium">品类</th>
                    <th className="px-3 py-2 text-left font-medium">当前状态</th>
                    <th className="px-3 py-2 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {members.map(({ snapshot, status }) => (
                    <tr key={snapshot.memberId} className="hover:bg-surface-50">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                            {snapshot.memberName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-surface-800">{snapshot.memberName}</div>
                            <div className="font-mono-num text-xs text-surface-400">{snapshot.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-surface-100 px-1.5 py-0.5 text-xs text-surface-600">{snapshot.category}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${activityMemberStatusStyles[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <StatusDropdown activityId={activity.id} memberId={snapshot.memberId} currentStatus={status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setViewCareActivityId(null)}
            className="rounded-lg bg-surface-100 px-4 py-2 text-sm font-medium text-surface-600 hover:bg-surface-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChurnWarning() {
  const {
    churnData, churnLabelFilter, setChurnLabelFilter,
    selectedChurnMembers, toggleChurnMember, toggleAllChurnMembers,
    openCareDraft, careActivities, updateCareActivityStatus, setViewCareActivityId,
    highlightedMemberIds,
  } = useDashboardStore()

  const filtered = churnLabelFilter === '全部'
    ? churnData
    : churnData.filter((m) => m.riskLabels.includes(churnLabelFilter))

  const filteredIds = filtered.map((m) => m.memberId)
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedChurnMembers.has(id))
  const hasSelection = selectedChurnMembers.size > 0

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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {riskLabelOptions.map((label) => (
          <button
            key={label}
            onClick={() => setChurnLabelFilter(label)}
            className={churnLabelFilter === label
              ? 'rounded-full bg-brand-700 px-3 py-1 text-sm text-white'
              : 'rounded-full bg-surface-100 px-3 py-1 text-sm text-surface-600 hover:bg-surface-200'
            }
          >
            {label}
          </button>
        ))}

        {hasSelection && (
          <button
            onClick={openCareDraft}
            className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-700 px-3 py-1 text-sm text-white hover:bg-brand-800"
          >
            <Send className="h-3.5 w-3.5" />
            发起关怀活动 ({selectedChurnMembers.size})
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-surface-500">
        <button
          onClick={() => toggleAllChurnMembers(filteredIds)}
          className="flex items-center gap-1.5 hover:text-surface-700"
        >
          {allSelected ? <CheckSquare className="h-4 w-4 text-brand-600" /> : <Square className="h-4 w-4" />}
          全选当前筛选
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => {
          const isSelected = selectedChurnMembers.has(member.memberId)
          const isHighlighted = highlightedMemberIds.has(member.memberId)
          return (
            <div
              key={member.memberId}
              className={`rounded-xl bg-white p-4 shadow-sm transition-all ${isSelected ? 'ring-2 ring-brand-500 ring-offset-1' : isHighlighted ? 'ring-2 ring-purple-500 ring-offset-1' : 'hover:shadow-md'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleChurnMember(member.memberId)}
                  className="mt-1 shrink-0"
                >
                  {isSelected ? <CheckSquare className="h-4 w-4 text-brand-600" /> : <Square className="h-4 w-4 text-surface-300" />}
                </button>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                  {member.memberName.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-surface-800">{member.memberName}</span>
                    <span className="rounded bg-surface-100 px-1.5 py-0.5 text-xs text-surface-600">{member.category}</span>
                    {isHighlighted && (
                      <span className="bg-purple-500 text-white text-[10px] px-1 py-0.5 rounded">TOP 风险</span>
                    )}
                  </div>
                  <div className="mt-1 font-mono-num text-sm text-surface-400">{member.phone}</div>
                  <div className="mt-1 text-xs text-surface-400">上次购买: {member.lastPurchaseDate}</div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="flex flex-wrap justify-end gap-1">
                    {member.riskLabels.map((label) => (
                      <span key={label} className={`rounded px-1.5 py-0.5 text-xs ${riskLabelStyles[label]}`}>{label}</span>
                    ))}
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${getActionStyle(member.suggestedAction)}`}>
                    {member.suggestedAction}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <CareDraftModal />

      {careActivities.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5" />
            关怀活动列表
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {careActivities.map((activity) => (
              <div key={activity.id} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-surface-400">{activity.id.slice(0, 12)}…</span>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusBadgeStyles[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>

                <div className="mt-2 text-xs text-surface-400">{activity.createdAt}</div>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-surface-600">
                    <Users className="h-4 w-4" />
                    {activity.memberIds.length} 人
                  </span>
                  <span className="text-surface-400">|</span>
                  <span className="text-surface-600">
                    {activity.categories.join('、')}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {activity.status === '草稿' && (
                    <button
                      onClick={() => updateCareActivityStatus(activity.id, '已发起')}
                      className="flex items-center gap-1 rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
                    >
                      <Send className="h-3.5 w-3.5" />
                      发起
                    </button>
                  )}
                  {activity.status === '已发起' && (
                    <button
                      onClick={() => updateCareActivityStatus(activity.id, '已完成')}
                      className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                    >
                      完成
                    </button>
                  )}
                  <button
                    onClick={() => setViewCareActivityId(activity.id)}
                    className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-medium text-surface-600 hover:bg-surface-200"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CareActivityDetailModal />
    </section>
  )
}
