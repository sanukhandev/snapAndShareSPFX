import * as React from "react";

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => (
  <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
    {message}
  </div>
);

export default Toast;
