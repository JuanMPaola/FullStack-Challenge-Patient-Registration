import { useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { PatientList } from '../components/patients/PatientList';
import { PatientForm } from '../components/patients/PatientForm';
import { SubmitModal } from '../components/patients/SumbitModal';
import { Modal } from '../components/ui/Modal/Modal';
import { Button } from '../components/ui/button/button';
import type { CreatePatientPayload } from '../types/patient.types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const PatientsPage = () => {
  const { patients, loading, error, createPatient } = usePatients();
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleSubmit = async (payload: CreatePatientPayload) => {
    try {
      await createPatient(payload);
      setFormOpen(false);
      setSubmitStatus('success');
    } catch (e) {
      setFormOpen(false);
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
      setSubmitStatus('error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500 mt-1">
              {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <div className="flex items-center gap-3">
            {role === 'admin' && (
              <Button onClick={() => setFormOpen(true)}>
                + Add Patient
              </Button>
            )}
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <PatientList patients={patients} loading={loading} error={error} />
      </div>

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">New Patient</h2>
          <button
            onClick={() => setFormOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <PatientForm onSubmit={handleSubmit} />
        </div>
      </Modal>

      <SubmitModal
        isOpen={submitStatus !== null}
        status={submitStatus}
        errorMessage={submitError}
        onClose={() => setSubmitStatus(null)}
      />
    </div>
  );
};