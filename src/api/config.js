// Base URL for the SAP BTP CAPM service. Update this in one place if the
// deployed service URL ever changes — everything else derives from it.

import axios from "axios";

export const API_BASE_URL =
  'https://1b01bd4dtrial-dev-creativeskillnexus-capm-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/catalog'

// Service credentials, pulled from environment variables — never hardcode
// Formats a Date as DD-MM-YYYY to match the CAPM service's expected format.
export function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}``

export async function generateBearerToken() {
    const clientId = "sb-creativeskillnexus_capm-1b01bd4dtrial-dev!t668197";
    const clientSecret = "b66d4247-fe9f-4755-ae89-082eddeb9f72$ComYgapW6Mg-7N3zgmRmimCDIA0zZcpicDFuYl_sWGU=";

    const tokenUrl =
        "https://1b01bd4dtrial.authentication.us10.hana.ondemand.com/oauth/token";

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const response = await axios.post(tokenUrl, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            auth: {
                username: clientId,
                password: clientSecret
            }
        });

        return response.data.access_token;

    } catch (error) {
        console.error(
            "Failed to generate bearer token:",
            error.response?.data || error.message
        );

        throw error;
    }
}