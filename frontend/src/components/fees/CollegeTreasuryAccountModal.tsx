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
  Check
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import {
  formatCurrencyINR,
  lookupIfscDetails,
  verifyBankAccountOnline,
  generateUpiPaymentUrl
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

  // Dynamic IFSC Lookup
  const handleIfscChange = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    setIfscCode(uppercaseVal);

    if (uppercaseVal.length === 11) {
      setIsLookingUpIfsc(true);
      setTimeout(() => {
        const info = lookupIfscDetails(uppercaseVal);
        if (info.valid) {
          setBankName(info.bankName);
          setBranchName(info.branch);
          setIfscVerifiedStatus(`${info.bankName} • ${info.branch}`);
        } else {
          setIfscVerifiedStatus(null);
        }
        setIsLookingUpIfsc(false);
      }, 300);
    } else {
      setIfscVerifiedStatus(null);
    }
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

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollegeBankAccount({
      bankName,
      accountNumber,
      ifscCode,
      branchName,
      accountHolderName,
      treasuryCode
    });
    alert('College Institutional Treasury Bank details updated successfully!');
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
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>
                IFSC कोड डालते ही सिस्टम सर्वर से बैंक का नाम और शाखा स्वचालित (Auto-detect) रूप से प्राप्त कर लेगा।
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  IFSC Code (आईएफएससी कोड दर्ज करें)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={e => handleIfscChange(e.target.value)}
                    placeholder="e.g. SBIN0001234"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase font-bold outline-none"
                    required
                  />
                  {isLookingUpIfsc && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-3 top-2.5" />
                  )}
                </div>
                {ifscVerifiedStatus && (
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {ifscVerifiedStatus}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name (बैंक का नाम)
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Number (खाता संख्या)
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Branch Name (शाखा का नाम)
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Holder Official Title (खाता धारक का नाम)
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={e => setAccountHolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/30"
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
