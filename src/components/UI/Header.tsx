import { ModeToggle } from "./ModeToggle"
import { useBattle } from "../../context/BattleContext"

export function Header() {
  const { pendingBattle, activeBattle, triggerRandomBattle } = useBattle()
  const battleBusy = !!(pendingBattle || activeBattle)

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        background: "linear-gradient(135deg, var(--header-from), var(--header-to))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 20px",
      }}
    >
      <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)" }}>
        <button
          className={`battle-trigger ${!battleBusy ? "battle-trigger-pulse" : ""}`}
          onClick={triggerRandomBattle}
          disabled={battleBusy}
          title="Start a neighborhood war"
        >
          {"\u2694\uFE0F"}
        </button>
      </div>

      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Portland's Internal Monologue
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            marginTop: 2,
          }}
        >
          March 28, 2026 — What's the city thinking?
        </p>
      </div>

      <div style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)" }}>
        <ModeToggle />
      </div>
    </header>
  )
}
