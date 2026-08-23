export const formatCurrencyINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export const exportToCSV = (filename: string, data: Record<string, any>[]) => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Add header row
  csvRows.push(headers.map(header => `"${header.replace(/"/g, '""')}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateId = (prefix: string = 'item'): string => {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Government Polytechnic Campus Geofence Reference
export const CAMPUS_COORDINATES = {
  name: 'Government Polytechnic (राजकीय पॉलिटेक्निक)',
  latitude: 25.86472,
  longitude: 84.22153,
  radiusMeters: 50 // Strict 50-meter campus boundary
};

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula (in meters)
 */
export const calculateDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number = CAMPUS_COORDINATES.latitude,
  lon2: number = CAMPUS_COORDINATES.longitude
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
};

/**
 * Returns array of days for a given month (1 to 28/30/31) with weekday name and Sunday check
 */
export const getDaysInMonthDetails = (year: number, monthZeroIndexed: number) => {
  const date = new Date(year, monthZeroIndexed, 1);
  const days: { dayNumber: number; dateStr: string; dayName: string; isSunday: boolean }[] = [];

  while (date.getMonth() === monthZeroIndexed) {
    const dayNumber = date.getDate();
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isSunday = date.getDay() === 0;
    const dateStr = `${year}-${String(monthZeroIndexed + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

    days.push({ dayNumber, dateStr, dayName, isSunday });
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export const generateReceiptNumber = (): string => {
  const rand = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `GPB/FEE/${year}/${rand}`;
};

/**
 * Bank & IFSC Database Lookup
 */
export interface IfscLookupResult {
  valid: boolean;
  bankName: string;
  branch: string;
  city: string;
  district: string;
  state: string;
  micr?: string;
}

const IFSC_DATABASE: Record<string, { bankName: string; branch: string; city: string; district: string }> = {
  SBIN0001234: { bankName: 'State Bank of India', branch: 'Govt Treasury Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  SBIN0004412: { bankName: 'State Bank of India', branch: 'Main Branch', city: '', district: 'Uttar Pradesh' },
  SBIN0000019: { bankName: 'State Bank of India', branch: 'Uttar Pradesh Sadar Main', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  PUNB0182900: { bankName: 'Punjab National Bank', branch: 'Collectorate Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  PUNB0002100: { bankName: 'Punjab National Bank', branch: ' Market', city: '', district: 'Uttar Pradesh' },
  BARB0: { bankName: 'Bank of Baroda', branch: 'Civil Lines Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  BARB0BANSDE: { bankName: 'Bank of Baroda', branch: 'Main Branch', city: '', district: 'Uttar Pradesh' },
  UBIN0558490: { bankName: 'Union Bank of India', branch: 'Main Branch Branch', city: '', district: 'Uttar Pradesh' },
  UBIN0538920: { bankName: 'Union Bank of India', branch: 'Uttar Pradesh Chowk', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  CNRB0001482: { bankName: 'Canara Bank', branch: 'Uttar Pradesh Sadar Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  HDFC0001829: { bankName: 'HDFC Bank', branch: 'Civil Lines, Uttar Pradesh', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  ICIC0002109: { bankName: 'ICICI Bank', branch: 'Station Road, Uttar Pradesh', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  UTIB0001420: { bankName: 'Axis Bank', branch: 'Uttar Pradesh City Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  KKBK0005120: { bankName: 'Kotak Mahindra Bank', branch: 'Uttar Pradesh Main', city: 'Uttar Pradesh', district: 'Uttar Pradesh' },
  CBIN0281920: { bankName: 'Central Bank of India', branch: ' Branch', city: '', district: 'Uttar Pradesh' },
  IDIB000B029: { bankName: 'Indian Bank', branch: 'Uttar Pradesh Main Branch', city: 'Uttar Pradesh', district: 'Uttar Pradesh' }
};

const BANK_PREFIX_MAP: Record<string, string> = {
  SBIN: 'State Bank of India',
  PUNB: 'Punjab National Bank',
  BARB: 'Bank of Baroda',
  UBIN: 'Union Bank of India',
  CNRB: 'Canara Bank',
  HDFC: 'HDFC Bank',
  ICIC: 'ICICI Bank',
  UTIB: 'Axis Bank',
  KKBK: 'Kotak Mahindra Bank',
  CBIN: 'Central Bank of India',
  IDIB: 'Indian Bank',
  BKID: 'Bank of India',
  IOBA: 'Indian Overseas Bank',
  MAHB: 'Bank of Maharashtra',
  UCBA: 'UCO Bank',
  PSIB: 'Punjab & Sind Bank'
};

export const lookupIfscDetails = (ifscCode: string): IfscLookupResult => {
  const code = (ifscCode || '').trim().toUpperCase();
  if (code.length !== 11) {
    return { valid: false, bankName: '', branch: '', city: '', district: '', state: '' };
  }

  // Exact match from database
  if (IFSC_DATABASE[code]) {
    const d = IFSC_DATABASE[code];
    return {
      valid: true,
      bankName: d.bankName,
      branch: d.branch,
      city: d.city,
      district: d.district,
      state: 'Uttar Pradesh'
    };
  }

  // Prefix match
  const prefix = code.substring(0, 4);
  const bankName = BANK_PREFIX_MAP[prefix] || 'Commercial Bank (NPCI Registered)';
  return {
    valid: true,
    bankName,
    branch: `Branch Code: ${code.substring(6)} (Uttar Pradesh/UP Zone)`,
    city: 'Uttar Pradesh',
    district: 'Uttar Pradesh',
    state: 'Uttar Pradesh'
  };
};

export const verifyBankAccountOnline = async (accountNumber: string, ifscCode: string) => {
  const cleanAcc = (accountNumber || '').trim();
  const ifscInfo = lookupIfscDetails(ifscCode);

  if (!cleanAcc || cleanAcc.length < 9 || cleanAcc.length > 18) {
    return {
      verified: false,
      message: 'Account number must be between 9 and 18 digits.'
    };
  }

  if (!ifscInfo.valid) {
    return {
      verified: false,
      message: 'Invalid 11-digit IFSC code format.'
    };
  }

  // Simulating instant Penny-Drop / NPCI Banking Gateway Verification
  await new Promise(r => setTimeout(r, 450));

  return {
    verified: true,
    bankName: ifscInfo.bankName,
    branch: ifscInfo.branch,
    ifscCode: ifscCode.toUpperCase(),
    accountType: cleanAcc.length > 13 ? 'Savings / Salary Account' : 'Institutional Current Account',
    status: 'ACTIVE_VERIFIED',
    gatewayRef: `NPCI-VER-${Date.now().toString(36).toUpperCase()}`
  };
};

/**
 * Generates dynamic UPI payment deep-link / QR payload
 */
export const generateUpiPaymentUrl = (
  vpa: string,
  payeeName: string,
  amount?: number,
  transactionNote: string = 'Government Polytechnic Treasury Deposit'
): string => {
  let url = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;
  if (amount && amount > 0) {
    url += `&am=${amount.toFixed(2)}`;
  }
  return url;
};
