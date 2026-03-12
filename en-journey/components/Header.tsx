'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { LANGS } from '@/lib/i18n'
import Logo from '@/components/Logo'

const NAV = [
  {
    key: 'nav_about',
    href: '/about',
    children: [
      { key: 'nav_phil',     href: '/about#philosophy' },
      { key: 'nav_officers', href: '/about#officers' },
      { key: 'nav_overview', href: '/company' },
    ],
  },
  {
    key: 'nav_service',
    href: '/service',
    children: [
      { key: 'nav_domestic', href: '/service#domestic' },
      { key: 'nav_overseas', href: '/service#overseas' },
      { key: 'nav_inbound',  href: '/service#inbound' },
      { key: 'nav_landop',   href: '/service#landop' },
    ],
  },
  { key: 'nav_news',    href: '/news' },
  { key: 'nav_recruit', href: '/recruit' },
]

export default function Header() {
  const { lang, setLang, tr } = useLang()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [activeDD,  setActiveDD]  = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'bg-white/98 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white/90 backdrop-blur-sm'
          }`}
      >
        {/* Crimson top bar */}
        <div className="h-[3px] bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light" />

        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 h-16">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none gap-0.5">
            <Logo size="sm" />
            <span className="text-[8px] tracking-widest font-sans text-muted">
              株式会社エンジャーニー
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map(item => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.children && setActiveDD(item.key)}
                onMouseLeave={() => setActiveDD(null)}
              >
                <Link href={item.href} className="nav-link text-[11px]">
                  {tr(item.key)}
                </Link>

                <AnimatePresence>
                  {item.children && activeDD === item.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-52"
                    >
                      <div className="bg-white border-t-2 border-crimson shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
                        {item.children.map(c => (
                          <Link
                            key={c.key}
                            href={c.href}
                            className="block px-5 py-3 text-[11px] tracking-widest text-muted
                                       border-b border-warm-100
                                       hover:text-crimson hover:bg-crimson-pale
                                       transition-colors duration-200"
                            onClick={() => setActiveDD(null)}
                          >
                            {tr(c.key)}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right: Lang + Contact */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-1">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-[10px] px-2 py-1 tracking-wider font-sans transition-all duration-200
                    ${lang === l.code
                      ? 'bg-crimson text-white'
                      : 'text-muted hover:text-crimson'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link href="/contact" className="btn-crimson text-[11px] py-2 px-5">
              {tr('nav_contact')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2"
            aria-label="menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i}
                className={`block w-6 h-px bg-charcoal transition-all duration-300
                  ${menuOpen && i === 0 ? 'translate-y-[7px] rotate-45' : ''}
                  ${menuOpen && i === 1 ? 'opacity-0' : ''}
                  ${menuOpen && i === 2 ? '-translate-y-[7px] -rotate-45' : ''}
                `}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white flex flex-col overflow-y-auto"
          >
            <div className="h-[3px] bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light" />
            <div className="px-8 pt-20 pb-16 flex flex-col gap-1">
              <Link href="/" className="py-4 text-muted text-xs tracking-widest border-b border-warm-100"
                onClick={() => setMenuOpen(false)}>
                {tr('nav_home')}
              </Link>
              {NAV.map(item => (
                <div key={item.key}>
                  <Link href={item.href}
                    className="block py-4 text-charcoal text-sm tracking-widest border-b border-warm-100"
                    onClick={() => setMenuOpen(false)}>
                    {tr(item.key)}
                  </Link>
                  {item.children?.map(c => (
                    <Link key={c.key} href={c.href}
                      className="block py-3 pl-4 text-muted text-xs tracking-widest border-b border-warm-50"
                      onClick={() => setMenuOpen(false)}>
                      — {tr(c.key)}
                    </Link>
                  ))}
                </div>
              ))}
              <Link href="/contact"
                className="mt-8 text-center py-4 border-2 border-crimson text-crimson text-xs tracking-widest
                           hover:bg-crimson hover:text-white transition-colors duration-200"
                onClick={() => setMenuOpen(false)}>
                {tr('nav_contact')}
              </Link>
              <div className="flex flex-wrap gap-2 mt-6">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className={`text-[11px] px-3 py-2 tracking-wider border transition-colors
                      ${lang === l.code ? 'bg-crimson border-crimson text-white' : 'border-warm-200 text-muted'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
