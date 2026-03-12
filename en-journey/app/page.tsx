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
  { num: '01', titleKey: 'svc1_title', bodyKey: 'svc1_body', href: '/service#domestic', scene: 'scene-mountain', icon: '🗾', tag: 'DOMESTIC' },
  { num: '02', titleKey: 'svc2_title', bodyKey: 'svc2_body', href: '/service#overseas', scene: 'scene-sky',      icon: '✈️',  tag: 'OVERSEAS' },
  { num: '03', titleKey: 'svc3_title', bodyKey: 'svc3_body', href: '/service#inbound',  scene: 'scene-beach',   icon: '🌏', tag: 'INBOUND'  },
  { num: '04', titleKey: 'svc4_title', bodyKey: 'svc4_body', href: '/service#landop',   scene: 'scene-temple',  icon: '🏨', tag: 'LAND OP' },
]

function BeachScene() {
  return (
    <svg viewBox="0 0 1200 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#87CEEB" />
          <stop offset="40%"  stopColor="#FFD4A8" />
          <stop offset="56%"  stopColor="#FFB060" />
          <stop offset="100%" stopColor="#FF8C42" />
        </linearGradient>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#5BBCD8" />
          <stop offset="60%"  stopColor="#2E96C4" />
          <stop offset="100%" stopColor="#1A7AAF" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>
      </defs>
      <rect width="1200" height="300" fill="url(#sky)" />
      <circle cx="900" cy="110" r="52" fill="#FFE566" opacity="0.9" />
      <circle cx="900" cy="110" r="75" fill="#FFE566" opacity="0.22" />
      <path d="M0 265 L120 165 L220 205 L340 130 L460 185 L580 100 L700 162 L820 108 L920 152 L1040 88 L1150 142 L1200 118 L1200 310 L0 310Z" fill="#A8D8EA" opacity="0.38" />
      <rect y="300" width="1200" height="200" fill="url(#ocean)" />
      <path d="M0 312 Q150 296 300 312 Q450 326 600 310 Q750 294 900 312 Q1050 328 1200 310 L1200 330 Q1050 348 900 330 Q750 312 600 330 Q450 348 300 330 Q150 314 0 330Z" fill="white" opacity="0.14" />
      <path d="M0 345 Q200 328 400 345 Q600 360 800 340 Q1000 322 1200 342 L1200 358 Q1000 336 800 358 Q600 374 400 358 Q200 342 0 358Z" fill="white" opacity="0.09" />
      <path d="M0 445 Q200 422 400 438 Q600 452 800 434 Q1000 416 1200 432 L1200 500 L0 500Z" fill="url(#sand)" />
      <path d="M825 308 Q870 300 918 308 Q948 302 975 310" stroke="#FFE566" strokeWidth="2.5" fill="none" opacity="0.55" />
      <path d="M755 324 Q825 312 892 322" stroke="#FFE566" strokeWidth="1.5" fill="none" opacity="0.38" />
    </svg>
  )
}

export default function Home() {
  const { tr, lang } = useLang()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroText = useTransform(scrollYProgress, [0, 0.5], ['0%', '-8%'])
  const heroOp   = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] flex items-center overflow-hidden bg-white">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <BeachScene />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent" />

        <motion.div style={{ y: heroText, opacity: heroOp }}
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

        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-muted text-[10px] tracking-widest font-sans">SCROLL</span>
          <motion.div animate={{ scaleY:[0,1,0] }} transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-crimson to-transparent origin-top" />
        </motion.div>
      </section>

      {/* ABOUT */}
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
            <AnimateIn direction="right" delay={0.2}>
              <div className="relative h-[420px]">
                <div className="absolute top-0 left-8 right-0 h-72 rounded-sm overflow-hidden scene-beach shadow-xl">
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-2">
                      <p className="text-[10px] tracking-widest font-sans text-muted">SHIRAHAMA, WAKAYAMA</p>
                      <p className="font-serif text-lg text-charcoal">南紀白浜</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-48 h-40 rounded-sm overflow-hidden scene-mountain shadow-lg border-4 border-white">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl opacity-30">🏔️</span>
                  </div>
                </div>
                <div className="absolute top-4 right-0 bg-crimson text-white p-5 text-center shadow-lg">
                  <p className="font-serif text-3xl font-light">5</p>
                  <p className="text-[9px] tracking-widest font-sans mt-1">言語対応</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* SERVICE */}
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
                <Link href={s.href} className="group relative overflow-hidden rounded-sm bg-white card-hover block">
                  <div className={`h-44 ${s.scene} relative overflow-hidden`}>
                    <motion.div className="absolute inset-0 flex items-center justify-center text-6xl opacity-25"
                      whileHover={{ scale:1.08 }} transition={{ duration:0.6 }}>
                      {s.icon}
                    </motion.div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-crimson text-[9px] tracking-widest font-sans px-3 py-1">{s.tag}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  </div>
                  <div className="p-7">
                    <span className="text-[10px] text-crimson font-sans tracking-widest">{s.num}</span>
                    <h3 className="font-serif text-xl text-charcoal mt-1 mb-3 group-hover:text-crimson transition-colors duration-300">{tr(s.titleKey)}</h3>
                    <p className="text-charcoal-soft text-sm leading-loose font-sans">{tr(s.bodyKey)}</p>
                    <span className="inline-flex items-center gap-2 text-[11px] text-crimson tracking-widest mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                      {tr('service_more')} →
                    </span>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimateIn direction="left" delay={0.1}>
              <div className="relative">
                <div className="h-[500px] scene-beach rounded-sm overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-15">🌊</span>
                  </div>
                </div>
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
                { n:'01', ja:'5言語対応サービス', en:'5-Language Support', dja:'日本語・英語・中文・タイ語・韓国語でスムーズにご対応', den:'Seamless service in 5 languages' },
                { n:'02', ja:'地元密着のプロが担当', en:'Local Professionals', dja:'南紀白浜を深く知るスタッフが観光を完全サポート', den:'Staff with deep local knowledge of Shirahama' },
                { n:'03', ja:'ワンストップで解決', en:'One-Stop Solution', dja:'旅行手配からランドオペレーター業務まで一括対応', den:'From travel booking to land operations, all in one place' },
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

      {/* NEWS */}
      <section className="py-32 bg-warm-50">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <div className="flex items-end justify-between mb-14">
              <div>
                <span className="label-en">{tr('news_en')}</span>
                <h2 className="title-ja text-3xl text-charcoal">{tr('news_title')}</h2>
              </div>
              <Link href="/news" className="text-[11px] tracking-widest text-muted hover:text-crimson transition-colors duration-300 font-sans link-underline hidden sm:block">
                {tr('news_more')} →
              </Link>
            </div>
          </AnimateIn>
          <div className="bg-white shadow-sm overflow-hidden">
            {NEWS.map((n, i) => (
              <AnimateIn key={i} delay={i*0.08}>
                <Link href="/news" className="group flex flex-col sm:flex-row sm:items-center gap-4 px-8 py-6 border-b border-warm-100 last:border-0 hover:bg-crimson-pale transition-colors duration-300">
                  <time className="text-xs text-muted font-sans tracking-wider shrink-0">{n.date}</time>
                  <span className="text-[10px] px-3 py-1 border border-warm-200 text-muted font-sans tracking-wider shrink-0 group-hover:border-crimson group-hover:text-crimson transition-colors duration-300">
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

      {/* CTA */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 scene-sky opacity-50" />
        <div className="absolute inset-0 bg-white/55" />
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
