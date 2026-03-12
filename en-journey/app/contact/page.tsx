'use client'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

const INQUIRY_TYPES = ['cont_t1', 'cont_t2', 'cont_t3', 'cont_t4']
const LANG_OPTIONS_JA = ['日本語', 'English', '中文', 'ภาษาไทย', '한국어']

const INFO_CARDS_JA = [
  { label: '所在地', value: '〒649-2201\n和歌山県西牟婁郡白浜町堅田2434-1' },
  { label: '対応言語', value: '日本語・英語・中国語・タイ語・韓国語' },
  { label: '受付時間', value: '平日 9:00〜18:00\n土日祝日は翌営業日対応' },
]
const INFO_CARDS_EN = [
  { label: 'Address', value: '2434-1 Katata, Shirahama-cho,\nNishimuro-gun, Wakayama 649-2201' },
  { label: 'Languages', value: 'Japanese, English, Chinese, Thai, Korean' },
  { label: 'Hours', value: 'Weekdays 9:00–18:00\n(Weekends/holidays: next business day)' },
]

export default function ContactPage() {
  const { tr, lang } = useLang()
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0])
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const infoCards = lang === 'ja' ? INFO_CARDS_JA : INFO_CARDS_EN

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) return
    setSubmitted(true)
  }

  return (
    <>
      <PageHero enLabel="CONTACT" titleKey="cont_page_title" breadcrumb={[{ label: tr('nav_contact') }]} />

      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">

            {/* Form */}
            <div className="lg:col-span-2">
              <AnimateIn>
                <span className="label-en">INQUIRY FORM</span>
                <h2 className="title-ja text-3xl text-navy mb-12">
                  {lang === 'ja' ? 'お問い合わせフォーム' : 'Send us a message'}
                </h2>
              </AnimateIn>

              {submitted ? (
                <AnimateIn>
                  <div className="py-16 text-center border border-gold/30 bg-cream-warm">
                    <span className="text-gold text-3xl block mb-4">✦</span>
                    <p className="font-serif text-xl text-navy mb-3">
                      {lang === 'ja' ? 'お問い合わせを受け付けました' : 'Thank you for your inquiry'}
                    </p>
                    <p className="text-stone text-sm font-sans">{tr('cont_note')}</p>
                  </div>
                </AnimateIn>
              ) : (
                <AnimateIn delay={0.1}>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Inquiry type */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-3">
                        {tr('cont_type')} <span className="text-red-400 ml-1">*</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {INQUIRY_TYPES.map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setInquiryType(key)}
                            className={`px-4 py-2 text-xs font-sans tracking-wider border transition-colors duration-200
                              ${inquiryType === key
                                ? 'bg-navy text-white border-navy'
                                : 'bg-white text-stone border-gray-200 hover:border-navy/30'
                              }`}
                          >
                            {tr(key)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_company')}
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white"
                        placeholder={lang === 'ja' ? '例：株式会社○○' : 'e.g. ACME Corporation'}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_name')} <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white"
                        placeholder={lang === 'ja' ? '例：山田 太郎' : 'e.g. Taro Yamada'}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_email')} <span className="text-red-400 ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white"
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* Tel */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_tel')}
                      </label>
                      <input
                        type="tel"
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white"
                        placeholder="000-0000-0000"
                      />
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_lang')}
                      </label>
                      <select
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white appearance-none"
                      >
                        {LANG_OPTIONS_JA.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] text-gold tracking-widest font-sans mb-2">
                        {tr('cont_msg')} <span className="text-red-400 ml-1">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        className="w-full border border-gray-200 px-4 py-3 text-sm font-sans text-navy
                                   focus:outline-none focus:border-navy/50 transition-colors bg-white resize-none"
                        placeholder={lang === 'ja' ? 'お問い合わせ内容をご記入ください' : 'Please describe your inquiry'}
                      />
                    </div>

                    {/* Privacy */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacy"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-navy"
                      />
                      <label htmlFor="privacy" className="text-sm text-stone font-sans cursor-pointer">
                        {tr('cont_privacy')}
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={!agreed}
                        className="btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {tr('cont_submit')}
                      </button>
                      <p className="text-xs text-stone/60 font-sans mt-4">{tr('cont_note')}</p>
                    </div>
                  </form>
                </AnimateIn>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <AnimateIn delay={0.2}>
                <span className="label-en">INFO</span>
                <h2 className="title-ja text-2xl text-navy mb-8">
                  {lang === 'ja' ? '会社情報' : 'Company Info'}
                </h2>

                <div className="space-y-4 mb-10">
                  {infoCards.map((card) => (
                    <div key={card.label} className="p-5 bg-cream-warm border-l-2 border-gold/40">
                      <p className="text-[10px] text-gold tracking-widest font-sans mb-2">{card.label}</p>
                      <p className="text-sm text-navy font-sans leading-relaxed whitespace-pre-line">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="overflow-hidden border border-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3293.5!2d135.3753!3d33.6836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000a0b0a0b0a0b0%3A0x0!2z5ZKM5LqV55S65pmC!5e0!3m2!1sja!2sjp!4v1620000000000!5m2!1sja!2sjp"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="En Journey Map"
                  />
                </div>
              </AnimateIn>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
