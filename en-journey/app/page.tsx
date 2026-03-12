'use client'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import AnimateIn from '@/components/AnimateIn'

/* ── News data ─────────────────────────────── */
const NEWS = [
  { date: '2025.05.01', cat: 'お知らせ', title_ja: 'インバウンド旅行者向け5言語対応サービスを開始しました', title_en: 'Launched 5-language support service for inbound travelers' },
  { date: '2025.04.15', cat: 'お知らせ', title_ja: '旅行代理店様向けランドサービスのご案内を開始しました', title_en: 'Launched land services for travel agencies' },
  { date: '2025.04.01', cat: 'プレスリリース', title_ja: 'コーポレートサイトをオープンしました', title_en: 'Corporate website launched' },
]

/* ── Service list ───────────────────────────── */
const SERVICES = [
  { num: '01', titleKey: 'svc1_title', bodyKey: 'svc1_body', href: '/service#domestic', emoji: '🗾' },
  { num: '02', titleKey: 'svc2_title', bodyKey: 'svc2_body', href: '/service#overseas', emoji: '✈️' },
  { num: '03', titleKey: 'svc3_title', bodyKey: 'svc3_body', href: '/service#inbound', emoji: '🌏' },
  { num: '04', titleKey: 'svc4_title', bodyKey: 'svc4_body', href: '/service#landop', emoji: '🏨' },
]

export default function Home() {
  const { tr, lang } = useLang()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-navy">
        {/* Parallax BG */}
        <motion.div style={{ y: heroY }}
          className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-[#1a4a6e]">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #C9A227 0%, transparent 50%), radial-gradient(circle at 80% 20%, #3A8FD1 0%, transparent 40%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div style={{ opacity: heroOpacity }}
          className="relative z-10 w-full px-6 md:px-12 lg:px-24 mt-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="label-en text-gold/80 mb-6"
          >
            {tr('hero_sub')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl xl:text-8xl
                       text-white leading-[1.2] tracking-wide mb-8 max-w-3xl"
          >
            {tr('hero_catch')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/60 text-sm font-sans leading-loose tracking-wider mb-12
                       max-w-lg whitespace-pre-line"
          >
            {tr('hero_body')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/service" className="btn-white">{tr('hero_btn1')}</Link>
            <Link href="/contact" className="btn-gold !border-gold/40 !text-gold/80 hover:!bg-gold hover:!text-navy">{tr('hero_btn2')}</Link>
          </motion.div>
        </motion.div>

        {/* Vertical text */}
        <div className="hidden xl:flex absolute right-12 top-1/2 -translate-y-1/2 writing-vertical
                        text-white/15 text-xs tracking-widest font-sans gap-8">
          <span>NANKI SHIRAHAMA</span>
          <span>WAKAYAMA</span>
        </div>

        {/* Scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-[10px] tracking-widest font-sans">SCROLL</span>
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent origin-top"
          />
        </motion.div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section className="py-32 lg:py-40">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimateIn direction="left">
              <span className="label-en">{tr('about_en')}</span>
              <h2 className="title-ja text-4xl lg:text-5xl text-navy mb-8 whitespace-pre-line">
                {tr('about_title')}
              </h2>
              <span className="accent-line" />
              <p className="text-stone text-base leading-loose font-sans mb-10">
                {tr('about_body')}
              </p>
              <Link href="/about" className="btn-navy">{tr('about_more')}</Link>
            </AnimateIn>

            {/* Asymmetric image block */}
            <AnimateIn direction="right" delay={0.2}>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1B6CA8] via-[#0A3B5C] to-navy
                                rounded-sm overflow-hidden flex items-center justify-center ml-0 lg:ml-8">
                  <span className="text-8xl opacity-30">🌊</span>
                  {/* Overlay text */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/40 text-xs tracking-widest font-sans">SHIRAHAMA, WAKAYAMA</p>
                    <p className="text-white/80 font-serif text-xl tracking-wider">南紀白浜</p>
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-6 -right-0 lg:-right-6 bg-gold text-navy p-6 w-32 text-center">
                  <p className="font-serif text-2xl font-light">5</p>
                  <p className="text-[10px] tracking-wider font-sans mt-1">言語対応</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICE ═══════════════ */}
      <section className="py-32 bg-cream-warm">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
              <div>
                <span className="label-en">{tr('service_en')}</span>
                <h2 className="title-ja text-4xl lg:text-5xl text-navy">{tr('service_title')}</h2>
              </div>
              <p className="text-stone text-sm font-sans leading-loose max-w-sm whitespace-pre-line">
                {tr('service_sub')}
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {SERVICES.map((s, i) => (
              <AnimateIn key={s.num} delay={i * 0.1}>
                <Link href={s.href}
                  className="group bg-white p-10 lg:p-14 flex gap-6 card-hover block h-full">
                  <span className="text-[11px] text-gold font-sans tracking-wider mt-1 shrink-0">{s.num}</span>
                  <div className="flex-1">
                    <div className="text-3xl mb-4">{s.emoji}</div>
                    <h3 className="font-serif text-xl text-navy mb-3 group-hover:text-gold transition-colors duration-300">
                      {tr(s.titleKey)}
                    </h3>
                    <p className="text-stone text-sm leading-loose font-sans">{tr(s.bodyKey)}</p>
                    <span className="inline-flex items-center gap-2 text-[11px] text-gold tracking-widest mt-6
                                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                      {tr('service_more')} →
                    </span>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWS ═══════════════ */}
      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="label-en">{tr('news_en')}</span>
                <h2 className="title-ja text-3xl text-navy">{tr('news_title')}</h2>
              </div>
              <Link href="/news"
                className="text-[11px] tracking-widest text-stone hover:text-gold transition-colors duration-300
                           font-sans link-underline hidden sm:block">
                {tr('news_more')} →
              </Link>
            </div>
          </AnimateIn>

          <div>
            {NEWS.map((n, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <Link href="/news"
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 py-6
                             border-b border-gray-100 hover:border-gold transition-colors duration-300">
                  <time className="text-xs text-stone font-sans tracking-wider shrink-0">{n.date}</time>
                  <span className="text-[10px] px-3 py-1 border border-gray-200 text-stone font-sans
                                   tracking-wider shrink-0">
                    {n.cat}
                  </span>
                  <span className="text-sm text-navy font-sans tracking-wide group-hover:text-gold
                                   transition-colors duration-300">
                    {lang === 'ja' ? n.title_ja : n.title_en}
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/news" className="btn-navy text-xs">{tr('news_more')}</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #C9A227 0%, transparent 60%)' }} />
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10">
          <div className="max-w-xl">
            <AnimateIn>
              <span className="label-en text-gold/60">CONTACT</span>
              <h2 className="title-ja text-4xl lg:text-5xl text-white mb-8 whitespace-pre-line">
                {tr('cta_title')}
              </h2>
              <p className="text-white/50 text-sm leading-loose font-sans mb-10">
                {tr('cta_body')}
              </p>
              <Link href="/contact" className="btn-white">{tr('cta_btn')}</Link>
            </AnimateIn>
          </div>
        </div>

        {/* Deco */}
        <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2
                        text-white/5 font-serif text-[200px] leading-none select-none pointer-events-none">
          旅
        </div>
      </section>
    </>
  )
}
