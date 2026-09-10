import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const COLORS = {
  navy: "#0B4F6C",
  gold: "#D79E27",
  slate: "#475569",
  pale: "#F8FBFC"
};

const formatDate = (value) => new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric"
}).format(new Date(value));

export const createCertificatePdf = async (res, certificate, verificationUrl) => {
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 240,
    color: { dark: COLORS.navy, light: "#FFFFFF" }
  });
  const qrImage = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });

  doc.pipe(res);
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const center = pageWidth / 2;

  doc.rect(0, 0, pageWidth, pageHeight).fill(COLORS.pale);
  doc.lineWidth(5).strokeColor(COLORS.navy).rect(22, 22, pageWidth - 44, pageHeight - 44).stroke();
  doc.lineWidth(1.5).strokeColor(COLORS.gold).rect(32, 32, pageWidth - 64, pageHeight - 64).stroke();

  doc.circle(75, 75, 23).fill(COLORS.navy);
  doc.fillColor("white").font("Helvetica-Bold").fontSize(9).text("MoES", 52, 65, { width: 46, align: "center" });
  doc.fontSize(7).text("IMD", 52, 77, { width: 46, align: "center" });
  doc.fillColor(COLORS.navy).font("Helvetica-Bold").fontSize(12).text("GOVERNMENT OF INDIA", 112, 57);
  doc.font("Helvetica").fontSize(10).text("Ministry of Earth Sciences | India Meteorological Department", 112, 75);
  doc.font("Helvetica-Bold").fontSize(9).text("CAPACITY CONNECT", pageWidth - 215, 60, { width: 160, align: "right" });
  doc.font("Helvetica").fontSize(8).fillColor(COLORS.slate).text(`Credential ID: ${certificate.certificateId}`, pageWidth - 260, 76, { width: 205, align: "right" });

  doc.fillColor(COLORS.navy).font("Helvetica-Bold").fontSize(26).text("CERTIFICATE OF COMPLETION", 0, 133, { width: pageWidth, align: "center" });
  doc.fillColor("#B7791F").fontSize(9).text("DIGITAL CAPACITY BUILDING AND LEARNING MANAGEMENT PORTAL", 0, 166, { width: pageWidth, align: "center" });
  doc.fillColor(COLORS.slate).font("Helvetica-Oblique").fontSize(13).text("This certificate is proudly presented to", 0, 205, { width: pageWidth, align: "center" });

  doc.fillColor("#123B54").font("Times-BoldItalic").fontSize(31).text(certificate.recipientName, 100, 247, { width: pageWidth - 200, align: "center" });
  doc.strokeColor(COLORS.gold).lineWidth(1.5).moveTo(center - 145, 289).lineTo(center + 145, 289).stroke();
  doc.fillColor(COLORS.slate).font("Helvetica").fontSize(12).text("for successfully completing the course", 0, 313, { width: pageWidth, align: "center" });
  doc.fillColor(COLORS.navy).font("Helvetica-Bold").fontSize(16).text(certificate.courseTitle, 120, 346, { width: pageWidth - 240, align: "center" });
  doc.fillColor(COLORS.slate).font("Helvetica").fontSize(10.5).text("and demonstrating commitment to professional competency development.", 0, 391, { width: pageWidth, align: "center" });

  doc.image(qrImage, pageWidth - 135, 422, { width: 72, height: 72 });
  doc.fillColor(COLORS.slate).fontSize(7.2).text("Scan to verify", pageWidth - 150, 497, { width: 102, align: "center" });
  doc.strokeColor("#94A3B8").lineWidth(0.8).moveTo(105, 492).lineTo(285, 492).stroke();
  doc.fillColor("#334155").font("Helvetica-Bold").fontSize(9).text(formatDate(certificate.issueDate), 105, 505, { width: 180, align: "center" });
  doc.fillColor(COLORS.slate).font("Helvetica").fontSize(8).text("Date of Issue", 105, 521, { width: 180, align: "center" });
  doc.strokeColor("#94A3B8").moveTo(pageWidth - 300, 492).lineTo(pageWidth - 150, 492).stroke();
  doc.fillColor("#334155").font("Helvetica-Bold").fontSize(9).text("Capacity Building Directorate", pageWidth - 325, 505, { width: 200, align: "center" });
  doc.fillColor(COLORS.slate).font("Helvetica").fontSize(8).text("Ministry of Earth Sciences, New Delhi", pageWidth - 325, 521, { width: 200, align: "center" });
  doc.fillColor(COLORS.slate).fontSize(7.5).text("This credential is issued through the CAPACITY CONNECT learning platform.", 0, 546, { width: pageWidth, align: "center" });
  doc.end();
};
