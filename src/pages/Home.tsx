import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import GlobalFilter from '@/components/GlobalFilter'
import OperationsSummary from '@/components/OperationsSummary'
import CategoryOverview from '@/components/CategoryOverview'
import StoreRanking from '@/components/StoreRanking'
import ChurnWarning from '@/components/ChurnWarning'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'summary' | 'category' | 'store' | 'churn'>('summary')

  const scrollToSection = (section: string) => {
    setActiveSection(section as 'summary' | 'category' | 'store' | 'churn')
    const el = document.getElementById(`section-${section}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar activeSection={activeSection} onSectionChange={scrollToSection} />

      <div className="flex-1 pl-16 lg:pl-60">
        <div className="sticky top-0 z-20 px-6 pt-4 pb-2">
          <GlobalFilter />
        </div>

        <div className="space-y-8 px-6 pb-8">
          <div id="section-summary">
            <OperationsSummary />
          </div>

          <div id="section-category">
            <CategoryOverview />
          </div>

          <div id="section-store">
            <StoreRanking />
          </div>

          <div id="section-churn">
            <ChurnWarning />
          </div>
        </div>
      </div>
    </div>
  )
}
