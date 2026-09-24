export const CURRENCY_RATES = {
  INR: {
    code: "INR",
    symbol: "₹",
    country: "India",
    monthlyPrice: 499,
    annualPrice: 3999,
    label: "INR (₹) - India"
  },
  USD: {
    code: "USD",
    symbol: "$",
    country: "United States / Global",
    monthlyPrice: 19,
    annualPrice: 149,
    label: "USD ($) - United States / Global"
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    country: "Eurozone",
    monthlyPrice: 18,
    annualPrice: 139,
    label: "EUR (€) - European Union"
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    country: "United Kingdom",
    monthlyPrice: 15,
    annualPrice: 119,
    label: "GBP (£) - United Kingdom"
  },
  CAD: {
    code: "CAD",
    symbol: "CA$",
    country: "Canada",
    monthlyPrice: 24,
    annualPrice: 189,
    label: "CAD (CA$) - Canada"
  },
  AUD: {
    code: "AUD",
    symbol: "A$",
    country: "Australia",
    monthlyPrice: 28,
    annualPrice: 219,
    label: "AUD (A$) - Australia"
  }
};

/**
 * Fallback currency detection based on Browser Timezone & Language
 */
export const detectCurrencyFromTimezone = () => {
  try {
    const timezone = String(Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    const lang = String(navigator.language || "").toLowerCase();

    if (timezone.includes("kolkata") || timezone.includes("calcutta") || lang.endsWith("-in")) {
      return CURRENCY_RATES.INR;
    }
    if (timezone.includes("london") || lang.endsWith("-gb")) {
      return CURRENCY_RATES.GBP;
    }
    if (timezone.includes("europe") || timezone.includes("paris") || timezone.includes("berlin")) {
      return CURRENCY_RATES.EUR;
    }
    if (timezone.includes("toronto") || timezone.includes("vancouver") || lang.endsWith("-ca")) {
      return CURRENCY_RATES.CAD;
    }
    if (timezone.includes("sydney") || timezone.includes("melbourne") || lang.endsWith("-au")) {
      return CURRENCY_RATES.AUD;
    }
  } catch {
    // Fallthrough to USD
  }
  return CURRENCY_RATES.USD;
};

/**
 * Geolocation Permission-based location detection
 */
export const detectCurrencyFromGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const fallback = detectCurrencyFromTimezone();
      return resolve({ currency: fallback, method: "timezone", message: "Geolocation not supported by browser. Selected default location." });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // India Bounding Box Check (Approx Lat 6° to 37° N, Long 68° to 97° E)
        if (latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
          return resolve({ currency: CURRENCY_RATES.INR, method: "geolocation", country: "India" });
        }

        // Europe Bounding Box Check (Approx Lat 35° to 70° N, Long -10° to 32° E)
        if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 32) {
          if (longitude >= -10 && longitude <= 2) {
            return resolve({ currency: CURRENCY_RATES.GBP, method: "geolocation", country: "United Kingdom" });
          }
          return resolve({ currency: CURRENCY_RATES.EUR, method: "geolocation", country: "Eurozone" });
        }

        // Canada Bounding Box Check (Approx Lat 41° to 83° N, Long -141° to -52° W)
        if (latitude >= 41 && latitude <= 83 && longitude >= -141 && longitude <= -52) {
          return resolve({ currency: CURRENCY_RATES.CAD, method: "geolocation", country: "Canada" });
        }

        // Australia Bounding Box Check (Approx Lat -44° to -10° S, Long 112° to 154° E)
        if (latitude >= -44 && latitude <= -10 && longitude >= 112 && longitude <= 154) {
          return resolve({ currency: CURRENCY_RATES.AUD, method: "geolocation", country: "Australia" });
        }

        // Fallback to timezone or USD
        const fallback = detectCurrencyFromTimezone();
        resolve({ currency: fallback, method: "geolocation", country: fallback.country });
      },
      (error) => {
        console.warn("[Location] Geolocation permission error or denied:", error?.message);
        const fallback = detectCurrencyFromTimezone();
        reject({ currency: fallback, error: error?.message || "Location permission denied" });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
};

export const formatCurrencyAmount = (amount, currencyCode = "USD") => {
  const rate = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.USD;
  return `${rate.symbol}${Number(amount).toLocaleString()}`;
};
