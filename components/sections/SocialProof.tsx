import React from 'react'

const CLIENTS = [
  { name: 'Rations', weight: 'font-black' },
  { name: 'DEMO BISTRO', weight: 'font-light tracking-[0.2em]' },
  { name: 'The Pearl', weight: 'font-serif italic font-bold' },
  { name: 'KASADA', weight: 'font-mono font-bold' },
  { name: 'Bistro 24', weight: 'font-display tracking-tight' }
]

export function SocialProof({ sponsors = [], allowFallback = false }: { sponsors?: any[]; allowFallback?: boolean }) {
  const isProd = process.env.NODE_ENV === 'production'
  const canFallback = !isProd || allowFallback
  if (!canFallback && sponsors.length === 0) return null

  const displaySponsors = sponsors.length > 0 ? sponsors : CLIENTS
  const useMarquee = displaySponsors.length >= 6
  const marqueeDurationSeconds = Math.max(18, displaySponsors.length * 4)

  return (
    <section className="bg-[var(--color-bg)] py-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <h2 className="text-xl lg:text-2xl font-display text-[var(--color-text)] max-w-sm text-center lg:text-left leading-tight">
            Trusted by leading restaurants and cafes across the country
          </h2>
          
          {useMarquee ? (
            <div
              className="cevop-marquee opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 w-full lg:w-auto"
              style={{ ['--marquee-duration' as any]: `${marqueeDurationSeconds}s` }}
            >
              <div className="cevop-marquee-track flex items-center gap-x-12 gap-y-8">
                {displaySponsors.map((client, idx) => (
                  <div
                    key={`a-${client.name}-${idx}`}
                    className={`text-xl lg:text-2xl text-[var(--color-text)] ${client.font_weight || client.weight || ''} whitespace-nowrap flex items-center justify-center`}
                  >
                    {client.logo_url ? (
                      <img src={client.logo_url} alt={client.name} className="h-8 lg:h-10 w-auto object-contain" />
                    ) : (
                      client.name
                    )}
                  </div>
                ))}
                {displaySponsors.map((client, idx) => (
                  <div
                    key={`b-${client.name}-${idx}`}
                    aria-hidden="true"
                    className={`text-xl lg:text-2xl text-[var(--color-text)] ${client.font_weight || client.weight || ''} whitespace-nowrap flex items-center justify-center`}
                  >
                    {client.logo_url ? (
                      <img src={client.logo_url} alt="" className="h-8 lg:h-10 w-auto object-contain" />
                    ) : (
                      client.name
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {displaySponsors.map((client, idx) => (
                <div
                  key={client.name + idx}
                  className={`text-xl lg:text-2xl text-[var(--color-text)] ${client.font_weight || client.weight || ''} whitespace-nowrap flex items-center justify-center`}
                >
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="h-8 lg:h-10 w-auto object-contain" />
                  ) : (
                    client.name
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
