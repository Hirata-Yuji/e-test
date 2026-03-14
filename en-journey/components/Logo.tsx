interface Props {
  white?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { text: 'text-xl',  ring: 'w-[0.60em] h-[0.60em] border-[0.10em]' },
  md: { text: 'text-2xl', ring: 'w-[0.60em] h-[0.60em] border-[0.10em]' },
  lg: { text: 'text-4xl', ring: 'w-[0.60em] h-[0.60em] border-[0.12em]' },
}

export default function Logo({ white = false, size = 'md' }: Props) {
  const color = white ? 'text-white' : 'text-[#231815]'
  const { text, ring } = sizeMap[size]

  return (
    <span
      className={`inline-flex items-center leading-none tracking-tight select-none ${text}`}
      style={{ fontFamily: "'Nunito', 'Helvetica Neue', Arial, sans-serif", fontWeight: 800 }}
    >
      <span className={color}>En J</span>
      <span
        className={`inline-block rounded-full flex-shrink-0 mx-[0.03em] ${ring}`}
        style={{ borderColor: '#9B3A52', marginBottom: '0.03em' }}
        aria-hidden="true"
      />
      <span className={color}>uney</span>
    </span>
  )
}
