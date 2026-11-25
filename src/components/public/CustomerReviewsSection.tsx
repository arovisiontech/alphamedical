'use client'

import React, { useState, useEffect } from 'react'
import { Star, CheckCircle2, MessageSquarePlus, X, Send, ShieldCheck } from 'lucide-react'
import {
  getStoredReviews,
  addStoredReview,
  INITIAL_REVIEWS_SEED,
  StoreReviewItem,
} from '@/src/lib/dataStore'

export default function CustomerReviewsSection() {
  const [reviews, setReviews] = useState<StoreReviewItem[]>(INITIAL_REVIEWS_SEED)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [author, setAuthor] = useState('')
  const [hospital, setHospital] = useState('')
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submittedNotice, setSubmittedNotice] = useState(false)

  useEffect(() => {
    const sync = () => {
      setReviews(getStoredReviews())
    }
    sync()
    window.addEventListener('alpha_reviews_updated', sync)
    window.addEventListener('storage', sync)

    let ch: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        ch = new BroadcastChannel('alpha_sync_channel')
        ch.onmessage = (e) => {
          if (e.data?.type === 'reviews_updated') sync()
        }
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('alpha_reviews_updated', sync)
      window.removeEventListener('storage', sync)
      if (ch) {
        try {
          ch.close()
        } catch (e) {}
      }
    }
  }, [])

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
      : '5.0'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !comment.trim()) return

    const updated = addStoredReview({
      author: author.trim(),
      hospital: hospital.trim() || 'Verified USA Customer',
      rating,
      title: title.trim() || 'Verified 5-Star Customer Review',
      comment: comment.trim(),
    })

    setReviews(updated)
    setAuthor('')
    setHospital('')
    setRating(5)
    setTitle('')
    setComment('')
    setIsModalOpen(false)
    setSubmittedNotice(true)
    setTimeout(() => setSubmittedNotice(false), 4000)
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl 2xl:max-w-[1900px] mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Verified Customer Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trusted by Surgeons & Hospitals Across the USA
            </h2>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-black text-slate-900">{avgRating} / 5.0</span>
              <span>• Based on {reviews.length} verified reviews</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#96161B] hover:bg-[#7d1216] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a 5-Star Review</span>
          </button>
        </div>

        {submittedNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Thank you! Your review has been published on the website and synced to our team.</span>
          </div>
        )}

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= (rev.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{rev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{rev.author}</div>
                  {rev.hospital && (
                    <div className="text-slate-500 truncate">{rev.hospital}</div>
                  )}
                </div>
                <span className="text-slate-400 shrink-0">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WRITE REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">Leave a Verified Review</h3>
                <p className="text-[11px] text-slate-500">
                  Share your experience with Alpha Medical Supplies
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Rating <span className="text-[#96161B]">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-700 ml-2">{rating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name <span className="text-[#96161B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Dr. Emily Roberts, MD"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Clinic / City
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. Miami Surgical Center, FL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Excellent surgical precision & fast delivery"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review Comment <span className="text-[#96161B]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback about instrument quality, checkout, and delivery..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#96161B] focus:bg-white text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#96161B] hover:bg-[#7d1216] text-white py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publish Review</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
