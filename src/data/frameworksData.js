// Illustrative trend data used to power the "Trending Frameworks" chart.
// Values represent a relative interest index (0-100), not live analytics.

export const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

const palette = [
  '#7c5cff', // violet
  '#22d3ee', // cyan
  '#ffb454', // amber
  '#ff6fb0', // pink
  '#34d399', // emerald
  '#60a5fa', // blue
  '#fb7185', // rose
  '#a3e635', // lime
]

function series(values) {
  return months.map((m, i) => ({ month: m, value: values[i] }))
}

export const categories = [
  {
    id: 'technical',
    label: 'Technical',
    description: 'Coding-first roles across full-stack, cloud & AI.',
    items: [
      { name: 'SAP BTP Full Stack', color: palette[0], data: series([58, 64, 70, 76, 83, 90]) },
      { name: 'SAP UI5', color: palette[1], data: series([50, 54, 58, 60, 63, 67]) },
      { name: 'React', color: palette[2], data: series([70, 74, 78, 82, 87, 92]) },
      { name: 'Java Full Stack', color: palette[3], data: series([62, 63, 66, 68, 71, 74]) },
      { name: 'Python Full Stack', color: palette[4], data: series([65, 70, 74, 79, 84, 89]) },
      { name: 'GEN-AI', color: palette[5], data: series([40, 52, 63, 75, 85, 96]) },
      { name: 'Data Science', color: palette[6], data: series([60, 63, 67, 70, 74, 78]) },
      { name: 'AI', color: palette[7], data: series([55, 64, 72, 80, 88, 95]) },
    ],
  },
  {
    id: 'technical-noncoding',
    label: 'Technical (Non-Coding)',
    description: 'Hands-on technical roles that don\u2019t require writing code.',
    items: [
      { name: 'SAP MM', color: palette[0], data: series([48, 50, 52, 55, 57, 60]) },
      { name: 'SAP SD', color: palette[1], data: series([46, 48, 51, 53, 56, 58]) },
      { name: 'Manual Testing', color: palette[2], data: series([52, 53, 54, 55, 56, 57]) },
      { name: 'Automation Testing', color: palette[3], data: series([58, 62, 66, 70, 74, 79]) },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    description: 'Core finance, audit & analysis tracks.',
    items: [
      { name: 'SAP FICO', color: palette[0], data: series([55, 58, 60, 63, 66, 69]) },
      { name: 'Auditing', color: palette[1], data: series([50, 51, 53, 54, 56, 58]) },
      { name: 'ERP Planning', color: palette[2], data: series([47, 49, 52, 55, 58, 61]) },
      { name: 'Business Analyst', color: palette[3], data: series([60, 63, 66, 69, 73, 77]) },
    ],
  },
  {
    id: 'hr',
    label: 'HR',
    description: 'Talent, recruitment & people operations.',
    items: [
      { name: 'US-IT Recruiter', color: palette[0], data: series([54, 57, 60, 62, 65, 68]) },
      { name: 'HR', color: palette[1], data: series([50, 51, 52, 54, 55, 57]) },
      { name: 'Talent Acquisition', color: palette[2], data: series([52, 55, 58, 61, 64, 67]) },
    ],
  },
  {
    id: 'electrical',
    label: 'Electrical',
    description: 'Chip design and embedded systems.',
    items: [
      { name: 'VLSI', color: palette[0], data: series([45, 48, 51, 55, 59, 63]) },
      { name: 'Embedded Systems', color: palette[1], data: series([53, 56, 60, 64, 68, 72]) },
    ],
  },
]
