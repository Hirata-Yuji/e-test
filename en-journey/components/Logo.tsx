import Image from 'next/image'

interface Props {
  white?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 180, height: 60 },
  md: { width: 160, height: 54 },
  lg: { width: 220, height: 74 },
}

export default function Logo({ size = 'md' }: Props) {
  const { width, height } = sizeMap[size]

  return (
    <Image
      src="/logo.png"
      alt="En Journey"
      width={width}
      height={height}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
