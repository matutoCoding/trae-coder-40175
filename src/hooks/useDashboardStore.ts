import { create } from 'zustand'
import { getFilteredData } from '@/lib/mockData'
import type { CategoryRepurchase, StoreRanking, ChurnMember, RiskLabel, FollowUpAction, ActionRecord } from '@/lib/mockData'

interface CareActivityDraft {
  isOpen: boolean
  selectedMembers: string[]
  scriptSummary: string
}

interface DashboardState {
  timeRange: string
  region: string
  selectedCategory: string | null
  expandedStore: number | null
  churnLabelFilter: RiskLabel | '全部'
  categoryData: CategoryRepurchase[]
  storeData: StoreRanking[]
  churnData: ChurnMember[]
  actionRecords: ActionRecord[]
  selectedChurnMembers: Set<string>
  careDraft: CareActivityDraft
  setTimeRange: (range: string) => void
  setRegion: (region: string) => void
  setSelectedCategory: (category: string | null) => void
  setExpandedStore: (rank: number | null) => void
  setChurnLabelFilter: (label: RiskLabel | '全部') => void
  refreshData: () => void
  addActionRecord: (record: Omit<ActionRecord, 'id' | 'timestamp'>) => void
  toggleChurnMember: (memberId: string) => void
  toggleAllChurnMembers: (memberIds: string[]) => void
  clearChurnSelection: () => void
  openCareDraft: () => void
  closeCareDraft: () => void
}

const initialData = getFilteredData('近30天', '全部')

export const useDashboardStore = create<DashboardState>((set, get) => ({
  timeRange: '近30天',
  region: '全部',
  selectedCategory: null,
  expandedStore: null,
  churnLabelFilter: '全部',
  categoryData: initialData.categoryRepurchaseData,
  storeData: initialData.storeRankingData,
  churnData: initialData.churnMembersData,
  actionRecords: [],
  selectedChurnMembers: new Set<string>(),
  careDraft: { isOpen: false, selectedMembers: [], scriptSummary: '' },

  setTimeRange: (range) => {
    set({ timeRange: range })
    const { region } = get()
    const data = getFilteredData(range, region)
    set({ categoryData: data.categoryRepurchaseData, storeData: data.storeRankingData, churnData: data.churnMembersData })
  },

  setRegion: (region) => {
    set({ region })
    const { timeRange } = get()
    const data = getFilteredData(timeRange, region)
    set({ categoryData: data.categoryRepurchaseData, storeData: data.storeRankingData, churnData: data.churnMembersData })
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setExpandedStore: (rank) => set({ expandedStore: rank }),
  setChurnLabelFilter: (label) => set({ churnLabelFilter: label }),

  refreshData: () => {
    const { timeRange, region } = get()
    const data = getFilteredData(timeRange, region)
    set({ categoryData: data.categoryRepurchaseData, storeData: data.storeRankingData, churnData: data.churnMembersData })
  },

  addActionRecord: (record) => {
    const newRecord: ActionRecord = {
      ...record,
      id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleString('zh-CN'),
    }
    set((state) => ({ actionRecords: [...state.actionRecords, newRecord] }))
  },

  toggleChurnMember: (memberId) => {
    set((state) => {
      const next = new Set(state.selectedChurnMembers)
      if (next.has(memberId)) {
        next.delete(memberId)
      } else {
        next.add(memberId)
      }
      return { selectedChurnMembers: next }
    })
  },

  toggleAllChurnMembers: (memberIds) => {
    set((state) => {
      const allSelected = memberIds.every((id) => state.selectedChurnMembers.has(id))
      const next = new Set(state.selectedChurnMembers)
      if (allSelected) {
        memberIds.forEach((id) => next.delete(id))
      } else {
        memberIds.forEach((id) => next.add(id))
      }
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

    set({
      careDraft: {
        isOpen: true,
        selectedMembers: [...selectedChurnMembers],
        scriptSummary: script,
      },
    })
  },

  closeCareDraft: () => set({ careDraft: { isOpen: false, selectedMembers: [], scriptSummary: '' } }),
}))
