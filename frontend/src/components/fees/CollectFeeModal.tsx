import React, { useState } from 'react';
import { FeeRecord } from '../../types';
import { Modal } from '../common/Modal';
import { useCollegeData } from '../../context/CollegeDataContext';
import { formatCurrencyINR } from '../../utils/helpers';
import confetti from 'canvas-confetti';

interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeRecord: FeeRecord | null;
  onPaymentSuccess?: (receiptNo: string) => void;
}

export const CollectFeeModal: React.FC<CollectFeeModalProps> = ({
  isOpen,
  onClose,
  feeRecord,
  onPaymentSuccess
}) => {
  const { addPayment } = useCollegeData();

  const [amount, setAmount] = useState<number>(feeRecord?.pendingAmount || 12450);
  const [paymentMode, setPaymentMode] = useState<'Online UPI' | 'Net Banking' | 'Cash' | 'Challan'>('Online UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [remarks, setRemarks] = useState('Semester Tuition & Exam Registration Fee');

  if (!feeRecord) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Payment amount must be greater than zero.');
      return;
    }

    const txRef = transactionRef || `TXN/${Date.now().toString().slice(-6)}`;

    const tx = await addPayment(feeRecord.id, {
      amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      transactionRef: txRef,
      remarks,
      collectedBy: 'Accounts Section, Government Polytechnic'
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    onClose();
    if (onPaymentSuccess) {
      onPaymentSuccess(tx.receiptNo);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Academic Fee &amp; Generate Receipt"
      subtitle={`Student: ${feeRecord.studentName} (${feeRecord.rollNo})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Fee Summary Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-3 gap-3">
          <div>
            <span className="text-slate-500">Total Fee:</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {formatCurrencyINR(feeRecord.totalFee)}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Already Paid:</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {formatCurrencyINR(feeRecord.paidAmount)}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Current Balance:</span>
            <div className="font-bold text-red-600 dark:text-red-400 text-sm">
              {formatCurrencyINR(feeRecord.pendingAmount)}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount to Pay (INR ₹) *
          </label>
          <input
            type="number"
            required
            max={feeRecord.pendingAmount || 50000}
            min={1}
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Mode *
          </label>
          <select
            value={paymentMode}
            onChange={e => setPaymentMode(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          >
            <option value="Online UPI">Online UPI (GooglePay / PhonePe / Paytm)</option>
            <option value="Net Banking">Net Banking / SBI Collect</option>
            <option value="Challan">Bank Challan (Union Bank / SBI Bansdeeh)</option>
            <option value="Cash">Cash at College Counter</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Transaction ID / UTR / Challan Ref No.
          </label>
          <input
            type="text"
            placeholder="e.g. UPI/4098231092/SBI"
            value={transactionRef}
            onChange={e => setTransactionRef(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Remarks / Fee Head
          </label>
          <input
            type="text"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
          >
            Confirm &amp; Issue Receipt (₹)
          </button>
        </div>
      </form>
    </Modal>
  );
};
