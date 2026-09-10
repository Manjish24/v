import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export default function TraineeCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const certRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [certsRes, coursesRes] = await Promise.all([
          api.get('/trainee/certificates'),
          api.get('/trainee/courses')
        ]);

        if (certsRes.data.success) {
          setCertificates(certsRes.data.data);
        }

        if (coursesRes.data.success) {
          setCompletedCourses(coursesRes.data.data.completed || []);
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleClaimCertificate = async (courseId) => {
    setIssuing(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/certificates/issue', { course_id: courseId });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Certificate successfully issued by backend verification!' });
        setCertificates(prev => [res.data.data, ...prev.filter(c => c.course_id !== courseId)]);
      } else {
        setMessage({ type: 'error', text: res.data.message });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Eligibility check failed. Ensure 100% course completion and passing assessment marks.'
      });
    } finally {
      setIssuing(false);
    }
  };

  const handleDownloadPDF = async (certNumber) => {
    if (!certRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`CapacityConnect-Certificate-${certNumber}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  const primaryCert = certificates[0] || null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Accredited Certifications</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Section 18 & 59: Cryptographically verified digital certificates generated client-side with verifiable QR validation.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-xs mt-3">Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
          <Award className="w-14 h-14 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Certificates Issued Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Certificates are issued only after backend verification confirms 100% course module completion and passing score on course evaluations.
          </p>

          {completedCourses.length > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-emerald-700">Eligible Completed Courses:</p>
              {completedCourses.map(c => (
                <div key={c.course_id} className="inline-flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-xs font-bold text-emerald-900">{c.title}</span>
                  <button
                    onClick={() => handleClaimCertificate(c.course_id)}
                    disabled={issuing}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {issuing ? 'Verifying...' : 'Claim Certificate'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Certificate Showcase View */}
          {primaryCert && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Primary Certificate Preview
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPDF(primaryCert.certificate_number)}
                    disabled={downloading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Rendering PDF...' : 'Download Certificate PDF'}
                  </button>
                  <Link
                    to={`/verify/${primaryCert.verification_token}`}
                    target="_blank"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Public Verification Link
                  </Link>
                </div>
              </div>

              {/* High-Resolution Certificate Document Canvas */}
              <div
                ref={certRef}
                className="bg-white rounded-2xl border-8 border-slate-900 shadow-2xl p-8 sm:p-12 relative overflow-hidden max-w-4xl mx-auto"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #fafafa 0%, #ffffff 100%)'
                }}
              >
                {/* Decorative border frame */}
                <div className="absolute inset-3 border-2 border-amber-500/40 pointer-events-none rounded-lg"></div>

                {/* Certificate Content */}
                <div className="text-center space-y-6 relative z-10 py-4">
                  {/* Top Branding */}
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-black tracking-tight text-slate-900">CAPACITY CONNECT</h3>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        Smart India Hackathon • PS 26075
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-xs uppercase font-extrabold tracking-widest text-amber-600">
                      Official Certificate of Competency
                    </p>
                    <p className="text-xs text-slate-400">This is to certify that</p>
                  </div>

                  {/* Recipient */}
                  <div className="py-2">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-amber-500 decoration-2 underline-offset-8">
                      {primaryCert.trainee_name || user?.name}
                    </h2>
                  </div>

                  {/* Completion Text */}
                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                    has successfully completed the accredited coursework, video lectures, and rigorous evaluations for:
                  </p>

                  <h3 className="text-xl sm:text-2xl font-black text-blue-900">
                    {primaryCert.course_title}
                  </h3>

                  {/* Bottom details: Signatures, Issue Date, QR code */}
                  <div className="pt-8 grid grid-cols-3 gap-4 items-end border-t border-slate-100">
                    {/* Left: Authority Signature */}
                    <div className="text-left space-y-1">
                      <p className="font-serif italic text-base text-slate-800">Capacity Connect Authority</p>
                      <div className="w-32 h-0.5 bg-slate-400"></div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Chief Academic Director</p>
                      <p className="text-[10px] text-slate-400">
                        Date: {new Date(primaryCert.issued_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Middle: Certificate Number */}
                    <div className="text-center space-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Backend Verified
                      </div>
                      <p className="font-mono text-xs font-bold text-slate-700">
                        {primaryCert.certificate_number}
                      </p>
                    </div>

                    {/* Right: Dynamic QR Code */}
                    <div className="flex flex-col items-end space-y-1">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-xs">
                        <QRCodeSVG
                          value={`${window.location.origin}/verify/${primaryCert.verification_token}`}
                          size={70}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Scan to Verify</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* List of All Certificates */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">All Issued Certificates ({certificates.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cert.course_title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{cert.certificate_number}</p>
                    <p className="text-[11px] text-purple-700 font-semibold mt-1">
                      Issued on {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/verify/${cert.verification_token}`}
                    target="_blank"
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    Verify Authenticity <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
