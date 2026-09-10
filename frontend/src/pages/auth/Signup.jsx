import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Compass, User, Mail, Lock, Building, GraduationCap, Briefcase, Sparkles, ArrowRight } from "lucide-react";

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "trainee",
    organization: "India Meteorological Department (IMD)",
    department: "Radar & Weather Forecasting",
    designation: "Scientific Assistant",
    phone: "",
    qualifications: "M.Sc. Physics / Atmospheric Sciences",
    experience: "2 years in synoptic meteorology",
    skills: "Radar, Cyclone Tracking, Python",
    interests: "NWP Modeling, Severe Weather Nowcasting"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signup(formData);
      const user = response.user;
      if (user.role === "trainer") {
        alert("Trainer registration submitted! You can now explore the Trainer console.");
        navigate("/trainer/dashboard");
      } else {
        navigate("/trainee/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-6 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xl shadow-blue-500/25 mb-3">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Register for CAPACITY CONNECT</h1>
          <p className="text-xs text-sky-300 mt-1">Ministry of Earth Sciences & India Meteorological Department</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Role selection tab */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Your Portal Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "trainee" })}
                  className={`p-3 rounded-xl border text-center transition ${
                    formData.role === "trainee"
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-2 ring-blue-500/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-semibold">Trainee / Forecaster</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Learn & get certified</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "trainer" })}
                  className={`p-3 rounded-xl border text-center transition ${
                    formData.role === "trainer"
                      ? "bg-amber-50 border-amber-600 text-amber-900 font-bold ring-2 ring-amber-500/20"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-semibold">Trainer / Scientist</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Teach courses & build quizzes</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@imd.gov.in"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Institute</label>
                <select
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="India Meteorological Department (IMD)">India Meteorological Department (IMD)</option>
                  <option value="Ministry of Earth Sciences (MoES)">Ministry of Earth Sciences (MoES)</option>
                  <option value="NCMRWF (Medium Range Weather Forecasting)">NCMRWF</option>
                  <option value="INCOIS (Ocean Information Services)">INCOIS</option>
                  <option value="IITM (Tropical Meteorology, Pune)">IITM Pune</option>
                </select>
              </div>
            </div>

            {/* Qualifications & Professional Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Division</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Cyclone Warning Division"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Scientist 'C', Technical Asst"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications & Academic Degrees</label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g. M.Sc. Meteorology, Ph.D. Physics"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Doppler Radar, WRF Modeling, Dvorak Technique, GIS"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition disabled:opacity-50 text-sm mt-4"
            >
              <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
