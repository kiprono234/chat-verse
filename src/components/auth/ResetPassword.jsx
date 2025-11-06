// src/components/auth/ResetPassword.jsx
import React, { useState } from 'react';
import styles from './AuthForm.module.scss';
import * as api from '../../api/auth';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function requestReset(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.requestPasswordReset({ email });
      setMsg(res?.message || 'If that email exists, instructions were sent.');
      setStep(2);
    } catch (err) { setMsg(err.message || 'Request failed'); }
    finally { setBusy(false); }
  }

  async function performReset(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.resetPassword({ token, password });
      setMsg(res?.message || 'Password reset successful.');
    } catch (err) { setMsg(err.message || 'Reset failed'); }
    finally { setBusy(false); }
  }

  return (
    <div className={styles.authWrap}>
      <div className={styles.authCard}>
        <h2>{step === 1 ? 'Reset password' : 'Enter new password'}</h2>
        {msg && <div className={styles.info}>{msg}</div>}

        {step === 1 ? (
          <form onSubmit={requestReset}>
            <label>
              Email
              <input value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <button className={styles.cta} disabled={busy}>{busy ? 'Sending...' : 'Send reset email'}</button>
            <div className={styles.row}><Link to="/login">Back to sign in</Link></div>
          </form>
        ) : (
          <form onSubmit={performReset}>
            <label>
              Reset token
              <input value={token} onChange={e => setToken(e.target.value)} required />
            </label>
            <label>
              New password
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </label>
            <button className={styles.cta} disabled={busy}>{busy ? 'Resetting...' : 'Reset password'}</button>
            <div className={styles.row}><Link to="/login">Back to sign in</Link></div>
          </form>
        )}
      </div>
    </div>
  );
}
