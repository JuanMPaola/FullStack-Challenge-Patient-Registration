import { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '../../../ui/button/button';

interface CamDesktopProps {
  onCapture: (file: File) => void;
}

export const CamDesktop = ({ onCapture }: CamDesktopProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    streamRef.current = stream;
    setActive(true);
    setError(null);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }, 100);
  } catch {
    setError('Could not access camera. Please check permissions.');
  }
};

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCaptured(dataUrl);
    stopCamera();

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'document.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.9);
  };

  const handleRetake = () => {
    setCaptured(null);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} className="hidden" />

      {!active && !captured && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3">
          <span className="text-4xl">📷</span>
          <p className="text-sm text-gray-600 text-center">Use your camera to take a photo of your document</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button onClick={startCamera} className="mt-2">
            Open Camera
          </Button>
        </div>
      )}

      {active && (
        <div className="w-full flex flex-col items-center gap-3">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-xl border border-gray-200"
          />
          <div className="flex gap-2 w-full">
            <Button variant="secondary" onClick={stopCamera} className="flex-1 justify-center">
              Cancel
            </Button>
            <Button onClick={handleCapture} className="flex-1 justify-center">
              📸 Capture
            </Button>
          </div>
        </div>
      )}

      {captured && (
        <div className="w-full flex flex-col items-center gap-3">
          <img src={captured} alt="Captured" className="w-full rounded-xl border border-gray-200" />
          <Button variant="secondary" onClick={handleRetake} className="w-full justify-center">
            Retake
          </Button>
        </div>
      )}
    </div>
  );
};