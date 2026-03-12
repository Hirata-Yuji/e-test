'use client'
import Link from 'next/link'
import { useLang } from '@/contexts/LanguageContext'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'

export default function CompanyPage() {
  const { tr } = useLang()

  const rows = [
    { th: 'comp_name',   td: 'comp_name_v' },
    { th: 'comp_ceo',    td: 'comp_ceo_v' },
    { th: 'comp_vp',     td: 'comp_vp_v' },
    { th: 'comp_md',     td: 'comp_md_v' },
    { th: 'comp_est',    td: 'comp_est_v' },
    { th: 'comp_cap',    td: 'comp_cap_v' },
    { th: 'comp_addr',   td: 'comp_addr_v' },
    { th: 'comp_biz',    td: 'comp_biz_v' },
    { th: 'comp_parent', td: 'comp_parent_v' },
    { th: 'comp_access', td: 'comp_access_v' },
  ]

  return (
    <>
      <PageHero
        enLabel="COMPANY"
        titleKey="comp_page_title"
        breadcrumb={[
          { label: tr('nav_about'), href: '/about' },
          { label: tr('nav_overview') },
        ]}
      />

      {/* Company table */}
      <section className="py-32">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <AnimateIn>
              <span className="label-en">OVERVIEW</span>
              <h2 className="title-ja text-3xl text-navy mb-12">{tr('nav_overview')}</h2>
            </AnimateIn>

            <table className="w-full">
              <tbody>
                {rows.map((row, i) => (
                  <AnimateIn key={row.th} delay={i * 0.05} direction="none">
                    <tr className="border-b border-gray-100 group">
                      <th className="py-5 pr-8 text-left text-xs text-gold tracking-widest font-sans
                                     whitespace-nowrap w-36 align-top pt-5">
                        {tr(row.th)}
                      </th>
                      <td className="py-5 text-sm text-navy font-sans leading-relaxed">
                        {row.th === 'comp_parent' ? (
                          <a href="https://www.y-enjin.co.jp/" target="_blank" rel="noopener"
                            className="link-underline text-gold hover:text-navy transition-colors">
                            {tr(row.td)}
                          </a>
                        ) : tr(row.td)}
                      </td>
                    </tr>
                  </AnimateIn>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-cream-warm">
        <div className="px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
          <AnimateIn>
            <h2 className="title-ja text-2xl text-navy mb-8">{tr('comp_access')}</h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <div className="overflow-hidden rounded-sm shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3290.5!2d135.3618!3d33.6768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000d0e1c4e5a5a5%3A0x0!2z5Y2D6KW_55ac6YO9!5e0!3m2!1sja!2sjp"
                width="100%" height="400" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="En Journey Map" className="block"
              />
            </div>
            <p className="mt-4 text-sm text-stone font-sans">{tr('comp_access_v')}</p>
          </AnimateIn>
        </div>
      </section>

      <section className="py-16 text-center">
        <Link href="/about" className="btn-navy mr-4">{tr('nav_about')}</Link>
        <Link href="/contact" className="btn-gold">{tr('nav_contact')}</Link>
      </section>
    </>
  )
}
