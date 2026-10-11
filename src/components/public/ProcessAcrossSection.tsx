import React from 'react'
import { Search, FileCheck, Truck, ThumbsUp } from 'lucide-react'

export default function ProcessAcrossSection() {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Browse & Select',
      description: 'Explore certified medical equipment, surgical instruments, and hospital furniture online.',
    },
    {
      step: '02',
      icon: FileCheck,
      title: 'Request Quotation',
      description: 'Submit your hospital or clinic requirement to receive official instant pricing & specifications.',
    },
    {
      step: '03',
      icon: Truck,
      title: 'Quality Dispatch',
      description: 'Items undergo biomedical testing and sterile packaging before fast nationwide dispatch.',
    },
    {
      step: '04',
      icon: ThumbsUp,
      title: 'Setup & After-Sales',
      description: 'On-site installation, staff operation training, and ongoing maintenance coverage.',
    },
  ]

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold text-[#B92025] uppercase tracking-widest">
            Streamlined Hospital Procurement
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How Ordering Works with ALPHA Medical
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon
            return (
              <div
                key={idx}
                className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 hover:border-[#B92025] transition-all hover:shadow-lg relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#B92025] text-white flex items-center justify-center shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-300 group-hover:text-[#B92025]/30 transition-colors">
                    {st.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {st.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
