'use client'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import AnimateIn from '@/components/AnimateIn'

const NEWS = [
  { date: '2025.05.01', cat: 'お知らせ', title_ja: 'インバウンド旅行者向け5言語対応サービスを開始しました', title_en: 'Launched 5-language support service for inbound travelers' },
  { date: '2025.04.15', cat: 'お知らせ', title_ja: '旅行代理店様向けランドサービスのご案内を開始しました', title_en: 'Launched land services for travel agencies' },
  { date: '2025.04.01', cat: 'プレスリリース', title_ja: 'コーポレートサイトをオープンしました', title_en: 'Corporate website launched' },
]

const SERVICES = [
  { num: '01', titleKey: 'svc1_title', bodyKey: 'svc1_body', href: '/service#domestic', img: '/images/domestic.jpg', alt: '国内旅行', tag: 'DOMESTIC' },
  { num: '02', titleKey: 'svc2_title', bodyKey: 'svc2_body', href: '/service#overseas', img: '/images/overseas.jpg', alt: '海外旅行', tag: 'OVERSEAS' },
  { num: '03', titleKey: 'svc3_title', bodyKey: 'svc3_body', href: '/service#inbound',  img: '/images/inbound.jpg',  alt: 'インバウンド', tag: 'INBOUND' },
  { num: '04', titleKey: 'svc4_title', bodyKey: 'svc4_body', href: '/service#landop',   img: '/images/landop.jpg',   alt: 'ランドオペレーター', tag: 'LAND OP' },
  { num: '05', titleKey: 'svc5_title', bodyKey: 'svc5_body', href: '/service#bustour',  img: '/images/service-bustour.jpg', alt: '観光バス事業', tag: 'CHARTER BUS' },
]

export default function Home() {
  const { tr, lang } = useLang()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImgY  = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-8%'])
  const heroOp    = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <>
      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] flex items-center overflow-hidden bg-white">
        {/* Parallax photo */}
        <motion.div style={{ y: heroImgY }} className="absolute inset-0 will-change-transform">
          <img
            src="/images/hero.jpg"
            alt="南紀白浜の海"
            className="w-full h-[130%] object-cover object-center"
          />
        </motion.div>

        {/* Overlay: left-side text reveal gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-white/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />

        {/* Text */}
        <motion.div style={{ y: heroTextY, opacity: heroOp }}
          className="relative z-10 w-full px-6 md:px-12 lg:px-24 mt-16">
          <motion.p initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.2 }} className="label-en mb-4">
            {tr('hero_sub')}
          </motion.p>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:1, delay:0.4 }}
            className="font-serif font-light text-5xl sm:text-6xl lg:text-7xl text-charcoal leading-[1.15] tracking-wide mb-6 max-w-2xl">
            {tr('hero_catch')}
          </motion.h1>
          <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
            transition={{ duration:0.8, delay:0.75 }}
            className="origin-left w-16 h-[2px] bg-crimson mb-8" />
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ duration:0.8, delay:0.9 }}
            className="text-charcoal-soft text-sm font-sans leading-loose tracking-wider mb-10 max-w-md whitespace-pre-line">
            {tr('hero_body')}
          </motion.p>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:1.1 }} className="flex flex-wrap gap-4">
            <Link href="/service" className="btn-crimson">{tr('hero_btn1')}</Link>
            <Link href="/contact" className="btn-outline">{tr('hero_btn2')}</Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-muted text-[10px] tracking-widest font-sans">SCROLL</span>
          <motion.div animate={{ scaleY:[0,1,0] }} transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-crimson to-transparent origin-top" />
        </motion.div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="py-32 lg:py-40 bg-white">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <AnimateIn direction="left">
              <span className="label-en">{tr('about_en')}</span>
              <h2 className="title-ja text-4xl lg:text-5xl text-charcoal mb-6 whitespace-pre-line">{tr('about_title')}</h2>
              <span className="accent-line" />
              <p className="text-charcoal-soft text-base leading-loose font-sans mb-10 tracking-wide">{tr('about_body')}</p>
              <Link href="/about" className="btn-outline">{tr('about_more')}</Link>
            </AnimateIn>

            {/* Asymmetric photo stack */}
            <AnimateIn direction="right" delay={0.2}>
              <div className="relative h-[460px]">
                {/* Main photo */}
                <div className="absolute top-0 left-8 right-0 h-80 overflow-hidden shadow-2xl">
                  <img src="/images/about.jpg" alt="南紀白浜の海岸"
                    className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 bg-white/85 backdrop-blur-sm px-4 py-2">
                    <p className="text-[10px] tracking-widest font-sans text-muted">SHIRAHAMA, WAKAYAMA</p>
                    <p className="font-serif text-lg text-charcoal">南紀白浜</p>
                  </div>
                </div>
                {/* Secondary photo offset */}
                <div className="absolute bottom-0 left-0 w-52 h-44 overflow-hidden shadow-xl border-4 border-white">
                  <img src="/images/domestic.jpg" alt="日本の自然"
                    className="w-full h-full object-cover object-center" />
                </div>
                {/* Badge */}
                <div className="absolute top-6 right-0 bg-crimson text-white p-5 text-center shadow-xl">
                  <p className="font-serif text-3xl font-light">5</p>
                  <p className="text-[9px] tracking-widest font-sans mt-1">言語対応</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ══ SERVICE ══ */}
      <section className="py-32 bg-warm-50">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-6">
              <div>
                <span className="label-en">{tr('service_en')}</span>
                <h2 className="title-ja text-4xl lg:text-5xl text-charcoal">{tr('service_title')}</h2>
              </div>
              <p className="text-charcoal-soft text-sm font-sans leading-loose max-w-sm whitespace-pre-line">{tr('service_sub')}</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <AnimateIn key={s.num} delay={i * 0.08}>
                <Link href={s.href} className="group relative overflow-hidden bg-white card-hover block">
                  {/* Photo header */}
                  <div className="h-48 overflow-hidden relative">
                    <motion.img src={s.img} alt={s.alt}
                      className="w-full h-full object-cover object-center"
                      whileHover={{ scale:1.05 }}
                      transition={{ duration:0.7, ease:'easeOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-crimson text-[9px] tracking-widest font-sans px-3 py-1">
                        {s.tag}
                      </span>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="p-7">
                    <span className="text-[10px] text-crimson font-sans tracking-widest">{s.num}</span>
                    <h3 className="font-serif text-xl text-charcoal mt-1 mb-3
                                   group-hover:text-crimson transition-colors duration-300">
                      {tr(s.titleKey)}
                    </h3>
                    <p className="text-charcoal-soft text-sm leading-loose font-sans">{tr(s.bodyKey)}</p>
                    <span className="inline-flex items-center gap-2 text-[11px] text-crimson tracking-widest mt-5
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

      {/* ══ WHY US (非対称) ══ */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Parallax photo */}
            <AnimateIn direction="left" delay={0.1}>
              <div className="relative">
                <div className="h-[520px] overflow-hidden shadow-2xl">
                  <WhyUsParallax />
                </div>
                {/* Floating info card */}
                <div className="absolute -bottom-8 -right-4 bg-white shadow-xl p-6 w-52">
                  <p className="font-serif text-4xl text-crimson font-light">5</p>
                  <p className="text-[10px] font-sans tracking-widest text-muted mt-1 uppercase">Languages</p>
                  <p className="text-[10px] font-sans text-muted-light mt-2 leading-relaxed">
                    日本語・English・中文<br />ภาษาไทย・한국어
                  </p>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="right" delay={0.2}>
              <span className="label-en">WHY EN JOURNEY</span>
              <h2 className="title-ja text-3xl lg:text-4xl text-charcoal mb-6">
                {lang === 'ja' ? '私たちが選ばれる理由' : 'Why Choose Us'}
              </h2>
              <span className="accent-line" />
              {[
                { n:'01', ja:'5言語対応サービス', en:'5-Language Support',
                  dja:'日本語・英語・中文・タイ語・韓国語でスムーズにご対応', den:'Seamless service in 5 languages' },
                { n:'02', ja:'地元密着のプロが担当', en:'Local Professionals',
                  dja:'南紀白浜を深く知るスタッフが観光を完全サポート', den:'Staff with deep local knowledge of Shirahama' },
                { n:'03', ja:'ワンストップで解決', en:'One-Stop Solution',
                  dja:'旅行手配からランドオペレーター業務まで一括対応', den:'From travel booking to land operations, all in one place' },
              ].map((f, i) => (
                <motion.div key={f.n} initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.6, delay:i*0.12 }}
                  className="flex gap-5 mb-8 last:mb-0">
                  <span className="text-crimson text-[11px] tracking-widest font-sans mt-1 shrink-0 w-8">{f.n}</span>
                  <div className="border-l-2 border-crimson-muted pl-5">
                    <p className="font-serif text-lg text-charcoal mb-1">{lang==='ja'?f.ja:f.en}</p>
                    <p className="text-sm text-charcoal-soft font-sans leading-relaxed">{lang==='ja'?f.dja:f.den}</p>
                  </div>
                </motion.div>
              ))}
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ══ NEWS ══ */}
      <section className="py-32 bg-warm-50">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="label-en">{tr('news_en')}</span>
                <h2 className="title-ja text-3xl text-charcoal">{tr('news_title')}</h2>
              </div>
              <Link href="/news"
                className="text-[11px] tracking-widest text-muted hover:text-crimson transition-colors duration-300 font-sans link-underline hidden sm:block">
                {tr('news_more')} →
              </Link>
            </div>
          </AnimateIn>
          <div className="bg-white shadow-sm overflow-hidden">
            {NEWS.map((n, i) => (
              <AnimateIn key={i} delay={i*0.08}>
                <Link href="/news"
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 px-8 py-6
                             border-b border-warm-100 last:border-0 hover:bg-crimson-pale transition-colors duration-300">
                  <time className="text-xs text-muted font-sans tracking-wider shrink-0">{n.date}</time>
                  <span className="text-[10px] px-3 py-1 border border-warm-200 text-muted font-sans tracking-wider shrink-0
                                   group-hover:border-crimson group-hover:text-crimson transition-colors duration-300">
                    {n.cat}
                  </span>
                  <span className="text-sm text-charcoal font-sans tracking-wide group-hover:text-crimson transition-colors duration-300">
                    {lang === 'ja' ? n.title_ja : n.title_en}
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-40 overflow-hidden">
        {/* Full-bleed photo background */}
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover object-[50%_40%]" />
          <div className="absolute inset-0 bg-white/75" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-crimson-pale opacity-80" />
        <div className="absolute right-[30%] top-0 bottom-0 w-[2px] bg-crimson-muted opacity-60" />

        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10">
          <AnimateIn>
            <div className="max-w-lg">
              <span className="label-en">CONTACT</span>
              <h2 className="title-ja text-4xl lg:text-5xl text-charcoal mb-6 whitespace-pre-line">{tr('cta_title')}</h2>
              <span className="accent-line" />
              <p className="text-charcoal-soft text-sm leading-loose font-sans mb-10 tracking-wide">{tr('cta_body')}</p>
              <Link href="/contact" className="btn-crimson">{tr('cta_btn')}</Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}

/* Parallax photo component for "Why Us" section */
function WhyUsParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <div ref={ref} className="w-full h-full overflow-hidden">
      <motion.img
        src="/images/whyus.jpg"
        alt="南紀白浜の澄んだ海"
        style={{ y }}
        className="w-full h-[115%] object-cover object-center will-change-transform"
      />
    </div>
  )
}
