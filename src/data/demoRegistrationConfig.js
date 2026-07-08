// Configuration for the Demo Registration wizard.
// Field names intentionally mirror the POST /demoRegistration payload
// (NAME, CONTACTNO, EMAIL, BACKGROUND, EXPERIENCE, INTERESTEDIN,
//  MODEOFLEARNING, PREFERREDTIMINGS, MODEOFATTENDANCE, createddate).

// Education background — grouped so the dropdown stays scannable even
// with a lot of options. Streams reflect what's commonly available
// around Hyderabad.
export const BACKGROUND_GROUPS = [
  {
    label: 'B.Tech / B.E. Streams',
    options: [
      'B.Tech - Computer Science (CSE)',
      'B.Tech - Information Technology (IT)',
      'B.Tech - Electronics & Communication (ECE)',
      'B.Tech - Electrical & Electronics (EEE)',
      'B.Tech - Mechanical Engineering',
      'B.Tech - Civil Engineering',
      'B.Tech - Chemical Engineering',
      'B.Tech - Biotechnology',
      'B.Tech - Aeronautical Engineering',
    ],
  },
  {
    label: 'B.Com Streams',
    options: [
      'B.Com - General',
      'B.Com - Computers',
      'B.Com - Honours',
      'B.Com - Business Analytics',
    ],
  },
  {
    label: 'Other Backgrounds',
    options: [
      'BBA / MBA',
      'B.Sc',
      'BA',
      'Diploma / Polytechnic',
      'Intermediate / +2',
      'Other',
    ],
  },
]

// Flat list, handy for validation.
export const BACKGROUND_OPTIONS = BACKGROUND_GROUPS.flatMap((g) => g.options)

// Work experience — slider from Fresher up to 15 years.
export const EXPERIENCE_MIN = 0
export const EXPERIENCE_MAX = 15
export const EXPERIENCE_DEFAULT = 0

export function formatExperience(years) {
  if (years <= 0) return 'Fresher'
  if (years >= EXPERIENCE_MAX) return `${EXPERIENCE_MAX}+ years`
  return `${years} ${years === 1 ? 'year' : 'years'}`
}

// What the person is interested in learning.
export const INTERESTED_IN_OPTIONS = [
  {
    value: 'Coding Module',
    label: 'Coding Module',
    hint: 'Programming, software development & engineering courses',
    icon: 'code',
  },
  {
    value: 'Non-Coding Module',
    label: 'Non-Coding Module',
    hint: 'Business, design, analytics & non-programming courses',
    icon: 'people',
  },
  {
    value: 'Not Sure / Explore Both',
    label: 'Not Sure Yet',
    hint: "I'd like guidance on both",
    icon: 'compass',
  },
]

// How they'd like to learn.
export const MODE_OF_LEARNING_OPTIONS = [
  { value: 'Online', label: 'Online', hint: 'Live classes from anywhere', icon: 'globe' },
  { value: 'Offline', label: 'Offline', hint: 'In-person at our Hyderabad center', icon: 'building' },
]

// Preferred days — used together with time slots to build the
// PREFERREDTIMINGS string.
export const PREFERRED_DAY_OPTIONS = ['Weekdays', 'Saturday', 'Sunday']

// Preferred time slots — same slot list applies whichever day(s) are picked.
export const PREFERRED_TIME_SLOTS = [
  '7:00 AM',
  '9:00 AM',
  '11:00 AM',
  '1:00 PM',
  '3:00 PM',
  '6:00 PM',
  '9:00 PM',
]

// How they'd like to attend the demo session itself.
export const MODE_OF_ATTENDANCE_OPTIONS = [
  {
    value: 'Online Demo',
    label: 'Online Demo',
    hint: 'Join the demo over a video call link',
    icon: 'video',
  },
  {
    value: 'Walk-in Demo',
    label: 'Walk-in Demo',
    hint: 'Visit our Hyderabad center in person',
    icon: 'pin',
  },
]

export const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,59}$/
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
export const PHONE_PATTERN = /^[0-9+\-\s]{7,15}$/
