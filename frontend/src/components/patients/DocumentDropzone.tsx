import { useCallback, useState } from 'react';

interface DocumentDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}

export const DocumentDropzone = ({ file, onFileChange, error }: DocumentDropzoneProps) => {
  const [dragging, setDragging] = useState(false);

  const validate = (f: File): boolean => {
    return f.name.toLowerCase().endsWith('.jpg') || f.type === 'image/jpeg';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && validate(dropped)) onFileChange(dropped);
  }, [onFileChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && validate(selected)) onFileChange(selected);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Document Photo</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
          ${dragging ? 'border-blue-400 bg-blue-50' : error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'}`}
        onClick={() => document.getElementById('doc-upload')?.click()}
      >
        <input
          id="doc-upload"
          type="file"
          accept=".jpg,image/jpeg"
          className="hidden"
          onChange={handleChange}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <p className="text-sm text-gray-600">{file.name}</p>
            <button
              type="button"
              className="text-xs text-red-500 hover:underline"
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-3xl">📎</span>
            <p className="text-sm">Drag & drop or <span className="text-blue-500">browse</span></p>
            <p className="text-xs">Only .jpg files accepted</p>
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500 animate-pulse">{error}</span>}
    </div>
  );
};