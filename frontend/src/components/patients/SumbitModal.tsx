import { Modal } from '../ui/Modal/Modal';
import { Button } from '../ui/button/button';

interface SubmitModalProps {
  isOpen: boolean;
  status: 'success' | 'error' | null;
  errorMessage?: string;
  onClose: () => void;
}

export const SubmitModal = ({ isOpen, status, errorMessage, onClose }: SubmitModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">
        {status === 'success' ? (
          <>
            <span className="text-5xl animate-scale-in">✅</span>
            <h2 className="text-xl font-bold text-gray-900">Patient Registered!</h2>
            <p className="text-gray-500 text-sm">
              The patient was successfully registered. A confirmation email has been sent.
            </p>
          </>
        ) : (
          <>
            <span className="text-5xl animate-scale-in">❌</span>
            <h2 className="text-xl font-bold text-gray-900">Registration Failed</h2>
            <p className="text-gray-500 text-sm">
              {errorMessage ?? 'Something went wrong. Please try again.'}
            </p>
          </>
        )}
        <Button onClick={onClose} className="w-full justify-center">
          Close
        </Button>
      </div>
    </Modal>
  );
};