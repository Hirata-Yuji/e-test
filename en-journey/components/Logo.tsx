import Image from 'next/image'

interface Props {
  white?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Heights in px match the previous text-based logo sizes (text-xl / text-2xl / text-4xl)
// Width is kept at 'auto' so the SVG's native 600:140 aspect ratio is preserved.
const heightMap: Record<NonNullable<Props['size']>, number> = {
  sm: 20,
  md: 24,
  lg: 36,
}

export default function Logo({ white = false, size = 'md' }: Props) {
  const h = heightMap[size]
  return (
    <Image
      src="/logo-dark.svg"
      alt="En Jouney"
      width={600}
      height={140}
      style={{ height: h, width: 'auto' }}
      className={white ? 'brightness-0 invert' : ''}
      priority
    />
  )
}
