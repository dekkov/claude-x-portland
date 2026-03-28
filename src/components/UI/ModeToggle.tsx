import { useAppState } from "../../context/AppContext"

export function ModeToggle() {
  const { mode, toggleMode } = useAppState()
  const isUnhinged = mode === "unhinged"

  return (
    <button
      onClick={toggleMode}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.2)",
        background: isUnhinged
          ? "rgba(132, 204, 22, 0.15)"
          : "rgba(255, 255, 255, 0.1)",
        color: isUnhinged ? "#BEF264" : "var(--text-primary)",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 700,
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ opacity: isUnhinged ? 0.5 : 1 }}>Sane</span>
      <span
        style={{
          width: 32,
          height: 18,
          borderRadius: 9,
          background: isUnhinged ? "#84CC16" : "rgba(255,255,255,0.3)",
          position: "relative",
          transition: "background 0.2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: isUnhinged ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s ease",
          }}
        />
      </span>
      <span style={{ opacity: isUnhinged ? 1 : 0.5 }}>Unhinged</span>
    </button>
  )
}
