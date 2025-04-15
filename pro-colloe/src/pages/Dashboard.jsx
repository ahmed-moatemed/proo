import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) navigate('/auth', { replace: true });
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to your scheduler!</p>
    </div>
  );
}