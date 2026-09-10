import React, { useState } from "react";
import { Download, Printer, Compass } from "lucide-react";
import { Modal } from "./Modal";
import { api } from "../services/api";

export const CertificateModal = ({ isOpen, onClose, certificate }) => {
  const [downloading, setDownloading] = useState(false);
  if (!certificate) return null;

  const hasScore = Number.isFinite(Number(certificate.score));
  const score = hasScore ? Number(certificate.score) : null;
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B+" : "Qualified";
  const issuedOn = certificate.issueDate
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(certificate.issueDate))
    : "";

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!certificate.certificateId) return;
    setDownloading(true);
    try {
      const file = await api.downloadCertificate(certificate.certificateId);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Capacity-Connect-${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Keep the object URL alive long enough for slower browsers to start the download.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      alert(error.message || "Certificate download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official MoES / IMD Certificate of Competency" maxWidth="max-w-3xl">
      <div className="p-2 certificate-modal-content">
        {/* Printable Certificate Frame */}
        <div
          id="printable-certificate"
          className="relative p-8 rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-sky-50/30 border-8 border-double border-slate-300 text-center shadow-lg"
        >
          {/* Header Logos & Emblems */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200">
            <div className="flex items-center space-x-2 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Government of India</p>
                <p className="text-sm font-extrabold text-blue-950">Ministry of Earth Sciences (MoES)</p>
                <p className="text-xs text-slate-500 font-medium">India Meteorological Department</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono font-bold text-slate-500 block">ID: {certificate.certificateId}</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Credential
              </span>
            </div>
          </div>

          <p className="text-xs uppercase font-extrabold tracking-[0.25em] text-amber-700 mb-2">
            Certificate of Technical Competency
          </p>
          <h2 className="text-xl font-serif italic text-slate-600 mb-1">This is officially awarded to</h2>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 underline decoration-amber-500 decoration-2 underline-offset-8 my-4">
            {certificate.recipientName}
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed my-4">
            for successfully completing the rigorous curriculum and qualifying the subject-wise technical examination in
          </p>

          <div className="p-4 my-4 bg-blue-50/80 rounded-xl border border-blue-100 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-blue-900">
              {certificate.courseTitle}
            </h3>
            <p className="text-xs text-blue-700 mt-1 font-medium">
              {hasScore ? <>Examination Score: <span className="font-extrabold text-blue-950">{score}%</span> | Grade: {grade} (Qualified)</> : "Course completion verified"}
            </p>
          </div>

          {issuedOn && <p className="text-xs font-semibold text-slate-600">Issued on {issuedOn}</p>}

          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Awarded under the CAPACITY CONNECT Digital Capacity Building Initiative for Meteorological Cadre Development.
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-slate-200 text-center">
            <div>
              <p className="text-sm font-bold text-slate-800">Dr. M. Mohapatra</p>
              <p className="text-[11px] text-slate-500">Director General of Meteorology, IMD</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Capacity Building Directorate</p>
              <p className="text-[11px] text-slate-500">Ministry of Earth Sciences, New Delhi</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3 certificate-actions">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? "Preparing PDF..." : "Download Certificate"}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
