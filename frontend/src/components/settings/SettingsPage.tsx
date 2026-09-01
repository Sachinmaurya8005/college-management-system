import React, { useState } from 'react';
import {
  Settings,
  Building,
  Shield,
  Bell,
  Moon,
  Sun,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCollegeData } from '../../context/CollegeDataContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CollegeLogo } from '../common/CollegeLogo';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { websiteContentService } from '../../services/websiteContentService';
import confetti from 'canvas-confetti';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useCollegeData();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'college' | 'security' | 'appearance' | 'system'>('college');
  const [collegeForm, setCollegeForm] = useState({ ...settings });
  const [adminProfileForm, setAdminProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(collegeForm);
    await websiteContentService.updateAboutCollege({
      college_name: collegeForm.collegeName,
      hindi_name: collegeForm.hindiName,
      bteup_code: collegeForm.bteupCode,
      principal_name: collegeForm.principalName
    });
    setSaveSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfileForm.newPassword && adminProfileForm.newPassword !== adminProfileForm.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    updateUser({
      name: adminProfileForm.name,
      email: adminProfileForm.email,
      phone: adminProfileForm.phone
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Institutional Settings &amp; Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Government Polytechnic • Branding, System &amp; Security Controls
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
          </div>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <button
          onClick={() => setActiveTab('college')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'college'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" /> College Branding &amp; Info
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" /> Admin Credentials
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'appearance'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Moon className="w-4 h-4" /> Appearance &amp; Theme
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'system'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" /> System &amp; Demo Data
        </button>
      </div>

      {/* Tab 1: College Information */}
      {activeTab === 'college' && (
        <form
          onSubmit={handleSaveCollege}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6"
        >
          {/* Logo Preview and Custom URL */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <CollegeLogo size="lg" subtitle={false} />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Institutional Seal &amp; Logo
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The official vector seal is loaded by default. You can also paste an exact custom uploaded image URL if desired.
              </p>
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="url"
                  placeholder="Paste custom logo image URL (optional)"
                  value={collegeForm.customLogoUrl || ''}
                  onChange={e => setCollegeForm({ ...collegeForm, customLogoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
                {collegeForm.customLogoUrl && (
                  <button
                    type="button"
                    onClick={() => setCollegeForm({ ...collegeForm, customLogoUrl: '' })}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Name (English)
              </label>
              <input
                type="text"
                required
                value={collegeForm.collegeName}
                onChange={e => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College Name (Hindi)
              </label>
              <input
                type="text"
                value={collegeForm.hindiName}
                onChange={e => setCollegeForm({ ...collegeForm, hindiName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Principal Name
              </label>
              <input
                type="text"
                value={collegeForm.principalName}
                onChange={e => setCollegeForm({ ...collegeForm, principalName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                BTEUP Institutional Code
              </label>
              <input
                type="text"
                value={collegeForm.bteupCode}
                onChange={e => setCollegeForm({ ...collegeForm, bteupCode: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Postal Address
              </label>
              <input
                type="text"
                value={collegeForm.address}
                onChange={e => setCollegeForm({ ...collegeForm, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Contact Phone
              </label>
              <input
                type="text"
                value={collegeForm.phone}
                onChange={e => setCollegeForm({ ...collegeForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={collegeForm.email}
                onChange={e => setCollegeForm({ ...collegeForm, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" /> Save College Branding
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Admin Profile & Credentials */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleSaveSecurity}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-5"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Administrator Profile &amp; Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Name
              </label>
              <input
                type="text"
                value={adminProfileForm.name}
                onChange={e => setAdminProfileForm({ ...adminProfileForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={adminProfileForm.email}
                onChange={e => setAdminProfileForm({ ...adminProfileForm, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Leave blank to keep current"
                  value={adminProfileForm.newPassword}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, newPassword: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={adminProfileForm.confirmPassword}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, confirmPassword: e.target.value })}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
            >
              <Save className="w-4 h-4" /> Update Credentials
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Appearance & Theme */}
      {activeTab === 'appearance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theme &amp; Visual Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize the portal display mode for optimal readability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-blue-600 bg-blue-50/50 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-amber-500" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Light Mode</h4>
                  <p className="text-xs text-slate-500">Clean white and royal navy layout</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => theme === 'light' && toggleTheme()}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-blue-500 bg-slate-800 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-6 h-6 text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dark Mode</h4>
                  <p className="text-xs text-slate-400">High contrast deep slate &amp; navy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: System & Demo Data Reset */}
      {activeTab === 'system' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Local Storage &amp; Demo Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              All student additions, fee collections, exam marks, and notices are saved locally. You can restore fresh mock data anytime.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                Reset All Portal Records to Default
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                Restores original realistic Indian polytechnic data for students, teachers, exams, and notices.
              </p>
            </div>

            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-rose-600/30 flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Reset Demo Data
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetAllData();
          setResetConfirmOpen(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
        }}
        title="Reset All College Data"
        message="This will clear your local changes and reload the default Government Polytechnic database records. Proceed?"
        danger={true}
        confirmText="Yes, Reset Data"
      />
    </div>
  );
};
