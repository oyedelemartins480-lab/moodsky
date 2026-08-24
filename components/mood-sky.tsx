'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock3, MapPin, Search, Wind } from 'lucide-react'

type WeatherKind = 'sunny' | 'rainy' | 'cloudy' | 'storm' | 'cold'
type Day = { day: string; date: string; kind: WeatherKind; high: number; low: number; sunsetHour: number; sunsetMinute: number }
type LocationWeather = { name: string; country?: string; timezone: string; temperature: number; feelsLike: number; humidity: number; wind: number; sunset: string; kind: WeatherKind }

const days: Day[] = [
  { day: 'Today', date: '24', kind: 'sunny', high: 29, low: 24, sunsetHour: 18, sunsetMinute: 42 },
  { day: 'Tue', date: '25', kind: 'rainy', high: 27, low: 23, sunsetHour: 18, sunsetMinute: 42 },
  { day: 'Wed', date: '26', kind: 'cloudy', high: 28, low: 23, sunsetHour: 18, sunsetMinute: 43 },
  { day: 'Thu', date: '27', kind: 'sunny', high: 30, low: 24, sunsetHour: 18, sunsetMinute: 43 },
  { day: 'Fri', date: '28', kind: 'storm', high: 26, low: 22, sunsetHour: 18, sunsetMinute: 44 },
  { day: 'Sat', date: '29', kind: 'sunny', high: 30, low: 24, sunsetHour: 18, sunsetMinute: 44 },
  { day: 'Sun', date: '30', kind: 'cloudy', high: 28, low: 23, sunsetHour: 18, sunsetMinute: 45 },
]

const copy: Record<WeatherKind, { label: string; sentence: string }> = {
  sunny: { label: 'Sunny skies', sentence: 'It’s sunny and warm — perfect for iced coffee outside.' },
  rainy: { label: 'Soft rain', sentence: 'A little rain is on the way. Cozy socks recommended.' },
  cloudy: { label: 'Cloudy', sentence: 'A calm, cloudy day. The sky is taking it easy.' },
  storm: { label: 'Stormy', sentence: 'Big weather energy today. Stay tucked in and safe.' },
  cold: { label: 'Chilly', sentence: 'Cool air is moving in. Wrap up and take it slow.' },
}

function MoodCloud({ kind, small = false }: { kind: WeatherKind; small?: boolean }) {
  return (
    <div className={`mood-cloud mood-cloud--${kind} ${small ? 'mood-cloud--small' : ''}`} role="img" aria-label={`${copy[kind].label} cloud character`}>
      {kind === 'sunny' && <span className="sunglasses" aria-hidden="true"><i /><i /><b /></span>}
      {kind === 'rainy' && <span className="umbrella">⌒</span>}
      <div className="cloud-shape"><span className="eye eye-left"><i /></span><span className="eye eye-right"><i /></span><span className="cheek cheek-left" /><span className="cheek cheek-right" /><span className="mouth" /></div>
      {kind === 'sunny' && <span className="sun-rays" aria-hidden="true"><i>✦</i><i>✦</i><i>✦</i></span>}
      {kind === 'rainy' && <span className="rain-drops">· · ·</span>}
    </div>
  )
}

export function MoodSky() {
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState('Lagos, Nigeria')
  const [timezone, setTimezone] = useState('Africa/Lagos')
  const [now, setNow] = useState<Date | null>(null)
  const [locationWeather, setLocationWeather] = useState<LocationWeather | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const current = days[selected]

  async function searchLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const city = query.trim()
    if (!city || isSearching) return
    setIsSearching(true)
    setSearchError('')
    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
      if (!geoResponse.ok) throw new Error('Unable to find that place')
      const geoData = await geoResponse.json()
      const result = geoData.results?.[0]
      if (!result) throw new Error('Location not found')
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=sunset&timezone=auto&forecast_days=1`)
      if (!weatherResponse.ok) throw new Error('Unable to load weather')
      const weather = await weatherResponse.json()
      const code = weather.current?.weather_code ?? 0
      const kind: WeatherKind = code >= 95 ? 'storm' : code >= 51 ? 'rainy' : code >= 1 && code <= 3 ? 'cloudy' : 'sunny'
      setLocationWeather({
        name: result.name,
        country: result.country,
        timezone: result.timezone,
        temperature: Math.round(weather.current.temperature_2m),
        feelsLike: Math.round(weather.current.apparent_temperature),
        humidity: Math.round(weather.current.relative_humidity_2m),
        wind: Math.round(weather.current.wind_speed_10m),
        sunset: weather.daily.sunset[0],
        kind,
      })
      setTimezone(result.timezone)
      setSelected(0)
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const timeFormatter = useMemo(() => new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', minute: '2-digit' }), [timezone])
  const sunsetDate = locationWeather ? new Date(locationWeather.sunset) : new Date(2026, 7, Number(current.date), current.sunsetHour, current.sunsetMinute)
  const sunsetTime = useMemo(() => timeFormatter.format(sunsetDate), [sunsetDate, timeFormatter])
  const timezoneLabel = locationWeather ? `${locationWeather.name} · ${locationWeather.timezone}` : timezone === 'Africa/Lagos' ? 'Lagos · GMT+1' : timezone === 'America/New_York' ? 'New York · ET' : timezone === 'Europe/London' ? 'London · GMT' : 'Tokyo · GMT+9'
  const details = copy[locationWeather?.kind ?? current.kind]
  const displayedName = locationWeather ? `${locationWeather.name}${locationWeather.country ? `, ${locationWeather.country}` : ''}` : query || 'Lagos, Nigeria'
  const displayedKind = locationWeather?.kind ?? current.kind
  const displayedTemperature = locationWeather?.temperature ?? current.high
  const displayedFeelsLike = locationWeather?.feelsLike ?? current.high - 1
  const displayedHumidity = locationWeather?.humidity ?? 78
  const displayedWind = locationWeather?.wind ?? 12
  const formattedDate = useMemo(() => new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(sunsetDate), [sunsetDate])

  return (
    <main className={`mood-app mood-app--${displayedKind}`}>
      <div className="mood-wrap">
        <header className="topbar">
          <div className="brand"><span className="brand-mark">M</span><span>MoodSky</span></div>
          <div className="location"><MapPin size={15} strokeWidth={2.5} /><span>{displayedName}</span></div>
          <div className="local-time"><Clock3 size={14} aria-hidden="true" /><time dateTime={now?.toISOString()}>{now ? timeFormatter.format(now) : '—:—'}</time><label className="sr-only" htmlFor="timezone">Choose timezone</label><select id="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}><option value="Africa/Lagos">Lagos (GMT+1)</option><option value="America/New_York">New York (ET)</option><option value="Europe/London">London (GMT)</option><option value="Asia/Tokyo">Tokyo (GMT+9)</option></select></div>
          <form className="search-box" onSubmit={searchLocation} aria-busy={isSearching}>
            <Search size={16} aria-hidden="true" /><label className="sr-only" htmlFor="city">Search city</label><input id="city" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a city" /><button type="submit" aria-label="Search"><ArrowRight size={16} /></button>
          </form>
        </header>

        <section className="hero" aria-labelledby="weather-heading">
          <div className="date-label">{formattedDate}</div>
          <div className="hero-cloud"><MoodCloud kind={displayedKind} /></div>
          <div className="weather-copy"><p className="eyebrow">Good morning, {locationWeather?.name ?? 'Lagos'}</p><h1 id="weather-heading">{displayedTemperature}°</h1><p className="condition">{details.label} <span aria-hidden="true">·</span> Feels like {displayedFeelsLike}°</p><p className="sentence">{details.sentence}</p></div>
          <div className="metrics"><div><Wind size={17} /><span>Wind</span><strong>{displayedWind} km/h</strong></div><div><span className="humidity-dot" /><span>Humidity</span><strong>{displayedHumidity}%</strong></div><div><span className="sunset-dot" /><span>Sunset</span><strong>{sunsetTime}</strong></div></div>
        </section>

        <section className="forecast-section" aria-labelledby="forecast-heading"><div className="section-heading"><div><p className="eyebrow">The week ahead</p><h2 id="forecast-heading">Your sky, at a glance</h2></div><div className="arrows"><button aria-label="Previous day" onClick={() => setSelected(Math.max(0, selected - 1))}><ArrowLeft size={17} /></button><button aria-label="Next day" onClick={() => setSelected(Math.min(days.length - 1, selected + 1))}><ArrowRight size={17} /></button></div></div><div className="forecast-strip">{days.map((day, index) => <button key={day.date} className={`day-card ${index === selected ? 'day-card--selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={index === selected}><span className="day-name">{day.day}</span><span className="day-date">{day.date}</span><MoodCloud kind={day.kind} small /><span className="temps"><b>{day.high}°</b><span>{day.low}°</span></span></button>)}</div></section>
        <footer><span>© Built by Mars</span><span className="footer-note">{timezoneLabel}</span></footer>
      </div>
    </main>
  )
}

export default MoodSky
