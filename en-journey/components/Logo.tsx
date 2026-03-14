import Image from 'next/image'

interface Props {
  white?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { width: 120, height: 40 },
  md: { width: 160, height: 54 },
  lg: { width: 220, height: 74 },
}

export default function Logo({ size = 'md' }: Props) {
  const { width, height } = sizeMap[size]

  return (
    <Image
      src="/e-test/logo.png"
      alt="En Journey"
      width={width}
      height={height}
      style={{ objectFit: 'contain' }}
      priority
    />
  )
}
