import { create } from 'zustand'
import { getFilteredData } from '@/lib/mockData'
import type { CategoryRepurchase, StoreRanking, ChurnMember, RiskLabel } from '@/lib/mockData'

interface FilterState {
  timeRange: string
  region: string
  selectedCategory: string | null
  expandedStore: number | null
  churnLabelFilter: RiskLabel | '全部'
}

interface DashboardState extends FilterState {
  categoryData: CategoryRepurchase[]
  storeData: StoreRanking[]
  churnData: ChurnMember[]
  setTimeRange: (range: string) => void
  setRegion: (region: string) => void
  setSelectedCategory: (category: string | null) => void
  setExpandedStore: (rank: number | null) => void
  setChurnLabelFilter: (label: RiskLabel | '全部') => void
  refreshData: () => void
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
}))
