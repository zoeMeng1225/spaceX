// Every N2YO request goes through /n2yo. A small proxy forwards it to
// https://api.n2yo.com/rest/v1/satellite and adds the API key on the server,
// so the key never ships to the browser.
//   Local dev:        src/setupProxy.js
//   Cloudflare Pages: functions/n2yo/[[path]].js
export const NEARBY_SATELLITE_URL = "/n2yo/above";
export const SATELLITE_POSITION_URL = "/n2yo/positions";

// N2YO category 52 = Starlink
export const STARLINK_CATEGORY = 52;

// N2YO returns at most 300 seconds (one position per second) per request.
export const MAX_TRACK_SECONDS = 300;
