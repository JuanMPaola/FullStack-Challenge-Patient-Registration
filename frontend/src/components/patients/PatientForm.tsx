import { useState } from 'react';
import { Input } from '../ui/input/input';
import { Button } from '../ui/button/button';
import { PhoneInput } from './PhoneInput';
import { DocumentDropzone } from './DocumentDropzone';
import { DocumentType } from '../../types/patient.types';
import { documentVerificationApi } from '../../api/document-verification.api';
import { useAuth } from '../../context/AuthContext';
import type { CreatePatientPayload } from '../../types/patient.types';

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  documentNumber?: string;
  documentPhoto?: string;
}

interface PatientFormProps {
  onSubmit: (payload: CreatePatientPayload) => Promise<void>;
}

export const PatientForm = ({ onSubmit }: PatientFormProps) => {
  const { token } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+54');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentType, setDocumentType] = useState<string>(DocumentType.DNI_AR);
  const [documentNumber, setDocumentNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(fullName)) newErrors.fullName = 'Full name must contain only letters';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!email.endsWith('@gmail.com')) newErrors.email = 'Only @gmail.com addresses are accepted';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!documentPhoto) newErrors.documentPhoto = 'Document photo is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setScanning(true);
    try {
      const scanResult = await documentVerificationApi.scan(documentPhoto!, documentType, token!);
      setScanning(false);

      await onSubmit({
        fullName,
        email,
        countryCode,
        phoneNumber,
        documentType: documentType as CreatePatientPayload['documentType'],
        documentNumber: documentNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
        documentPhotoUrl: scanResult.photoUrl ?? '',
      });
    } catch (e) {
      setErrors({ documentPhoto: e instanceof Error ? e.message : 'Upload failed' });
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="Juan Perez"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={errors.fullName}
      />
      <Input
        label="Email"
        type="email"
        placeholder="juan@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <PhoneInput
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onCountryCodeChange={setCountryCode}
        onPhoneNumberChange={setPhoneNumber}
        phoneNumberError={errors.phoneNumber}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition-all duration-200"
        >
          <option value={DocumentType.DNI_AR}>🇦🇷 DNI Argentina</option>
          <option value={DocumentType.CI_UY}>🇺🇾 Cédula Uruguay</option>
        </select>
      </div>
      <Input
        label="Document Number"
        placeholder="45096432"
        value={documentNumber}
        onChange={(e) => setDocumentNumber(e.target.value)}
        error={errors.documentNumber}
      />
      {documentType === DocumentType.CI_UY && (
        <Input
          label="Date of Birth (DD/MM/YYYY)"
          placeholder="01/01/1990"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      )}
      <DocumentDropzone
        file={documentPhoto}
        onFileChange={setDocumentPhoto}
        error={errors.documentPhoto}
      />
      <Button type="submit" loading={loading} className="w-full justify-center mt-2">
        {scanning ? 'Uploading document...' : 'Register Patient'}
      </Button>
    </form>
  );
};