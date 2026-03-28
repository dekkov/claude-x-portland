export interface BattlePair {
  readonly neighborhoodA: string // neighborhood ID
  readonly neighborhoodB: string
  readonly conflictReason: string
  readonly armyEmojiA: string
  readonly armyEmojiB: string
}

export type BattleState = "pending" | "approved" | "marching" | "colliding" | "resolved"

export interface Battle {
  readonly id: string
  readonly pair: BattlePair
  readonly state: BattleState
  readonly winner?: string
  readonly commentary?: string
  readonly route?: GeoJSON.LineString
}

export interface BattleResult {
  readonly battleId: string
  readonly winner: string
  readonly loser: string
  readonly commentary: string
  readonly pair: BattlePair
}
