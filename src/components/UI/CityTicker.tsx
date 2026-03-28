import { useMonologue } from "../../hooks/useMonologue"

export function CityTicker() {
  const { text, isLoading } = useMonologue()

  return (
    <div className="city-ticker">
      <span className="ticker-label">Portland is thinking...</span>
      <div className="ticker-track">
        {isLoading ? (
          <span className="ticker-text ticker-loading">...</span>
        ) : (
          <span className="ticker-text">{text}</span>
        )}
      </div>
    </div>
  )
}
