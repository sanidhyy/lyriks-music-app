import tzToCountry from "./tzToCountry.json";

const normalizeCountry = (value) => {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
};

const fetchJsonWithTimeout = async (url, ms = 4000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const countryFromTimezone = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return normalizeCountry(tzToCountry[tz]);
  } catch {
    return null;
  }
};

/**
 * Resolve ISO 3166-1 alpha-2 country (uppercase).
 * geojs → ipwho.is → IANA timezone map (2026c) → US
 */
export const getCountryCode = async () => {
  const geojs = await fetchJsonWithTimeout(
    "https://get.geojs.io/v1/ip/country.json"
  );
  const fromGeojs = normalizeCountry(geojs?.country);
  if (fromGeojs) return fromGeojs;

  const ipwho = await fetchJsonWithTimeout("https://ipwho.is/");
  const fromIpwho = normalizeCountry(ipwho?.country_code);
  if (fromIpwho) return fromIpwho;

  return countryFromTimezone() || "US";
};
