'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { LANGS } from '@/lib/i18n'

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
          ${scrolled ? 'bg-white/97 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 h-[72px]">

          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className={`font-serif font-light text-xl tracking-widest transition-colors duration-300
              ${scrolled ? 'text-navy' : 'text-white'}`}>
              En Journey
            </span>
            <span className={`text-[9px] tracking-widest2 font-sans transition-colors duration-300
              ${scrolled ? 'text-stone' : 'text-white/60'}`}>
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
                <Link
                  href={item.href}
                  className={`nav-link text-[11px] tracking-widest transition-colors duration-300
                    ${scrolled ? '' : '!text-white/80 hover:!text-white'}`}
                >
                  {tr(item.key)}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDD === item.key && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48"
                    >
                      <div className="bg-white border-t-2 border-gold shadow-xl">
                        {item.children.map(c => (
                          <Link
                            key={c.key}
                            href={c.href}
                            className="block px-5 py-3 text-[11px] tracking-widest text-stone
                                       border-b border-gray-50 hover:text-navy hover:bg-cream
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
          <div className="hidden lg:flex items-center gap-6">
            {/* Language switcher */}
            <div className="flex items-center gap-1">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-[10px] px-2 py-1 tracking-wider font-sans transition-all duration-300
                    ${lang === l.code
                      ? 'bg-gold text-navy'
                      : scrolled
                        ? 'text-stone hover:text-navy'
                        : 'text-white/60 hover:text-white'
                    }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link href="/contact" className={`btn-gold text-[11px] py-2 px-6
              ${scrolled ? '' : '!border-white/60 !text-white hover:!bg-white hover:!text-navy'}`}>
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
                className={`block w-6 h-px transition-all duration-300
                  ${scrolled || menuOpen ? 'bg-navy' : 'bg-white'}
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
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-40 bg-navy flex flex-col overflow-y-auto"
          >
            <div className="px-8 pt-24 pb-16 flex flex-col gap-1">
              <Link href="/" className="py-4 text-white/60 text-xs tracking-widest border-b border-white/10"
                onClick={() => setMenuOpen(false)}>
                {tr('nav_home')}
              </Link>
              {NAV.map(item => (
                <div key={item.key}>
                  <Link href={item.href}
                    className="block py-4 text-white text-sm tracking-widest border-b border-white/10"
                    onClick={() => setMenuOpen(false)}>
                    {tr(item.key)}
                  </Link>
                  {item.children?.map(c => (
                    <Link key={c.key} href={c.href}
                      className="block py-3 pl-4 text-white/50 text-xs tracking-widest border-b border-white/5"
                      onClick={() => setMenuOpen(false)}>
                      — {tr(c.key)}
                    </Link>
                  ))}
                </div>
              ))}
              <Link href="/contact"
                className="mt-8 text-center py-4 border border-gold text-gold text-xs tracking-widest"
                onClick={() => setMenuOpen(false)}>
                {tr('nav_contact')}
              </Link>

              {/* Mobile lang switcher */}
              <div className="flex flex-wrap gap-2 mt-6">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className={`text-[11px] px-3 py-2 tracking-wider border transition-colors
                      ${lang === l.code ? 'bg-gold border-gold text-navy' : 'border-white/20 text-white/50'}`}>
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
