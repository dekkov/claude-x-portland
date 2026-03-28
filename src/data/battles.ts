import type { BattlePair } from "./battle-types"

// Army emoji per neighborhood — defines what troops each neighborhood sends
export const NEIGHBORHOOD_ARMIES: Record<string, string> = {
  downtown: "\uD83D\uDCBC",           // briefcase
  "east-portland": "\uD83D\uDC26\u200D\u2B1B", // crow
  boise: "\uD83D\uDCDA",              // books
  buckman: "\uD83D\uDC83",            // dancer
  "hosford-abernethy": "\uD83C\uDFB8", // guitar
  lloyd: "\uD83D\uDED2",              // shopping cart
  pearl: "\u2615",                     // coffee
  "sellwood-moreland": "\uD83E\uDDA4", // flamingo
  "nw-industrial": "\uD83D\uDD27",    // wrench
  "st-johns": "\uD83E\uDDCC",         // troll
  "foster-powell": "\uD83D\uDC7D",    // alien
  alberta: "\uD83C\uDFA8",            // art palette
  hawthorne: "\uD83C\uDF3B",          // sunflower
  mississippi: "\uD83C\uDFB6",        // music notes
  irvington: "\uD83C\uDFDB\uFE0F",   // classical building
  kenton: "\uD83E\uDD84",             // unicorn
  montavilla: "\uD83C\uDF7A",         // beer
  sunnyside: "\u2600\uFE0F",          // sun
  woodstock: "\uD83C\uDFB5",          // music note
  overlook: "\uD83C\uDF05",           // sunset
  cully: "\uD83C\uDF3E",              // rice
  lents: "\uD83C\uDF31",              // seedling
  "goose-hollow": "\u26BD",           // soccer
  northwest: "\uD83D\uDED2",          // cart
  "old-town": "\uD83C\uDFEE",        // lantern
  "mt-tabor": "\uD83C\uDF0B",        // volcano
  brooklyn: "\uD83D\uDE82",           // train
  "cathedral-park": "\u26EA",         // church
  laurelhurst: "\uD83E\uDDA2",        // swan
  eliot: "\uD83C\uDFAA",             // circus
}

export const BATTLE_PAIRS: readonly BattlePair[] = [
  {
    neighborhoodA: "downtown",
    neighborhoodB: "pearl",
    conflictReason: "Dispute over who has more overpriced coffee per square foot",
    armyEmojiA: "\uD83D\uDCBC",
    armyEmojiB: "\u2615",
  },
  {
    neighborhoodA: "boise",
    neighborhoodB: "lloyd",
    conflictReason: "Cultural authenticity vs convention center parking lots",
    armyEmojiA: "\uD83D\uDCDA",
    armyEmojiB: "\uD83D\uDED2",
  },
  {
    neighborhoodA: "st-johns",
    neighborhoodB: "nw-industrial",
    conflictReason: "Bridge aesthetics vs industrial stink rights",
    armyEmojiA: "\uD83E\uDDCC",
    armyEmojiB: "\uD83D\uDD27",
  },
  {
    neighborhoodA: "east-portland",
    neighborhoodB: "sellwood-moreland",
    conflictReason: "Crow sovereignty negotiations broke down",
    armyEmojiA: "\uD83D\uDC26\u200D\u2B1B",
    armyEmojiB: "\uD83E\uDDA4",
  },
  {
    neighborhoodA: "foster-powell",
    neighborhoodB: "hosford-abernethy",
    conflictReason: "The mystery smell has been traced to YOUR side",
    armyEmojiA: "\uD83D\uDC7D",
    armyEmojiB: "\uD83C\uDFB8",
  },
  {
    neighborhoodA: "buckman",
    neighborhoodB: "downtown",
    conflictReason: "Drag brunch supremacy — there can be only one",
    armyEmojiA: "\uD83D\uDC83",
    armyEmojiB: "\uD83D\uDCBC",
  },
  {
    neighborhoodA: "alberta",
    neighborhoodB: "mississippi",
    conflictReason: "Street fair rivalry escalated to actual warfare",
    armyEmojiA: "\uD83C\uDFA8",
    armyEmojiB: "\uD83C\uDFB6",
  },
  {
    neighborhoodA: "hawthorne",
    neighborhoodB: "buckman",
    conflictReason: "Vintage shop territorial dispute",
    armyEmojiA: "\uD83C\uDF3B",
    armyEmojiB: "\uD83D\uDC83",
  },
  {
    neighborhoodA: "kenton",
    neighborhoodB: "overlook",
    conflictReason: "Paul Bunyan statue custody battle",
    armyEmojiA: "\uD83E\uDD84",
    armyEmojiB: "\uD83C\uDF05",
  },
  {
    neighborhoodA: "montavilla",
    neighborhoodB: "mt-tabor",
    conflictReason: "Hiking trail access rights and beer garden zoning",
    armyEmojiA: "\uD83C\uDF7A",
    armyEmojiB: "\uD83C\uDF0B",
  },
  {
    neighborhoodA: "pearl",
    neighborhoodB: "old-town",
    conflictReason: "Gentrification border skirmish",
    armyEmojiA: "\u2615",
    armyEmojiB: "\uD83C\uDFEE",
  },
  {
    neighborhoodA: "sellwood-moreland",
    neighborhoodB: "brooklyn",
    conflictReason: "Antique shop turf war crossed the railroad tracks",
    armyEmojiA: "\uD83E\uDDA4",
    armyEmojiB: "\uD83D\uDE82",
  },
  {
    neighborhoodA: "irvington",
    neighborhoodB: "eliot",
    conflictReason: "Historic home association vs mural artists",
    armyEmojiA: "\uD83C\uDFDB\uFE0F",
    armyEmojiB: "\uD83C\uDFAA",
  },
  {
    neighborhoodA: "goose-hollow",
    neighborhoodB: "northwest",
    conflictReason: "Soccer fans vs brunch crowd — a Sunday showdown",
    armyEmojiA: "\u26BD",
    armyEmojiB: "\uD83D\uDED2",
  },
  {
    neighborhoodA: "cully",
    neighborhoodB: "concordia",
    conflictReason: "Community garden expansion treaty violated",
    armyEmojiA: "\uD83C\uDF3E",
    armyEmojiB: "\uD83C\uDFA8",
  },
]

export const APPROVAL_OPTIONS = [
  "Yes",
  "Of course",
  "Approve",
  "Definitely",
  "LET THEM FIGHT",
  "Why not?",
  "I was born for this",
  "Democracy has spoken",
] as const

export const FALLBACK_COMMENTARIES = [
  "In a stunning display of neighborhood pride, troops clashed at the border. The victors celebrated with locally sourced artisanal victory speeches.",
  "The battle was fierce, the casualties mostly emotional. Witnesses report seeing dropped kombucha bottles and abandoned fixie bikes across the battlefield.",
  "Military historians will remember this as Portland's most aggressively passive-aggressive conflict. The winning army politely asked the losers to leave, then wrote a Yelp review about it.",
  "After a brief but intense skirmish, one neighborhood emerged victorious. The losing side has retreated to their favorite coffee shop to process their feelings.",
  "The conflict lasted approximately 47 seconds before both sides agreed to a ceasefire for a pop-up taco stand that appeared at the midpoint. The war resumed after lunch.",
] as const
