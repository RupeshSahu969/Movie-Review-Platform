import React from "react";
import { AlertCircle } from "lucide-react"; 

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-sm animate-fadeIn">
      <AlertCircle className="w-5 h-5 text-red-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}


export default ErrorMessage;
