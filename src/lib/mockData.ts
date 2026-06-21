export type RiskLabel = '连续三次未回购' | '处方可能过期' | '只在线下买过无法触达'

export interface CategoryRepurchase {
  category: string
  expectedCount: number
  actualCount: number
  nonRepurchaseRate: number
  trend: { date: string; expected: number; actual: number }[]
}

export interface StoreDetail {
  reminders: { memberName: string; dueDate: string; completed: boolean; completedDate?: string }[]
  unreachableMembers: { memberName: string; phone: string; attempts: number; lastAttempt: string }[]
  outOfStockDrugs: { drugName: string; affectedMembers: number; restockDate?: string }[]
}

export interface StoreRanking {
  rank: number
  storeName: string
  region: string
  reminderCompletionRate: number
  repurchaseSuccessRate: number
  details: StoreDetail
}

export interface ChurnMember {
  memberId: string
  memberName: string
  phone: string
  category: string
  riskLabels: RiskLabel[]
  lastPurchaseDate: string
  suggestedAction: string
}

export const categoryRepurchaseData: CategoryRepurchase[] = [
  {
    category: '高血压',
    expectedCount: 2860,
    actualCount: 1923,
    nonRepurchaseRate: 0.328,
    trend: [
      { date: '06-01', expected: 400, actual: 268 },
      { date: '06-02', expected: 410, actual: 279 },
      { date: '06-03', expected: 395, actual: 260 },
      { date: '06-04', expected: 420, actual: 285 },
      { date: '06-05', expected: 408, actual: 272 },
      { date: '06-06', expected: 415, actual: 288 },
      { date: '06-07', expected: 412, actual: 271 },
    ],
  },
  {
    category: '糖尿病',
    expectedCount: 2140,
    actualCount: 1356,
    nonRepurchaseRate: 0.366,
    trend: [
      { date: '06-01', expected: 305, actual: 189 },
      { date: '06-02', expected: 310, actual: 198 },
      { date: '06-03', expected: 298, actual: 185 },
      { date: '06-04', expected: 312, actual: 201 },
      { date: '06-05', expected: 306, actual: 192 },
      { date: '06-06', expected: 308, actual: 196 },
      { date: '06-07', expected: 301, actual: 195 },
    ],
  },
  {
    category: '甲状腺',
    expectedCount: 980,
    actualCount: 712,
    nonRepurchaseRate: 0.273,
    trend: [
      { date: '06-01', expected: 138, actual: 99 },
      { date: '06-02', expected: 142, actual: 104 },
      { date: '06-03', expected: 135, actual: 97 },
      { date: '06-04', expected: 145, actual: 106 },
      { date: '06-05', expected: 140, actual: 102 },
      { date: '06-06', expected: 143, actual: 103 },
      { date: '06-07', expected: 137, actual: 101 },
    ],
  },
  {
    category: '抗凝',
    expectedCount: 1560,
    actualCount: 987,
    nonRepurchaseRate: 0.367,
    trend: [
      { date: '06-01', expected: 220, actual: 138 },
      { date: '06-02', expected: 228, actual: 145 },
      { date: '06-03', expected: 215, actual: 132 },
      { date: '06-04', expected: 232, actual: 148 },
      { date: '06-05', expected: 222, actual: 139 },
      { date: '06-06', expected: 225, actual: 143 },
      { date: '06-07', expected: 218, actual: 142 },
    ],
  },
]

export const storeRankingData: StoreRanking[] = [
  {
    rank: 1,
    storeName: '国大药房-朝阳路店',
    region: '华北',
    reminderCompletionRate: 0.92,
    repurchaseSuccessRate: 0.85,
    details: {
      reminders: [
        { memberName: '张建国', dueDate: '2026-06-10', completed: true, completedDate: '2026-06-09' },
        { memberName: '李秀芳', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-10' },
        { memberName: '王德明', dueDate: '2026-06-12', completed: false },
        { memberName: '赵玉兰', dueDate: '2026-06-13', completed: true, completedDate: '2026-06-12' },
      ],
      unreachableMembers: [
        { memberName: '孙志强', phone: '139****3281', attempts: 3, lastAttempt: '2026-06-08' },
        { memberName: '周美华', phone: '136****7845', attempts: 2, lastAttempt: '2026-06-07' },
      ],
      outOfStockDrugs: [
        { drugName: '缬沙坦胶囊', affectedMembers: 12, restockDate: '2026-06-15' },
      ],
    },
  },
  {
    rank: 2,
    storeName: '益丰药房-浦东大道店',
    region: '华东',
    reminderCompletionRate: 0.89,
    repurchaseSuccessRate: 0.82,
    details: {
      reminders: [
        { memberName: '陈丽萍', dueDate: '2026-06-10', completed: true, completedDate: '2026-06-09' },
        { memberName: '刘国华', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-11' },
        { memberName: '黄淑芬', dueDate: '2026-06-12', completed: false },
        { memberName: '吴明辉', dueDate: '2026-06-14', completed: true, completedDate: '2026-06-13' },
        { memberName: '郑雅琴', dueDate: '2026-06-15', completed: false },
      ],
      unreachableMembers: [
        { memberName: '林永福', phone: '158****2190', attempts: 4, lastAttempt: '2026-06-09' },
        { memberName: '何春梅', phone: '137****6532', attempts: 2, lastAttempt: '2026-06-06' },
        { memberName: '曹建华', phone: '155****8901', attempts: 3, lastAttempt: '2026-06-08' },
      ],
      outOfStockDrugs: [
        { drugName: '二甲双胍缓释片', affectedMembers: 8, restockDate: '2026-06-14' },
        { drugName: '左甲状腺素钠片', affectedMembers: 5 },
      ],
    },
  },
  {
    rank: 3,
    storeName: '大参林-天河城店',
    region: '华南',
    reminderCompletionRate: 0.87,
    repurchaseSuccessRate: 0.79,
    details: {
      reminders: [
        { memberName: '梁伟明', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-10' },
        { memberName: '何秀珍', dueDate: '2026-06-12', completed: false },
        { memberName: '罗志文', dueDate: '2026-06-13', completed: true, completedDate: '2026-06-12' },
      ],
      unreachableMembers: [
        { memberName: '黄丽嫦', phone: '135****4421', attempts: 3, lastAttempt: '2026-06-07' },
        { memberName: '陈永康', phone: '150****3367', attempts: 2, lastAttempt: '2026-06-08' },
      ],
      outOfStockDrugs: [
        { drugName: '华法林钠片', affectedMembers: 6, restockDate: '2026-06-16' },
        { drugName: '硝苯地平控释片', affectedMembers: 4 },
      ],
    },
  },
  {
    rank: 4,
    storeName: '老百姓大药房-解放路店',
    region: '华中',
    reminderCompletionRate: 0.84,
    repurchaseSuccessRate: 0.76,
    details: {
      reminders: [
        { memberName: '刘福生', dueDate: '2026-06-10', completed: true, completedDate: '2026-06-10' },
        { memberName: '杨桂兰', dueDate: '2026-06-12', completed: false },
        { memberName: '胡德贵', dueDate: '2026-06-13', completed: true, completedDate: '2026-06-12' },
        { memberName: '邓秀英', dueDate: '2026-06-14', completed: false },
      ],
      unreachableMembers: [
        { memberName: '谭志刚', phone: '182****5543', attempts: 5, lastAttempt: '2026-06-09' },
        { memberName: '贺美玲', phone: '133****9087', attempts: 3, lastAttempt: '2026-06-07' },
        { memberName: '龚国平', phone: '186****1234', attempts: 2, lastAttempt: '2026-06-06' },
      ],
      outOfStockDrugs: [
        { drugName: '阿卡波糖片', affectedMembers: 9, restockDate: '2026-06-13' },
      ],
    },
  },
  {
    rank: 5,
    storeName: '一心堂-春城路店',
    region: '西南',
    reminderCompletionRate: 0.81,
    repurchaseSuccessRate: 0.73,
    details: {
      reminders: [
        { memberName: '段永福', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-10' },
        { memberName: '杨秀芳', dueDate: '2026-06-12', completed: true, completedDate: '2026-06-12' },
        { memberName: '李春华', dueDate: '2026-06-14', completed: false },
        { memberName: '张美芬', dueDate: '2026-06-15', completed: false },
      ],
      unreachableMembers: [
        { memberName: '王建国', phone: '151****6678', attempts: 4, lastAttempt: '2026-06-08' },
        { memberName: '赵兰英', phone: '138****2345', attempts: 2, lastAttempt: '2026-06-07' },
      ],
      outOfStockDrugs: [
        { drugName: '利伐沙班片', affectedMembers: 7, restockDate: '2026-06-17' },
        { drugName: '氨氯地平片', affectedMembers: 3 },
      ],
    },
  },
  {
    rank: 6,
    storeName: '海王星辰-南山店',
    region: '华南',
    reminderCompletionRate: 0.78,
    repurchaseSuccessRate: 0.70,
    details: {
      reminders: [
        { memberName: '林伟杰', dueDate: '2026-06-10', completed: true, completedDate: '2026-06-09' },
        { memberName: '郑丽华', dueDate: '2026-06-12', completed: false },
        { memberName: '吴国强', dueDate: '2026-06-13', completed: true, completedDate: '2026-06-13' },
      ],
      unreachableMembers: [
        { memberName: '黄志远', phone: '159****8812', attempts: 3, lastAttempt: '2026-06-09' },
        { memberName: '陈美珍', phone: '136****4523', attempts: 2, lastAttempt: '2026-06-06' },
        { memberName: '张伟明', phone: '157****7789', attempts: 4, lastAttempt: '2026-06-08' },
      ],
      outOfStockDrugs: [
        { drugName: '甲巯咪唑片', affectedMembers: 4, restockDate: '2026-06-14' },
      ],
    },
  },
  {
    rank: 7,
    storeName: '国大药房-海淀黄庄店',
    region: '华北',
    reminderCompletionRate: 0.75,
    repurchaseSuccessRate: 0.67,
    details: {
      reminders: [
        { memberName: '孙明远', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-10' },
        { memberName: '王淑珍', dueDate: '2026-06-12', completed: false },
        { memberName: '刘德全', dueDate: '2026-06-14', completed: false },
        { memberName: '赵凤英', dueDate: '2026-06-15', completed: true, completedDate: '2026-06-14' },
        { memberName: '钱国栋', dueDate: '2026-06-16', completed: false },
      ],
      unreachableMembers: [
        { memberName: '李志明', phone: '139****1123', attempts: 5, lastAttempt: '2026-06-09' },
        { memberName: '周桂芳', phone: '185****9934', attempts: 3, lastAttempt: '2026-06-07' },
      ],
      outOfStockDrugs: [
        { drugName: '厄贝沙坦片', affectedMembers: 11, restockDate: '2026-06-15' },
        { drugName: '格列美脲片', affectedMembers: 6 },
      ],
    },
  },
  {
    rank: 8,
    storeName: '益丰药房-鼓楼店',
    region: '华东',
    reminderCompletionRate: 0.72,
    repurchaseSuccessRate: 0.64,
    details: {
      reminders: [
        { memberName: '朱明华', dueDate: '2026-06-10', completed: false },
        { memberName: '许秀英', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-11' },
        { memberName: '田国荣', dueDate: '2026-06-13', completed: true, completedDate: '2026-06-12' },
        { memberName: '范淑兰', dueDate: '2026-06-14', completed: false },
      ],
      unreachableMembers: [
        { memberName: '曹志华', phone: '152****3356', attempts: 4, lastAttempt: '2026-06-08' },
        { memberName: '彭美芳', phone: '138****7712', attempts: 3, lastAttempt: '2026-06-07' },
        { memberName: '魏建国', phone: '156****4498', attempts: 2, lastAttempt: '2026-06-05' },
      ],
      outOfStockDrugs: [
        { drugName: '达比加群酯胶囊', affectedMembers: 5, restockDate: '2026-06-18' },
      ],
    },
  },
  {
    rank: 9,
    storeName: '大参林-越秀店',
    region: '华南',
    reminderCompletionRate: 0.68,
    repurchaseSuccessRate: 0.59,
    details: {
      reminders: [
        { memberName: '冯国强', dueDate: '2026-06-10', completed: true, completedDate: '2026-06-09' },
        { memberName: '梁秀芳', dueDate: '2026-06-12', completed: false },
        { memberName: '何志伟', dueDate: '2026-06-13', completed: false },
      ],
      unreachableMembers: [
        { memberName: '罗美珍', phone: '135****6281', attempts: 5, lastAttempt: '2026-06-09' },
        { memberName: '黄建平', phone: '183****5502', attempts: 3, lastAttempt: '2026-06-08' },
      ],
      outOfStockDrugs: [
        { drugName: '瑞格列奈片', affectedMembers: 7, restockDate: '2026-06-16' },
        { drugName: '丙硫氧嘧啶片', affectedMembers: 3 },
      ],
    },
  },
  {
    rank: 10,
    storeName: '老百姓大药房-武昌店',
    region: '华中',
    reminderCompletionRate: 0.65,
    repurchaseSuccessRate: 0.55,
    details: {
      reminders: [
        { memberName: '程德明', dueDate: '2026-06-10', completed: false },
        { memberName: '董秀华', dueDate: '2026-06-11', completed: true, completedDate: '2026-06-11' },
        { memberName: '余国华', dueDate: '2026-06-13', completed: false },
        { memberName: '苏桂英', dueDate: '2026-06-14', completed: false },
        { memberName: '潘志刚', dueDate: '2026-06-15', completed: true, completedDate: '2026-06-14' },
      ],
      unreachableMembers: [
        { memberName: '叶明辉', phone: '139****8845', attempts: 6, lastAttempt: '2026-06-09' },
        { memberName: '范丽华', phone: '186****2231', attempts: 4, lastAttempt: '2026-06-08' },
        { memberName: '贾德荣', phone: '158****6679', attempts: 3, lastAttempt: '2026-06-07' },
      ],
      outOfStockDrugs: [
        { drugName: '氯吡格雷片', affectedMembers: 10, restockDate: '2026-06-20' },
      ],
    },
  },
]

export const churnMembersData: ChurnMember[] = [
  {
    memberId: 'M10001',
    memberName: '王建国',
    phone: '138****5621',
    category: '高血压',
    riskLabels: ['连续三次未回购'],
    lastPurchaseDate: '2026-03-15',
    suggestedAction: '调整电话跟进节奏至每日一次',
  },
  {
    memberId: 'M10002',
    memberName: '李秀英',
    phone: '139****3482',
    category: '糖尿病',
    riskLabels: ['连续三次未回购', '处方可能过期'],
    lastPurchaseDate: '2026-02-28',
    suggestedAction: '安排门店补货并电话跟进',
  },
  {
    memberId: 'M10003',
    memberName: '张志明',
    phone: '136****7719',
    category: '抗凝',
    riskLabels: ['只在线下买过无法触达'],
    lastPurchaseDate: '2026-04-10',
    suggestedAction: '发起会员关怀活动并引导线上购药',
  },
  {
    memberId: 'M10004',
    memberName: '陈美华',
    phone: '158****2234',
    category: '甲状腺',
    riskLabels: ['处方可能过期'],
    lastPurchaseDate: '2026-03-22',
    suggestedAction: '安排门店补货并电话跟进',
  },
  {
    memberId: 'M10005',
    memberName: '刘德荣',
    phone: '155****8867',
    category: '高血压',
    riskLabels: ['连续三次未回购', '只在线下买过无法触达'],
    lastPurchaseDate: '2026-02-14',
    suggestedAction: '调整电话跟进节奏至每日一次',
  },
  {
    memberId: 'M10006',
    memberName: '赵玉兰',
    phone: '137****4532',
    category: '糖尿病',
    riskLabels: ['连续三次未回购'],
    lastPurchaseDate: '2026-03-05',
    suggestedAction: '发起会员关怀活动并引导线上购药',
  },
  {
    memberId: 'M10007',
    memberName: '孙国平',
    phone: '182****1198',
    category: '高血压',
    riskLabels: ['处方可能过期', '只在线下买过无法触达'],
    lastPurchaseDate: '2026-04-18',
    suggestedAction: '安排门店补货并电话跟进',
  },
  {
    memberId: 'M10008',
    memberName: '周美芳',
    phone: '150****6653',
    category: '抗凝',
    riskLabels: ['连续三次未回购'],
    lastPurchaseDate: '2026-01-20',
    suggestedAction: '调整电话跟进节奏至每日一次',
  },
  {
    memberId: 'M10009',
    memberName: '吴明辉',
    phone: '133****9941',
    category: '甲状腺',
    riskLabels: ['连续三次未回购', '处方可能过期'],
    lastPurchaseDate: '2026-02-08',
    suggestedAction: '安排门店补货并电话跟进',
  },
  {
    memberId: 'M10010',
    memberName: '黄淑芬',
    phone: '186****3372',
    category: '糖尿病',
    riskLabels: ['只在线下买过无法触达'],
    lastPurchaseDate: '2026-04-25',
    suggestedAction: '发起会员关怀活动并引导线上购药',
  },
  {
    memberId: 'M10011',
    memberName: '郑雅琴',
    phone: '151****8890',
    category: '高血压',
    riskLabels: ['连续三次未回购'],
    lastPurchaseDate: '2026-03-10',
    suggestedAction: '调整电话跟进节奏至每日一次',
  },
  {
    memberId: 'M10012',
    memberName: '林永福',
    phone: '159****4426',
    category: '抗凝',
    riskLabels: ['处方可能过期', '只在线下买过无法触达'],
    lastPurchaseDate: '2026-04-02',
    suggestedAction: '安排门店补货并电话跟进',
  },
  {
    memberId: 'M10013',
    memberName: '何春梅',
    phone: '135****5578',
    category: '糖尿病',
    riskLabels: ['连续三次未回购', '处方可能过期'],
    lastPurchaseDate: '2026-01-30',
    suggestedAction: '发起会员关怀活动并引导线上购药',
  },
  {
    memberId: 'M10014',
    memberName: '曹建华',
    phone: '156****2214',
    category: '甲状腺',
    riskLabels: ['连续三次未回购'],
    lastPurchaseDate: '2026-03-28',
    suggestedAction: '调整电话跟进节奏至每日一次',
  },
  {
    memberId: 'M10015',
    memberName: '梁伟明',
    phone: '138****9903',
    category: '高血压',
    riskLabels: ['处方可能过期', '只在线下买过无法触达'],
    lastPurchaseDate: '2026-04-15',
    suggestedAction: '安排门店补货并电话跟进',
  },
]

export function getFilteredData(timeRange: string, region: string) {
  const filteredStores = region === '全部'
    ? storeRankingData
    : storeRankingData.filter((s) => s.region === region)

  const filteredChurn = region === '全部'
    ? churnMembersData
    : churnMembersData.filter((m) => {
        const memberCategories = filteredStores.flatMap((s) => [
          ...s.details.reminders.map((r) => r.memberName),
          ...s.details.unreachableMembers.map((u) => u.memberName),
        ])
        return memberCategories.includes(m.memberName)
      })

  return {
    categoryRepurchaseData,
    storeRankingData: filteredStores,
    churnMembersData: filteredChurn,
  }
}
