// Configuration for the AI Course Finder wizard.
//
// IMPORTANT — assumptions flagged for confirmation:
// - `background` enum values (IT / NonIT / Fresher) and the "Coding" trait
//   codes (Patience, Creativity, ProblemSolving) are confirmed by the sample
//   payload you shared. The trait codes for the other four interest areas
//   (NonCoding, Finance, Designing, Security) are my best guess following
//   the same pattern — swap them out here if the real API expects different
//   codes, no need to touch the wizard component itself.

export const BACKGROUND_OPTIONS = [
  { value: 'IT', label: 'IT background', icon: 'code' },
  { value: 'NonIT', label: 'Non-IT background', icon: 'briefcase' },
  { value: 'Fresher', label: 'Student / fresher', icon: 'cap' },
]

export const INTEREST_AREA_OPTIONS = [
  { value: 'Coding', label: 'Coding', icon: 'image' },
  { value: 'NonCoding', label: 'Non-coding', icon: 'people' },
  { value: 'Finance', label: 'Finance', icon: 'bars' },
  { value: 'Designing', label: 'Designing', icon: 'palette' },
  { value: 'Security', label: 'Security', icon: 'shield' },
]

// Each interest area shows exactly 3 trait sliders (matches the sample
// payload's traitScores length). Every score is 1-5.
export const TRAITS_BY_INTEREST_AREA = {
  Coding: [
    { trait: 'Patience', label: 'Patience with trial and error' },
    { trait: 'Creativity', label: 'Enjoys creative problem solving with code' },
    { trait: 'ProblemSolving', label: 'Comfortable breaking big problems into steps' },
  ],
  NonCoding: [
    { trait: 'Patience', label: 'Patience with repetitive, detailed work' },
    { trait: 'Communication', label: 'Enjoys explaining things to others' },
    { trait: 'Organization', label: 'Comfort managing structured processes' },
  ],
  Finance: [
    { trait: 'ComfortWithNumbers', label: 'Comfort with numbers' },
    { trait: 'Patience', label: 'Patience with detailed reconciliation work' },
    { trait: 'Analytical', label: 'Enjoys analyzing data and trends' },
  ],
  Designing: [
    { trait: 'Creativity', label: 'Enjoys creating visual designs' },
    { trait: 'AttentionToDetail', label: 'Attention to visual detail' },
    { trait: 'Patience', label: 'Patience with iterative feedback' },
  ],
  Security: [
    { trait: 'ProblemSolving', label: 'Enjoys solving security puzzles' },
    { trait: 'Focus', label: 'Sustained focus on monitoring tasks' },
    { trait: 'Patience', label: 'Patience investigating root causes' },
  ],
}

export const TRAIT_SCORE_MIN = 1
export const TRAIT_SCORE_MAX = 5
export const TRAIT_SCORE_DEFAULT = 3

export const WEEKLY_HOURS_MIN = 1
export const WEEKLY_HOURS_MAX = 40
export const WEEKLY_HOURS_DEFAULT = 8

export const TOP_N_MIN = 1
export const TOP_N_MAX = 5
export const TOP_N_DEFAULT = 3

export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 60
// Letters, spaces, apostrophes and hyphens only.
export const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,59}$/

// Loose but useful checks — good enough to catch typos, not meant to be a
// full RFC-grade validator.
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
export const PHONE_PATTERN = /^[0-9+\-\s]{7,15}$/
