import { useState } from 'react'
import { RotateCw, ChevronDown } from 'lucide-react'
import { useDashboardStore } from '@/hooks/useDashboardStore'

const timeOptions = ['近7天', '近30天', '近90天']
const regionOptions = ['全部', '华东', '华南', '华北', '华中', '西南']

function Dropdown({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 font-medium text-sm hover:bg-surface-200"
      >
        {value}
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-1 min-w-[120px] rounded-lg bg-white py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full px-3 py-1.5 text-left text-sm ${
                  value === opt ? 'bg-brand-700 font-medium text-white' : 'hover:bg-surface-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function GlobalFilter() {
  const { timeRange, region, setTimeRange, setRegion, refreshData } = useDashboardStore()

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-5 py-3 shadow-sm">
      <h1 className="text-lg font-semibold text-brand-700">续购数据看板</h1>

      <div className="flex items-center gap-3">
        <Dropdown options={timeOptions} value={timeRange} onChange={setTimeRange} />
        <Dropdown options={regionOptions} value={region} onChange={setRegion} />

        <button
          onClick={refreshData}
          className="flex items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 font-medium text-sm hover:bg-surface-200"
        >
          <RotateCw className="h-4 w-4" />
          刷新
        </button>
      </div>
    </div>
  )
}
