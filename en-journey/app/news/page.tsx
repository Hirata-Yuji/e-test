'use client'
import { useState } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

const NEWS = [
  { date: '2025.05.01', cat: 'お知らせ', cat_en: 'Notice',
    title_ja: 'インバウンド旅行者向け5言語対応サービスを開始しました',
    title_en: 'Launched 5-language support service for inbound travelers' },
  { date: '2025.04.15', cat: 'お知らせ', cat_en: 'Notice',
    title_ja: '旅行代理店様向けランドサービスのご案内を開始しました',
    title_en: 'Launched land services for travel agencies' },
  { date: '2025.04.01', cat: 'プレスリリース', cat_en: 'Press Release',
    title_ja: 'コーポレートサイトをオープンしました',
    title_en: 'Corporate website launched' },
  { date: '2025.04.01', cat: '採用情報', cat_en: 'Careers',
    title_ja: '2025年度 採用情報を公開しました',
    title_en: '2025 career opportunities now available' },
  { date: '2025.04.01', cat: 'お知らせ', cat_en: 'Notice',
    title_ja: '株式会社En Journey、設立のお知らせ',
    title_en: 'En Journey Co., Ltd. established' },
]

const CATS = ['すべて', 'お知らせ', 'プレスリリース', '採用情報']

export default function NewsPage() {
  const { tr, lang } = useLang()
  const [active, setActive] = useState('すべて')

  const filtered = active === 'すべて' ? NEWS : NEWS.filter(n => n.cat === active)

  return (
    <>
      <PageHero enLabel="NEWS" titleKey="news_page_title" breadcrumb={[{ label: tr('nav_news') }]} />

      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">

          {/* Filter */}
          <AnimateIn>
            <div className="flex flex-wrap gap-2 mb-16">
              {CATS.map(c => (
                <button key={c} onClick={() => setActive(c)}
                  className={`text-[11px] px-5 py-2 tracking-widest font-sans border transition-all duration-300
                    ${active === c ? 'bg-navy text-white border-navy' : 'border-gray-200 text-stone hover:border-navy hover:text-navy'}`}>
                  {c === 'すべて' ? tr('all') : c}
                </button>
              ))}
            </div>
          </AnimateIn>

          {/* List */}
          <div>
            {filtered.map((n, i) => (
              <AnimateIn key={i} delay={i * 0.05}>
                <article className="group py-8 border-b border-gray-100 hover:border-gold
                                    transition-colors duration-300 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <time className="text-xs text-stone font-sans tracking-wider shrink-0">{n.date}</time>
                    <span className="text-[10px] px-3 py-1 border border-gray-200 text-stone
                                     font-sans tracking-wider shrink-0 w-fit">
                      {lang === 'ja' ? n.cat : n.cat_en}
                    </span>
                    <h2 className="text-sm text-navy font-sans group-hover:text-gold transition-colors duration-300">
                      {lang === 'ja' ? n.title_ja : n.title_en}
                    </h2>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
