type Props = {
  title: string
  subtitle?: string
  image: string
  align?: 'left' | 'center'
}

export default function PageHero({ title, subtitle, image, align = 'left' }: Props) {
  return (
    <section className="relative pt-24">
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/40" />
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{title}</h1>
            {subtitle && <p className="mt-4 text-lg text-primary-100">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
