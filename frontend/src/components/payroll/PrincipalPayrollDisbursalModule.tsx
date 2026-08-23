import React, { useState } from 'react';
import {
  Landmark,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Send,
  Users,
  Search,
  Sparkles,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Edit3,
  X,
  Clock,
  Eye,
  FileSpreadsheet,
  QrCode,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import {
  formatCurrencyINR,
  exportToCSV,
  lookupIfscDetails,
  verifyBankAccountOnline
} from '../../utils/helpers';
import { Teacher, TeacherBankAccount, SalaryDisbursementRecord } from '../../types';
import { CollegeTreasuryAccountModal } from '../fees/CollegeTreasuryAccountModal';
import confetti from 'canvas-confetti';

export const PrincipalPayrollDisbursalModule: React.FC = () => {
  const {
    teachers,
    collegeBankAccount,
    salaryDisbursements,
    calculateTeacherMonthlySalary,
    disburseTeacherSalary,
    disburseAllMonthlySalaries,
    updateTeacherBankDetails
  } = useCollegeData();

  // State
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [searchFilter, setSearchFilter] = useState('');
  const [isTreasuryModalOpen, setIsTreasuryModalOpen] = useState(false);
  const [editingTeacherForBank, setEditingTeacherForBank] = useState<Teacher | null>(null);
  const [bankForm, setBankForm] = useState<TeacherBankAccount>({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    panNumber: ''
  });
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [bankVerificationResult, setBankVerificationResult] = useState<{
    verified: boolean;
    statusText: string;
  } | null>(null);

  // Single Transfer Modal State
  const [pendingDisbursalTeacher, setPendingDisbursalTeacher] = useState<Teacher | null>(null);
  const [disbursalMode, setDisbursalMode] = useState<'imps' | 'neft' | 'upi'>('imps');
  const [isExecutingTransfer, setIsExecutingTransfer] = useState(false);

  const [viewingSlip, setViewingSlip] = useState<SalaryDisbursementRecord | null>(null);
  const [isBatchDisbursing, setIsBatchDisbursing] = useState(false);

  // Filtered Faculty
  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.empCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
    t.department.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Open Edit Bank Details Modal with Server Auto-Verification
  const handleOpenBankEdit = (teacher: Teacher) => {
    setEditingTeacherForBank(teacher);
    const existing = teacher.bankAccount || {
      bankName: 'State Bank of India',
      accountNumber: '30481920491',
      ifscCode: 'SBIN0004412',
      accountHolderName: teacher.name,
      branchName: 'Bansdeeh Main Branch',
      panNumber: 'ABCPR1234F'
    };
    setBankForm(existing);

    // Initial check
    const ifscRes = lookupIfscDetails(existing.ifscCode);
    if (ifscRes.valid) {
      setBankVerificationResult({
        verified: true,
        statusText: `Verified with Banking Gateway • ${ifscRes.bankName} (${ifscRes.branch})`
      });
    } else {
      setBankVerificationResult(null);
    }
  };

  // Real-time IFSC lookup when typing
  const handleIfscInputChange = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    const updated = { ...bankForm, ifscCode: uppercaseVal };
    setBankForm(updated);

    if (uppercaseVal.length === 11) {
      setIsVerifyingBank(true);
      setTimeout(() => {
        const info = lookupIfscDetails(uppercaseVal);
        if (info.valid) {
          setBankForm(prev => ({
            ...prev,
            bankName: info.bankName,
            branchName: info.branch
          }));
          setBankVerificationResult({
            verified: true,
            statusText: `Server Verified • ${info.bankName} (${info.branch})`
          });
        } else {
          setBankVerificationResult({
            verified: false,
            statusText: 'Invalid IFSC code format.'
          });
        }
        setIsVerifyingBank(false);
      }, 350);
    } else {
      setBankVerificationResult(null);
    }
  };

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacherForBank) return;

    setIsVerifyingBank(true);
    const check = await verifyBankAccountOnline(bankForm.accountNumber, bankForm.ifscCode);
    setIsVerifyingBank(false);

    if (!check.verified) {
      alert(`Bank Verification Failed: ${check.message}`);
      return;
    }

    updateTeacherBankDetails(editingTeacherForBank.id, {
      ...bankForm,
      bankName: check.bankName || bankForm.bankName,
      branchName: check.branch || bankForm.branchName || ''
    });

    setEditingTeacherForBank(null);
  };

  // Open Single Transfer Dialog
  const handleOpenDisburseDialog = (teacher: Teacher) => {
    const summary = calculateTeacherMonthlySalary(teacher.id, selectedMonth);
    if (collegeBankAccount.availableBalance < summary.netPayableSalary) {
      alert(`Insufficient Treasury Balance! Available: ${formatCurrencyINR(collegeBankAccount.availableBalance)}, Required: ${formatCurrencyINR(summary.netPayableSalary)}. Please deposit funds in the College Treasury account first.`);
      return;
    }
    setPendingDisbursalTeacher(teacher);
  };

  // Execute Single Transfer
  const handleConfirmDisbursal = async () => {
    if (!pendingDisbursalTeacher) return;
    setIsExecutingTransfer(true);

    try {
      const record = await disburseTeacherSalary(pendingDisbursalTeacher.id, selectedMonth);
      setIsExecutingTransfer(false);
      setPendingDisbursalTeacher(null);
      confetti({ particleCount: 80, spread: 80 });
      setViewingSlip(record);
    } catch (err: any) {
      setIsExecutingTransfer(false);
      alert(`Transfer Failed: ${err?.message}`);
    }
  };

  // Batch Disburse All
  const handleDisburseAll = async () => {
    const pendingTeachers = teachers.filter(t => {
      return !salaryDisbursements.some(
        r => r.teacherId === t.id && r.month === selectedMonth && r.status === 'Approved_Disbursed'
      );
    });

    if (pendingTeachers.length === 0) {
      alert(`All staff salaries for ${selectedMonth} are already disbursed!`);
      return;
    }

    const totalRequired = pendingTeachers.reduce(
      (sum, t) => sum + calculateTeacherMonthlySalary(t.id, selectedMonth).netPayableSalary,
      0
    );

    if (collegeBankAccount.availableBalance < totalRequired) {
      alert(`Insufficient Treasury Balance! Available: ${formatCurrencyINR(collegeBankAccount.availableBalance)}, Total Required for ${pendingTeachers.length} staff: ${formatCurrencyINR(totalRequired)}. Please top up the college treasury account.`);
      return;
    }

    const confirmed = window.confirm(
      `Confirm Batch Disbursal of ${formatCurrencyINR(totalRequired)} for ${pendingTeachers.length} faculty and staff members for ${selectedMonth}?`
    );
    if (!confirmed) return;

    setIsBatchDisbursing(true);
    await disburseAllMonthlySalaries(selectedMonth);
    setIsBatchDisbursing(false);
    confetti({ particleCount: 120, spread: 90 });
    alert(`Batch Salary Disbursal Complete! ${pendingTeachers.length} staff accounts credited directly from College Treasury.`);
  };

  // Export Payroll Spreadsheet
  const handleExportPayroll = () => {
    const exportData = filteredTeachers.map(t => {
      const summary = calculateTeacherMonthlySalary(t.id, selectedMonth);
      const isDisbursed = salaryDisbursements.find(
        r => r.teacherId === t.id && r.month === selectedMonth
      );

      return {
        'Employee Code': t.empCode,
        'Staff Name': t.name,
        'Department': t.department,
        'Designation': t.designation,
        'Bank Name': t.bankAccount?.bankName || 'State Bank of India',
        'Bank Account No': t.bankAccount?.accountNumber || '30481920491',
        'IFSC Code': t.bankAccount?.ifscCode || 'SBIN0004412',
        'Present Days': summary.presentDays,
        'Leave Days': summary.leaveDays,
        'Absent Days': summary.absentDays,
        'Monthly Base Salary (₹)': summary.monthlyBaseSalary,
        'Deductions (₹)': summary.deductions,
        'Net Payable Amount (₹)': summary.netPayableSalary,
        'Disbursal Status': isDisbursed ? 'Approved & Disbursed' : 'Pending Approval',
        'Transaction Ref': isDisbursed?.transactionRef || '-'
      };
    });

    exportToCSV(`GP_Bansdeeh_Staff_Payroll_${selectedMonth}`, exportData);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper College Bank Treasury Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left w-full lg:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                College Official Institutional Treasury Account (कॉलेज का मुख्य बैंक खाता)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Treasury
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {collegeBankAccount.bankName} ({collegeBankAccount.branchName})
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              A/C No: <strong>{collegeBankAccount.accountNumber}</strong> • IFSC: <strong>{collegeBankAccount.ifscCode}</strong> • DDO: <strong>{collegeBankAccount.treasuryCode}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
          {/* Treasury Balance */}
          <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              Available College Treasury Funds (उपलब्ध शेष राशि)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {formatCurrencyINR(collegeBankAccount.availableBalance)}
            </div>
            <span className="text-[10px] text-slate-300">Govt of UP Technical Education Fund</span>
          </div>

          <button
            onClick={() => setIsTreasuryModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <QrCode className="w-4 h-4" />
            <span>Deposit Funds via QR / NetBanking</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Month Navigation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              मासिक स्टाफ वेतन अनुमोदन व बैंक ट्रांसफर (Staff Payroll &amp; Bank Disbursal)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate end-of-month salary based on daily campus presence and disburse directly to teachers' bank accounts with real-time IFSC resolution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
          >
            <option value="2026-08">August 2026 (Current)</option>
            <option value="2026-07">July 2026</option>
            <option value="2026-06">June 2026</option>
            <option value="2026-05">May 2026</option>
          </select>

          <button
            onClick={handleExportPayroll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          <button
            onClick={handleDisburseAll}
            disabled={isBatchDisbursing}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isBatchDisbursing ? 'Processing Transfers...' : 'Disburse All Staff Salaries (सभी को वेतन भेजें)'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search faculty by name, code, or department..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredTeachers.length}</strong> Faculty &amp; Staff Members
        </div>
      </div>

      {/* PAYROLL MATRIX TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px]">
                <th className="py-3 px-4 font-bold">Faculty Member</th>
                <th className="py-3 px-3 font-bold">Monthly Base (मूल)</th>
                <th className="py-3 px-3 font-bold text-center">Attendance (P/L/A)</th>
                <th className="py-3 px-3 font-bold">Deductions (कटौती)</th>
                <th className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
                  Net to Send (भेजने योग्य ₹)
                </th>
                <th className="py-3 px-4 font-bold">Teacher Bank Account (बैंक खाता)</th>
                <th className="py-3 px-4 font-bold text-right">Disbursal Action (भुगतान)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredTeachers.map(teacher => {
                const summary = calculateTeacherMonthlySalary(teacher.id, selectedMonth);
                const disbursedRecord = salaryDisbursements.find(
                  r => r.teacherId === teacher.id && r.month === selectedMonth
                );
                const bank = teacher.bankAccount || {
                  bankName: 'State Bank of India',
                  accountNumber: '30481920491',
                  ifscCode: 'SBIN0004412',
                  accountHolderName: teacher.name,
                  branchName: 'Bansdeeh Main Branch'
                };

                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Faculty Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={teacher.photoUrl}
                          alt={teacher.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {teacher.name}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {teacher.empCode} • {teacher.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Monthly Base */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrencyINR(summary.monthlyBaseSalary)}
                    </td>

                    {/* Attendance Breakdown */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-emerald-600 font-bold">{summary.presentDays}P</span> /{' '}
                      <span className="text-amber-600">{summary.leaveDays}L</span> /{' '}
                      <span className="text-rose-600">{summary.absentDays}A</span>
                    </td>

                    {/* Deductions */}
                    <td className="py-3 px-3 font-mono font-bold text-rose-600">
                      {summary.deductions > 0 ? `-${formatCurrencyINR(summary.deductions)}` : '₹0'}
                    </td>

                    {/* Net Payable */}
                    <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50/30 dark:bg-emerald-950/10">
                      {formatCurrencyINR(summary.netPayableSalary)}
                    </td>

                    {/* Bank Account */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate max-w-[130px] flex items-center gap-1">
                            <span>{bank.bankName}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            A/C: {bank.accountNumber.slice(-4).padStart(bank.accountNumber.length, '•')}
                          </div>
                          <div className="text-[9px] font-mono text-blue-600">{bank.ifscCode}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBankEdit(teacher)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                          title="Edit / Auto-Verify Bank Account"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      {disbursedRecord ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Transferred
                          </span>
                          <button
                            onClick={() => setViewingSlip(disbursedRecord)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                            title="View Generated Payslip"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenDisburseDialog(teacher)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 ml-auto transition-all hover:scale-105 active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Approve &amp; Transfer</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SINGLE TEACHER ONLINE SALARY DISBURSAL MODAL */}
      {pendingDisbursalTeacher && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Confirm Salary Transfer
                </h3>
              </div>
              <button
                onClick={() => setPendingDisbursalTeacher(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipient & Amount Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Faculty Recipient:</span>
                <strong className="text-slate-900 dark:text-white text-xs">{pendingDisbursalTeacher.name}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Target Bank Account:</span>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                    {pendingDisbursalTeacher.bankAccount?.bankName || 'State Bank of India'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    A/C: {pendingDisbursalTeacher.bankAccount?.accountNumber || '30481920491'} (IFSC: {pendingDisbursalTeacher.bankAccount?.ifscCode || 'SBIN0004412'})
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-bold">Net Salary Payable:</span>
                <strong className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatCurrencyINR(calculateTeacherMonthlySalary(pendingDisbursalTeacher.id, selectedMonth).netPayableSalary)}
                </strong>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Online Payment Gateway Mode (भुगतान माध्यम चुनें)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'imps', label: 'Instant IMPS (24x7)', icon: Zap },
                  { id: 'neft', label: 'Treasury RTGS/NEFT', icon: Landmark },
                  { id: 'upi', label: 'UPI Direct Payout', icon: QrCode }
                ].map(mode => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setDisbursalMode(mode.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all flex flex-col items-center gap-1 ${
                        disbursalMode === mode.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPendingDisbursalTeacher(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecutingTransfer}
                onClick={handleConfirmDisbursal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isExecutingTransfer ? 'Executing Electronic Transfer...' : 'Confirm & Transfer Salary'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEACHER BANK MODAL WITH REAL-TIME IFSC AUTO-LOOKUP */}
      {editingTeacherForBank && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Link Bank Account for {editingTeacherForBank.name}
                </h3>
                <p className="text-slate-500">{editingTeacherForBank.empCode} • {editingTeacherForBank.department}</p>
              </div>
              <button
                onClick={() => setEditingTeacherForBank(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center gap-2 text-blue-800 dark:text-blue-200 text-xs">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  IFSC कोड दर्ज करते ही बैंक का नाम और शाखा सर्वर द्वारा स्वतः प्राप्त हो जाएगी।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  IFSC Code (आईएफएससी कोड)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankForm.ifscCode}
                    onChange={e => handleIfscInputChange(e.target.value)}
                    placeholder="e.g. SBIN0004412"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase font-bold outline-none"
                    required
                  />
                  {isVerifyingBank && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-3 top-2.5" />
                  )}
                </div>
                {bankVerificationResult && (
                  <span
                    className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                      bankVerificationResult.verified ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {bankVerificationResult.verified ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                    )}
                    {bankVerificationResult.statusText}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name (बैंक का नाम - Auto-Fetched)
                </label>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
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
                  value={bankForm.accountNumber}
                  onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  placeholder="e.g. 30481920491"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branch Name (शाखा का नाम)
                  </label>
                  <input
                    type="text"
                    value={bankForm.branchName || ''}
                    onChange={e => setBankForm({ ...bankForm, branchName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    value={bankForm.panNumber || ''}
                    onChange={e => setBankForm({ ...bankForm, panNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankForm.accountHolderName}
                  onChange={e => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTeacherForBank(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingBank}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/30 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVerifyingBank ? 'Validating Bank Gateway...' : 'Save & Verify Bank Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COLLEGE TREASURY ACCOUNT MODAL */}
      <CollegeTreasuryAccountModal
        isOpen={isTreasuryModalOpen}
        onClose={() => setIsTreasuryModalOpen(false)}
      />
    </div>
  );
};
