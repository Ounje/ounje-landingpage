const DAYS_OF_WEEK = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const parseTime = (str: string | null | undefined): number | null => {
  if (!str || typeof str !== "string") return null;

  const trimmed = str.trim();

  // 12-hour format: "9:30 AM", "12:30 AM", "1:30 PM" etc.
  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hh = parseInt(amPmMatch[1], 10);
    const mm = parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3].toUpperCase();

    if (isNaN(hh) || isNaN(mm) || hh < 1 || hh > 12 || mm < 0 || mm > 59)
      return null;

    if (period === "AM") {
      if (hh === 12) hh = 0; // 12:xx AM → 00:xx
    } else {
      if (hh !== 12) hh += 12; // 1:xx PM → 13:xx, but 12:xx PM stays 12:xx
    }

    return hh * 60 + mm;
  }

  // 24-hour format: "09:30", "22:00"
  const h24Match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (h24Match) {
    const hh = parseInt(h24Match[1], 10);
    const mm = parseInt(h24Match[2], 10);
    if (isNaN(hh) || isNaN(mm) || hh > 23 || mm > 59) return null;
    return hh * 60 + mm;
  }

  return null;
};

export const checkVendorStatus = (vendor: any): { isOpen: boolean; reason: string } => {
  const storeDetails = vendor.storeDetails?.[0] || {};
  
  // Status check
  // Detail endpoint spreads and deletes storeDetails, returning:
  // - isOnline (storeDetail.status === "active")
  // - servicesOffered
  // - timePeriod
  // - preorderPeriods
  // Browse page returns raw storeDetails array.
  
  const status = vendor.isOnline !== undefined
    ? (vendor.isOnline ? "active" : "deactivated")
    : (storeDetails.status || "pending");

  if (status !== "active") {
    return {
      isOpen: false,
      reason: "This vendor is currently offline and not accepting orders.",
    };
  }

  const servicesOffered = vendor.servicesOffered || storeDetails.servicesOffered || "InstantMeals";
  const timePeriod = vendor.timePeriod || storeDetails.timePeriod || [];
  const preorderPeriods = vendor.preorderPeriods || storeDetails.preorderPeriods || [];

  // Shift current time to WAT (UTC+1)
  const nowUTC = new Date();
  const nowWAT = new Date(nowUTC.getTime() + 60 * 60 * 1000);
  const nowMinutes = nowWAT.getUTCHours() * 60 + nowWAT.getUTCMinutes();
  const todayName = DAYS_OF_WEEK[nowWAT.getUTCDay()];

  // ── preOrderMeals ────────────
  if (servicesOffered === "preOrderMeals") {
    if (!preorderPeriods || preorderPeriods.length === 0) {
      return {
        isOpen: false,
        reason: "This vendor has not configured their preorder windows yet.",
      };
    }

    const isOpen = preorderPeriods.some((entry: any) => {
      if (!entry.orderingTime) return false;
      const open = parseTime(entry.orderingTime);
      if (open === null) return false;
      return nowMinutes >= open;
    });

    if (isOpen) {
      return { isOpen: true, reason: "" };
    }

    const windows = preorderPeriods
      .map((p: any) => `${p.period} (opens at ${p.orderingTime})`)
      .join(", ");
    return {
      isOpen: false,
      reason: `Ordering is currently closed. Preorder windows: ${windows}.`,
    };
  }

  // ── InstantMeals / hybridMeals ────────────────────────────────────────────
  if (!timePeriod || timePeriod.length === 0) {
    return {
      isOpen: false,
      reason: "This vendor has not set their operating hours yet.",
    };
  }

  const todayEntry = timePeriod.find(
    (t: any) => t.day?.toLowerCase() === todayName
  );
  if (!todayEntry) {
    const capitalised = todayName.charAt(0).toUpperCase() + todayName.slice(1);
    return {
      isOpen: false,
      reason: `This vendor is closed on ${capitalised}s.`,
    };
  }

  const open = parseTime(todayEntry.openingHour);
  const close = parseTime(todayEntry.closingHour);
  if (open === null || close === null) {
    return {
      isOpen: false,
      reason: "Invalid operating hours schedule.",
    };
  }

  let isOpen = false;
  if (close < open) {
    // Overnight schedule e.g. 22:00 -> 02:00
    isOpen = nowMinutes >= open || nowMinutes < close;
  } else {
    isOpen = nowMinutes >= open && nowMinutes < close;
  }

  if (isOpen) {
    return { isOpen: true, reason: "" };
  }

  return {
    isOpen: false,
    reason: `This vendor is currently closed. Operating hours today: ${todayEntry.openingHour} – ${todayEntry.closingHour}.`,
  };
};
