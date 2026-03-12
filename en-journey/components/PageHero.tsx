'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'

interface Props {
  enLabel: string
  titleKey: string
  breadcrumb: { label: string; href?: string }[]
}

export default function PageHero({ enLabel, titleKey, breadcrumb }: Props) {
  const { tr } = useLang()
  return (
    <section className="page-hero">
      {/* Deco */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #C9A227 0%, transparent 50%)' }} />

      <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label-en text-gold/70 mb-4"
        >
          {enLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif font-light text-4xl lg:text-5xl text-white tracking-wide mb-8"
        >
          {tr(titleKey)}
        </motion.h1>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 text-[11px] font-sans tracking-wider text-white/40"
        >
          <Link href="/" className="hover:text-white/70 transition-colors">HOME</Link>
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <span>/</span>
              {b.href
                ? <Link href={b.href} className="hover:text-white/70 transition-colors">{b.label}</Link>
                : <span className="text-white/60">{b.label}</span>
              }
            </span>
          ))}
        </motion.nav>
      </div>
    </section>
  )
}
