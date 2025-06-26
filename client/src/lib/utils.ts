import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "border-red-500 bg-red-50";
    case "medium":
      return "border-yellow-500 bg-yellow-50";
    case "low":
      return "border-green-500 bg-green-50";
    default:
      return "border-gray-300 bg-white";
  }
}

export function getPriorityBadgeColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Due today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Due tomorrow";
  } else if (date < today) {
    return "Overdue";
  } else {
    return `Due ${date.toLocaleDateString()}`;
  }
}
