import { Input } from '../../ui/input/input';
import { Button } from '../../ui/button/button';

interface StepAccountProps {
  email: string;
  password: string;
  confirmPassword: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  errors: Record<string, string>;
  onNext: () => void;
  loading: boolean;
}

export const StepAccount = ({
  email, password, confirmPassword,
  onEmailChange, onPasswordChange, onConfirmPasswordChange,
  errors, onNext, loading,
}: StepAccountProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@gmail.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        error={errors.password}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        error={errors.confirmPassword}
      />
      <Button onClick={onNext} loading={loading} className="w-full justify-center mt-2">
        Continue
      </Button>
    </div>
  );
};