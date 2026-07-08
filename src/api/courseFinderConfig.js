import { API_BASE_URL } from './config'

export const FIND_RIGHT_COURSE_URL = `${API_BASE_URL}/findRightCourse`

/**
 * Calls the AI course-matching endpoint.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {'IT'|'NonIT'|'Student'} params.background
 * @param {'Coding'|'NonCoding'|'Finance'|'Designing'|'Security'} params.interestArea
 * @param {number} params.weeklyHoursAvailable
 * @param {{trait: string, score: number}[]} params.traitScores
 * @param {number} [params.topN]
 */
export async function findRightCourse({
  name,
  background,
  interestArea,
  weeklyHoursAvailable,
  traitScores,
  topN = 3,
}) {
  const payload = {
    input: {
      name,
      background,
      interestArea,
      weeklyHoursAvailable,
      traitScores,
    },
    topN,
  }

  const response = await fetch(FIND_RIGHT_COURSE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      `findRightCourse request failed (${response.status}): ${text || response.statusText}`
    )
  }

  return response.json().catch(() => null)
}
