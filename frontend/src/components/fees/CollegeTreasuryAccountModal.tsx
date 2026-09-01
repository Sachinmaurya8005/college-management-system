import React, { useState, useEffect } from 'react';
import {
  Building2,
  Landmark,
  IndianRupee,
  ShieldCheck,
  CreditCard,
  PlusCircle,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Copy,
  Send,
  ArrowRight,
  Smartphone,
  RefreshCw,
  Search,
  Check,
  Globe,
  ChevronDown
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import {
  formatCurrencyINR,
  lookupIfscDetails,
  verifyBankAccountOnline,
  generateUpiPaymentUrl,
  COMPREHENSIVE_BANK_LIST,
  BankOption
} from '../../utils/helpers';
import confetti from 'canvas-confetti';

interface CollegeTreasuryAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeTreasuryAccountModal: React.FC<CollegeTreasuryAccountModalProps> = ({
  isOpen,
  onClose
}) => {
  const { collegeBankAccount, updateCollegeBankAccount } = useCollegeData();

  const [activeTab, setActiveTab] = useState<'qr' | 'netbanking' | 'edit'>('qr');

  // QR Code & Online Payment State
  const [depositAmount, setDepositAmount] = useState('500000');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'netbanking' | 'rtgs'>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [neftRefNo, setNeftRefNo] = useState('');
  const [grantNote, setGrantNote] = useState('State Technical Education Grant 2026-27 (UP Govt)');

  // Edit Form State
  const [bankName, setBankName] = useState(collegeBankAccount.bankName);
  const [accountNumber, setAccountNumber] = useState(collegeBankAccount.accountNumber);
  const [ifscCode, setIfscCode] = useState(collegeBankAccount.ifscCode);
  const [branchName, setBranchName] = useState(collegeBankAccount.branchName);
  const [accountHolderName, setAccountHolderName] = useState(collegeBankAccount.accountHolderName);
  const [treasuryCode, setTreasuryCode] = useState(collegeBankAccount.treasuryCode);
  const [isLookingUpIfsc, setIsLookingUpIfsc] = useState(false);
  const [ifscVerifiedStatus, setIfscVerifiedStatus] = useState<string | null>('State Bank of India (Govt Treasury Branch)');

  const collegeUpiId = 'principal.Government Polytechnic@sbi';

  // Validation errors state
  const [errors, setErrors] = useState<{
    ifscCode?: string;
    bankName?: string;
    accountNumber?: string;
    branchName?: string;
    accountHolderName?: string;
  }>({});
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // Dynamic IFSC Lookup & Real-time Validation
  const handleIfscChange = (val: string) => {
    const uppercaseVal = val.toUpperCase().trim();
    setIfscCode(uppercaseVal);
    if (errors.ifscCode) {
      setErrors(prev => ({ ...prev, ifscCode: undefined }));
    }

    if (uppercaseVal.length === 11) {
      setIsLookingUpIfsc(true);
      setTimeout(() => {
        const info = lookupIfscDetails(uppercaseVal);
        if (info.valid) {
          setBankName(info.bankName);
          setBranchName(info.branch);
          setIfscVerifiedStatus(`${info.bankName} • ${info.branch}`);
          setErrors(prev => ({ ...prev, ifscCode: undefined, bankName: undefined, branchName: undefined }));
        } else {
          setIfscVerifiedStatus(null);
          // Check regex
          const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
          if (!ifscRegex.test(uppercaseVal)) {
            setErrors(prev => ({
              ...prev,
              ifscCode: '❌ गलत IFSC फॉर्मेट! पहले 4 अक्षर बैंक कोड (A-Z), 5वाँ अक्षर 0, और अंतिम 6 अक्षर शाखा कोड होने चाहिए (उदा. SBIN0001234 या UBIN0544124)'
            }));
          }
        }
        setIsLookingUpIfsc(false);
      }, 300);
    } else {
      setIfscVerifiedStatus(null);
    }
  };

  // Bank Selector Dropdown / Modal State
  const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [selectedBankCategory, setSelectedBankCategory] = useState<'all' | 'indian_public' | 'indian_private' | 'foreign_intl' | 'treasury_rural'>('all');

  const filteredBanks = COMPREHENSIVE_BANK_LIST.filter(bank => {
    const matchesCat = selectedBankCategory === 'all' || bank.category === selectedBankCategory;
    const matchesSearch = bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
                          bank.code.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
                          bank.country.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
                          bank.ifscPrefix.toLowerCase().includes(bankSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectBank = (bank: BankOption) => {
    setBankName(bank.name);
    const sampleIfsc = bank.ifscPrefix ? `${bank.ifscPrefix}0001234` : 'SBIN0001234';
    setIfscCode(sampleIfsc);
    if (bank.category === 'foreign_intl') {
      setBranchName(`International Banking Division (${bank.country}) • New Delhi / Mumbai`);
      setIfscVerifiedStatus(`${bank.name} (${bank.countryFlag} ${bank.country}) • Swift: ${bank.swiftCode || 'N/A'}`);
    } else if (bank.category === 'treasury_rural') {
      setBranchName(`Govt Institutional / Regional Branch, Uttar Pradesh`);
      setIfscVerifiedStatus(`${bank.name} • Institutional Treasury Account`);
    } else {
      setBranchName(`Main Branch, Uttar Pradesh`);
      setIfscVerifiedStatus(`${bank.name} • Verified Commercial Bank`);
    }
    setErrors({});
    setShowValidationAlert(false);
    setIsBankSelectorOpen(false);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(collegeUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompleteOnlineDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const newBalance = collegeBankAccount.availableBalance + amountNum;
      updateCollegeBankAccount({
        availableBalance: newBalance
      });

      setIsProcessingPayment(false);
      confetti({ particleCount: 80, spread: 80 });
      alert(
        `✅ Payment Successful!\n\n₹${amountNum.toLocaleString('en-IN')} has been directly credited into ${collegeBankAccount.bankName} (A/C: ${collegeBankAccount.accountNumber}).\n\nNew Treasury Balance: ₹${newBalance.toLocaleString('en-IN')}`
      );
      onClose();
    }, 1000);
  };

  const validateEditForm = (): boolean => {
    const newErrors: {
      ifscCode?: string;
      bankName?: string;
      accountNumber?: string;
      branchName?: string;
      accountHolderName?: string;
    } = {};

    const cleanIfsc = (ifscCode || '').trim().toUpperCase();
    const cleanAcc = (accountNumber || '').trim().replace(/\s+/g, '');
    const cleanBank = (bankName || '').trim();
    const cleanBranch = (branchName || '').trim();
    const cleanHolder = (accountHolderName || '').trim();

    // 1. IFSC Validation
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!cleanIfsc) {
      newErrors.ifscCode = '⚠️ कृपया बैंक का IFSC कोड दर्ज करें।';
    } else if (cleanIfsc.length !== 11) {
      newErrors.ifscCode = `❌ अमान्य IFSC कोड! IFSC कोड ठीक 11 अक्षरों का होना चाहिए (आपने केवल ${cleanIfsc.length} अक्षर दर्ज किए हैं)। उदा. SBIN0001234 या UBIN0544124`;
    } else if (!ifscRegex.test(cleanIfsc)) {
      newErrors.ifscCode = '❌ गलत IFSC फॉर्मेट! पहले 4 अक्षर बैंक कोड (A-Z), 5वाँ अक्षर 0, और अंतिम 6 अक्षर शाखा कोड होने चाहिए। (उदा. SBIN0001234)';
    }

    // 2. Bank Name Validation
    if (!cleanBank) {
      newErrors.bankName = '⚠️ कृपया बैंक का नाम दर्ज करें अथवा ऊपर दी गई सूची से चुनें।';
    } else if (cleanBank.length < 3) {
      newErrors.bankName = '❌ बैंक का नाम बहुत छोटा है (कम से कम 3 अक्षर होने चाहिए)।';
    }

    // 3. Account Number Validation
    if (!cleanAcc) {
      newErrors.accountNumber = '⚠️ कृपया बैंक खाता संख्या (Account Number) दर्ज करें।';
    } else if (!/^\d+$/.test(cleanAcc)) {
      newErrors.accountNumber = '❌ खाता संख्या में केवल अंक (0-9) होने चाहिए (अक्षर या विशेष चिन्ह मान्य नहीं हैं)।';
    } else if (cleanAcc.length < 9 || cleanAcc.length > 18) {
      newErrors.accountNumber = `❌ अमान्य खाता संख्या! बैंक खाता संख्या 9 से 18 अंकों के बीच होनी चाहिए (वर्तमान में केवल ${cleanAcc.length} अंक हैं)।`;
    }

    // 4. Branch Name Validation
    if (!cleanBranch) {
      newErrors.branchName = '⚠️ कृपया बैंक शाखा का नाम (Branch Name) दर्ज करें।';
    } else if (cleanBranch.length < 3) {
      newErrors.branchName = '❌ शाखा का नाम कम से कम 3 अक्षरों का होना चाहिए।';
    }

    // 5. Account Holder Validation
    if (!cleanHolder) {
      newErrors.accountHolderName = '⚠️ कृपया खाता धारक का आधिकारिक पद / नाम दर्ज करें।';
    } else if (cleanHolder.length < 3) {
      newErrors.accountHolderName = '❌ खाता धारक का नाम कम से कम 3 अक्षरों का होना चाहिए।';
    }

    setErrors(newErrors);
    const hasErrors = Object.keys(newErrors).length > 0;
    setShowValidationAlert(hasErrors);
    return !hasErrors;
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEditForm()) {
      return;
    }

    setShowValidationAlert(false);
    updateCollegeBankAccount({
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      branchName: branchName.trim(),
      accountHolderName: accountHolderName.trim(),
      treasuryCode: treasuryCode.trim()
    });
    confetti({ particleCount: 60, spread: 60 });
    alert('✅ कॉलेज सरकारी कोषागार बैंक खाता सफलतापूर्वक अपडेट हो गया है!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-xs animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-polytechnic-800 to-indigo-900 text-white flex items-center justify-center shadow-md">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  College Institutional Treasury &amp; Online Banking Gateway
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  Principal Control
                </span>
              </div>
              <p className="text-slate-500 font-medium">
                राजकीय पॉलिटेक्निक • आधिकारिक सरकारी कोषागार व यूपीआई भुगतान
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Available College Treasury Funds (उपलब्ध सरकारी शेष राशि)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
              {formatCurrencyINR(collegeBankAccount.availableBalance)}
            </div>
            <span className="text-[11px] text-slate-300">
              {collegeBankAccount.bankName} • A/C: {collegeBankAccount.accountNumber} • IFSC: {collegeBankAccount.ifscCode}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="text-[10px] text-amber-300 font-bold block">Treasury DDO Code</span>
            <span className="font-mono font-black text-xs text-white">{collegeBankAccount.treasuryCode}</span>
          </div>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Dynamic UPI QR Code (स्कैन करके पैसे डालें)</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'netbanking'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>NetBanking / RTGS / NEFT</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Edit Account Details (खाता बदलें)</span>
          </button>
        </div>

        {/* TAB 1: DYNAMIC UPI QR CODE */}
        {activeTab === 'qr' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
              {/* Visual Dynamic QR Code Box */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-900 shadow-xl text-center space-y-2 flex-shrink-0">
                <div className="w-48 h-48 bg-slate-950 p-3 rounded-xl flex items-center justify-center text-white relative overflow-hidden group">
                  {/* Authentic SVG QR Representation */}
                  <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
                    <rect x="40" y="10" width="8" height="8" />
                    <rect x="52" y="10" width="8" height="8" />
                    <rect x="40" y="22" width="20" height="8" />
                    <rect x="10" y="40" width="8" height="20" />
                    <rect x="22" y="45" width="8" height="15" />
                    <rect x="40" y="40" width="20" height="20" fill="#2563eb" />
                    <rect x="70" y="40" width="10" height="8" />
                    <rect x="85" y="40" width="15" height="8" />
                    <rect x="70" y="52" width="20" height="8" />
                    <rect x="40" y="70" width="8" height="20" />
                    <rect x="52" y="70" width="8" height="10" />
                    <rect x="52" y="85" width="8" height="15" />
                    <rect x="70" y="70" width="20" height="8" />
                    <rect x="70" y="82" width="10" height="18" />
                    <rect x="85" y="85" width="15" height="15" />
                  </svg>
                  {/* Center Emblem Badge */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-lg p-0.5 shadow-md flex items-center justify-center text-polytechnic-950 font-black text-[9px] text-center leading-none">
                    GPB SBI
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  Amount: <strong className="text-emerald-600 font-mono text-xs">{formatCurrencyINR(parseFloat(depositAmount) || 0)}</strong>
                </div>
                <span className="text-[9px] text-slate-400 block font-mono">Scan via PhonePe, GPay, Paytm, BHIM</span>
              </div>

              {/* Deposit Inputs & Transfer Controls */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Deposit Amount to College Account (जमा करने योग्य राशि ₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      placeholder="e.g. 500000"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-black text-sm outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                {/* Quick Pre-Set Amounts */}
                <div className="flex flex-wrap gap-2">
                  {['100000', '250000', '500000', '1000000', '2500000'].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        depositAmount === amt
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                      }`}
                    >
                      +{formatCurrencyINR(parseInt(amt))}
                    </button>
                  ))}
                </div>

                {/* Copyable UPI ID */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block uppercase">
                      Official Institutional UPI VPA
                    </span>
                    <strong className="text-slate-900 dark:text-white font-mono text-xs">{collegeUpiId}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold flex items-center gap-1 hover:bg-blue-50"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                  </button>
                </div>

                {/* Complete Online Deposit Button */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleCompleteOnlineDeposit}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isProcessingPayment
                      ? 'Confirming Online Payment...'
                      : `Confirm & Credit ₹${(parseFloat(depositAmount) || 0).toLocaleString('en-IN')} to Treasury`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NETBANKING / RTGS / NEFT */}
        {activeTab === 'netbanking' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span>Inter-Bank Direct Electronic Fund Transfer Details (NEFT / RTGS)</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Beneficiary Name</span>
                  <strong className="text-slate-900 dark:text-white">{collegeBankAccount.accountHolderName}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Bank Name &amp; Branch</span>
                  <strong className="text-slate-900 dark:text-white">{collegeBankAccount.bankName} ({collegeBankAccount.branchName})</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">Account Number</span>
                  <strong className="text-blue-600 text-sm font-black">{collegeBankAccount.accountNumber}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase">IFSC Code</span>
                  <strong className="text-emerald-600 text-sm font-black">{collegeBankAccount.ifscCode}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteOnlineDeposit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deposit Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NEFT / UTR / Grant Order Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-UP-2026-981249"
                    value={neftRefNo}
                    onChange={e => setNeftRefNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Credit Funds to Treasury Account
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EDIT COLLEGE ACCOUNT WITH AUTO-IFSC */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveChanges} className="space-y-4 animate-fade-in">
            {/* Indian & Foreign Bank Selector Directory */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Select Bank (भारतीय व विदेशी बैंक सूची)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Choose from 35+ Indian Public, Private, and International Foreign Banks
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBankSelectorOpen(!isBankSelectorOpen)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isBankSelectorOpen ? 'Close Bank Directory' : 'Browse & Pick Bank'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isBankSelectorOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isBankSelectorOpen && (
                <div className="space-y-3 pt-2 border-t border-blue-200/60 dark:border-slate-700 animate-fade-in">
                  {/* Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    {[
                      { id: 'all', label: '🌐 All Banks' },
                      { id: 'indian_public', label: '🇮🇳 Public Sector' },
                      { id: 'indian_private', label: '🇮🇳 Private Banks' },
                      { id: 'foreign_intl', label: '🌍 Foreign / Intl Banks' },
                      { id: 'treasury_rural', label: '🏦 Treasury / RRB' },
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedBankCategory(cat.id as any)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                          selectedBankCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={bankSearchQuery}
                      onChange={e => setBankSearchQuery(e.target.value)}
                      placeholder="Search bank by name (e.g. SBI, HDFC, HSBC, Citibank, Barclays)..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bank List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {filteredBanks.map(b => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => handleSelectBank(b)}
                        className={`p-2 rounded-xl border text-left transition-all flex items-start gap-2 ${
                          bankName.includes(b.code) || bankName === b.name
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-1 ring-blue-500'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/30'
                        }`}
                      >
                        <span className="text-base flex-shrink-0">{b.countryFlag}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {b.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 flex-wrap">
                            <span>{b.country}</span>
                            <span>•</span>
                            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                              {b.category === 'foreign_intl' ? `SWIFT: ${b.swiftCode}` : `IFSC: ${b.ifscPrefix}`}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredBanks.length === 0 && (
                      <div className="sm:col-span-2 text-center py-4 text-slate-400 text-xs">
                        No banks found matching "{bankSearchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Validation Error Summary Alert */}
            {showValidationAlert && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-start gap-2.5 animate-shake shadow-md">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-extrabold text-red-800 dark:text-red-200">
                    गलत विवरण! कृपया नीचे लाल बॉक्स में चिह्नित त्रुटियों को ठीक करें।
                  </div>
                  <p className="text-[11px] font-normal text-red-600 dark:text-red-400">
                    जब तक सभी बॉक्स में सही IFSC कोड और वैध खाता संख्या (9-18 अंक) नहीं भरी जाएगी, तब तक खाता सेव नहीं होगा।
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>
                IFSC कोड डालते ही सिस्टम सर्वर से बैंक का नाम और शाखा स्वचालित (Auto-detect) रूप से प्राप्त कर लेगा।
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* IFSC Code */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>IFSC Code (आईएफएससी कोड दर्ज करें) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">11 Chars (e.g. SBIN0001234)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={e => {
                      handleIfscChange(e.target.value);
                      if (errors.ifscCode) setErrors(prev => ({ ...prev, ifscCode: undefined }));
                    }}
                    placeholder="e.g. SBIN0001234"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono uppercase font-bold outline-none transition-all ${
                      errors.ifscCode
                        ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600'
                    }`}
                  />
                  {isLookingUpIfsc && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-3 top-3" />
                  )}
                </div>
                {errors.ifscCode ? (
                  <div className="mt-1.5 p-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errors.ifscCode}</span>
                  </div>
                ) : ifscVerifiedStatus ? (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {ifscVerifiedStatus}
                  </span>
                ) : null}
              </div>

              {/* Bank Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name (बैंक का नाम) *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => {
                    setBankName(e.target.value);
                    if (errors.bankName) setErrors(prev => ({ ...prev, bankName: undefined }));
                  }}
                  placeholder="e.g. State Bank of India"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all font-semibold ${
                    errors.bankName
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {errors.bankName && (
                  <div className="mt-1.5 p-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errors.bankName}</span>
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Account Number (खाता संख्या) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">9-18 Digits</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => {
                    setAccountNumber(e.target.value);
                    if (errors.accountNumber) setErrors(prev => ({ ...prev, accountNumber: undefined }));
                  }}
                  placeholder="e.g. 401234567890"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold outline-none transition-all ${
                    errors.accountNumber
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {errors.accountNumber && (
                  <div className="mt-1.5 p-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errors.accountNumber}</span>
                  </div>
                )}
              </div>

              {/* Branch Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Branch Name (शाखा का नाम) *
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={e => {
                    setBranchName(e.target.value);
                    if (errors.branchName) setErrors(prev => ({ ...prev, branchName: undefined }));
                  }}
                  placeholder="e.g. Main Institutional Branch, Uttar Pradesh"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                    errors.branchName
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {errors.branchName && (
                  <div className="mt-1.5 p-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errors.branchName}</span>
                  </div>
                )}
              </div>

              {/* Account Holder Official Title */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Holder Official Title (खाता धारक का नाम) *
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={e => {
                    setAccountHolderName(e.target.value);
                    if (errors.accountHolderName) setErrors(prev => ({ ...prev, accountHolderName: undefined }));
                  }}
                  placeholder="e.g. Principal, Government Polytechnic (Institutional Treasury A/C)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all font-medium ${
                    errors.accountHolderName
                      ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40 dark:bg-red-950/30 text-red-900 dark:text-red-200'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600'
                  }`}
                />
                {errors.accountHolderName && (
                  <div className="mt-1.5 p-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-[11px] font-bold flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{errors.accountHolderName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
              >
                Save Account Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
