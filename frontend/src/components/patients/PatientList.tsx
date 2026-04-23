import { Spinner } from '../ui/Sprinner/Spinner';
import { PatientCard } from './PatientCard';
import type { Patient } from '../../types/patient.types';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

export const PatientList = ({ patients, loading, error }: PatientListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl mb-4">🏥</p>
        <p className="text-lg font-medium text-gray-500">No patients registered yet</p>
        <p className="text-sm mt-1">Add the first patient using the button above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};