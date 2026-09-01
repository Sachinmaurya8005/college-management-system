import {
  LibraryBook,
  IssuedBookRecord,
  UpcomingLibraryBook,
  LibrarySettingsData
} from '../types';

export const DEFAULT_LIBRARY_STATS: LibrarySettingsData = {
  totalHoldings: '15,480+',
  ebooksCount: '4,200+',
  bookBankSets: '2,800+',
  activeReaders: '620+',
  maxBooksPerStudent: 4,
  maxDaysAllowed: 21,
  lateFinePerDay: 2,
  librarianName: 'Dr. Sunita Devi (M.Lib.I.Sc)',
  librarianEmail: 'library@polytechnic.edu',
  librarianPhone: '+91 94150 44321'
};

export const DEFAULT_BOOKS: LibraryBook[] = [
  {
    id: 'bk-01',
    title: 'Data Structures & Algorithms in C',
    author: 'Reema Thareja',
    branch: 'Computer Science & Engineering',
    code: 'CSE-DS-01',
    isbn: '978-0198099307',
    pages: 584,
    totalCopies: 45,
    copiesAvailable: 38,
    rackLocation: 'Rack 4, Shelf A',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '2nd Edition (Oxford University Press)',
    status: 'Available'
  },
  {
    id: 'bk-02',
    title: 'Theory of Machines & Mechanisms',
    author: 'R. S. Khurmi & J. K. Gupta',
    branch: 'Mechanical Engineering',
    code: 'ME-TOM-02',
    isbn: '978-8121925242',
    pages: 720,
    totalCopies: 40,
    copiesAvailable: 29,
    rackLocation: 'Rack 2, Shelf C',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1537432376769-00f5c244c8d8?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '14th Revised Edition (S. Chand)',
    status: 'Available'
  },
  {
    id: 'bk-03',
    title: 'Surveying & Levelling (Vol I & II)',
    author: 'Dr. B. C. Punmia & Ashok Jain',
    branch: 'Civil Engineering',
    code: 'CE-SURV-03',
    isbn: '978-8170088530',
    pages: 640,
    totalCopies: 35,
    copiesAvailable: 24,
    rackLocation: 'Rack 1, Shelf B',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '16th Edition (Laxmi Publications)',
    status: 'Available'
  },
  {
    id: 'bk-04',
    title: 'Electrical Technology (AC/DC Machines)',
    author: 'B. L. Theraja & A. K. Theraja',
    branch: 'Electrical Engineering',
    code: 'EE-TECH-04',
    isbn: '978-8121924405',
    pages: 890,
    totalCopies: 55,
    copiesAvailable: 48,
    rackLocation: 'Rack 3, Shelf A',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '23rd Multicolor Edition',
    status: 'Available'
  },
  {
    id: 'bk-05',
    title: 'Digital Principles and Applications',
    author: 'Donald P. Leach & Albert Paul Malvino',
    branch: 'Electronics Engineering',
    code: 'ECE-DIG-05',
    isbn: '978-9339203405',
    pages: 680,
    totalCopies: 32,
    copiesAvailable: 25,
    rackLocation: 'Rack 5, Shelf B',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '8th Special Indian Edition (McGraw Hill)',
    status: 'Available'
  },
  {
    id: 'bk-06',
    title: 'Computer Networks & Internet Protocols',
    author: 'Andrew S. Tanenbaum & David Wetherall',
    branch: 'Information Technology',
    code: 'IT-NET-06',
    isbn: '978-9332518742',
    pages: 940,
    totalCopies: 30,
    copiesAvailable: 19,
    rackLocation: 'Rack 4, Shelf C',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: '5th Pearson Indian Edition',
    status: 'Available'
  },
  {
    id: 'bk-07',
    title: 'Engineering Mathematics (Diploma Volume 1 & 2)',
    author: 'H. K. Dass & Rama Verma',
    branch: 'General / Applied Sciences',
    code: 'GEN-MATH-07',
    isbn: '978-9352834372',
    pages: 512,
    totalCopies: 60,
    copiesAvailable: 52,
    rackLocation: 'Rack 6, Shelf A',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: 'Revised BTEUP Curriculum Edition',
    status: 'Available'
  },
  {
    id: 'bk-08',
    title: 'Applied Physics & Technical Lab Manual',
    author: 'Dr. S. L. Gupta & Sanjeev Gupta',
    branch: 'General / Applied Sciences',
    code: 'GEN-PHY-08',
    isbn: '978-8177000887',
    pages: 420,
    totalCopies: 50,
    copiesAvailable: 44,
    rackLocation: 'Rack 6, Shelf B',
    isBookBankEligible: true,
    category: 'Core Curriculum',
    coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&h=280&fit=crop',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    edition: 'Dhanpat Rai Technical Series',
    status: 'Available'
  }
];

export const DEFAULT_ISSUED_RECORDS: IssuedBookRecord[] = [
  {
    id: 'iss-01',
    bookId: 'bk-01',
    bookTitle: 'Data Structures & Algorithms in C',
    bookCode: 'CSE-DS-01',
    borrowerName: 'Sachin Verma',
    borrowerType: 'Student',
    borrowerId: 'E224412355001',
    borrowerEmail: 'sachin.cse@polytechnic.edu',
    borrowerPhone: '+91 98765 43210',
    branch: 'Computer Science',
    issueDate: '2026-08-10',
    dueDate: '2026-08-31',
    status: 'Issued',
    fineAmount: 0
  },
  {
    id: 'iss-02',
    bookId: 'bk-02',
    bookTitle: 'Theory of Machines & Mechanisms',
    bookCode: 'ME-TOM-02',
    borrowerName: 'Pooja Singh',
    borrowerType: 'Student',
    borrowerId: 'E224412355002',
    borrowerEmail: 'pooja.me@polytechnic.edu',
    borrowerPhone: '+91 98765 43211',
    branch: 'Mechanical Engineering',
    issueDate: '2026-08-05',
    dueDate: '2026-08-26',
    status: 'Overdue',
    fineAmount: 14
  },
  {
    id: 'iss-03',
    bookId: 'bk-04',
    bookTitle: 'Electrical Technology (AC/DC Machines)',
    bookCode: 'EE-TECH-04',
    borrowerName: 'Er. Vinay Singh',
    borrowerType: 'Teacher',
    borrowerId: 'EMP-FAC-014',
    borrowerEmail: 'vinay.singh@polytechnic.ac.in',
    borrowerPhone: '+91 98380 98765',
    branch: 'Electrical Engineering',
    issueDate: '2026-08-12',
    dueDate: '2026-09-12',
    status: 'Issued',
    fineAmount: 0
  }
];

export const DEFAULT_UPCOMING_BOOKS: UpcomingLibraryBook[] = [
  {
    id: 'up-01',
    title: 'Generative AI & Python Deep Learning for Engineers',
    author: 'Aurélien Géron',
    branch: 'Computer Science & Engineering',
    publisher: "O'Reilly Media / Pearson",
    expectedDate: '2026-09-20',
    copiesOrdered: 15,
    requestedByCount: 42,
    requestedByNames: ['Sachin Verma', 'Ankit Maurya', 'Er. Alok Kumar'],
    status: 'In Transit',
    estimatedCost: '₹14,250'
  },
  {
    id: 'up-02',
    title: 'Electric Vehicles: Technology, Policy and Commercialization',
    author: 'Dr. James Larminie & John Lowry',
    branch: 'Electrical & Mechanical Engineering',
    publisher: 'Wiley Technical Press',
    expectedDate: '2026-09-28',
    copiesOrdered: 20,
    requestedByCount: 36,
    requestedByNames: ['Ravi Sharma', 'Pooja Singh', 'Dr. Sunita Devi'],
    status: 'Approved',
    estimatedCost: '₹18,500'
  },
  {
    id: 'up-03',
    title: 'Smart City Infrastructure & BIM 3D Design',
    author: 'Brad Hardin & Dave McCool',
    branch: 'Civil Engineering',
    publisher: 'Sybex / Wiley',
    expectedDate: '2026-10-05',
    copiesOrdered: 12,
    requestedByCount: 28,
    requestedByNames: ['Neha Gupta', 'Shubham Tiwari'],
    status: 'Recommended',
    estimatedCost: '₹11,400'
  },
  {
    id: 'up-04',
    title: 'BTEUP Previous 10 Years Solved Exam Master Series (2026-27)',
    author: 'UP Board of Technical Education Panel',
    branch: 'General / Applied Sciences',
    publisher: 'Vidya Prakashan Mandir',
    expectedDate: '2026-09-15',
    copiesOrdered: 50,
    requestedByCount: 84,
    requestedByNames: ['All 1st Year Diploma Batches'],
    status: 'In Transit',
    estimatedCost: '₹12,500'
  }
];

const STORAGE_KEYS = {
  BOOKS: 'gpb_library_catalog_books',
  ISSUED: 'gpb_library_issued_records',
  UPCOMING: 'gpb_library_upcoming_books',
  SETTINGS: 'gpb_library_settings_stats'
};

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('gpb_realtime_broadcast_channel')
  : null;

function notifyLibrary(type: string, data: any) {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload: data });
    } catch {
      // ignore
    }
  }
}

export const libraryService = {
  // --- STATS & SETTINGS ---
  getSettings(): LibrarySettingsData {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_LIBRARY_STATS;
  },

  updateSettings(updates: Partial<LibrarySettingsData>): LibrarySettingsData {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      notifyLibrary('LIBRARY_SETTINGS_UPDATED', updated);
    } catch (e) {
      console.error(e);
    }
    return updated;
  },

  // --- BOOKS CATALOG ---
  getBooks(): LibraryBook[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_BOOKS;
  },

  saveBooks(books: LibraryBook[]): LibraryBook[] {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
      notifyLibrary('LIBRARY_BOOKS_UPDATED', books);
    } catch (e) {
      console.error(e);
    }
    return books;
  },

  addBook(book: Omit<LibraryBook, 'id'>): LibraryBook {
    const list = this.getBooks();
    const newBook: LibraryBook = {
      ...book,
      id: 'bk-' + Date.now(),
      copiesAvailable: book.copiesAvailable ?? book.totalCopies,
      status: (book.copiesAvailable ?? book.totalCopies) > 0 ? 'Available' : 'Out of Stock'
    };
    list.unshift(newBook);
    this.saveBooks(list);
    return newBook;
  },

  updateBook(id: string, updates: Partial<LibraryBook>): LibraryBook[] {
    const list = this.getBooks();
    const idx = list.findIndex(b => b.id === id);
    if (idx !== -1) {
      const merged = { ...list[idx], ...updates };
      merged.status = merged.copiesAvailable > 5 ? 'Available' : merged.copiesAvailable > 0 ? 'Low Stock' : 'Out of Stock';
      list[idx] = merged;
      this.saveBooks(list);
    }
    return list;
  },

  deleteBook(id: string): LibraryBook[] {
    const list = this.getBooks().filter(b => b.id !== id);
    this.saveBooks(list);
    return list;
  },

  // --- ISSUED BOOKS RECORDS ---
  getIssuedRecords(): IssuedBookRecord[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.ISSUED);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ISSUED_RECORDS;
  },

  saveIssuedRecords(records: IssuedBookRecord[]): IssuedBookRecord[] {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUED, JSON.stringify(records));
      notifyLibrary('LIBRARY_ISSUED_UPDATED', records);
    } catch (e) {
      console.error(e);
    }
    return records;
  },

  issueBook(data: {
    bookId: string;
    borrowerName: string;
    borrowerType: 'Student' | 'Teacher';
    borrowerId: string;
    borrowerEmail?: string;
    borrowerPhone?: string;
    branch?: string;
    days?: number;
  }): IssuedBookRecord | null {
    const books = this.getBooks();
    const book = books.find(b => b.id === data.bookId);
    if (!book || book.copiesAvailable <= 0) {
      return null;
    }

    // Decrement available copies
    book.copiesAvailable = Math.max(0, book.copiesAvailable - 1);
    book.status = book.copiesAvailable > 5 ? 'Available' : book.copiesAvailable > 0 ? 'Low Stock' : 'Out of Stock';
    this.saveBooks(books);

    const issueDateObj = new Date();
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (data.days || 21));

    const newRecord: IssuedBookRecord = {
      id: 'iss-' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      bookCode: book.code,
      borrowerName: data.borrowerName,
      borrowerType: data.borrowerType,
      borrowerId: data.borrowerId,
      borrowerEmail: data.borrowerEmail,
      borrowerPhone: data.borrowerPhone,
      branch: data.branch || book.branch,
      issueDate: issueDateObj.toISOString().split('T')[0],
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'Issued',
      fineAmount: 0
    };

    const records = this.getIssuedRecords();
    records.unshift(newRecord);
    this.saveIssuedRecords(records);
    return newRecord;
  },

  returnBook(recordId: string): IssuedBookRecord[] {
    const records = this.getIssuedRecords();
    const recIdx = records.findIndex(r => r.id === recordId);
    if (recIdx !== -1) {
      const rec = records[recIdx];
      rec.status = 'Returned';
      rec.returnDate = new Date().toISOString().split('T')[0];

      // Restore book copy to stock
      const books = this.getBooks();
      const book = books.find(b => b.id === rec.bookId);
      if (book) {
        book.copiesAvailable = Math.min(book.totalCopies, book.copiesAvailable + 1);
        book.status = book.copiesAvailable > 5 ? 'Available' : book.copiesAvailable > 0 ? 'Low Stock' : 'Out of Stock';
        this.saveBooks(books);
      }
      this.saveIssuedRecords(records);
    }
    return records;
  },

  // --- UPCOMING / REQUESTED BOOKS ---
  getUpcomingBooks(): UpcomingLibraryBook[] {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.UPCOMING);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_UPCOMING_BOOKS;
  },

  saveUpcomingBooks(list: UpcomingLibraryBook[]): UpcomingLibraryBook[] {
    try {
      localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(list));
      notifyLibrary('LIBRARY_UPCOMING_UPDATED', list);
    } catch (e) {
      console.error(e);
    }
    return list;
  },

  addUpcomingBook(book: Omit<UpcomingLibraryBook, 'id' | 'requestedByCount'>): UpcomingLibraryBook {
    const list = this.getUpcomingBooks();
    const newBook: UpcomingLibraryBook = {
      ...book,
      id: 'up-' + Date.now(),
      requestedByCount: 1,
      requestedByNames: book.requestedByNames || ['Librarian Procurement']
    };
    list.unshift(newBook);
    this.saveUpcomingBooks(list);
    return newBook;
  },

  updateUpcomingBook(id: string, updates: Partial<UpcomingLibraryBook>): UpcomingLibraryBook[] {
    const list = this.getUpcomingBooks();
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveUpcomingBooks(list);
    }
    return list;
  },

  deleteUpcomingBook(id: string): UpcomingLibraryBook[] {
    const list = this.getUpcomingBooks().filter(u => u.id !== id);
    this.saveUpcomingBooks(list);
    return list;
  },

  requestUpcomingBook(id: string, requesterName: string): UpcomingLibraryBook[] {
    const list = this.getUpcomingBooks();
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      const item = list[idx];
      const names = item.requestedByNames || [];
      if (!names.includes(requesterName)) {
        names.push(requesterName);
        item.requestedByNames = names;
        item.requestedByCount = (item.requestedByCount || 0) + 1;
        this.saveUpcomingBooks(list);
      }
    }
    return list;
  },

  markArrivedAndAddToCatalog(upcomingId: string, rackLocation: string = 'Rack 1'): LibraryBook | null {
    const upcomingList = this.getUpcomingBooks();
    const upcoming = upcomingList.find(u => u.id === upcomingId);
    if (!upcoming) return null;

    // Create book in catalog
    const newBook = this.addBook({
      title: upcoming.title,
      author: upcoming.author,
      branch: upcoming.branch,
      code: 'LIB-' + Math.floor(1000 + Math.random() * 9000),
      pages: 450,
      totalCopies: upcoming.copiesOrdered || 10,
      copiesAvailable: upcoming.copiesOrdered || 10,
      rackLocation,
      isBookBankEligible: true,
      category: 'Core Curriculum',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop',
      edition: upcoming.publisher || 'Latest Edition',
      status: 'Available'
    });

    // Delete from upcoming
    this.deleteUpcomingBook(upcomingId);
    return newBook;
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.BOOKS);
    localStorage.removeItem(STORAGE_KEYS.ISSUED);
    localStorage.removeItem(STORAGE_KEYS.UPCOMING);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    notifyLibrary('LIBRARY_DATA_RESET', null);
  }
};
