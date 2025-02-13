import { useEffect, useState } from "react";

interface UploadProgressProps {
  progress: number;
}

export default function ProgressBar({ progress }: UploadProgressProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (progress > 0 && progress < 100) {
      setVisible(true);
    } else if (progress === 100) {
      setTimeout(() => setVisible(false), 500);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
  );
}
