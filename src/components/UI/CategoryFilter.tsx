import { useAppState } from "../../context/AppContext"

export function CategoryFilter() {
  const { categories, activeCategories, toggleCategory } = useAppState()

  return (
    <div
      style={{
        position: "fixed",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 8,
        zIndex: 100,
        padding: "8px 12px",
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(12px)",
        borderRadius: 24,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {categories.map((cat) => {
        const isActive = activeCategories.has(cat.id)
        return (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 16,
              border: `2px solid ${cat.color}`,
              background: isActive ? cat.color : "transparent",
              color: isActive ? "white" : cat.color,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 700,
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
