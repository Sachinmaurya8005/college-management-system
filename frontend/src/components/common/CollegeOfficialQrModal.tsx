import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Building2,
  IndianRupee,
  Sparkles,
  ArrowRight,
  Share2,
  Lock,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { usePrincipalInfo } from '../../hooks/usePrincipalInfo';
import confetti from 'canvas-confetti';

interface CollegeOfficialQrModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CollegeOfficialQrModal: React.FC<CollegeOfficialQrModalProps> = ({
  isOpen = false,
  onClose
}) => {
  const { collegeBankAccount, updateCollegeBankAccount, broadcastLiveEvent } = useCollegeData();
  const principal = usePrincipalInfo();

  // Active view: 'qr' (Google Pay Display) or 'link_bank' (Add / Join Account like GPay)
  const [activeTab, setActiveTab] = useState<'qr' | 'link_bank'>('qr');

  // Dynamic Payment States
  const [upiId, setUpiId] = useState<string>(() => {
    return localStorage.getItem('gpb_custom_upi_id') || collegeBankAccount.upiId || 'gpbansdih@sbi';
  });

  const [payeeName, setPayeeName] = useState<string>(() => {
    return collegeBankAccount.accountHolderName || `Principal, Government Polytechnic Bansdih`;
  });

  const [selectedBank, setSelectedBank] = useState<string>(() => {
    return collegeBankAccount.bankName || 'State Bank of India';
  });

  const [accountNumber, setAccountNumber] = useState<string>(() => {
    return collegeBankAccount.accountNumber || '4018294019284';
  });

  const [ifscCode, setIfscCode] = useState<string>(() => {
    return collegeBankAccount.ifscCode || 'SBIN0001234';
  });

  // Custom Amount state
  const [amount, setAmount] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Sync state if context changes
  useEffect(() => {
    if (collegeBankAccount.upiId) {
      setUpiId(collegeBankAccount.upiId);
    }
    if (collegeBankAccount.accountHolderName) {
      setPayeeName(collegeBankAccount.accountHolderName);
    }
    if (collegeBankAccount.bankName) {
      setSelectedBank(collegeBankAccount.bankName);
    }
  }, [collegeBankAccount]);

  if (!isOpen) return null;

  // Clean UPI parameters
  const cleanUpiId = upiId.trim();
  const cleanPayee = payeeName.trim();
  const numAmount = parseFloat(amount);
  const validAmount = !isNaN(numAmount) && numAmount > 0 ? numAmount.toFixed(2) : '';

  // Official NPCI Standard UPI Payment URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(cleanUpiId)}&pn=${encodeURIComponent(cleanPayee)}&cu=INR${validAmount ? `&am=${validAmount}` : ''}&tn=${encodeURIComponent('Govt Polytechnic Institutional Fee')}`;

  // Authentic High-Resolution QR Code Image Endpoint
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=340x340&data=${encodeURIComponent(upiUri)}&margin=8&format=svg`;

  // 1-Click Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(cleanUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Join / Link New Bank Account (Google Pay style account creation)
  const handleLinkNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      alert('कृपया मान्य UPI ID दर्ज करें (उदा: gpbansdih@sbi या principal@okhdfcbank)');
      return;
    }

    try {
      localStorage.setItem('gpb_custom_upi_id', cleanUpiId);
    } catch (e) {}

    updateCollegeBankAccount({
      bankName: selectedBank,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      accountHolderName: cleanPayee,
      upiId: cleanUpiId
    });

    broadcastLiveEvent(
      'treasury',
      `Google Pay UPI Linked: ${cleanUpiId}`,
      `${selectedBank} Account Linked for Online Payments`
    );

    setJoinSuccess(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setJoinSuccess(false);
      setActiveTab('qr');
    }, 1500);
  };

  // Print Official Standee
  const handlePrintStandee = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Google Colors Accent Bar */}
        <div className="h-1.5 w-full flex">
          <div className="h-full flex-1 bg-[#4285F4]" /> {/* Blue */}
          <div className="h-full flex-1 bg-[#EA4335]" /> {/* Red */}
          <div className="h-full flex-1 bg-[#FBBC05]" /> {/* Yellow */}
          <div className="h-full flex-1 bg-[#34A853]" /> {/* Green */}
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            {/* Google Pay Official Badge Icon */}
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center p-1.5">
              <svg className="w-full h-full" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.77l7.97-6.18z"/>
                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Google Pay &amp; BHIM UPI QR
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  NPCI Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">Government Polytechnic Institutional Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: View QR vs Join / Link Bank Account */}
        <div className="flex items-center p-1.5 mx-5 mt-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-blue-500" />
            <span>Google Pay QR देखें</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('link_bank')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'link_bank'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>खाता जोड़ें / UPI ID बदलें</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: AUTHENTIC GOOGLE PAY QR CODE DISPLAY */}
        {/* ============================================================ */}
        {activeTab === 'qr' && (
          <div className="p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
            {/* The Google Pay Physical Standee Card */}
            <div className="relative rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl p-5 text-center space-y-4">
              
              {/* Account Identity Header */}
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  <img
                    src={principal.photoUrl || '/principal_sachin_maurya.jpg'}
                    alt={cleanPayee}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/80 shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white pt-1">
                  {cleanPayee}
                </h4>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>{selectedBank} • A/C •••• {accountNumber.slice(-4)}</span>
                </div>
              </div>

              {/* Scannable Real QR Matrix Box with GPay Logo Sticker */}
              <div className="relative mx-auto w-64 h-64 p-3 bg-white rounded-3xl border-2 border-slate-900/80 dark:border-slate-600 shadow-2xl flex items-center justify-center group overflow-hidden">
                <img
                  src={qrCodeUrl}
                  alt={`Google Pay QR for ${cleanUpiId}`}
                  className="w-full h-full object-contain select-none"
                  loading="eager"
                />
                
                {/* Center Google Pay Official Emblem Badge */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center p-2 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.77l7.97-6.18z"/>
                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>
              </div>

              {/* Dynamic UPI ID Bar with 1-Click Copy */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm max-w-sm mx-auto">
                <div className="text-left pl-2 overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Official College UPI ID
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-black text-slate-900 dark:text-white truncate block">
                    {cleanUpiId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    copiedUpi
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-95'
                  }`}
                >
                  {copiedUpi ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Custom Optional Fee Amount Input */}
              <div className="max-w-sm mx-auto space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Enter Fee Amount (वैकल्पिक राशि):</span>
                  {validAmount && (
                    <span className="text-emerald-600 font-mono font-bold">
                      QR locked to ₹{Number(validAmount).toLocaleString('en-IN')}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 12450)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[
                    { label: '₹12,450 (1st Year Fee)', val: '12450' },
                    { label: '₹1,500 (Exam Fee)', val: '1500' },
                    { label: '₹1,000 (Caution Money)', val: '1000' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAmount(p.val)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                  {amount && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="text-[10px] text-red-500 font-bold hover:underline ml-auto"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Supported UPI Apps Footer Row */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Scan &amp; Pay using any UPI Application
                </span>
                <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">🟢 Google Pay</span>
                  <span className="flex items-center gap-1">🟣 PhonePe</span>
                  <span className="flex items-center gap-1">🔵 Paytm</span>
                  <span className="flex items-center gap-1">🟠 BHIM UPI</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Print Standee & Share */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrintStandee}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official Standee (प्रिंट निकालें)</span>
              </button>

              <a
                href={qrCodeUrl}
                download="Government_Polytechnic_GPay_QR.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                title="Download QR Image"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </a>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LINK / JOIN NEW BANK ACCOUNT (GOOGLE PAY STYLE) */}
        {/* ============================================================ */}
        {activeTab === 'link_bank' && (
          <form onSubmit={handleLinkNewAccount} className="p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Google Pay Account Linking (नया खाता जोड़ें)</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                जैसे Google Pay में अपना बैंक जोड़ते ही आपकी UPI ID और QR Code बन जाता है, वैसे ही यहां अपना खाता और UPI ID भरें — सिस्टम तुरंत नया लाइव QR कोड जनरेट कर देगा!
              </p>
            </div>

            {joinSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>खाता सफलतापूर्वक जुड़ गया! नया Google Pay QR Code तैयार है...</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Holder / Merchant Name (खाताधारक / प्राचार्य नाम) *
              </label>
              <input
                type="text"
                required
                value={payeeName}
                onChange={e => setPayeeName(e.target.value)}
                placeholder="e.g. Principal, Government Polytechnic Bansdih"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                UPI ID / VPA (गूगल पे / बैंक की UPI ID) *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="e.g. gpbansdih@sbi or sachinmaurya8005@okaxis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Google Pay QR Code सीधे इसी UPI ID से लिंक होकर स्कैन होगा।
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name (बैंक का नाम) *
                </label>
                <select
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="State Bank of India">State Bank of India (SBI)</option>
                  <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                  <option value="Bank of Baroda">Bank of Baroda (BOB)</option>
                  <option value="Union Bank of India">Union Bank of India</option>
                  <option value="Canara Bank">Canara Bank</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Number (खाता संख्या)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="e.g. 4018294019284"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                IFSC Code (आईएफएससी कोड)
              </label>
              <input
                type="text"
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>खाता जोड़ें और नया QR बनाएं</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
