import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { CertificateModal } from "../../components/CertificateModal";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  Building,
  Phone,
  Mail,
  Edit2,
  Check
} from "lucide-react";

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    organization: user?.organization || "",
    department: user?.department || "",
    designation: user?.designation || "",
    phone: user?.phone || "",
    qualifications: user?.qualifications || "",
    experience: user?.experience || "",
    skills: (user?.skills || []).join(", "),
    interests: (user?.interests || []).join(", ")
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.updateProfile(formData);
      updateUser(response.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 text-white font-extrabold flex items-center justify-center text-2xl shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="text-[10px] uppercase font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.designation || "Technical Cadre"} · {user?.department}</p>
            <p className="text-xs font-semibold text-blue-700 mt-0.5">{user?.organization}</p>
          </div>
        </div>

        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-2"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{editing ? "Cancel Editing" : "Edit Profile"}</span>
        </button>
      </div>

      {/* Profile Form / View */}
      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Update Professional Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Division</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications & Degrees</label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience & Background</label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Qualifications & Experience */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic & Technical Qualifications</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <p className="font-semibold">{user?.qualifications || "Not specified"}</p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 pt-2">
              <Briefcase className="w-4 h-4 text-sky-600" />
              <span>Work Experience</span>
            </h3>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
              <p>{user?.experience || "Not specified"}</p>
            </div>
          </div>

          {/* Skills & Verified Badges */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Core Competencies & Skills</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {(user?.skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl"
                >
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 pt-4">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Earned Certifications</span>
            </h3>
            <div className="space-y-2">
              {(user?.certificates || []).length === 0 ? (
                <p className="text-xs text-slate-400">No certifications issued yet.</p>
              ) : (
                user.certificates.map((cert, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setSelectedCert({
                        certificateId: cert.certificateId,
                        recipientName: user.name,
                        courseTitle: cert.courseTitle || cert.title,
                        score: cert.score,
                        issueDate: cert.issueDate
                      })
                    }
                    className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-emerald-950">{cert.title}</p>
                      <p className="text-[10px] text-emerald-700">{cert.issuer}</p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-1 rounded shadow-sm">
                      View Certificate
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
      />
    </div>
  );
};
