'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

const SERVICES = [
  {
    id: 'domestic', num: '01', emoji: '🗾',
    tagKey: 'nav_domestic', titleKey: 'svc1_title', bodyKey: 'svc1_body',
    points: ['南紀白浜・熊野古道など和歌山の観光手配', '宿泊・バス・レンタカー・アクティビティの一括手配', '旅行代理店向け卸販売・ランドサービス', '個人・グループ・法人ツアーに対応'],
    points_en: ['Shirahama & Kumano Kodo sightseeing arrangements', 'One-stop booking: accommodation, buses, car rental, activities', 'Wholesale services for travel agencies', 'Individual, group, and corporate tours'],
    color: 'from-[#1B6CA8] to-[#0A3B5C]',
    img: '/e-test/images/service-domestic.jpg',
  },
  {
    id: 'overseas', num: '02', emoji: '✈️',
    tagKey: 'nav_overseas', titleKey: 'svc2_title', bodyKey: 'svc2_body',
    points: ['アジア・欧米・オセアニアへのパッケージツアー', '法人視察旅行・インセンティブツアーの企画', 'ハネムーン・記念旅行のコーディネート', '航空券・ホテル・オプショナルツアーの手配'],
    points_en: ['Package tours to Asia, Europe & Oceania', 'Corporate incentive trips & study tours', 'Honeymoon & anniversary trip planning', 'Flights, hotels & optional tour arrangements'],
    color: 'from-[#0A1628] to-[#1A2E4A]',
    img: '/e-test/images/service-overseas.jpg',
  },
  {
    id: 'inbound', num: '03', emoji: '🌏',
    tagKey: 'nav_inbound', titleKey: 'svc3_title', bodyKey: 'svc3_body',
    points: ['5言語対応（日本語・英語・中国語・タイ語・韓国語）', '南紀白浜・熊野古道エリアの観光案内', '外国人旅行者向け宿泊・交通手配', '海外エージェント・OTA向け素材提供'],
    points_en: ['5-language support (JP/EN/ZH/TH/KO)', 'Guided sightseeing in Shirahama & Kumano', 'Accommodation & transport for inbound visitors', 'Travel content for overseas agents & OTAs'],
    color: 'from-[#C9A227] to-[#A8831A]',
    img: '/e-test/images/service-inbound.jpg',
  },
  {
    id: 'landop', num: '04', emoji: '🏨',
    tagKey: 'nav_landop', titleKey: 'svc4_title', bodyKey: 'svc4_body',
    points: ['宿泊・バス・送迎・ガイドの一括手配', '国内旅行代理店・海外エージェントへの対応', '多言語ガイドの手配・同行', '南紀白浜・熊野エリアを中心としたランドサービス'],
    points_en: ['One-stop local coordination: accommodation, buses, guides', 'Support for domestic agencies and overseas agents', 'Multilingual guide arrangements', 'Land services centered on Shirahama & Kumano'],
    color: 'from-[#2E5C3F] to-[#1A3A28]',
    img: '/e-test/images/service-landop.jpg',
  },
]

export default function ServicePage() {
  const { tr, lang } = useLang()
  return (
    <>
      <PageHero enLabel="SERVICE" titleKey="svc_page_title" breadcrumb={[{ label: tr('nav_service') }]} />

      {/* Jump nav */}
      <div className="sticky top-[72px] z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="px-6 md:px-12 lg:px-24 flex gap-6 overflow-x-auto py-4">
          {SERVICES.map(s => (
            <a key={s.id} href={`#${s.id}`}
               className="text-[11px] tracking-widest text-stone hover:text-gold whitespace-nowrap
                          font-sans transition-colors duration-300 link-underline shrink-0">
              {tr(s.tagKey)}
            </a>
          ))}
        </div>
      </div>

      {SERVICES.map((s, i) => (
        <section
          key={s.id} id={s.id}
          className={`py-32 ${i % 2 === 1 ? 'bg-cream-warm' : ''}`}
        >
          <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center
                             ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>

              {/* Visual */}
              <AnimateIn direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="aspect-[4/3] rounded-sm overflow-hidden relative">
                  <img src={s.img} alt={s.id}
                    className="w-full h-full object-cover object-center" />
                  <div className="absolute top-6 left-6">
                    <span className="text-white/40 font-sans text-6xl font-light drop-shadow">{s.num}</span>
                  </div>
                </div>
              </AnimateIn>

              {/* Text */}
              <AnimateIn direction={i % 2 === 0 ? 'right' : 'left'} delay={0.15}>
                <span className="label-en">{tr(s.tagKey)}</span>
                <h2 className="title-ja text-3xl lg:text-4xl text-navy mb-6">{tr(s.titleKey)}</h2>
                <span className="accent-line" />
                <p className="text-stone text-sm leading-loose font-sans mb-8">{tr(s.bodyKey)}</p>
                <ul className="flex flex-col gap-3">
                  {(lang === 'ja' ? s.points : s.points_en).map((p, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-navy/80 font-sans">
                      <span className="text-gold mt-1 shrink-0 text-xs">✦</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </AnimateIn>
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 text-center bg-navy">
        <div className="px-6">
          <AnimateIn>
            <p className="text-white/50 text-sm font-sans mb-8 tracking-wider">
              {lang === 'ja' ? 'ご不明な点はお気軽にお問い合わせください' : 'Contact us for any questions about our services'}
            </p>
            <Link href="/contact" className="btn-white">{tr('nav_contact')}</Link>
          </AnimateIn>
        </div>
      </section>
    </>
  )
}
