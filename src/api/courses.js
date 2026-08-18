import { API_BASE_URL, generateBearerToken } from './config'

export const COURSES_URL = `${API_BASE_URL}/Courses`
export const COURSES_HIERARCHY_URL = `${API_BASE_URL}/CoursesHirarchy()`
const token = await generateBearerToken();


async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Request to ${url} failed (${response.status}): ${text || response.statusText}`)
  }

  const data = await response.json().catch(() => null)
  // CAP OData responses are usually wrapped as { value: [...] }; plain
  // arrays are also supported so this works either way.
  return Array.isArray(data) ? data : data?.value ?? []
}

/** Fetches the flat list of courses shown on the Courses page. */
export function fetchCourses() {
  return getJson(COURSES_URL)
}

/**
 * Fetches the full CoursesHirarchy dataset (hierarchy + pricing per course).
 * The service returns every course's hierarchy, so we filter client-side
 * by NAME to get the one the user clicked into.
 */
export async function fetchCourseHierarchyByName(courseName) {
  const StringData = await getJson(COURSES_HIERARCHY_URL)

  let all = JSON.parse(StringData)


  const normalized = courseName.trim().toLowerCase()
  const matches = all.filter(
    (item) => (item.NAME || '').trim().toLowerCase() === normalized
  )
  return matches[0] || null
}