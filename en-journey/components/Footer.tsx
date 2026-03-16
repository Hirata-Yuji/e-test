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
      { key: 'nav_bustour',  href: '/service#bustour' },
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
    <footer className="bg-white border-t border-warm-200">
      {/* Top crimson bar */}
      <div className="h-[3px] bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light" />

      <div className="px-6 md:px-12 lg:px-24 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12 pb-12 border-b border-warm-200">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex flex-col mb-5 gap-1">
              <Logo size="md" />
              <span className="text-[9px] tracking-widest text-muted font-sans">株式会社エンジャーニー</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4 font-sans whitespace-pre-line">
              {tr('footer_desc')}
            </p>
            <p className="text-xs text-muted-light leading-loose font-sans whitespace-pre-line">
              {tr('footer_addr')}
            </p>
          </div>

          {/* Nav cols */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLS.map(col => (
              <div key={col.titleKey}>
                <h4 className="text-[10px] tracking-widest text-crimson font-sans uppercase mb-4">
                  {tr(col.titleKey)}
                </h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map(l => (
                    <li key={l.key}>
                      <Link href={l.href}
                        className="text-xs text-muted hover:text-crimson tracking-wider font-sans
                                   transition-colors duration-200 link-underline">
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
          <p className="text-[11px] text-muted-light font-sans tracking-wider">
            {tr('footer_copy')} All Rights Reserved.
          </p>
          <div className="flex items-center gap-1">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`text-[10px] px-2 py-1 tracking-wider font-sans transition-all duration-200
                  ${lang === l.code ? 'bg-crimson text-white' : 'text-muted hover:text-crimson'}`}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
