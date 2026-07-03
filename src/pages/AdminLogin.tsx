import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      toast.error(t.validation_required_fields);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      toast.error(t.login_error);
    } else {
      toast.success(t.login_success);
      navigate('/admin');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{t.login_title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <div>
            <Label htmlFor="email">{t.login_email} <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: false }));
              }}
              placeholder="admin@email.ee"
              className={fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
          </div>
          <div>
            <Label htmlFor="password">{t.login_password} <span className="text-destructive">*</span></Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: false }));
              }}
              placeholder="••••••••"
              className={fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t.login_loading : t.login_button}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
