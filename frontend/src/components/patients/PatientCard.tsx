import { useState } from 'react';
import type { Patient } from '../../types/patient.types';

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center gap-4">
        <img
          src={patient.documentPhotoUrl}
          alt="Document"
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{patient.fullName}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${patient.documentVerified
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>
            {patient.documentVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
        <span className={`text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 animate-slide-down">
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Email</span>
              <p className="text-gray-900 font-medium truncate">{patient.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone</span>
              <p className="text-gray-900 font-medium">{patient.countryCode} {patient.phoneNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">Document</span>
              <p className="text-gray-900 font-medium">{patient.documentType} {patient.documentNumber ?? '—'}</p>
            </div>
            <div>
              <span className="text-gray-500">Registered</span>
              <p className="text-gray-900 font-medium">
                {new Date(patient.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};