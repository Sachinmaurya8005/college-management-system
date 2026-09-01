import React, { useState, useRef } from 'react';
import {
  QrCode,
  Globe,
  IndianRupee,
  MapPin,
  FileBadge,
  Phone,
  Printer,
  Download,
  Copy,
  Check,
  Sparkles,
  X,
  ExternalLink,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';
import { CollegeLogo } from './CollegeLogo';
import { useCollegeData } from '../../context/CollegeDataContext';
import confetti from 'canvas-confetti';

interface CollegeOfficialQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeOfficialQrModal: React.FC<CollegeOfficialQrModalProps> = ({
  isOpen,
  onClose
}) => {
  const { settings } = useCollegeData();
  const [activeTab, setActiveTab] = useState<'web' | 'upi' | 'location' | 'vcard' | 'verify'>('web');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://frontend-xi-green-85.vercel.app';

  // Dynamic QR Payloads
  const QR_DATA_MAP = {
    web: {
      title: 'Official Website & Student Portal',
      subtitle: 'स्कैन करके कॉलेज की आधिकारिक वेबसाइट व पोर्टल खोलें',
      url: `${currentHost}/#home`,
      tag: '🌐 Web Portal',
      instruction: 'अपने मोबाइल कैमरे से स्कैन करें और सीधे कॉलेज पोर्टल पर पहुंचें।'
    },
    upi: {
      title: 'College Treasury UPI Fee Deposit',
      subtitle: 'स्कैन करके कॉलेज ट्रेजरी खाते में ऑनलाइन फीस जमा करें',
      url: `upi://pay?pa=polytechnictreasury@sbi&pn=Government%20Polytechnic&tn=College%20Fees%20Deposit&cu=INR`,
      tag: '💳 UPI Scan & Pay',
      instruction: 'PhonePe, Google Pay, Paytm, BHIM या किसी भी UPI ऐप से स्कैन करके सुरक्षित भुगतान करें।'
    },
    location: {
      title: 'Campus Google Maps Navigation',
      subtitle: 'स्कैन करके कॉलेज परिसर का लाइव जीपीएस नेविगेशन मैप खोलें',
      url: 'https://maps.google.com/?q=25.86472,84.22153',
      tag: '📍 GPS Location',
      instruction: 'स्कैन करते ही Google Maps पर कॉलेज के लिए टर्न-बाय-टर्न नेविगेशन शुरू हो जाएगा।'
    },
    vcard: {
      title: 'Official College Digital vCard',
      subtitle: 'स्कैन करके कॉलेज व प्रिंसिपल का आधिकारिक संपर्क फोन में सेव करें',
      url: `BEGIN:VCARD\nVERSION:3.0\nFN:Government Polytechnic\nORG:Department of Technical Education UP\nTITLE:Principal Er. Sachin Maurya\nTEL:+91 94150 24510\nEMAIL:info@polytechnic.edu\nURL:${currentHost}\nADR:;;Government Polytechnic Campus;Uttar Pradesh;277202;India\nEND:VCARD`,
      tag: '📇 Contact vCard',
      instruction: 'स्कैन करते ही कॉलेज का पूरा संपर्क पता आपके स्मार्टफोन में 1-टैप में सेव हो जाएगा।'
    },
    verify: {
      title: 'BTEUP Document Verification',
      subtitle: 'स्कैन करके फीस रसीद व मार्कशीट का सत्यापन करें',
      url: `${currentHost}/#qr-verify`,
      tag: '📜 Smart Verification',
      instruction: 'प्रवेश पत्र, मार्कशीट या फीस रसीद के असली होने का तुरंत डिजिटल सत्यापन करें।'
    }
  };

  const selectedData = QR_DATA_MAP[activeTab];
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(selectedData.url)}&margin=10&color=022c22&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(selectedData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Government_Polytechnic_QR_${activeTab.toUpperCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {
      window.open(qrImageUrl, '_blank');
    }
  };

  const handlePrintPoster = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up text-xs text-slate-800 dark:text-slate-100 my-6">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white flex items-start justify-between gap-4 border-b border-polytechnic-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner flex-shrink-0">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 mb-1">
                <ShieldCheck className="w-3 h-3" />
                <span>UP BTEUP Code: {settings.bteupCode || '4412'} • Official QR Hub</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Government Polytechnic • Official QR Code
              </h3>
              <p className="text-[11px] text-slate-300">
                राजकीय पॉलिटेक्निक • आधिकारिक क्यूआर कोड जनरेटर व पोस्टर
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Type Tabs */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'web', label: '🌐 Web Portal', icon: Globe },
            { id: 'upi', label: '💳 Treasury UPI (₹)', icon: IndianRupee },
            { id: 'location', label: '📍 GPS Location Map', icon: MapPin },
            { id: 'vcard', label: '📇 Digital vCard', icon: Phone },
            { id: 'verify', label: '📜 Document Verify', icon: FileBadge }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Poster & QR Code Display Area */}
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Printable Poster Card */}
          <div
            ref={printRef}
            className="w-full sm:w-80 p-5 rounded-3xl bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-2 border-emerald-500/40 shadow-xl text-center space-y-3.5 relative flex-shrink-0"
          >
            {/* Header in Poster */}
            <div className="space-y-1 border-b border-emerald-200 dark:border-slate-700 pb-2.5">
              <div className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                Government of Uttar Pradesh
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Government Polytechnic
              </h4>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                राजकीय पॉलिटेक्निक • BTEUP Code: {settings.bteupCode || '4412'}
              </p>
            </div>

            {/* QR Frame */}
            <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block mx-auto">
              <img
                src={qrImageUrl}
                alt="College Official QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto"
              />
              <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-emerald-950 border-2 border-white shadow-lg flex items-center justify-center text-emerald-300 pointer-events-none">
                <Building className="w-5 h-5" />
              </div>
            </div>

            {/* Poster Footer Info */}
            <div className="space-y-1 pt-1 border-t border-emerald-200 dark:border-slate-700">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider inline-block">
                {selectedData.tag}
              </span>
              <div className="text-xs font-black text-slate-900 dark:text-white">
                {selectedData.title}
              </div>
              <p className="text-[9px] text-slate-500 leading-tight">
                Principal: Er. Sachin Maurya • AICTE Approved
              </p>
            </div>
          </div>

          {/* Details & Action Commands */}
          <div className="flex-1 space-y-4 text-left">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Smartphone className="w-4 h-4" />
                <span>स्कैन करने के निर्देश (How to Scan):</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedData.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedData.instruction}
              </p>
            </div>

            {/* Target URL / Deep Link Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">QR Payload Target:</span>
              <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all line-clamp-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                {selectedData.url}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={handleDownloadQr}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Image</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handlePrintPoster}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 text-center text-[11px] text-slate-500">
          इस क्यूआर कोड को कॉलेज के मुख्य द्वार, सूचना पट्ट और शुल्क काउंटर पर प्रिंट करके चिपकाया जा सकता है।
        </div>
      </div>
    </div>
  );
};
