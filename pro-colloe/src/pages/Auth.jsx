import { useState } from 'react';
import { signIn, signUp } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import '../style/auth.css'; 

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
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        {error && <p className="auth-error">{error}</p>}
        <div>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {isSignUp && (
            <input
              className="auth-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          )}
          <button
            className="auth-button"
            onClick={handleSubmit}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        <p className="auth-switch">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}