import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Info,
  Building,
  GraduationCap,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  FileText
} from 'lucide-react';
import { publicService } from '../../services/publicService';
import { PublicFeeStructure } from '../../types';
import { formatCurrencyINR } from '../../utils/helpers';

interface DetailedFeeItem {
  id: string;
  name: string;
  hindiName: string;
  govtAmount: number;
  pppAmount: number;
  frequency: string;
  refundable: boolean;
  category: string;
  description: string;
  scholarshipEligible: boolean;
}

const DETAILED_FEE_BREAKDOWN: DetailedFeeItem[] = [
  {
    id: 'tuition',
    name: 'Academic Tuition Fee',
    hindiName: 'शिक्षण शुल्क',
    govtAmount: 8000,
    pppAmount: 24000,
    frequency: 'Annual (Payable per session)',
    refundable: false,
    category: 'Core Academic',
    description: 'Subsidized tuition fee covering academic lectures, classroom teaching, coursework modules, and instructor guidance.',
    scholarshipEligible: true
  },
  {
    id: 'development',
    name: 'Institutional Development & Maintenance',
    hindiName: 'संस्थान विकास एवं रख-रखाव शुल्क',
    govtAmount: 2000,
    pppAmount: 3500,
    frequency: 'Annual',
    refundable: false,
    category: 'Infrastructure',
    description: 'Maintenance of smart classrooms, high-speed campus networking, electrical backup generators, and institute upkeep.',
    scholarshipEligible: true
  },
  {
    id: 'exam',
    name: 'BTEUP Examination & Marks Sheet Fee',
    hindiName: 'परीक्षा एवं अंकतालिका शुल्क',
    govtAmount: 1000,
    pppAmount: 1000,
    frequency: 'Annual (Odd & Even Semester Boards)',
    refundable: false,
    category: 'Examination Board',
    description: 'Statutory board fees remitted to Board of Technical Education, Uttar Pradesh (BTEUP Lucknow) for admit cards, examination conduct, and marksheets.',
    scholarshipEligible: true
  },
  {
    id: 'lab',
    name: 'Laboratory & Workshop Consumables',
    hindiName: 'प्रयोगशाला एवं कार्यशाला शुल्क',
    govtAmount: 500,
    pppAmount: 750,
    frequency: 'Annual',
    refundable: false,
    category: 'Practical & Training',
    description: 'Covers consumables for mechanical workshop fitting/welding/carpentry, civil survey equipment, and electrical/electronics practicals.',
    scholarshipEligible: true
  },
  {
    id: 'library',
    name: 'Central Library & Digital E-Resources',
    hindiName: 'पुस्तकालय एवं ई-रिसोर्स शुल्क',
    govtAmount: 250,
    pppAmount: 300,
    frequency: 'Annual',
    refundable: false,
    category: 'Learning Resources',
    description: 'Access to central library book lending, reference encyclopedias, national journals, and digital technical e-books.',
    scholarshipEligible: true
  },
  {
    id: 'welfare',
    name: 'Student Welfare & Group Insurance',
    hindiName: 'छात्र कल्याण एवं दुर्घटना बीमा निधि',
    govtAmount: 200,
    pppAmount: 200,
    frequency: 'Annual',
    refundable: false,
    category: 'Student Welfare',
    description: 'Mandatory accidental insurance coverage and campus emergency healthcare assistance for enrolled diploma students.',
    scholarshipEligible: true
  },
  {
    id: 'sports',
    name: 'Sports, Cultural & Tech Fest Activities',
    hindiName: 'क्रीड़ा एवं सांस्कृतिक गतिविधियां',
    govtAmount: 200,
    pppAmount: 200,
    frequency: 'Annual',
    refundable: false,
    category: 'Co-Curricular',
    description: 'Conduct of annual inter-polytechnic sports meets, technical model exhibitions, youth festivals, and cultural events.',
    scholarshipEligible: false
  },
  {
    id: 'caution',
    name: 'Caution Money (Security Deposit)',
    hindiName: 'धरोहर राशि (वापसी योग्य)',
    govtAmount: 500,
    pppAmount: 500,
    frequency: 'One-Time (At Admission)',
    refundable: true,
    category: 'Refundable Deposit',
    description: '100% refundable security deposit refunded to candidate upon successful course completion and clearance certificate.',
    scholarshipEligible: false
  }
];

export const PublicFeesPage: React.FC = () => {
  const [feeMode, setFeeMode] = useState<'govt' | 'ppp'>('govt');
  const [selectedFeeItem, setSelectedFeeItem] = useState<DetailedFeeItem | null>(null);

  const totalGovt = DETAILED_FEE_BREAKDOWN.reduce((sum, item) => sum + item.govtAmount, 0);
  const totalPPP = DETAILED_FEE_BREAKDOWN.reduce((sum, item) => sum + item.pppAmount, 0);

  const activeTotal = feeMode === 'govt' ? totalGovt : totalPPP;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-blue-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Subsidized Fee Schedule • BTEUP Code: 4412</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Institutional Fee Structure &amp; Itemized Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl">
            Complete transparent breakdown of annual diploma engineering fees for Government Subsidized Regular seats and PPP / Self-Finance seats.
          </p>
        </div>

        <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-md z-10">
          <span className="text-xs text-blue-200 uppercase font-bold block">
            {feeMode === 'govt' ? 'Govt Regular Annual Fee' : 'PPP Mode Annual Fee'}
          </span>
          <span className="text-3xl font-black text-amber-400 font-mono">
            {formatCurrencyINR(activeTotal)}
          </span>
          <span className="text-[10px] text-blue-200 block">Per Academic Year</span>
        </div>
      </div>

      {/* Mode Switcher Tabs: Government Regular vs PPP Mode */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFeeMode('govt')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              feeMode === 'govt'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Government Subsidized Regular Mode (₹{totalGovt.toLocaleString('en-IN')})</span>
          </button>

          <button
            onClick={() => setFeeMode('ppp')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              feeMode === 'ppp'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>2. PPP / Self-Finance Mode (₹{totalPPP.toLocaleString('en-IN')})</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Click any fee head below for complete details ℹ️
        </div>
      </div>

      {/* Official Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">Important Information for Students &amp; Parents:</strong>
          <p>
            All fees are strictly regulated as per the Government of Uttar Pradesh and Technical Education Department guidelines. No capitation fee or cash payments are charged. Full scholarship reimbursement is available for eligible SC/ST/OBC/EWS candidates under UP Post-Matric schemes.
          </p>
        </div>
      </div>

      {/* Itemized Breakdown Grid / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <span>
                {feeMode === 'govt'
                  ? 'Government Subsidized Regular Annual Fee Structure (₹12,650)'
                  : 'Public-Private Partnership (PPP) / SFS Annual Fee Structure (₹30,150)'}
              </span>
            </h2>
            <span className="text-xs text-slate-400">Applicable to all 6 Diploma Engineering disciplines</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
            AY 2025-2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-6">S.No</th>
                <th className="py-3.5 px-6">Fee Head / Component (मद)</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Frequency</th>
                <th className="py-3.5 px-6">Scholarship Status</th>
                <th className="py-3.5 px-6 text-right">Amount (₹ INR)</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {DETAILED_FEE_BREAKDOWN.map((item, idx) => {
                const amount = feeMode === 'govt' ? item.govtAmount : item.pppAmount;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedFeeItem(item)}
                    className="hover:bg-blue-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-4 px-6">
                      <strong className="text-slate-900 dark:text-white font-bold block group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </strong>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        {item.hindiName}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{item.frequency}</td>
                    <td className="py-4 px-6">
                      {item.scholarshipEligible ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Reimbursable
                        </span>
                      ) : item.refundable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          <Shield className="w-3.5 h-3.5" /> 100% Refundable
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Institutional</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900 dark:text-white text-sm font-mono">
                      ₹{amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all text-xs font-bold">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Total Summary Row */}
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 font-black text-xs">
                <td colSpan={5} className="py-4 px-6 text-right uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Total Annual Institutional Fee ({feeMode === 'govt' ? 'Govt Subsidized' : 'PPP Self-Finance'}):
                </td>
                <td className="py-4 px-6 text-right text-base text-blue-700 dark:text-amber-400 font-mono">
                  ₹{activeTotal.toLocaleString('en-IN')}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scholarship Guidance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>UP State Post-Matric Scholarship &amp; Fee Reimbursement</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Eligible SC, ST, OBC, Minority, and General (BPL) candidates whose parental annual income is under ₹2.5 Lakhs (SC/ST) or ₹2.0 Lakhs (General/OBC) receive 100% tuition and development fee reimbursement directly to their Aadhaar-seeded bank account.
          </p>
          <a
            href="https://scholarship.up.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline inline-flex items-center gap-1"
          >
            Visit UP Scholarship Official Portal →
          </a>
        </div>

        <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>AICTE Pragati &amp; Saksham Scholarship Schemes</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Female diploma candidates admitted through JEECUP counseling can avail ₹50,000 per annum towards academic fee and living expenses under the AICTE Pragati scheme. Saksham scheme provides ₹50,000/yr for differently-abled candidates.
          </p>
          <a
            href="https://www.aicte-india.org/schemes/students-development-schemes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline inline-flex items-center gap-1"
          >
            Check AICTE National Scholarship Guidelines →
          </a>
        </div>
      </div>

      {/* Interactive Fee Details Modal */}
      {selectedFeeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase">Fee Head Dossier</span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {selectedFeeItem.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">{selectedFeeItem.hindiName}</span>
              </div>
              <button
                onClick={() => setSelectedFeeItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <span className="text-slate-400 font-medium block">Govt Subsidized Rate:</span>
                  <strong className="text-base text-blue-600 dark:text-blue-400 font-mono font-black">
                    ₹{selectedFeeItem.govtAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">PPP / SFS Rate:</span>
                  <strong className="text-base text-indigo-600 dark:text-indigo-400 font-mono font-black">
                    ₹{selectedFeeItem.pppAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Fee Purpose &amp; Allocation:</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  {selectedFeeItem.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Frequency:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedFeeItem.frequency}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Refund Policy:</span>
                  <strong className={selectedFeeItem.refundable ? 'text-emerald-600' : 'text-slate-600'}>
                    {selectedFeeItem.refundable ? '100% Refundable at Course Completion' : 'Non-Refundable'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">UP Scholarship Coverage:</span>
                  <strong className={selectedFeeItem.scholarshipEligible ? 'text-emerald-600' : 'text-slate-400'}>
                    {selectedFeeItem.scholarshipEligible ? '100% Reimbursable under UP Welfare Scheme' : 'Not Reimbursable'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedFeeItem(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
