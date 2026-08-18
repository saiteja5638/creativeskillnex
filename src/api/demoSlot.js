import { API_BASE_URL, generateBearerToken } from './config'

// POST: books a demo slot for a specific course.
export const CREATE_DEMO_SLOT_URL = `${API_BASE_URL}/DEMO_SLOTS`

const token = await generateBearerToken();
/**
 * Submits a demo-slot booking.
 * date is expected pre-formatted as DD-MM-YYYY (use formatDate from ./config).
 */
export async function submitDemoSlot({
  name,
  email,
  contactNumber,
  courseName,
  date,
  day,
  timeSlot,
}) {
  const payload = {
    Name: name,
    Email: email,
    ContactNumber: contactNumber,
    CourseName: courseName,
    Date: date,
    Day: day,
    TimeSlot: timeSlot,
  }

 

  const response = await fetch(CREATE_DEMO_SLOT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      `createDemoSlot request failed (${response.status}): ${text || response.statusText}`
    )
  }

  return response.json().catch(() => null)
}
