'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

const POSITIONS = [
  {
    titleKey: 'pos1',
    rows_ja: [
      ['仕事内容', '国内外旅行の企画・手配・旅行代理店との折衝業務'],
      ['雇用形態', '正社員・契約社員'],
      ['勤務地', '和歌山県西牟婁郡白浜町（本社）'],
      ['必要スキル', '旅行業経験優遇・英語力あれば尚可'],
    ],
    rows_en: [
      ['Role', 'Planning & arranging domestic/overseas travel, liaising with agencies'],
      ['Employment', 'Full-time / Contract'],
      ['Location', 'Shirahama, Wakayama (HQ)'],
      ['Skills', 'Travel industry experience preferred; English a plus'],
    ],
  },
  {
    titleKey: 'pos2',
    rows_ja: [
      ['仕事内容', '訪日外国人の対応・旅行手配・観光案内'],
      ['雇用形態', '正社員・アルバイト・パート'],
      ['勤務地', '和歌山県西牟婁郡白浜町（本社）'],
      ['必要スキル', '英語・中国語・タイ語・韓国語いずれか歓迎'],
    ],
    rows_en: [
      ['Role', 'Assisting inbound visitors, travel arrangements, guiding'],
      ['Employment', 'Full-time / Part-time'],
      ['Location', 'Shirahama, Wakayama (HQ)'],
      ['Skills', 'English, Chinese, Thai, or Korean language skills welcome'],
    ],
  },
  {
    titleKey: 'pos3',
    rows_ja: [
      ['仕事内容', '旅行代理店・海外エージェントからの現地手配・コーディネート'],
      ['雇用形態', '正社員・契約社員'],
      ['勤務地', '和歌山県西牟婁郡白浜町（本社）'],
      ['必要スキル', '観光業・旅行業の経験者歓迎'],
    ],
    rows_en: [
      ['Role', 'Local coordination for domestic and overseas travel agencies'],
      ['Employment', 'Full-time / Contract'],
      ['Location', 'Shirahama, Wakayama (HQ)'],
      ['Skills', 'Tourism or travel industry experience preferred'],
    ],
  },
]

const FLOW = ['step1', 'step2', 'step3', 'step4']

const BENEFITS_JA = ['社会保険完備', '交通費支給', '年次有給休暇', '旅行優待制度', '研修・スキルアップ支援', '5言語対応の国際的な職場環境']
const BENEFITS_EN = ['Social insurance', 'Transportation allowance', 'Annual paid leave', 'Travel discount program', 'Training & skill development', 'International 5-language workplace']

export default function RecruitPage() {
  const { tr, lang } = useLang()
  return (
    <>
      <PageHero enLabel="RECRUIT" titleKey="rec_page_title" breadcrumb={[{ label: tr('nav_recruit') }]} />

      {/* Hero message */}
      <section className="py-32 bg-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/recruit-hero.jpg" alt="recruit"
            className="w-full h-full object-cover object-center opacity-30" />
        </div>
        <div className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 60%, #C9A227 0%, transparent 50%)' }} />
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10 max-w-2xl">
          <AnimateIn>
            <span className="label-en text-gold/60">MESSAGE</span>
            <h2 className="title-ja text-4xl lg:text-5xl text-white mb-8">{tr('rec_msg')}</h2>
            <span className="block w-12 h-px bg-gold mb-8" />
            <p className="text-white/60 text-base leading-loose font-sans">{tr('rec_sub')}</p>
          </AnimateIn>
        </div>
      </section>

      {/* Positions */}
      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <span className="label-en">POSITIONS</span>
            <h2 className="title-ja text-3xl text-navy mb-16">
              {lang === 'ja' ? '募集職種' : 'Open Positions'}
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-100">
            {POSITIONS.map((pos, i) => (
              <AnimateIn key={pos.titleKey} delay={i * 0.1}>
                <div className="bg-white p-8 lg:p-10 h-full">
                  <span className="text-[10px] text-gold tracking-widest font-sans">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-xl text-navy mt-2 mb-6">{tr(pos.titleKey)}</h3>
                  <table className="w-full">
                    <tbody>
                      {(lang === 'ja' ? pos.rows_ja : pos.rows_en).map(([th, td]) => (
                        <tr key={th} className="border-b border-gray-50">
                          <th className="py-3 text-left text-[10px] text-gold tracking-wider font-sans w-24 align-top">{th}</th>
                          <td className="py-3 text-xs text-stone font-sans leading-relaxed">{td}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 bg-cream-warm">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <span className="label-en">BENEFITS</span>
            <h2 className="title-ja text-3xl text-navy mb-12">
              {lang === 'ja' ? '福利厚生' : 'Benefits'}
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(lang === 'ja' ? BENEFITS_JA : BENEFITS_EN).map((b, i) => (
              <AnimateIn key={i} delay={i * 0.08}>
                <div className="p-6 bg-white border-l-2 border-gold/30 hover:border-gold transition-colors">
                  <span className="text-gold text-xs tracking-wider">✦</span>
                  <p className="text-sm text-navy font-sans mt-2">{b}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring flow */}
      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <span className="label-en">FLOW</span>
            <h2 className="title-ja text-3xl text-navy mb-16">{tr('flow_title')}</h2>
          </AnimateIn>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
            {FLOW.map((step, i) => (
              <AnimateIn key={step} delay={i * 0.1} className="flex items-center">
                <div className="text-center px-8 py-6 border border-gray-200 min-w-[140px]">
                  <span className="text-[10px] text-gold tracking-widest font-sans block mb-2">STEP {String(i+1).padStart(2,'0')}</span>
                  <p className="text-sm text-navy font-sans">{tr(step)}</p>
                </div>
                {i < FLOW.length - 1 && (
                  <span className="text-gold mx-2 hidden sm:block">→</span>
                )}
              </AnimateIn>
            ))}
          </div>

          <div className="text-center mt-16">
            <AnimateIn>
              <Link href="/contact" className="btn-gold">{tr('rec_msg')}</Link>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  )
}
