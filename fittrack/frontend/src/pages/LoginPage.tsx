import { useState } from 'react';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (name: string, email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    // Simulated auth delay
    setTimeout(() => {
      const displayName = isSignUp ? name : email.split('@')[0];
      // Store in localStorage for session persistence
      localStorage.setItem(
        'fittrack_user',
        JSON.stringify({ name: displayName, email })
      );
      onLogin(displayName, email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg-gradient" />
      <div className="login-bg-grid" />

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Zap size={28} />
          </div>
          <div>
            <div className="login-logo-title">FitTrack</div>
            <div className="login-logo-subtitle">ELITE PERFORMANCE</div>
          </div>
        </div>

        {/* Card */}
        <div className="login-card">
          <h1 className="login-heading">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="login-subheading">
            {isSignUp
              ? 'Start your fitness journey today'
              : 'Sign in to your dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-field">
                <label className="login-label">Full Name</label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Email</label>
              <input
                type="email"
                className="login-input"
                placeholder="alex@fittrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="login-forgot">
                <button type="button" className="login-forgot-btn">
                  Forgot password?
                </button>
              </div>
            )}

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="login-google-btn" onClick={() => {
            const gName = 'Alex Rivera';
            localStorage.setItem('fittrack_user', JSON.stringify({ name: gName, email: 'alex@fittrack.com' }));
            onLogin(gName, 'alex@fittrack.com');
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continue with Google
          </button>

          <p className="login-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <p className="login-footer">
          © 2026 FitTrack Elite Performance. All rights reserved.
        </p>
      </div>
    </div>
  );
}
