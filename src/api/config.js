// Base URL for the SAP BTP CAPM service. Update this in one place if the
// deployed service URL ever changes — everything else derives from it.
export const API_BASE_URL =
  'https://1b01bd4dtrial-dev-creativeskillnexus-capm-srv.cfapps.us10-001.hana.ondemand.com/catalog'

// Formats a Date as DD-MM-YYYY to match the CAPM service's expected format.
export function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}
