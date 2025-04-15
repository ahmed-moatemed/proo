import { useState } from 'react';
import { signIn, signUp } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSignUp && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
      <p className="mt-4 text-center">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }}
          className="ml-1 text-blue-500 hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}