import React from 'react'
import HeaderNav from '@/src/components/public/HeaderNav'
import MainRedNavbar from '@/src/components/public/MainRedNavbar'
import TopBar from '@/src/components/public/TopBar'
import PublicFooter from '@/src/components/public/PublicFooter'
import Link from 'next/link'
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Careers - Alpha Wholesale Medical Supplies LLC',
  description: 'Join our team at Alpha Wholesale Medical Supplies LLC.',
}

export default function CareersPage() {
  const jobs = [
    {
      title: 'Surgical Instrument Quality Specialist',
      department: 'Quality Assurance',
      location: 'Easley, SC, USA',
      type: 'Full-Time',
    },
    {
      title: 'International Medical Sales Executive',
      department: 'Global Export',
      location: 'Remote / Hybrid',
      type: 'Full-Time',
    },
    {
      title: 'Biomedical Equipment Technician',
      department: 'Technical Support',
      location: 'Easley, SC, USA',
      type: 'Full-Time',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <HeaderNav />
      <MainRedNavbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#96161B] uppercase tracking-wider">
              Careers at Alpha Medical
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Build the Future of Healthcare With Us
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
              We are constantly seeking passionate medical technologists, engineers, and supply chain experts.
            </p>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.title}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#96161B]/40 transition-colors"
              >
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold mt-1">
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-[#96161B] hover:bg-[#7d1216] text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
