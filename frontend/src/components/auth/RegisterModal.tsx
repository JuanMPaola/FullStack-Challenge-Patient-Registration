import { useState } from 'react';
import { Modal } from '../ui/Modal/Modal';
import { StepAccount } from './steps/StepAccount';
import { StepVerification } from './steps/StepVerification';
import { StepConfirmData } from './steps/StepConfirmData';
import { useAuthForm } from '../../hooks/useAuthForm';
import { DocumentType } from '../../types/patient.types';
import type { ScanResult } from '../../api/document-verification.api';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ['Account', 'Scan Document', 'Confirm Data'];

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+54');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentType, setDocumentType] = useState<string>(DocumentType.DNI_AR);
  const [documentNumber, setDocumentNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [documentPhotoUrl, setDocumentPhotoUrl] = useState('');

  const { handleRegister, handleCreatePatient, registrationToken, loading, error } = useAuthForm();

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email is required';
    if (!password || password.length < 6) e.password = 'Min 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!fullName || !/^[a-zA-ZÀ-ÿ\s]+$/.test(fullName)) e.fullName = 'Only letters allowed';
    if (!phoneNumber) e.phoneNumber = 'Phone is required';
    if (!documentNumber) e.documentNumber = 'Document number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!validateStep0()) return;
      const success = await handleRegister(email, password);
      if (success) setStep(1);
    }
  };

  const handleScanned = (result: ScanResult) => {
    if (result.firstName || result.lastName) setFullName(result.firstName + ' ' + result.lastName);
    if (result.documentNumber) setDocumentNumber(result.documentNumber);
    if (result.dateOfBirth) setDateOfBirth(result.dateOfBirth);
    if (result.photoUrl) setDocumentPhotoUrl(result.photoUrl);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    try {
      await handleCreatePatient({
        email, password,
        fullName, countryCode, phoneNumber,
        documentType, documentNumber, dateOfBirth,
        documentPhotoUrl,
      });
    } catch {
      // error ya está en el state
    }
  };

  const handleClose = () => {
    setStep(0);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Create account</h2>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
          ✕
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center animate-pulse mb-4">{error}</p>
      )}

      <div className="max-h-[60vh] overflow-y-auto pr-1">
        {step === 0 && (
          <StepAccount
            email={email} password={password} confirmPassword={confirmPassword}
            onEmailChange={setEmail} onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            errors={errors} onNext={handleNext} loading={loading}
          />
        )}
        {step === 1 && (
          <StepVerification
            documentType={documentType}
            token={registrationToken ?? ''}
            onScanned={handleScanned}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepConfirmData
            fullName={fullName} documentNumber={documentNumber}
            documentType={documentType} dateOfBirth={dateOfBirth}
            countryCode={countryCode} phoneNumber={phoneNumber}
            onFullNameChange={setFullName} onDocumentNumberChange={setDocumentNumber}
            onDocumentTypeChange={setDocumentType} onDateOfBirthChange={setDateOfBirth}
            onCountryCodeChange={setCountryCode} onPhoneNumberChange={setPhoneNumber}
            errors={errors} onSubmit={handleSubmit} onBack={() => setStep(1)}
            loading={loading}
          />
        )}
      </div>
    </Modal>
  );
};