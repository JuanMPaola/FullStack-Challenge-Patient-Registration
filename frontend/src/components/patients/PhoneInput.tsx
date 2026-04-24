import { Input } from "../ui/input/input";

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  countryCodeError?: string;
  phoneNumberError?: string;
}

const COUNTRY_CODES = [
  { code: '+54', label: '🇦🇷 +54' },
  { code: '+598', label: '🇺🇾 +598' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+34', label: '🇪🇸 +34' },
  { code: '+55', label: '🇧🇷 +55' },
  { code: '+56', label: '🇨🇱 +56' },
];

export const PhoneInput = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  countryCodeError,
  phoneNumberError,
}: PhoneInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">Phone Number</label>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className={`px-3 py-2 border rounded-lg outline-none transition-all duration-200 bg-white
              ${countryCodeError ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400'}`}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
          {countryCodeError && (
            <span className="text-xs text-red-500 animate-pulse">{countryCodeError}</span>
          )}
        </div>
        <div className="flex-1">
          <Input
            placeholder="1135347363"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            error={phoneNumberError}
          />
        </div>
      </div>
    </div>
  );
};