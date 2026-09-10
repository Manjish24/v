export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateString;
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "";
  }
};

export const getRoleBadgeColor = (role) => {
  switch (role) {
    case "admin":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "trainer":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "trainee":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "approved":
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending":
    case "in-progress":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "rejected":
    case "failed":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};
