import { AppProvider } from "./context/AppContext"
import { BattleProvider } from "./context/BattleContext"
import { MapContainer } from "./components/Map/MapContainer"
import { Header } from "./components/UI/Header"
import { CategoryFilter } from "./components/UI/CategoryFilter"
import { CityTicker } from "./components/UI/CityTicker"

function App() {
  return (
    <AppProvider>
      <BattleProvider>
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <Header />
          <MapContainer />
          <CategoryFilter />
          <CityTicker />
        </div>
      </BattleProvider>
    </AppProvider>
  )
}

export default App
