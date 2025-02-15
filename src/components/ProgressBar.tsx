import { useEffect, useState } from "react";

interface UploadProgressProps {
  progress: number;
}

export default function ProgressBar({ progress }: UploadProgressProps) {
  const [visible, setVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setVisible(true);
    } else if (progress === 100) {
      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
      }, 1000);
      setTimeout(() => setVisible(false), 100);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
      {/* transluscent overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-white opacity-60" />
      {visible && popupVisible && <div className="fixed bottom-6 left-20 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
        ✅ Success!
      </div>}
    </>
  );
}
