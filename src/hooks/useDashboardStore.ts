import { create } from 'zustand'
import { getFilteredData, getDefaultStoreForRegion, churnMembersData } from '@/lib/mockData'
import type {
  CategoryRepurchase, StoreRanking, ChurnMember, RiskLabel, ActionRecord, CareActivity,
  ActionStatus, CareActivityStatus, ActivityMemberStatus, ChurnMemberSnapshot,
} from '@/lib/mockData'

interface CareDraftModal {
  isOpen: boolean
  selectedMembers: string[]
  scriptSummary: string
}

interface DashboardState {
  timeRange: string
  region: string
  selectedCategory: string | null
  expandedStore: number | null
  highlightedStoreRank: number | null
  churnLabelFilter: RiskLabel | '全部'
  highlightedMemberIds: Set<string>
  categoryData: CategoryRepurchase[]
  storeData: StoreRanking[]
  churnData: ChurnMember[]
  actionRecords: ActionRecord[]
  selectedChurnMembers: Set<string>
  careDraftModal: CareDraftModal
  careActivities: CareActivity[]
  viewCareActivityId: string | null
  storeActionFilter: ActionStatus | '全部'
  setTimeRange: (range: string) => void
  setRegion: (region: string) => void
  setSelectedCategory: (category: string | null) => void
  setExpandedStore: (rank: number | null) => void
  setHighlightedStoreRank: (rank: number | null) => void
  setChurnLabelFilter: (label: RiskLabel | '全部') => void
  setHighlightedMemberIds: (ids: Set<string>) => void
  refreshData: () => void
  addActionRecord: (record: Omit<ActionRecord, 'id' | 'timestamp' | 'status'>) => void
  updateActionStatus: (id: string, status: ActionStatus) => void
  toggleChurnMember: (memberId: string) => void
  toggleAllChurnMembers: (memberIds: string[]) => void
  clearChurnSelection: () => void
  openCareDraft: () => void
  closeCareDraft: () => void
  confirmCareDraft: () => void
  updateCareActivityStatus: (id: string, status: CareActivityStatus) => void
  setViewCareActivityId: (id: string | null) => void
  setStoreActionFilter: (filter: ActionStatus | '全部') => void
  navigateToCategory: (category: string) => void
  navigateToStore: (rank: number) => void
  navigateToChurn: () => void
  navigateToChurnWithLabel: (label: RiskLabel) => void
  updateActivityMemberStatus: (activityId: string, memberId: string, status: ActivityMemberStatus) => void
}

const initialData = getFilteredData('近30天', '全部')

function syncSelectionToChurnData(selectedChurnMembers: Set<string>, churnData: ChurnMember[]): Set<string> {
  const validIds = new Set(churnData.map((m) => m.memberId))
  const next = new Set<string>()
  selectedChurnMembers.forEach((id) => { if (validIds.has(id)) next.add(id) })
  return next
}

function snapshotFromMember(m: ChurnMember): ChurnMemberSnapshot {
  return {
    memberId: m.memberId,
    memberName: m.memberName,
    phone: m.phone,
    category: m.category,
    region: m.region,
    riskLabels: [...m.riskLabels],
    lastPurchaseDate: m.lastPurchaseDate,
  }
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  timeRange: '近30天',
  region: '全部',
  selectedCategory: null,
  expandedStore: null,
  highlightedStoreRank: null,
  churnLabelFilter: '全部',
  highlightedMemberIds: new Set<string>(),
  categoryData: initialData.categoryRepurchaseData,
  storeData: initialData.storeRankingData,
  churnData: initialData.churnMembersData,
  actionRecords: [],
  selectedChurnMembers: new Set<string>(),
  careDraftModal: { isOpen: false, selectedMembers: [], scriptSummary: '' },
  careActivities: [],
  viewCareActivityId: null,
  storeActionFilter: '全部',

  setTimeRange: (range) => {
    set({ timeRange: range })
    const { region } = get()
    const data = getFilteredData(range, region)
    set((state) => ({
      categoryData: data.categoryRepurchaseData,
      storeData: data.storeRankingData,
      churnData: data.churnMembersData,
      selectedChurnMembers: syncSelectionToChurnData(state.selectedChurnMembers, data.churnMembersData),
    }))
  },

  setRegion: (region) => {
    set({ region })
    const { timeRange } = get()
    const data = getFilteredData(timeRange, region)
    set((state) => ({
      categoryData: data.categoryRepurchaseData,
      storeData: data.storeRankingData,
      churnData: data.churnMembersData,
      selectedChurnMembers: syncSelectionToChurnData(state.selectedChurnMembers, data.churnMembersData),
    }))
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setExpandedStore: (rank) => set({ expandedStore: rank }),
  setHighlightedStoreRank: (rank) => set({ highlightedStoreRank: rank }),
  setChurnLabelFilter: (label) => set({ churnLabelFilter: label }),
  setHighlightedMemberIds: (ids) => set({ highlightedMemberIds: ids }),

  refreshData: () => {
    const { timeRange, region } = get()
    const data = getFilteredData(timeRange, region)
    set((state) => ({
      categoryData: data.categoryRepurchaseData,
      storeData: data.storeRankingData,
      churnData: data.churnMembersData,
      selectedChurnMembers: syncSelectionToChurnData(state.selectedChurnMembers, data.churnMembersData),
    }))
  },

  addActionRecord: (record) => {
    const newRecord: ActionRecord = {
      ...record,
      id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: '待处理',
      timestamp: new Date().toLocaleString('zh-CN'),
    }
    set((state) => ({ actionRecords: [...state.actionRecords, newRecord] }))
  },

  updateActionStatus: (id, status) => {
    set((state) => {
      const record = state.actionRecords.find((r) => r.id === id)
      const nextActionRecords = state.actionRecords.map((r) => r.id === id ? { ...r, status } : r)
      if (record && record.sourceActivityId && record.memberId && status === '已完成') {
        const nextCareActivities = state.careActivities.map((a) => {
          if (a.id === record.sourceActivityId && a.memberStatuses[record.memberId!] === '已转门店') {
            return { ...a, memberStatuses: { ...a.memberStatuses, [record.memberId!]: '已回购' as ActivityMemberStatus } }
          }
          return a
        })
        return { actionRecords: nextActionRecords, careActivities: nextCareActivities }
      }
      return { actionRecords: nextActionRecords }
    })
  },

  toggleChurnMember: (memberId) => {
    set((state) => {
      const next = new Set(state.selectedChurnMembers)
      if (next.has(memberId)) next.delete(memberId)
      else next.add(memberId)
      return { selectedChurnMembers: next }
    })
  },

  toggleAllChurnMembers: (memberIds) => {
    set((state) => {
      const allSelected = memberIds.every((id) => state.selectedChurnMembers.has(id))
      const next = new Set(state.selectedChurnMembers)
      if (allSelected) memberIds.forEach((id) => next.delete(id))
      else memberIds.forEach((id) => next.add(id))
      return { selectedChurnMembers: next }
    })
  },

  clearChurnSelection: () => set({ selectedChurnMembers: new Set<string>() }),

  openCareDraft: () => {
    const { selectedChurnMembers, churnData } = get()
    const selected = churnData.filter((m) => selectedChurnMembers.has(m.memberId))
    const categories = [...new Set(selected.map((m) => m.category))]
    const hasOfflineOnly = selected.some((m) => m.riskLabels.includes('只在线下买过无法触达'))
    const hasExpiredRx = selected.some((m) => m.riskLabels.includes('处方可能过期'))
    const hasNoRepurchase = selected.some((m) => m.riskLabels.includes('连续三次未回购'))
    let script = '尊敬的会员您好，'
    if (hasNoRepurchase) script += '我们关注到您近期的续购计划，'
    if (hasExpiredRx) script += '您的处方即将到期，建议及时复诊更新处方，'
    if (hasOfflineOnly) script += '您也可通过线上渠道便捷购药，'
    script += '如有需要可随时联系您的专属药师。'
    set({ careDraftModal: { isOpen: true, selectedMembers: [...selectedChurnMembers], scriptSummary: script } })
  },

  closeCareDraft: () => set({ careDraftModal: { isOpen: false, selectedMembers: [], scriptSummary: '' } }),

  confirmCareDraft: () => {
    const { careDraftModal } = get()
    if (careDraftModal.selectedMembers.length === 0) return
    const allChurn = churnMembersData
    const selected = allChurn.filter((m) => careDraftModal.selectedMembers.includes(m.memberId))
    const categories = [...new Set(selected.map((m) => m.category))]
    const riskLabelCounts: Record<string, number> = {}
    selected.forEach((m) => m.riskLabels.forEach((l) => { riskLabelCounts[l] = (riskLabelCounts[l] || 0) + 1 }))
    const memberSnapshots: Record<string, ChurnMemberSnapshot> = {}
    const memberStatuses: Record<string, ActivityMemberStatus> = {}
    selected.forEach((m) => {
      memberSnapshots[m.memberId] = snapshotFromMember(m)
      memberStatuses[m.memberId] = '待触达'
    })
    const activity: CareActivity = {
      id: `care-${Date.now()}`,
      memberIds: careDraftModal.selectedMembers,
      memberSnapshots,
      memberStatuses,
      categories,
      riskLabelCounts,
      scriptSummary: careDraftModal.scriptSummary,
      status: '草稿',
      createdAt: new Date().toLocaleString('zh-CN'),
    }
    set((state) => ({
      careActivities: [activity, ...state.careActivities],
      careDraftModal: { isOpen: false, selectedMembers: [], scriptSummary: '' },
      selectedChurnMembers: new Set<string>(),
    }))
  },

  updateCareActivityStatus: (id, status) => {
    set((state) => ({ careActivities: state.careActivities.map((a) => a.id === id ? { ...a, status } : a) }))
  },

  setViewCareActivityId: (id) => set({ viewCareActivityId: id }),

  setStoreActionFilter: (filter) => set({ storeActionFilter: filter }),

  navigateToCategory: (category) => {
    set({ selectedCategory: category })
    const el = document.getElementById('section-category')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },

  navigateToStore: (rank) => {
    set({ expandedStore: rank, highlightedStoreRank: rank })
    const el = document.getElementById('section-store')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => set({ highlightedStoreRank: null }), 3000)
  },

  navigateToChurn: () => {
    set({ highlightedMemberIds: new Set() })
    const el = document.getElementById('section-churn')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },

  navigateToChurnWithLabel: (label) => {
    const { churnData, churnLabelFilter } = get()
    const filter = churnLabelFilter === label ? label : label
    set({ churnLabelFilter: filter as RiskLabel })
    const targetFilter = filter
    const filteredMembers = churnData.filter((m) => m.riskLabels.includes(targetFilter as RiskLabel))
    const sortedByRisk = [...filteredMembers].sort((a, b) => b.riskLabels.length - a.riskLabels.length)
    const topIds = new Set(sortedByRisk.slice(0, Math.min(3, sortedByRisk.length)).map((m) => m.memberId))
    set({ highlightedMemberIds: topIds })
    setTimeout(() => {
      const el = document.getElementById('section-churn')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  },

  updateActivityMemberStatus: (activityId, memberId, status) => {
    set((state) => {
      const activities = state.careActivities.map((a) => {
        if (a.id !== activityId) return a
        const prevStatus = a.memberStatuses[memberId]
        const nextStatuses = { ...a.memberStatuses, [memberId]: status }
        return { ...a, memberStatuses: nextStatuses }
      })
      const activity = state.careActivities.find((a) => a.id === activityId)
      const nextActions = [...state.actionRecords]
      if (activity && status === '已转门店') {
        const snapshot = activity.memberSnapshots[memberId]
        const region = snapshot?.region ?? get().region
        const storeName = getDefaultStoreForRegion(region) || ''
        if (storeName) {
          const exists = nextActions.some((r) => r.sourceActivityId === activityId && r.memberId === memberId)
          if (!exists) {
            nextActions.push({
              id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              storeName,
              itemType: 'activityTransfer',
              itemName: snapshot?.memberName ?? memberId,
              action: '转门店店长',
              status: '待处理',
              timestamp: new Date().toLocaleString('zh-CN'),
              sourceActivityId: activityId,
              memberId,
            })
          }
        }
      }
      return { careActivities: activities, actionRecords: nextActions }
    })
  },
}))
