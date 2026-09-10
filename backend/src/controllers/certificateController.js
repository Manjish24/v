import { dataService } from "../services/dataService.js";
import { createCertificatePdf } from "../services/certificateService.js";

const findCertificate = async (certificateId) => {
  const enrollments = await dataService.getEnrollments();
  const enrollment = enrollments.find((item) => item.certificateId === certificateId);
  if (!enrollment || enrollment.status !== "completed") return null;

  const [user, course] = await Promise.all([
    dataService.getUserById(enrollment.userId),
    dataService.getCourseById(enrollment.courseId)
  ]);
  if (!user || !course) return null;

  return {
    enrollment,
    certificate: {
      certificateId,
      recipientName: user.name,
      courseTitle: course.title,
      score: enrollment.certificateScore,
      issueDate: enrollment.certificateIssuedAt || enrollment.updatedAt || enrollment.enrolledAt
    }
  };
};

export const verifyCertificate = async (req, res) => {
  try {
    const record = await findCertificate(req.params.certificateId);
    if (!record) return res.status(404).json({ valid: false, message: "Certificate is not valid or has been revoked." });
    res.json({ valid: true, status: "valid", certificate: record.certificate });
  } catch (error) {
    res.status(500).json({ valid: false, message: "Unable to verify certificate." });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const record = await findCertificate(req.params.certificateId);
    if (!record) return res.status(404).json({ success: false, message: "Certificate is not valid or has been revoked." });
    if (req.user.role !== "admin" && record.enrollment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only download your own certificate." });
    }

    const baseUrl = process.env.PUBLIC_APP_URL || `${req.protocol}://${req.get("host")}`;
    const verificationUrl = `${baseUrl}/api/certificates/verify/${encodeURIComponent(record.certificate.certificateId)}`;
    const filename = `Capacity-Connect-${record.certificate.certificateId}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    await createCertificatePdf(res, record.certificate, verificationUrl);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, message: "Unable to generate certificate." });
  }
};
