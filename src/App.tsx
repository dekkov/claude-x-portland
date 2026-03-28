import { AppProvider } from "./context/AppContext"
import { MapContainer } from "./components/Map/MapContainer"
import { Header } from "./components/UI/Header"
import { CategoryFilter } from "./components/UI/CategoryFilter"
import { CityTicker } from "./components/UI/CityTicker"

function App() {
  return (
    <AppProvider>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Header />
        <MapContainer />
        <CategoryFilter />
        <CityTicker />
      </div>
    </AppProvider>
  )
}

export default App
