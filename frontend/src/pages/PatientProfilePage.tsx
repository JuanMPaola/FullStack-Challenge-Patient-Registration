import { usePatients } from '../hooks/usePatients';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button/button';
import { Spinner } from '../components/ui/Sprinner/Spinner';

export const PatientProfilePage = () => {
  const { patients, loading, error } = usePatients();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const patient = patients[0];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-gray-600">{error ?? 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">
                  {patient.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">{patient.fullName}</h2>
                <p className="text-gray-500 text-sm mt-1">{patient.email}</p>
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                  patient.documentVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {patient.documentVerified ? '✅ Verified' : '⚠️ Unverified'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone</p>
              <p className="text-gray-900 font-medium">{patient.countryCode} {patient.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Document Type</p>
              <p className="text-gray-900 font-medium">{patient.documentType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Document Number</p>
              <p className="text-gray-900 font-medium">{patient.documentNumber ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Member Since</p>
              <p className="text-gray-900 font-medium">
                {new Date(patient.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Document Photo</p>
            <img
              src={patient.documentPhotoUrl}
              alt="Document"
              className="w-full rounded-xl border border-gray-200 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};