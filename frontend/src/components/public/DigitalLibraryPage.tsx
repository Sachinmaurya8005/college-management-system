import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Download,
  BookMarked,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  FileText,
  Bookmark,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  RotateCcw,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Truck,
  ThumbsUp,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCollegeData } from '../../context/CollegeDataContext';
import {
  LibraryBook,
  IssuedBookRecord,
  UpcomingLibraryBook,
  LibrarySettingsData
} from '../../types';
import {
  libraryService,
  DEFAULT_LIBRARY_STATS
} from '../../services/libraryService';
import confetti from 'canvas-confetti';

const BRANCH_OPTIONS = [
  'All',
  'Computer Science & Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Information Technology',
  'General / Applied Sciences'
];

export const DigitalLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const { students } = useCollegeData();

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isLibrarian = isAdmin || isTeacher || user?.department?.toLowerCase().includes('library') || user?.designation?.toLowerCase().includes('librarian');

  // Active Tab: catalog | issued | upcoming | rules
  const [activeTab, setActiveTab] = useState<'catalog' | 'issued' | 'upcoming' | 'rules'>('catalog');

  // Data State
  const [books, setBooks] = useState<LibraryBook[]>(() => libraryService.getBooks());
  const [issuedRecords, setIssuedRecords] = useState<IssuedBookRecord[]>(() => libraryService.getIssuedRecords());
  const [upcomingBooks, setUpcomingBooks] = useState<UpcomingLibraryBook[]>(() => libraryService.getUpcomingBooks());
  const [settings, setSettings] = useState<LibrarySettingsData>(() => libraryService.getSettings());

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);
  const [bookForm, setBookForm] = useState<Partial<LibraryBook>>({
    title: '',
    author: '',
    branch: 'Computer Science & Engineering',
    code: 'CSE-101',
    pages: 450,
    totalCopies: 30,
    copiesAvailable: 30,
    rackLocation: 'Rack 1, Shelf A',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: 'Latest Edition',
    status: 'Available'
  });

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<LibraryBook | null>(null);
  const [issueForm, setIssueForm] = useState({
    borrowerName: '',
    borrowerType: 'Student' as 'Student' | 'Teacher',
    borrowerId: '',
    borrowerEmail: '',
    borrowerPhone: '+91 94150 12345',
    days: 21
  });

  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [editingUpcoming, setEditingUpcoming] = useState<UpcomingLibraryBook | null>(null);
  const [upcomingForm, setUpcomingForm] = useState<Partial<UpcomingLibraryBook>>({
    title: '',
    author: '',
    branch: 'Computer Science & Engineering',
    publisher: 'Pearson / Technical Press',
    expectedDate: '2026-09-30',
    copiesOrdered: 15,
    status: 'Approved',
    estimatedCost: '₹12,000'
  });

  const [showRequestBookModal, setShowRequestBookModal] = useState(false);
  const [requestBookForm, setRequestBookForm] = useState({
    title: '',
    author: '',
    branch: user?.branch || 'Computer Science & Engineering',
    reason: 'Required for BTEUP semester syllabus & practical project.'
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState<LibrarySettingsData>(settings);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Real-time broadcast sync
  useEffect(() => {
    const channel = new BroadcastChannel('gpb_realtime_broadcast_channel');
    const handleBroadcast = (e: MessageEvent) => {
      if (e.data?.type === 'LIBRARY_BOOKS_UPDATED') {
        setBooks(libraryService.getBooks());
      } else if (e.data?.type === 'LIBRARY_ISSUED_UPDATED') {
        setIssuedRecords(libraryService.getIssuedRecords());
      } else if (e.data?.type === 'LIBRARY_UPCOMING_UPDATED') {
        setUpcomingBooks(libraryService.getUpcomingBooks());
      } else if (e.data?.type === 'LIBRARY_SETTINGS_UPDATED') {
        setSettings(libraryService.getSettings());
      } else if (e.data?.type === 'LIBRARY_DATA_RESET') {
        setBooks(libraryService.getBooks());
        setIssuedRecords(libraryService.getIssuedRecords());
        setUpcomingBooks(libraryService.getUpcomingBooks());
        setSettings(libraryService.getSettings());
      }
    };
    channel.addEventListener('message', handleBroadcast);
    return () => {
      channel.removeEventListener('message', handleBroadcast);
      channel.close();
    };
  }, []);

  // --- BOOK CATALOG HANDLERS ---
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      branch: 'Computer Science & Engineering',
      code: 'LIB-' + Math.floor(100 + Math.random() * 900),
      pages: 450,
      totalCopies: 30,
      copiesAvailable: 30,
      rackLocation: 'Rack 1, Shelf A',
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=280&fit=crop',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      edition: 'Latest Edition',
      status: 'Available'
    });
    setShowAddBookModal(true);
  };

  const handleOpenEditBook = (book: LibraryBook) => {
    setEditingBook(book);
    setBookForm({ ...book });
    setShowAddBookModal(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title?.trim() || !bookForm.author?.trim()) {
      alert('कृपया पुस्तक का नाम और लेखक का नाम दर्ज करें।');
      return;
    }

    if (editingBook) {
      const updated = libraryService.updateBook(editingBook.id, bookForm);
      setBooks(updated);
      showToast('✅ पुस्तक विवरण सफलतापूर्वक अपडेट हो गया!');
    } else {
      libraryService.addBook(bookForm as Omit<LibraryBook, 'id'>);
      setBooks(libraryService.getBooks());
      showToast('🎉 नई पुस्तक लाइब्रेरी कैटलॉग में सफलतापूर्वक जुड़ गई!');
    }
    setShowAddBookModal(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteBook = (id: string, title: string) => {
    if (window.confirm(`क्या आप "${title}" को लाइब्रेरी कैटलॉग से स्थायी रूप से हटाना चाहते हैं?`)) {
      const updated = libraryService.deleteBook(id);
      setBooks(updated);
      showToast('🗑️ पुस्तक रिकॉर्ड लाइब्रेरी से हटा दिया गया।');
    }
  };

  // --- ISSUE / RETURN HANDLERS ---
  const handleOpenIssueModal = (book: LibraryBook) => {
    setSelectedBookForIssue(book);
    setIssueForm({
      borrowerName: user?.name || '',
      borrowerType: user?.role === 'teacher' ? 'Teacher' : 'Student',
      borrowerId: user?.rollNo || user?.empCode || 'E224412355001',
      borrowerEmail: user?.email || '',
      borrowerPhone: user?.phone || '+91 94150 12345',
      days: 21
    });
    setShowIssueModal(true);
  };

  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForIssue) return;
    if (!issueForm.borrowerName.trim() || !issueForm.borrowerId.trim()) {
      alert('कृपया छात्र/शिक्षक का नाम और अनुक्रमांक (Roll No/Emp ID) दर्ज करें।');
      return;
    }

    const rec = libraryService.issueBook({
      bookId: selectedBookForIssue.id,
      borrowerName: issueForm.borrowerName,
      borrowerType: issueForm.borrowerType,
      borrowerId: issueForm.borrowerId,
      borrowerEmail: issueForm.borrowerEmail,
      borrowerPhone: issueForm.borrowerPhone,
      branch: selectedBookForIssue.branch,
      days: issueForm.days
    });

    if (rec) {
      setBooks(libraryService.getBooks());
      setIssuedRecords(libraryService.getIssuedRecords());
      setShowIssueModal(false);
      showToast(`📖 पुस्तक "${selectedBookForIssue.title}" सफलतापूर्वक जारी कर दी गई!`);
      confetti({ particleCount: 60, spread: 70 });
    } else {
      alert('यह पुस्तक वर्तमान में स्टॉक में उपलब्ध नहीं है।');
    }
  };

  const handleReturnBook = (recordId: string, bookTitle: string) => {
    if (window.confirm(`क्या पुस्तक "${bookTitle}" को लाइब्रेरी में वापस जमा करना चाहते हैं?`)) {
      const updated = libraryService.returnBook(recordId);
      setIssuedRecords(updated);
      setBooks(libraryService.getBooks());
      showToast('✅ पुस्तक लाइब्रेरी स्टॉक में वापस जमा हो गई!');
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  // --- UPCOMING / REQUESTED BOOKS HANDLERS ---
  const handleOpenAddUpcoming = () => {
    setEditingUpcoming(null);
    setUpcomingForm({
      title: '',
      author: '',
      branch: 'Computer Science & Engineering',
      publisher: 'Pearson / McGraw Hill',
      expectedDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      copiesOrdered: 15,
      status: 'Approved',
      estimatedCost: '₹12,500'
    });
    setShowUpcomingModal(true);
  };

  const handleOpenEditUpcoming = (up: UpcomingLibraryBook) => {
    setEditingUpcoming(up);
    setUpcomingForm({ ...up });
    setShowUpcomingModal(true);
  };

  const handleSaveUpcoming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingForm.title?.trim() || !upcomingForm.author?.trim()) {
      alert('कृपया पुस्तक का नाम और लेखक दर्ज करें।');
      return;
    }

    if (editingUpcoming) {
      const updated = libraryService.updateUpcomingBook(editingUpcoming.id, upcomingForm);
      setUpcomingBooks(updated);
      showToast('✅ आगामी पुस्तक ऑर्डर अपडेट हो गया!');
    } else {
      libraryService.addUpcomingBook(upcomingForm as Omit<UpcomingLibraryBook, 'id' | 'requestedByCount'>);
      setUpcomingBooks(libraryService.getUpcomingBooks());
      showToast('🎉 नया आगामी पुस्तक ऑर्डर दर्ज हो गया!');
    }
    setShowUpcomingModal(false);
  };

  const handleDeleteUpcoming = (id: string, title: string) => {
    if (window.confirm(`क्या आप "${title}" के आगामी ऑर्डर को हटाना चाहते हैं?`)) {
      const updated = libraryService.deleteUpcomingBook(id);
      setUpcomingBooks(updated);
      showToast('🗑️ आगामी ऑर्डर हटा दिया गया।');
    }
  };

  const handleUpvoteBook = (id: string, title: string) => {
    const requesterName = user?.name || 'Student Reader';
    const updated = libraryService.requestUpcomingBook(id, requesterName);
    setUpcomingBooks(updated);
    showToast(`👍 आपने "${title}" पुस्तक के लिए अनुरोध दर्ज कर दिया है!`);
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleMarkArrived = (upcomingId: string, title: string) => {
    if (window.confirm(`क्या "${title}" लाइब्रेरी में पहुँच चुकी है और इसे उपलब्ध स्टॉक में जोड़ना चाहते हैं?`)) {
      const book = libraryService.markArrivedAndAddToCatalog(upcomingId);
      if (book) {
        setBooks(libraryService.getBooks());
        setUpcomingBooks(libraryService.getUpcomingBooks());
        showToast(`🎉 पुस्तक "${title}" अब आधिकारिक रूप से लाइब्रेरी स्टॉक में उपलब्ध है!`);
        confetti({ particleCount: 70, spread: 80 });
      }
    }
  };

  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestBookForm.title.trim()) {
      alert('कृपया पुस्तक का नाम लिखें।');
      return;
    }
    libraryService.addUpcomingBook({
      title: requestBookForm.title,
      author: requestBookForm.author || 'Author to be specified',
      branch: requestBookForm.branch,
      publisher: 'Student Requested Acquisition',
      expectedDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      copiesOrdered: 10,
      status: 'Recommended',
      estimatedCost: 'Under Review',
      requestedByNames: [user?.name || 'Student Applicant']
    });
    setUpcomingBooks(libraryService.getUpcomingBooks());
    setShowRequestBookModal(false);
    setRequestBookForm({ title: '', author: '', branch: 'Computer Science & Engineering', reason: '' });
    showToast('📝 आपकी पुस्तक मँगवाने की सिफारिश लाइब्रेरियन को भेज दी गई है!');
    confetti({ particleCount: 50, spread: 60 });
  };

  // --- SETTINGS / RESET ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = libraryService.updateSettings(settingsForm);
    setSettings(updated);
    setShowSettingsModal(false);
    showToast('✅ लाइब्रेरी नियम व सांख्यिकी अपडेट हो गई!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('क्या आप लाइब्रेरी का संपूर्ण डेटा (किताबें, जारी रिकॉर्ड, आगामी पुस्तकें) आधिकारिक डिफ़ॉल्ट पर रीसेट करना चाहते हैं?')) {
      libraryService.resetToDefault();
      setBooks(libraryService.getBooks());
      setIssuedRecords(libraryService.getIssuedRecords());
      setUpcomingBooks(libraryService.getUpcomingBooks());
      setSettings(libraryService.getSettings());
      showToast('🔄 लाइब्रेरी डेटा डिफ़ॉल्ट पर रीसेट कर दिया गया।');
    }
  };

  // Filter Catalog
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.isbn && b.isbn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = branchFilter === 'All' || b.branch.toLowerCase().includes(branchFilter.toLowerCase());
    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesBranch && matchesCat;
  });

  // Filter Issued
  const activeIssued = issuedRecords.filter(r => r.status !== 'Returned');
  const userIssued = isStudent
    ? issuedRecords.filter(r => r.borrowerEmail === user?.email || r.borrowerId === user?.rollNo)
    : isTeacher
    ? issuedRecords.filter(r => r.borrowerEmail === user?.email || r.borrowerId === user?.empCode)
    : issuedRecords;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-2xl border border-slate-700 animate-slide-up flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* LIBRARIAN / ADMIN CONTROLLER BAR */}
      {isLibrarian && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-polytechnic-950 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wide text-white">Digital Library In-Charge Controller</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase">
                  {isAdmin ? 'Admin Principal' : 'Librarian In-Charge'}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                उपलब्ध पुस्तकें जोड़ें/हटाएं, जारी पुस्तकें ट्रैक करें, व भविष्य में आने वाले ऑर्डर प्रबंधित करें।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleOpenAddBook}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> + नई पुस्तक जोड़ें
            </button>
            <button
              onClick={handleOpenAddUpcoming}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> + आगामी ऑर्डर जोड़ें
            </button>
            <button
              onClick={() => { setSettingsForm(settings); setShowSettingsModal(true); }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-300" /> नियम व आंकड़े
            </button>
            <button
              onClick={handleResetDefaults}
              title="Reset Library to Official Defaults"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-polytechnic-950 via-slate-900 to-polytechnic-900 text-white shadow-2xl border border-polytechnic-800 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Central Digital Library &amp; SC/ST Book Bank Scheme</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Digital E-Library &amp; Resource Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Access over 15,000+ technical textbooks, reference handbooks, BTEUP previous years' solved question papers, and national digital repository resources.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> In-Charge: <strong className="text-white">{settings.librarianName}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" /> {settings.librarianEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" /> {settings.librarianPhone}
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 flex-shrink-0">
          <span className="text-3xl font-black text-emerald-400">{settings.totalHoldings}</span>
          <div className="text-xs font-bold text-white uppercase tracking-wider">Book Holdings</div>
          <p className="text-[11px] text-blue-200">NDLI &amp; AICTE Consortium</p>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'catalog', label: '📚 उपलब्ध पुस्तकें व स्टॉक (Catalog)', count: books.length },
            { id: 'issued', label: '🔄 जारी पुस्तकें / अभी उपलब्ध नहीं (Issued)', count: activeIssued.length },
            { id: 'upcoming', label: '🚀 भविष्य में आने वाली (Upcoming & Pipeline)', count: upcomingBooks.length },
            { id: 'rules', label: '📊 नियम व आंकड़े (Rules & Stats)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'upcoming' && (
          <button
            onClick={() => setShowRequestBookModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-end sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> नई पुस्तक मँगवाने की सिफारिश करें
          </button>
        )}
      </div>

      {/* ================= TAB 1: ALL AVAILABLE CATALOG & STOCK ================= */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by book title, author, accession code (e.g. CSE-DS-01) or ISBN..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="All">All Engineering Branches</option>
                {BRANCH_OPTIONS.filter(b => b !== 'All').map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="All">All Categories</option>
                <option value="Core Curriculum">Core Curriculum</option>
                <option value="Reference">Reference</option>
                <option value="Competitive Exam">Competitive Exam</option>
                <option value="General Reading">General Reading</option>
                <option value="Digital E-Book">Digital E-Book</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => {
              return (
                <div
                  key={book.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  <div>
                    <div className="flex gap-4">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-20 h-28 rounded-xl object-cover shadow-md flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-1 text-xs min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {book.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            book.copiesAvailable > 5
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : book.copiesAvailable > 0
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          }`}>
                            {book.status}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-slate-500 font-medium truncate">By {book.author}</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">{book.branch}</p>
                        {book.rackLocation && (
                          <p className="text-[10px] text-slate-400 font-mono">📍 {book.rackLocation}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      <div>Pages: <strong className="text-slate-800 dark:text-slate-200">{book.pages}</strong></div>
                      <div>
                        Stock: <strong className={book.copiesAvailable > 0 ? "text-emerald-600" : "text-red-500"}>
                          {book.copiesAvailable} / {book.totalCopies} Copies
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      {book.isBookBankEligible ? (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                          ✓ SC/ST Book Bank
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Standard Lending</span>
                      )}

                      {book.pdfUrl && (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Read E-Book
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* Librarian / Admin Actions */}
                      {isLibrarian && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditBook(book)}
                            title="Edit Book Details"
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-blue-50 text-blue-600 text-xs font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id, book.title)}
                            title="Delete Book"
                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 text-red-600 text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleOpenIssueModal(book)}
                        disabled={book.copiesAvailable <= 0}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                          book.copiesAvailable > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <BookMarked className="w-3.5 h-3.5" />
                        <span>{book.copiesAvailable > 0 ? (isLibrarian ? 'Issue Book' : 'Borrow / Issue') : 'Out of Stock'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-slate-500 font-bold text-sm">No books found matching search criteria.</p>
              {isLibrarian && (
                <button
                  onClick={handleOpenAddBook}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> + Add New Book to Library
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: CURRENTLY ISSUED BOOKS (क्या अभी नहीं है) ================= */}
      {activeTab === 'issued' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Currently Issued Books &amp; Lending Status (जारी की गई पुस्तकें / अभी उपलब्ध नहीं)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                कुल {activeIssued.length} पुस्तकें छात्रों व शिक्षकों द्वारा जारी हैं। पुस्तक वापस जमा करते ही स्टॉक में अपने-आप जुड़ जाएगी।
              </p>
            </div>

            {isLibrarian && (
              <button
                onClick={() => {
                  if (books.length > 0) handleOpenIssueModal(books[0]);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md flex-shrink-0"
              >
                <Plus className="w-4 h-4" /> + नई किताब जारी करें
              </button>
            )}
          </div>

          {/* Issued Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userIssued.map(rec => {
              const isOverdue = rec.status === 'Overdue';
              const isReturned = rec.status === 'Returned';
              return (
                <div
                  key={rec.id}
                  className={`p-5 rounded-3xl border shadow-card flex flex-col justify-between space-y-3 transition-all ${
                    isReturned
                      ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-60'
                      : isOverdue
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-900/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {rec.bookCode}
                        </span>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">
                          {rec.bookTitle}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isReturned
                          ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          : isOverdue
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {rec.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span>Issued To:</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{rec.borrowerName} ({rec.borrowerType})</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Roll No / ID:</span>
                        <span className="font-mono font-semibold">{rec.borrowerId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Issue Date:</span>
                        <span className="font-mono">{rec.issueDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Due Date:</span>
                        <strong className={`font-mono ${isOverdue ? 'text-red-600' : 'text-slate-800 dark:text-slate-200'}`}>
                          {rec.dueDate}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {isOverdue && (
                      <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Overdue Fine: ₹{rec.fineAmount || 14}
                      </span>
                    )}
                    {isReturned && (
                      <span className="text-[10px] font-bold text-slate-500">
                        Returned on {rec.returnDate}
                      </span>
                    )}
                    {!isOverdue && !isReturned && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Lending
                      </span>
                    )}

                    {isLibrarian && !isReturned && (
                      <button
                        onClick={() => handleReturnBook(rec.id, rec.bookTitle)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> वापस जमा करें (Return)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {userIssued.length === 0 && (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
              कोई भी जारी पुस्तक रिकॉर्ड नहीं मिला।
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: UPCOMING & REQUESTED BOOKS (क्या Future में आने वाला है) ================= */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Future Upcoming Books &amp; Procurement Pipeline (भविष्य में आने वाली पुस्तकें)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ये पुस्तकें वर्तमान में ऑर्डर हो चुकी हैं या रास्ते में हैं। छात्र और शिक्षक अपनी पसंद की पुस्तक पर Upvote/Request कर सकते हैं।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRequestBookModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> नई पुस्तक मँगवाएं
              </button>
              {isLibrarian && (
                <button
                  onClick={handleOpenAddUpcoming}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" /> + नया ऑर्डर दर्ज करें
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingBooks.map(up => (
              <div
                key={up.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {up.branch}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          up.status === 'In Transit'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : up.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {up.status}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {up.title}
                      </h4>
                      <p className="text-xs text-slate-500">By {up.author} • Publisher: {up.publisher}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-blue-600 font-mono block">
                        {up.copiesOrdered} Copies
                      </span>
                      <span className="text-[10px] text-slate-400">Ordered Stock</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span>Expected Library Arrival:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{up.expectedDate}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Student &amp; Faculty Requests:</span>
                      <span className="font-bold text-emerald-600">{up.requestedByCount} readers requested</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleUpvoteBook(up.id, up.title)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> मुझे भी चाहिए ({up.requestedByCount})
                  </button>

                  <div className="flex items-center gap-2">
                    {isLibrarian && (
                      <>
                        <button
                          onClick={() => handleMarkArrived(up.id, up.title)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Arrived
                        </button>
                        <button
                          onClick={() => handleOpenEditUpcoming(up)}
                          className="p-1.5 rounded-lg border text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUpcoming(up.id, up.title)}
                          className="p-1.5 rounded-lg border text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: RULES & BOOK BANK ================= */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Total Volumes</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{settings.totalHoldings}</div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Print &amp; Digital</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">E-Books &amp; Journals</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{settings.ebooksCount}</div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">NDLI Repository</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">SC/ST Book Bank</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{settings.bookBankSets}</div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Full Semester Free</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Active Readers</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{settings.activeReaders}</div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Students &amp; Faculty</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Library Circulation Rules &amp; SC/ST Book Bank Scheme</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">📖 General Circulation Rules</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Diploma Students can issue up to <strong>{settings.maxBooksPerStudent} books</strong> at a time.</li>
                  <li>Standard borrowing duration is <strong>{settings.maxDaysAllowed} days</strong>.</li>
                  <li>Overdue fine after due date is <strong>₹{settings.lateFinePerDay} per day per book</strong>.</li>
                  <li>Library smart card is mandatory for physical book lending.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 space-y-2 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">🎓 SC/ST &amp; Meritorious Book Bank</h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Complete semester textbook set provided free for the full semester.</li>
                  <li>Books must be returned within 7 days after the final BTEUP theory examinations.</li>
                  <li>Special competitive exam books (JE, GATE, PSU) available in reference section.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BOOK ================= */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>{editingBook ? 'पुस्तक विवरण बदलें (Edit Book)' : 'नई पुस्तक जोड़ें (Add Book to Catalog)'}</span>
              </h3>
              <button onClick={() => setShowAddBookModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Book Title (पुस्तक का नाम) *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title || ''}
                    onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="e.g. Data Structures & Algorithms in C"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author Name (लेखक) *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author || ''}
                    onChange={e => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Reema Thareja"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Accession Code (बुक कोड) *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.code || ''}
                    onChange={e => setBookForm({ ...bookForm, code: e.target.value })}
                    placeholder="e.g. CSE-DS-01"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Branch (शाखा)</label>
                  <select
                    value={bookForm.branch || 'Computer Science & Engineering'}
                    onChange={e => setBookForm({ ...bookForm, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-medium"
                  >
                    {BRANCH_OPTIONS.filter(b => b !== 'All').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category (श्रेणी)</label>
                  <select
                    value={bookForm.category || 'Core Curriculum'}
                    onChange={e => setBookForm({ ...bookForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  >
                    <option value="Core Curriculum">Core Curriculum (मुख्य पाठ्यक्रम)</option>
                    <option value="Reference">Reference (संदर्भ ग्रंथ)</option>
                    <option value="Competitive Exam">Competitive Exam (प्रतियोगी परीक्षा)</option>
                    <option value="General Reading">General Reading (सामान्य ज्ञान)</option>
                    <option value="Digital E-Book">Digital E-Book (डिजिटल ई-बुक)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Copies in Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.totalCopies || 30}
                    onChange={e => {
                      const total = parseInt(e.target.value) || 1;
                      setBookForm({
                        ...bookForm,
                        totalCopies: total,
                        copiesAvailable: editingBook ? Math.min(bookForm.copiesAvailable || total, total) : total
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rack / Shelf Location</label>
                  <input
                    type="text"
                    value={bookForm.rackLocation || 'Rack 1, Shelf A'}
                    onChange={e => setBookForm({ ...bookForm, rackLocation: e.target.value })}
                    placeholder="e.g. Rack 4, Shelf B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pages Count</label>
                  <input
                    type="number"
                    value={bookForm.pages || 450}
                    onChange={e => setBookForm({ ...bookForm, pages: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ISBN Number</label>
                  <input
                    type="text"
                    value={bookForm.isbn || ''}
                    onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })}
                    placeholder="e.g. 978-0198099307"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Digital PDF URL (Optional e-Book)</label>
                  <input
                    type="url"
                    value={bookForm.pdfUrl || ''}
                    onChange={e => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
                    placeholder="https://example.com/books/sample.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bookBankEligible"
                    checked={bookForm.isBookBankEligible}
                    onChange={e => setBookForm({ ...bookForm, isBookBankEligible: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="bookBankEligible" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Eligible for SC/ST Free Semester Book Bank Scheme (बुक बैंक योजना हेतु पात्र)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/30"
                >
                  {editingBook ? 'Save Changes' : 'Add to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ISSUE BOOK ================= */}
      {showIssueModal && selectedBookForIssue && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-600" />
                <span>Issue Book (पुस्तक जारी करें)</span>
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{selectedBookForIssue.title}</div>
              <div className="text-[11px] text-slate-500">By {selectedBookForIssue.author} • Code: <strong className="font-mono">{selectedBookForIssue.code}</strong></div>
              <div className="text-[11px] text-emerald-600 font-bold">Available in Stock: {selectedBookForIssue.copiesAvailable} Copies</div>
            </div>

            <form onSubmit={handleConfirmIssue} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Borrower Type (जारीकर्ता प्रकार) *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIssueForm({ ...issueForm, borrowerType: 'Student' })}
                    className={`py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      issueForm.borrowerType === 'Student'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" /> Student (छात्र)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIssueForm({ ...issueForm, borrowerType: 'Teacher' })}
                    className={`py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      issueForm.borrowerType === 'Teacher'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" /> Teacher / Faculty
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name (नाम) *</label>
                <input
                  type="text"
                  required
                  value={issueForm.borrowerName}
                  onChange={e => setIssueForm({ ...issueForm, borrowerName: e.target.value })}
                  placeholder="e.g. Sachin Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number / Employee Code *</label>
                <input
                  type="text"
                  required
                  value={issueForm.borrowerId}
                  onChange={e => setIssueForm({ ...issueForm, borrowerId: e.target.value })}
                  placeholder="e.g. E224412355001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lending Duration (दिन)</label>
                <select
                  value={issueForm.days}
                  onChange={e => setIssueForm({ ...issueForm, days: parseInt(e.target.value) || 21 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                >
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={21}>21 Days (3 Weeks - Standard)</option>
                  <option value={30}>30 Days (1 Month)</option>
                  <option value={90}>Full Semester (Book Bank Scheme)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md"
                >
                  Confirm &amp; Issue Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT UPCOMING BOOK ================= */}
      {showUpcomingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>{editingUpcoming ? 'आगामी ऑर्डर बदलें' : 'नया आगामी पुस्तक ऑर्डर जोड़ें'}</span>
              </h3>
              <button onClick={() => setShowUpcomingModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpcoming} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Book Title (पुस्तक का नाम) *</label>
                <input
                  type="text"
                  required
                  value={upcomingForm.title || ''}
                  onChange={e => setUpcomingForm({ ...upcomingForm, title: e.target.value })}
                  placeholder="e.g. Generative AI & Python Deep Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author Name (लेखक) *</label>
                <input
                  type="text"
                  required
                  value={upcomingForm.author || ''}
                  onChange={e => setUpcomingForm({ ...upcomingForm, author: e.target.value })}
                  placeholder="e.g. Aurélien Géron"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Branch (शाखा)</label>
                  <select
                    value={upcomingForm.branch || 'Computer Science & Engineering'}
                    onChange={e => setUpcomingForm({ ...upcomingForm, branch: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs"
                  >
                    {BRANCH_OPTIONS.filter(b => b !== 'All').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={upcomingForm.status || 'Approved'}
                    onChange={e => setUpcomingForm({ ...upcomingForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs font-bold"
                  >
                    <option value="Approved">Approved (मंजूर)</option>
                    <option value="In Transit">In Transit (रास्ते में)</option>
                    <option value="Recommended">Recommended (सिफारिश)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expected Arrival Date</label>
                  <input
                    type="date"
                    value={upcomingForm.expectedDate || ''}
                    onChange={e => setUpcomingForm({ ...upcomingForm, expectedDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Copies Ordered</label>
                  <input
                    type="number"
                    value={upcomingForm.copiesOrdered || 15}
                    onChange={e => setUpcomingForm({ ...upcomingForm, copiesOrdered: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpcomingModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md"
                >
                  Save Upcoming Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: STUDENT / TEACHER REQUEST BOOK ================= */}
      {showRequestBookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Recommend a Book for Library (नई पुस्तक की सिफारिश करें)</span>
              </h3>
              <button onClick={() => setShowRequestBookModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              यदि कोई पुस्तक लाइब्रेरी में उपलब्ध नहीं है, तो उसका नाम यहाँ दर्ज करें। लाइब्रेरियन इसे अगले प्रोक्योरमेंट ऑर्डर में शामिल करेंगे।
            </p>

            <form onSubmit={handleSubmitNewRequest} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Book Title (पुस्तक का नाम) *</label>
                <input
                  type="text"
                  required
                  value={requestBookForm.title}
                  onChange={e => setRequestBookForm({ ...requestBookForm, title: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author Name (लेखक)</label>
                <input
                  type="text"
                  value={requestBookForm.author}
                  onChange={e => setRequestBookForm({ ...requestBookForm, author: e.target.value })}
                  placeholder="e.g. Stuart Russell & Peter Norvig"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Branch / Subject</label>
                <select
                  value={requestBookForm.branch}
                  onChange={e => setRequestBookForm({ ...requestBookForm, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  {BRANCH_OPTIONS.filter(b => b !== 'All').map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason / Notes</label>
                <textarea
                  rows={2}
                  value={requestBookForm.reason}
                  onChange={e => setRequestBookForm({ ...requestBookForm, reason: e.target.value })}
                  placeholder="e.g. For final year diploma project or BTEUP exam preparation..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestBookModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-600/30"
                >
                  Submit Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: LIBRARY SETTINGS ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>Edit Library Rules &amp; Statistics (नियम व सांख्यिकी बदलें)</span>
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Total Holdings</label>
                  <input
                    type="text"
                    value={settingsForm.totalHoldings}
                    onChange={e => setSettingsForm({ ...settingsForm, totalHoldings: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">E-Books Count</label>
                  <input
                    type="text"
                    value={settingsForm.ebooksCount}
                    onChange={e => setSettingsForm({ ...settingsForm, ebooksCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">SC/ST Book Bank Sets</label>
                  <input
                    type="text"
                    value={settingsForm.bookBankSets}
                    onChange={e => setSettingsForm({ ...settingsForm, bookBankSets: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Active Readers</label>
                  <input
                    type="text"
                    value={settingsForm.activeReaders}
                    onChange={e => setSettingsForm({ ...settingsForm, activeReaders: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Max Books per Student</label>
                  <input
                    type="number"
                    value={settingsForm.maxBooksPerStudent}
                    onChange={e => setSettingsForm({ ...settingsForm, maxBooksPerStudent: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Late Fine per Day (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.lateFinePerDay}
                    onChange={e => setSettingsForm({ ...settingsForm, lateFinePerDay: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div>
                  <label className="block font-bold mb-1">Librarian In-Charge Name</label>
                  <input
                    type="text"
                    value={settingsForm.librarianName}
                    onChange={e => setSettingsForm({ ...settingsForm, librarianName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.librarianEmail}
                      onChange={e => setSettingsForm({ ...settingsForm, librarianEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={settingsForm.librarianPhone}
                      onChange={e => setSettingsForm({ ...settingsForm, librarianPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
