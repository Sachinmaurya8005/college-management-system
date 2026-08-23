import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCollegeData } from './context/CollegeDataContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ArrowLeft, Globe } from 'lucide-react';

// Public Website Views
import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { PublicCoursesPage } from './components/public/PublicCoursesPage';
import { PublicFacultyPage } from './components/public/PublicFacultyPage';
import { FacilitiesPage } from './components/public/FacilitiesPage';
import { GalleryPage } from './components/public/GalleryPage';
import { PublicFeesPage } from './components/public/PublicFeesPage';
import { PublicTimetablePage } from './components/public/PublicTimetablePage';
import { PublicExamPage } from './components/public/PublicExamPage';
import { PublicNoticeBoardPage } from './components/public/PublicNoticeBoardPage';
import { ImportantLinksPage } from './components/public/ImportantLinksPage';
import { LocationContactPage } from './components/public/LocationContactPage';
import { PlacementCellPage } from './components/public/PlacementCellPage';
import { DigitalLibraryPage } from './components/public/DigitalLibraryPage';
import { AICampusAssistant } from './components/common/AICampusAssistant';
import { RealtimeLiveToastStream } from './components/common/RealtimeLiveToastStream';

// Portal Views
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { StudentList } from './components/students/StudentList';
import { AddEditStudentModal } from './components/students/AddEditStudentModal';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { TeacherList } from './components/teachers/TeacherList';
import { AddEditTeacherModal } from './components/teachers/AddEditTeacherModal';
import { TeacherProfileModal } from './components/teachers/TeacherProfileModal';
import { AttendanceModule } from './components/attendance/AttendanceModule';
import { FeesManagement } from './components/fees/FeesManagement';
import { FeeReceiptModal } from './components/fees/FeeReceiptModal';
import { ExaminationModule } from './components/examination/ExaminationModule';
import { MarksheetModal } from './components/examination/MarksheetModal';
import { TimetableModule } from './components/timetable/TimetableModule';
import { NoticeBoard } from './components/notices/NoticeBoard';
import { AddEditNoticeModal } from './components/notices/AddEditNoticeModal';
import { CoursesList } from './components/courses/CoursesList';
import { ReportsHub } from './components/reports/ReportsHub';
import { SettingsPage } from './components/settings/SettingsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { UniversalApplicationsView } from './components/portal/common/UniversalApplicationsView';
import { StudentMyFeesView } from './components/portal/student/StudentMyFeesView';
import { StudentMyAttendanceView } from './components/portal/student/StudentMyAttendanceView';
import { StudentMyResultsView } from './components/portal/student/StudentMyResultsView';
import { WebsiteContentManager } from './components/portal/admin/WebsiteContentManager';
import { ApprovalsView } from './components/portal/staff/ApprovalsView';
import { PrincipalPayrollDisbursalModule } from './components/payroll/PrincipalPayrollDisbursalModule';
import { TeacherMySalaryView } from './components/payroll/TeacherMySalaryView';

import { Student, Teacher, FeeRecord, StudentResult } from './types';

export const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { students, teachers, fees, results } = useCollegeData();

  // Navigation mode: 'public' or 'portal'
  const [isInPortalMode, setIsInPortalMode] = useState<boolean>(false);
  const [publicView, setPublicView] = useState<string>('home');
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Modals State
  const [studentAddModalOpen, setStudentAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [teacherAddModalOpen, setTeacherAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  const [noticeAddModalOpen, setNoticeAddModalOpen] = useState(false);

  const [activeReceiptFee, setActiveReceiptFee] = useState<FeeRecord | null>(null);
  const [activeMarksheetResult, setActiveMarksheetResult] = useState<StudentResult | null>(null);

  // Switch to portal mode on login, and public mode when unauthenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsInPortalMode(true);
    } else {
      setIsInPortalMode(false);
      setPublicView('home');
    }
  }, [isAuthenticated, user]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Full Browser Back & Forward Tab History Navigation Support (⬅ / ➡)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (event.state.isInPortalMode !== undefined) {
          setIsInPortalMode(event.state.isInPortalMode);
        }
        if (event.state.publicView) {
          setPublicView(event.state.publicView);
        }
        if (event.state.currentView) {
          setCurrentView(event.state.currentView);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: string, metadata?: any) => {
    if (view === 'view-public-web' || view === 'website') {
      setIsInPortalMode(false);
      setPublicView('home');
      window.history.pushState({ isInPortalMode: false, publicView: 'home', currentView }, '', '#home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    window.history.pushState({ isInPortalMode: true, publicView, currentView: view }, '', `#portal-${view}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (metadata?.studentId) {
      const std = students.find(s => s.id === metadata.studentId);
      if (std) setViewingStudent(std);
    }
    if (metadata?.teacherId) {
      const tch = teachers.find(t => t.id === metadata.teacherId);
      if (tch) setViewingTeacher(tch);
    }
  };

  const handlePublicNavigate = (route: string) => {
    setPublicView(route);
    window.history.pushState({ isInPortalMode: false, publicView: route, currentView }, '', `#${route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReceiptById = (feeId: string) => {
    const target = fees.find(f => f.id === feeId);
    if (target) setActiveReceiptFee(target);
  };

  const handleOpenMarksheetById = (resultId: string) => {
    const target = results.find(r => r.id === resultId);
    if (target) setActiveMarksheetResult(target);
  };

  // Render Public Website if not in portal mode
  if (!isInPortalMode || !isAuthenticated || !user) {
    const renderPublicContent = () => {
      switch (publicView) {
        case 'home':
          return (
            <HomePage
              onNavigate={handlePublicNavigate}
            />
          );
        case 'about':
          return <AboutPage />;
        case 'courses':
          return <PublicCoursesPage />;
        case 'faculty':
          return <PublicFacultyPage />;
        case 'facilities':
          return <FacilitiesPage />;
        case 'gallery':
          return <GalleryPage />;
        case 'placements':
          return <PlacementCellPage />;
        case 'library':
          return <DigitalLibraryPage />;
        case 'fees':
          return <PublicFeesPage />;
        case 'timetable':
          return <PublicTimetablePage />;
        case 'examinations':
          return <PublicExamPage />;
        case 'notices':
          return <PublicNoticeBoardPage />;
        case 'links':
        case 'important-links':
          return <ImportantLinksPage />;
        case 'location':
        case 'contact':
          return <LocationContactPage />;
        case 'login':
          return (
            <div className="py-6">
              <LoginPage
                onLoginSuccess={() => {
                  setIsInPortalMode(true);
                  setCurrentView('dashboard');
                }}
                onGoToHome={() => handlePublicNavigate('home')}
              />
            </div>
          );
        default:
          return (
            <HomePage
              onNavigate={handlePublicNavigate}
            />
          );
      }
    };

    return (
      <PublicLayout
        currentRoute={publicView}
        onNavigate={handlePublicNavigate}
        onReturnToPortal={isAuthenticated ? () => setIsInPortalMode(true) : undefined}
      >
        {renderPublicContent()}
      </PublicLayout>
    );
  }

  // Render Authenticated Portal
  const renderCurrentPortalView = () => {
    switch (currentView) {
      case 'dashboard':
        if (user.role === 'admin') {
          return (
            <AdminDashboard
              onNavigate={navigateTo}
              onOpenAddStudent={() => setStudentAddModalOpen(true)}
              onOpenAddTeacher={() => setTeacherAddModalOpen(true)}
              onOpenAddNotice={() => setNoticeAddModalOpen(true)}
            />
          );
        } else if (user.role === 'teacher') {
          return <TeacherDashboard onNavigate={navigateTo} />;
        } else {
          return (
            <StudentDashboard
              onNavigate={navigateTo}
              onOpenReceipt={handleOpenReceiptById}
              onOpenMarksheet={handleOpenMarksheetById}
            />
          );
        }

      case 'students':
        return (
          <StudentList
            onOpenAddModal={() => setStudentAddModalOpen(true)}
            onOpenEditModal={std => setEditingStudent(std)}
            onOpenProfileModal={std => setViewingStudent(std)}
          />
        );

      case 'teachers':
        return (
          <TeacherList
            onOpenAddModal={() => setTeacherAddModalOpen(true)}
            onOpenEditModal={tch => setEditingTeacher(tch)}
            onOpenProfileModal={tch => setViewingTeacher(tch)}
          />
        );

      case 'attendance':
        return user.role === 'student' ? <StudentMyAttendanceView /> : <AttendanceModule />;

      case 'payroll':
        return user.role === 'admin' ? <PrincipalPayrollDisbursalModule /> : <TeacherMySalaryView />;

      case 'my-salary':
        return <TeacherMySalaryView />;

      case 'fees':
        return user.role === 'student' ? <StudentMyFeesView /> : <FeesManagement />;

      case 'examination':
        return user.role === 'student' ? <StudentMyResultsView /> : <ExaminationModule />;

      case 'timetable':
        return <TimetableModule />;

      case 'applications':
        return <UniversalApplicationsView />;

      case 'approvals':
        return <ApprovalsView />;

      case 'content-manager':
        return <WebsiteContentManager />;

      case 'notices':
        return <NoticeBoard />;

      case 'placements':
        return <PlacementCellPage />;

      case 'library':
        return <DigitalLibraryPage />;

      case 'courses':
        return <CoursesList />;

      case 'reports':
        return <ReportsHub />;

      case 'settings':
        return <SettingsPage />;

      case 'profile':
        return (
          <ProfilePage
            onNavigate={navigateTo}
            onGoToPublicWebsite={() => {
              setIsInPortalMode(false);
              setPublicView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        );

      default:
        return (
          <AdminDashboard
            onNavigate={navigateTo}
            onOpenAddStudent={() => setStudentAddModalOpen(true)}
            onOpenAddTeacher={() => setTeacherAddModalOpen(true)}
            onOpenAddNotice={() => setNoticeAddModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={navigateTo}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onGoToPublicWebsite={() => {
          setIsInPortalMode(false);
          setPublicView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Layout Container */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={navigateTo}
        />

        {/* Dynamic Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPortalView()}
        </main>

        {/* Institutional Footer */}
        <Footer />
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Add / Edit Student Modal */}
      <AddEditStudentModal
        isOpen={studentAddModalOpen || !!editingStudent}
        onClose={() => {
          setStudentAddModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
      />

      {/* View Student Profile & ID Card Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onOpenReceipt={handleOpenReceiptById}
        onOpenMarksheet={handleOpenMarksheetById}
      />

      {/* Add / Edit Teacher Modal */}
      <AddEditTeacherModal
        isOpen={teacherAddModalOpen || !!editingTeacher}
        onClose={() => {
          setTeacherAddModalOpen(false);
          setEditingTeacher(null);
        }}
        teacher={editingTeacher}
      />

      {/* View Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={!!viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        teacher={viewingTeacher}
      />

      {/* Add Notice Modal */}
      <AddEditNoticeModal
        isOpen={noticeAddModalOpen}
        onClose={() => setNoticeAddModalOpen(false)}
      />

      {/* Global Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={!!activeReceiptFee}
        onClose={() => setActiveReceiptFee(null)}
        feeRecord={activeReceiptFee}
      />

      {/* Global Marksheet Modal */}
      <MarksheetModal
        isOpen={!!activeMarksheetResult}
        onClose={() => setActiveMarksheetResult(null)}
        result={activeMarksheetResult}
      />

      {/* Real-time Live Activity Event Stream Toast */}
      <RealtimeLiveToastStream />

      {/* 24/7 Intelligent AI Campus Assistant Helpdesk */}
      <AICampusAssistant
        onNavigate={(view) => {
          if (isInPortalMode) {
            navigateTo(view);
          } else {
            handlePublicNavigate(view);
          }
        }}
      />
    </div>
  );
};
