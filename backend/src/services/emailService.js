export const emailService = {
  sendWelcomeEmail: async (user) => {
    console.log(`[Email Service] Welcome email dispatched to: ${user.email} (${user.name})`);
    return true;
  },
  sendEnrollmentConfirmation: async (user, course) => {
    console.log(`[Email Service] Enrollment confirmation sent to ${user.email} for course: ${course.title}`);
    return true;
  },
  sendCertificateIssuedNotification: async (user, course, certificateId) => {
    console.log(`[Email Service] Certification notice (${certificateId}) sent to ${user.email} for course: ${course.title}`);
    return true;
  }
};
