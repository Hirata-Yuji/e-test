'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import { LANGS } from '@/lib/i18n'
import Logo from '@/components/Logo'

const COLS = [
  {
    titleKey: 'nav_about',
    links: [
      { key: 'nav_phil',     href: '/about#philosophy' },
      { key: 'nav_officers', href: '/about#officers' },
      { key: 'nav_overview', href: '/company' },
    ],
  },
  {
    titleKey: 'nav_service',
    links: [
      { key: 'nav_domestic', href: '/service#domestic' },
      { key: 'nav_overseas', href: '/service#overseas' },
      { key: 'nav_inbound',  href: '/service#inbound' },
      { key: 'nav_landop',   href: '/service#landop' },
    ],
  },
  {
    titleKey: 'nav_recruit',
    links: [
      { key: 'nav_recruit', href: '/recruit' },
      { key: 'nav_contact', href: '/contact' },
      { key: 'nav_news',    href: '/news' },
    ],
  },
]

export default function Footer() {
  const { lang, setLang, tr } = useLang()

  return (
    <footer className="bg-navy text-white">
      <div className="px-6 md:px-12 lg:px-24 pt-20 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col mb-6 gap-1">
              <Logo white size="md" />
              <span className="text-[10px] tracking-widest text-white/40 font-sans">株式会社エンジャーニー</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-4 font-sans whitespace-pre-line">
              {tr('footer_desc')}
            </p>
            <p className="text-xs text-white/40 leading-loose font-sans whitespace-pre-line">
              {tr('footer_addr')}
            </p>
          </div>

          {/* Nav cols */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLS.map(col => (
              <div key={col.titleKey}>
                <h4 className="text-[10px] tracking-widest2 text-gold font-sans mb-4">
                  {tr(col.titleKey).toUpperCase()}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map(l => (
                    <li key={l.key}>
                      <Link href={l.href}
                        className="text-xs text-white/50 hover:text-white tracking-wider font-sans
                                   transition-colors duration-300 link-underline">
                        {tr(l.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/30 font-sans tracking-wider">
            {tr('footer_copy')} All Rights Reserved.
          </p>

          {/* Language switcher */}
          <div className="flex items-center gap-1">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-[10px] px-2 py-1 tracking-wider font-sans transition-all duration-300
                  ${lang === l.code ? 'bg-gold text-navy' : 'text-white/40 hover:text-white'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
