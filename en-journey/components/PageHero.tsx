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
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-8 w-72 h-72 rounded-full bg-crimson-pale opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-40 h-40 rounded-full bg-crimson-muted opacity-20 blur-2xl pointer-events-none" />

      <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label-en"
        >
          {enLabel}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif font-light text-4xl lg:text-5xl text-charcoal tracking-wide mb-5"
        >
          {tr(titleKey)}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="origin-left w-10 h-[2px] bg-crimson mb-6"
        />
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2 text-[11px] font-sans tracking-wider text-muted"
        >
          <Link href="/" className="hover:text-crimson transition-colors">HOME</Link>
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-crimson opacity-40">/</span>
              {b.href
                ? <Link href={b.href} className="hover:text-crimson transition-colors">{b.label}</Link>
                : <span>{b.label}</span>
              }
            </span>
          ))}
        </motion.nav>
      </div>
    </section>
  )
}
