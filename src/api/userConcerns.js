import { API_BASE_URL, formatDate } from './config'

// Points at the SAP BTP CAPM service that stores contact-form submissions.
export const USER_CONCERNS_URL = `${API_BASE_URL}/UserConcerns`

/**
 * Submits a contact-form entry to the UserConcerns CAPM endpoint.
 * Throws if the request fails or the service returns a non-2xx status.
 */
export async function submitUserConcern({ name, contact, email, concern }) {
  const payload = {
    NAME: name,
    CONTACTNO: contact || '',
    EMAIL: email,
    CONCERN: concern,
    createddate: formatDate(new Date()),
  }

  const response = await fetch(USER_CONCERNS_URL, {
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
      `UserConcerns request failed (${response.status}): ${text || response.statusText}`
    )
  }

  return response.json().catch(() => null)
}
