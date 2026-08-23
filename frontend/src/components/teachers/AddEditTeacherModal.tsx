import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';
import { useCollegeData } from '../../context/CollegeDataContext';
import { Upload } from 'lucide-react';

interface AddEditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
}

export const AddEditTeacherModal: React.FC<AddEditTeacherModalProps> = ({
  isOpen,
  onClose,
  teacher
}) => {
  const { addTeacher, updateTeacher } = useCollegeData();

  const [formData, setFormData] = useState({
    name: '',
    empCode: '',
    department: 'Computer Science & Engineering',
    designation: 'Lecturer',
    qualification: 'M.Tech / B.Tech',
    email: '',
    mobile: '+91 94150 00000',
    joiningDate: '2020-08-01',
    subjects: 'Data Structures, Operating Systems',
    status: 'Active' as 'Active' | 'On Leave' | 'Relieved',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
    experienceYears: 5
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        empCode: teacher.empCode,
        department: teacher.department,
        designation: teacher.designation,
        qualification: teacher.qualification,
        email: teacher.email,
        mobile: teacher.mobile,
        joiningDate: teacher.joiningDate,
        subjects: teacher.subjects.join(', '),
        status: teacher.status,
        photoUrl: teacher.photoUrl,
        experienceYears: teacher.experienceYears
      });
    } else {
      const rand = Math.floor(10 + Math.random() * 90);
      setFormData({
        name: '',
        empCode: `FAC-GPB-${rand}`,
        department: 'Computer Science & Engineering',
        designation: 'Lecturer',
        qualification: 'M.Tech (CSE - AKTU Lucknow)',
        email: '',
        mobile: '+91 94150 00000',
        joiningDate: '2022-07-15',
        subjects: 'Computer Networks, Python Programming',
        status: 'Active',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces',
        experienceYears: 4
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.empCode) {
      alert('Please fill in Name and Employee Code.');
      return;
    }

    const payload = {
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (teacher) {
      updateTeacher(teacher.id, payload);
    } else {
      addTeacher(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacher ? 'Edit Faculty Member' : 'New Faculty Appointment Entry'}
      subtitle="Government Polytechnic • Faculty Registry"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Teacher Photo Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={formData.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces'}
              alt="Faculty Preview"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-md flex-shrink-0"
            />
            <div className="flex-1 w-full space-y-2 text-center sm:text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>Faculty Profile Photo (फ़ोटो लगाएं या अपलोड करें)</span>
                <span className="text-[10px] text-emerald-600 font-normal">PNG, JPG, WebP</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all shadow-sm flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device / Gallery (गैलरी)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://...)"
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Avatar Choices */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Quick Academic Avatars (तैयार अवतार चुनें):</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Prof. Male 1', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Prof. Male 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Lecturer Female 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Lecturer Female 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces' },
                { label: 'Technical Staff', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' }
              ].map((av, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photoUrl: av.url }))}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                    formData.photoUrl === av.url
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-4 h-4 rounded-full object-cover" />
                  <span>{av.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Alok Kumar Rai"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Employee ID Code *
            </label>
            <input
              type="text"
              required
              value={formData.empCode}
              onChange={e => setFormData({ ...formData, empCode: e.target.value })}
              placeholder="e.g. FAC-CSE-01"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Department (विभाग) *
            </label>
            <select
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none font-semibold"
            >
              <optgroup label="🎓 Academic Branches (शैक्षणिक शाखाएं)">
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Mechanical Engineering (Production)">Mechanical Engineering (Production)</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Applied Sciences & Humanities (Physics, Chem, Math)">Applied Sciences & Humanities (Physics, Chem, Math)</option>
              </optgroup>

              <optgroup label="📚 Central Library Wing (पुस्तकालय विभाग)">
                <option value="Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)">Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)</option>
              </optgroup>

              <optgroup label="🏢 Administration & Registry (कार्यालय / प्यून, अनुसेवक व क्लर्क)">
                <option value="Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)">Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)</option>
              </optgroup>

              <optgroup label="🚌 Transport & Campus Bus Fleet (परिवहन विभाग / बस चालक व स्टाफ)">
                <option value="Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)">Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)</option>
              </optgroup>

              <optgroup label="🛠️ Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)">
                <option value="Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)">Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)</option>
              </optgroup>

              <optgroup label="💰 Finance, Accounts & Treasury (लेखा एवं वित्त विभाग)">
                <option value="Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)">Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)</option>
              </optgroup>

              <optgroup label="🏨 Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)">
                <option value="Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)">Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)</option>
              </optgroup>
            </select>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Designation / Post (पद) *
              </label>
              <span className="text-[10px] text-slate-400">Click quick role to autofill:</span>
            </div>
            <input
              type="text"
              required
              value={formData.designation}
              onChange={e => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Head of Department / Librarian / Senior Peon / Bus Driver"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
            {/* Quick Designation Role Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { role: 'Lecturer', dept: 'Computer Science & Engineering' },
                { role: 'Head of Department (HOD)', dept: 'Computer Science & Engineering' },
                { role: 'Chief Librarian (पुस्तकालयाध्यक्ष)', dept: 'Central Library & Digital Resource Wing (पुस्तकालय / लाइब्रेरियन)' },
                { role: 'Senior Peon & Office Attendant (प्यून / अनुसेवक)', dept: 'Administrative Registry & Peon Staff (कार्यालय / प्यून, अनुसेवक व क्लर्क)' },
                { role: 'Heavy Bus Driver (बस चालक)', dept: 'Transport & Campus Bus Fleet (परिवहन / बस चालक व स्टाफ)' },
                { role: 'Workshop Instructor (वर्कशॉप अनुदेशक)', dept: 'Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)' },
                { role: 'Computer Lab Technician (लैब सहायक)', dept: 'Central Workshop & Technical Labs (केंद्रीय वर्कशॉप व लैब)' },
                { role: 'Head Accountant & Cashier (लेखाकार)', dept: 'Accounts, Audit & Treasury (लेखा एवं वित्त विभाग)' },
                { role: 'Hostel Warden & Security Supervisor', dept: 'Hostel, Mess & Campus Security (छात्रावास, मेस व सुरक्षा)' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, designation: p.role, department: p.dept }))}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  + {p.role}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Academic Qualifications
            </label>
            <input
              type="text"
              value={formData.qualification}
              onChange={e => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. Ph.D (CSE - MMMUT Gorakhpur), M.Tech (KNIT Sultanpur)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              placeholder="faculty.name@Government Polytechnic.ac.in"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Contact Mobile
            </label>
            <input
              type="text"
              value={formData.mobile}
              onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 94150 12345"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Teaching Subjects (comma-separated)
            </label>
            <input
              type="text"
              value={formData.subjects}
              onChange={e => setFormData({ ...formData, subjects: e.target.value })}
              placeholder="e.g. DBMS, Python, Data Structures"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Joining Date
            </label>
            <input
              type="date"
              value={formData.joiningDate}
              onChange={e => setFormData({ ...formData, joiningDate: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={formData.photoUrl}
              onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            {teacher ? 'Update Faculty' : 'Save Appointment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
