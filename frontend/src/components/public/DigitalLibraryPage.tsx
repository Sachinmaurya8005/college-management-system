import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DigitalLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [issuedBooks, setIssuedBooks] = useState<string[]>([]);

  const LIBRARY_STATS = [
    { label: 'Total Volume Holdings', value: '15,480+', sub: 'Print & Digital Copies' },
    { label: 'E-Books & Journals', value: '4,200+', sub: 'NDLI Subscription' },
    { label: 'SC/ST Book Bank Sets', value: '2,800+', sub: 'Free Semester Distribution' },
    { label: 'Active Student Readers', value: '620+', sub: 'Daily Footfall & Online' }
  ];

  const BOOKS_CATALOG = [
    {
      id: 'bk-01',
      title: 'Data Structures & Algorithms in C',
      author: 'Reema Thareja',
      branch: 'Computer Science & Engineering',
      code: 'CSE-DS-01',
      pages: 584,
      copiesAvailable: 42,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=280&fit=crop'
    },
    {
      id: 'bk-02',
      title: 'Theory of Machines & Mechanisms',
      author: 'R. S. Khurmi & J. K. Gupta',
      branch: 'Mechanical Engineering',
      code: 'ME-TOM-02',
      pages: 720,
      copiesAvailable: 35,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1537432376769-00f5c244c8d8?w=200&h=280&fit=crop'
    },
    {
      id: 'bk-03',
      title: 'Surveying & Levelling (Vol I & II)',
      author: 'Dr. B. C. Punmia',
      branch: 'Civil Engineering',
      code: 'CE-SURV-03',
      pages: 640,
      copiesAvailable: 28,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=200&h=280&fit=crop'
    },
    {
      id: 'bk-04',
      title: 'Electrical Technology (AC/DC Machines)',
      author: 'B. L. Theraja & A. K. Theraja',
      branch: 'Electrical Engineering',
      code: 'EE-TECH-04',
      pages: 890,
      copiesAvailable: 50,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=280&fit=crop'
    },
    {
      id: 'bk-05',
      title: 'Digital Principles and Applications',
      author: 'Donald P. Leach & Albert Paul Malvino',
      branch: 'Electronics Engineering',
      code: 'ECE-DIG-05',
      pages: 680,
      copiesAvailable: 30,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=280&fit=crop'
    },
    {
      id: 'bk-06',
      title: 'Computer Networks & Internet Security',
      author: 'Andrew S. Tanenbaum',
      branch: 'Information Technology',
      code: 'IT-NET-06',
      pages: 940,
      copiesAvailable: 22,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=280&fit=crop'
    }
  ];

  const filteredBooks = BOOKS_CATALOG.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'All' || b.branch.includes(branchFilter);
    return matchesSearch && matchesBranch;
  });

  const handleIssueBook = (id: string) => {
    if (!issuedBooks.includes(id)) {
      setIssuedBooks(prev => [...prev, id]);
      confetti({ particleCount: 40, spread: 60 });
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
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
        </div>

        <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center space-y-2 flex-shrink-0">
          <span className="text-3xl font-black text-emerald-400">15,480+</span>
          <div className="text-xs font-bold text-white uppercase tracking-wider">Book Holdings</div>
          <p className="text-[11px] text-blue-200">NDLI &amp; AICTE Consortium</p>
        </div>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {LIBRARY_STATS.map((stat, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stat.value}</div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search books by title, author name, or subject code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
          />
        </div>

        <select
          value={branchFilter}
          onChange={e => setBranchFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-600"
        >
          <option value="All">All Engineering Branches</option>
          <option value="Computer">Computer Science &amp; Engg</option>
          <option value="Mechanical">Mechanical Engineering</option>
          <option value="Civil">Civil Engineering</option>
          <option value="Electrical">Electrical Engineering</option>
          <option value="Electronics">Electronics Engineering</option>
          <option value="Information">Information Technology</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => {
          const isIssued = issuedBooks.includes(book.id);
          return (
            <div
              key={book.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex gap-4">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-20 h-28 rounded-xl object-cover shadow-md flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1 text-xs">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {book.code}
                    </span>
                    <h3 className="font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-slate-500 font-medium">By {book.author}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{book.branch}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>Pages: <strong className="text-slate-800 dark:text-slate-200">{book.pages}</strong></div>
                  <div>Available: <strong className="text-emerald-600">{book.copiesAvailable} Copies</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  ✓ SC/ST Book Bank
                </span>

                {isIssued ? (
                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Book Issued
                  </button>
                ) : (
                  <button
                    onClick={() => handleIssueBook(book.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                  >
                    <BookMarked className="w-3.5 h-3.5" /> Issue Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
