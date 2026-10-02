import type { FormEvent } from "react"
import { BattleForm } from "./components/BattleForm"
import { ErrorBanner } from "./components/ErrorBanner"
import { PresetRow } from "./components/PresetRow"
import { Scoreboard } from "./components/Scoreboard"
import { TopBar } from "./components/TopBar"
import { useBattle } from "./hooks/useBattle"

function App() {
  const {
    leftUser,
    rightUser,
    setLeftUser,
    setRightUser,
    result,
    error,
    loading,
    startBattle,
  } = useBattle("torvalds", "dan-abramov")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void startBattle(leftUser, rightUser)
  }

  const handlePreset = (left: string, right: string) => {
    setLeftUser(left)
    setRightUser(right)
    void startBattle(left, right)
  }

  return (
    <main className="relative z-[1] mx-auto w-[min(1080px,calc(100%-32px))] py-9 pb-18">
      <TopBar />

      <BattleForm
        leftUser={leftUser}
        rightUser={rightUser}
        loading={loading}
        onLeftChange={setLeftUser}
        onRightChange={setRightUser}
        onSubmit={handleSubmit}
      />

      <PresetRow onSelect={handlePreset} />

      {error && <ErrorBanner message={error} />}

      {result && <Scoreboard result={result} />}
    </main>
  )
}

export default App
