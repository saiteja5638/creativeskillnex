import { API_BASE_URL, formatDate, generateBearerToken } from './config'

// Points at the SAP BTP CAPM service endpoint that creates a demo
// registration entry.
export const DEMO_REGISTRATION_URL = `${API_BASE_URL}/demoRegistration`
const token = await generateBearerToken();

/**
 * Submits a demo registration to the demoRegistration CAPM endpoint.
 * Throws if the request fails or the service returns a non-2xx status.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} [params.contactNo]
 * @param {string} params.email
 * @param {string} params.background
 * @param {string} params.experience
 * @param {string} params.interestedIn
 * @param {string} params.modeOfLearning
 * @param {string} params.preferredTimings
 * @param {string} params.modeOfAttendance
 */
export async function submitDemoRegistration({
  name,
  contactNo,
  email,
  background,
  experience,
  interestedIn,
  modeOfLearning,
  preferredTimings,
  modeOfAttendance,
}) {
  const payload = {
    NAME: name,
    CONTACTNO: contactNo || '',
    EMAIL: email,
    BACKGROUND: background,
    EXPERIENCE: experience,
    INTERESTEDIN: interestedIn,
    MODEOFLEARNING: modeOfLearning,
    PREFERREDTIMINGS: preferredTimings,
    MODEOFATTENDANCE: modeOfAttendance,
    createddate: formatDate(new Date()),
  }

  const response = await fetch(DEMO_REGISTRATION_URL, {
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
      `demoRegistration request failed (${response.status}): ${text || response.statusText}`
    )
  }

  return response.json().catch(() => null)
}
