import { Input } from '../../ui/input/input';
import { Button } from '../../ui/button/button';
import { PhoneInput } from '../../patients/PhoneInput';
import { DocumentType } from '../../../types/patient.types';

interface StepPersonalDataProps {
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: string;
  onFullNameChange: (v: string) => void;
  onCountryCodeChange: (v: string) => void;
  onPhoneNumberChange: (v: string) => void;
  onDocumentTypeChange: (v: string) => void;
  onDocumentNumberChange: (v: string) => void;
  onDateOfBirthChange: (v: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export const StepPersonalData = ({
  fullName, countryCode, phoneNumber, documentType, documentNumber, dateOfBirth,
  onFullNameChange, onCountryCodeChange, onPhoneNumberChange,
  onDocumentTypeChange, onDocumentNumberChange, onDateOfBirthChange,
  errors, onNext, onBack,
}: StepPersonalDataProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="Juan Perez"
        value={fullName}
        onChange={(e) => onFullNameChange(e.target.value)}
        error={errors.fullName}
      />

      <PhoneInput
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onCountryCodeChange={onCountryCodeChange}
        onPhoneNumberChange={onPhoneNumberChange}
        phoneNumberError={errors.phoneNumber}
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
        placeholder="45096432"
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

      <div className="flex gap-2 mt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1 justify-center">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 justify-center">
          Continue
        </Button>
      </div>
    </div>
  );
};