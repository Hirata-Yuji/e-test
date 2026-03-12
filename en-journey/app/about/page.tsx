'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

const VALUES = [
  { titleKey: 'val1', bodyKey: 'val1_body', num: '01' },
  { titleKey: 'val2', bodyKey: 'val2_body', num: '02' },
  { titleKey: 'val3', bodyKey: 'val3_body', num: '03' },
]

export default function AboutPage() {
  const { tr } = useLang()
  return (
    <>
      <PageHero
        enLabel="ABOUT US"
        titleKey="abt_page_title"
        breadcrumb={[{ label: tr('nav_about') }]}
      />

      {/* ═══ PHILOSOPHY ═══ */}
      <section className="py-32" id="philosophy">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

            <AnimateIn direction="left">
              <span className="label-en">PHILOSOPHY</span>
              <h2 className="title-ja text-4xl text-navy mb-6">{tr('phil_title')}</h2>
              <span className="accent-line" />
              <blockquote className="font-serif text-2xl lg:text-3xl text-navy/80 leading-relaxed
                                     tracking-wide mb-8 border-l-2 border-gold pl-6">
                {tr('phil_mission')}
              </blockquote>
              <p className="text-stone text-base leading-loose font-sans">
                {tr('phil_body')}
              </p>
            </AnimateIn>

            <div className="flex flex-col gap-6">
              {VALUES.map((v, i) => (
                <AnimateIn key={v.num} delay={i * 0.15} direction="right">
                  <div className="p-8 bg-cream border-l-2 border-gold/30 hover:border-gold transition-colors duration-500">
                    <span className="text-[10px] text-gold tracking-widest font-sans">{v.num}</span>
                    <h3 className="font-serif text-xl text-navy mt-2 mb-3">{tr(v.titleKey)}</h3>
                    <p className="text-stone text-sm leading-loose font-sans">{tr(v.bodyKey)}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MESSAGE ═══ */}
      <section className="py-32 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #C9A227 0%, transparent 60%)' }} />
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10">
          <AnimateIn>
            <span className="label-en text-gold/60">MESSAGE</span>
            <h2 className="title-ja text-3xl text-white mb-12">{tr('msg_title')}</h2>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <AnimateIn direction="left">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-navy-light border border-white/10
                                flex items-center justify-center text-4xl mb-6">👤</div>
                <p className="text-[10px] text-gold tracking-widest font-sans mb-2">{tr('pos_ceo')}</p>
                <p className="text-white font-serif text-xl tracking-wide">大谷 晃一</p>
                <p className="text-white/40 text-xs font-sans mt-1">Koichi Otani</p>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2} className="lg:col-span-2">
              <p className="text-white/70 text-base leading-[2.2] font-sans">
                {tr('msg_body')}
              </p>
              <p className="mt-8 text-gold text-sm font-sans tracking-wider">{tr('msg_name')}</p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ═══ OFFICERS ═══ */}
      <section className="py-32" id="officers">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <span className="label-en">OFFICERS</span>
            <h2 className="title-ja text-3xl text-navy mb-16">{tr('officers_title')}</h2>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100">
            {[
              { pos: 'pos_ceo', name: '大谷 晃一', en: 'Koichi Otani' },
              { pos: 'pos_vp',  name: '本田 景士', en: 'Keiji Honda' },
              { pos: 'pos_md',  name: '小西 宏明', en: 'Hiroaki Konishi' },
            ].map((o, i) => (
              <AnimateIn key={o.en} delay={i * 0.15}>
                <div className="bg-white p-10 lg:p-14 text-center card-hover">
                  <div className="w-20 h-20 rounded-full bg-cream mx-auto mb-6
                                  flex items-center justify-center text-3xl border border-gray-100">
                    👤
                  </div>
                  <p className="text-[10px] text-gold tracking-widest font-sans mb-3">{tr(o.pos)}</p>
                  <h3 className="font-serif text-2xl text-navy mb-1 tracking-wide">{o.name}</h3>
                  <p className="text-xs text-stone font-sans tracking-wider">{o.en}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cream-warm">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto text-center">
          <AnimateIn>
            <Link href="/company" className="btn-navy mr-4">{tr('nav_overview')}</Link>
            <Link href="/contact" className="btn-gold">{tr('nav_contact')}</Link>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
