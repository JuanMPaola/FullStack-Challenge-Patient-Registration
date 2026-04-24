import { useState } from 'react';
import { DocumentDropzone } from '../../patients/DocumentDropzone';
import { Button } from '../../ui/button/button';
import { CamDesktop } from './Camera/CamDesktop';
import { CamMobile } from './Camera/CamMobile';
import { Spinner } from '../../ui/Sprinner/Spinner';
import { documentVerificationApi } from '../../../api/document-verification.api';
import type { ScanResult } from '../../../api/document-verification.api';

const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

interface StepVerificationProps {
  documentType: string;
  token: string;
  onScanned: (result: ScanResult) => void;
  onBack: () => void;
}

export const StepVerification = ({
  documentType, token, onScanned, onBack,
}: StepVerificationProps) => {
  const [tab, setTab] = useState<'upload' | 'camera'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (selectedFile: File) => {
    setFile(selectedFile);
    setScanning(true);
    setError(null);
    try {
      const result = await documentVerificationApi.scan(selectedFile, documentType, token);
      console.log('Raw scan result:', result);
      onScanned(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed');
      setFile(null);
    } finally {
      setScanning(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        Take or upload a photo of your document. We'll extract your information automatically.
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
            ${tab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📎 Upload File
        </button>
        <button
          onClick={() => setTab('camera')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
            ${tab === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          📷 Take Photo
        </button>
      </div>

      {scanning ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500">Scanning document...</p>
        </div>
      ) : (
        <>
          {tab === 'upload' && (
            <DocumentDropzone
              file={file}
              onFileChange={(f) => f && handleScan(f)}
              error={error ?? undefined}
            />
          )}
          {tab === 'camera' && (
            isMobile
              ? <CamMobile onCapture={handleScan} />
              : <CamDesktop onCapture={handleScan} />
          )}
        </>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center animate-pulse">{error}</p>
      )}

      <Button variant="secondary" onClick={onBack} className="w-full justify-center" disabled={scanning}>
        Back
      </Button>
    </div>
  );
};