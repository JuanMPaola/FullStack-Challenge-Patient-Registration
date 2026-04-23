import { Input } from '../../ui/input/input';
import { Button } from '../../ui/button/button';
import { PhoneInput } from '../../patients/PhoneInput';
import { DocumentType } from '../../../types/patient.types';

interface StepConfirmDataProps {
  fullName: string;
  documentNumber: string;
  documentType: string;
  dateOfBirth: string;
  countryCode: string;
  phoneNumber: string;
  onFullNameChange: (v: string) => void;
  onDocumentNumberChange: (v: string) => void;
  onDocumentTypeChange: (v: string) => void;
  onDateOfBirthChange: (v: string) => void;
  onCountryCodeChange: (v: string) => void;
  onPhoneNumberChange: (v: string) => void;
  errors: Record<string, string>;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const StepConfirmData = ({
  fullName, documentNumber, documentType, dateOfBirth,
  countryCode, phoneNumber,
  onFullNameChange, onDocumentNumberChange, onDocumentTypeChange,
  onDateOfBirthChange, onCountryCodeChange, onPhoneNumberChange,
  errors, onSubmit, onBack, loading,
}: StepConfirmDataProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
        ✅ Document scanned successfully. Please confirm your information below.
      </div>

      <Input
        label="Full Name"
        value={fullName}
        onChange={(e) => onFullNameChange(e.target.value)}
        error={errors.fullName}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={documentType}
          onChange={(e) => onDocumentTypeChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 bg-white transition-all duration-200"
        >
          <option value={DocumentType.DNI_AR}>🇦🇷 DNI Argentina</option>
          <option value={DocumentType.CI_UY}>🇺🇾 Cédula Uruguay</option>
        </select>
      </div>

      <Input
        label="Document Number"
        value={documentNumber}
        onChange={(e) => onDocumentNumberChange(e.target.value)}
        error={errors.documentNumber}
      />

      {documentType === DocumentType.CI_UY && (
        <Input
          label="Date of Birth (DD/MM/YYYY)"
          placeholder="01/01/1990"
          value={dateOfBirth}
          onChange={(e) => onDateOfBirthChange(e.target.value)}
        />
      )}

      <PhoneInput
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onCountryCodeChange={onCountryCodeChange}
        onPhoneNumberChange={onPhoneNumberChange}
        phoneNumberError={errors.phoneNumber}
      />

      <div className="flex gap-2 mt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1 justify-center" disabled={loading}>
          Back
        </Button>
        <Button onClick={onSubmit} className="flex-1 justify-center" loading={loading}>
          Complete Registration
        </Button>
      </div>
    </div>
  );
};