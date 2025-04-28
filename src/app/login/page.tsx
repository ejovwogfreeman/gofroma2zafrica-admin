import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | AfricGo Dashboard',
  description: 'Login to AfricGo admin dashboard',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
} 