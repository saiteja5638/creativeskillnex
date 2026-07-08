import { API_BASE_URL, formatDate } from './config'

// Points at the SAP BTP CAPM service that creates new user accounts.
export const CREATE_SIGNUP_USER_URL = `${API_BASE_URL}/createSignupUser`

/**
 * Submits a new signup entry to the createSignupUser CAPM endpoint.
 * Throws if the request fails or the service returns a non-2xx status.
 *
 * Note: only `password` is sent — `confirmPassword` is a client-side-only
 * check and never leaves the browser.
 */
export async function createSignupUser({ fullName, email, contact, password }) {
  const payload = {
    NAME: fullName,
    EMAIL: email,
    CONTACTNO: contact,
    PASSWORD: password,
    createddate: formatDate(new Date()),
  }

  const response = await fetch(CREATE_SIGNUP_USER_URL, {
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
      `createSignupUser request failed (${response.status}): ${text || response.statusText}`
    )
  }

  return response.json().catch(() => null)
}
