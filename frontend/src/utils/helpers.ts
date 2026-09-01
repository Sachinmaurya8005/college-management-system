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

export interface BankOption {
  code: string;
  name: string;
  category: 'indian_public' | 'indian_private' | 'foreign_intl' | 'treasury_rural';
  country: string;
  countryFlag: string;
  ifscPrefix: string;
  swiftCode?: string;
  popular?: boolean;
}

export const COMPREHENSIVE_BANK_LIST: BankOption[] = [
  // --- Indian Public Sector Banks ---
  { code: 'SBI', name: 'State Bank of India (SBI)', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'SBIN', popular: true },
  { code: 'PNB', name: 'Punjab National Bank (PNB)', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'PUNB', popular: true },
  { code: 'BOB', name: 'Bank of Baroda', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'BARB', popular: true },
  { code: 'CANARA', name: 'Canara Bank', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'CNRB', popular: true },
  { code: 'UNION', name: 'Union Bank of India', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'UBIN', popular: true },
  { code: 'BOI', name: 'Bank of India', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'BKID' },
  { code: 'INDIAN', name: 'Indian Bank', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'IDIB' },
  { code: 'CBI', name: 'Central Bank of India', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'CBIN' },
  { code: 'IOB', name: 'Indian Overseas Bank', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'IOBA' },
  { code: 'UCO', name: 'UCO Bank', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'UCBA' },
  { code: 'MAHABANK', name: 'Bank of Maharashtra', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'MAHB' },
  { code: 'PSB', name: 'Punjab & Sind Bank', category: 'indian_public', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'PSIB' },

  // --- Indian Private Sector Banks ---
  { code: 'HDFC', name: 'HDFC Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'HDFC', popular: true },
  { code: 'ICICI', name: 'ICICI Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'ICIC', popular: true },
  { code: 'AXIS', name: 'Axis Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'UTIB', popular: true },
  { code: 'KOTAK', name: 'Kotak Mahindra Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'KKBK', popular: true },
  { code: 'INDUSIND', name: 'IndusInd Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'INDB' },
  { code: 'YES', name: 'Yes Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'YESB' },
  { code: 'FEDERAL', name: 'Federal Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'FDRL' },
  { code: 'IDFC', name: 'IDFC FIRST Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'IDFB' },
  { code: 'BANDHAN', name: 'Bandhan Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'BDBL' },
  { code: 'RBL', name: 'RBL Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'RATN' },
  { code: 'SOUTHINDIAN', name: 'South Indian Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'SIBL' },
  { code: 'AUBANK', name: 'AU Small Finance Bank', category: 'indian_private', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'AUBL' },

  // --- Foreign / International Banks ---
  { code: 'HSBC', name: 'HSBC Bank (Hongkong & Shanghai Banking Corp)', category: 'foreign_intl', country: 'United Kingdom / Hong Kong', countryFlag: '🇬🇧', ifscPrefix: 'HSBC', swiftCode: 'HSBCINBB', popular: true },
  { code: 'CITI', name: 'Citibank N.A.', category: 'foreign_intl', country: 'United States', countryFlag: '🇺🇸', ifscPrefix: 'CITI', swiftCode: 'CITIINBX', popular: true },
  { code: 'SCB', name: 'Standard Chartered Bank', category: 'foreign_intl', country: 'United Kingdom', countryFlag: '🇬🇧', ifscPrefix: 'SCBL', swiftCode: 'SCBLINBB', popular: true },
  { code: 'DEUTSCHE', name: 'Deutsche Bank AG', category: 'foreign_intl', country: 'Germany', countryFlag: '🇩🇪', ifscPrefix: 'DEUT', swiftCode: 'DEUTINBB', popular: true },
  { code: 'BARCLAYS', name: 'Barclays Bank PLC', category: 'foreign_intl', country: 'United Kingdom', countryFlag: '🇬🇧', ifscPrefix: 'BARC', swiftCode: 'BARCINBB' },
  { code: 'JPMORGAN', name: 'JPMorgan Chase Bank N.A.', category: 'foreign_intl', country: 'United States', countryFlag: '🇺🇸', ifscPrefix: 'CHAS', swiftCode: 'CHASINBB' },
  { code: 'BOFA', name: 'Bank of America N.A.', category: 'foreign_intl', country: 'United States', countryFlag: '🇺🇸', ifscPrefix: 'BOFA', swiftCode: 'BOFAIN4X' },
  { code: 'DBS', name: 'DBS Bank India (Development Bank of Singapore)', category: 'foreign_intl', country: 'Singapore', countryFlag: '🇸🇬', ifscPrefix: 'DBSS', swiftCode: 'DBSSINBB', popular: true },
  { code: 'BNPPARIBAS', name: 'BNP Paribas', category: 'foreign_intl', country: 'France', countryFlag: '🇫🇷', ifscPrefix: 'BNPA', swiftCode: 'BNPAINBB' },
  { code: 'MUFG', name: 'MUFG Bank (Mitsubishi UFJ Financial Group)', category: 'foreign_intl', country: 'Japan', countryFlag: '🇯🇵', ifscPrefix: 'BOTM', swiftCode: 'BOTMINBB' },
  { code: 'MIZUHO', name: 'Mizuho Bank Ltd.', category: 'foreign_intl', country: 'Japan', countryFlag: '🇯🇵', ifscPrefix: 'MHCB', swiftCode: 'MHCBINBB' },
  { code: 'SMBC', name: 'Sumitomo Mitsui Banking Corporation', category: 'foreign_intl', country: 'Japan', countryFlag: '🇯🇵', ifscPrefix: 'SMBC', swiftCode: 'SMBCINBB' },
  { code: 'SCOTIABANK', name: 'Scotiabank (Bank of Nova Scotia)', category: 'foreign_intl', country: 'Canada', countryFlag: '🇨🇦', ifscPrefix: 'NOSC', swiftCode: 'NOSCINBB' },
  { code: 'SOCGEN', name: 'Societe Generale', category: 'foreign_intl', country: 'France', countryFlag: '🇫🇷', ifscPrefix: 'SOGE', swiftCode: 'SOGEINBB' },
  { code: 'SBM', name: 'SBM Bank (State Bank of Mauritius)', category: 'foreign_intl', country: 'Mauritius', countryFlag: '🇲🇺', ifscPrefix: 'STCB', swiftCode: 'STCBINBB' },
  { code: 'QNB', name: 'Qatar National Bank Q.P.S.C.', category: 'foreign_intl', country: 'Qatar', countryFlag: '🇶🇦', ifscPrefix: 'QNBA', swiftCode: 'QNBAINBB' },
  { code: 'FAB', name: 'First Abu Dhabi Bank PJSC', category: 'foreign_intl', country: 'United Arab Emirates', countryFlag: '🇦🇪', ifscPrefix: 'FABX', swiftCode: 'FABXINBB' },
  { code: 'EMIRATES', name: 'Emirates NBD Bank PJSC', category: 'foreign_intl', country: 'United Arab Emirates', countryFlag: '🇦🇪', ifscPrefix: 'EBIL', swiftCode: 'EBILINBB' },
  { code: 'SHINHAN', name: 'Shinhan Bank', category: 'foreign_intl', country: 'South Korea', countryFlag: '🇰🇷', ifscPrefix: 'SHBK', swiftCode: 'SHBKINBB' },

  // --- Treasury & Regional Rural Banks ---
  { code: 'RBI_TREASURY', name: 'State Treasury / Institutional Account (UP Govt / RBI)', category: 'treasury_rural', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'RBIS', popular: true },
  { code: 'ARYAVART', name: 'Aryavart Bank (Gramin Bank)', category: 'treasury_rural', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'ARYA' },
  { code: 'BARODA_UP', name: 'Baroda UP Bank (Gramin Bank)', category: 'treasury_rural', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'BARB0BUPGBX' },
  { code: 'PRATHAMA', name: 'Prathama UP Gramin Bank', category: 'treasury_rural', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'PRTH' },
  { code: 'UP_COOP', name: 'UP State Cooperative Bank Ltd.', category: 'treasury_rural', country: 'India', countryFlag: '🇮🇳', ifscPrefix: 'UPCB' }
];

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
  PSIB: 'Punjab & Sind Bank',
  INDB: 'IndusInd Bank',
  YESB: 'Yes Bank',
  FDRL: 'Federal Bank',
  IDFB: 'IDFC FIRST Bank',
  HSBC: 'HSBC Bank',
  CITI: 'Citibank N.A.',
  SCBL: 'Standard Chartered Bank',
  DEUT: 'Deutsche Bank AG',
  BARC: 'Barclays Bank PLC',
  CHAS: 'JPMorgan Chase Bank',
  BOFA: 'Bank of America',
  DBSS: 'DBS Bank India',
  BNPA: 'BNP Paribas',
  BOTM: 'MUFG Bank',
  MHCB: 'Mizuho Bank',
  SMBC: 'Sumitomo Mitsui Banking Corp',
  NOSC: 'Scotiabank',
  SOGE: 'Societe Generale',
  STCB: 'SBM Bank India',
  RBIS: 'Reserve Bank of India / Treasury'
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
