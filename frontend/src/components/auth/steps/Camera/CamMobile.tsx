import { useRef } from 'react';

interface CamMobileProps {
  onCapture: (file: File) => void;
}

export const CamMobile = ({ onCapture }: CamMobileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg') {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const jpgFile = new File([blob], 'document.jpg', { type: 'image/jpeg' });
            onCapture(jpgFile);
          }
        }, 'image/jpeg', 0.9);
      };
      img.src = URL.createObjectURL(file);
    } else {
      onCapture(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <div
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
        onClick={() => inputRef.current?.click()}
      >
        <span className="text-4xl">📷</span>
        <p className="text-sm text-gray-600 text-center">
          Tap to open camera and take a photo of your document
        </p>
        <p className="text-xs text-gray-400">Photo will be converted to .jpg automatically</p>
      </div>
    </div>
  );
};