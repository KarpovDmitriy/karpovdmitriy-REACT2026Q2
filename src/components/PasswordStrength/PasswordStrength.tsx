import { checkPasswordStrength } from '../../utils/passwordStrength';
import './PasswordStrength.css';

interface Props { password: string; }

function PasswordStrength({ password }: Props) {
  if (!password) return null;
  const s = checkPasswordStrength(password);
  const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="pw-strength">
      <div className="pw-bar-track">
        <div className="pw-bar-fill" style={{ width: `${s.score * 25}%`, background: colors[s.score - 1] || '#e74c3c' }} />
      </div>
      <span className="pw-label" style={{ color: colors[s.score - 1] || '#e74c3c' }}>{labels[s.score - 1] || 'Weak'}</span>
      <ul className="pw-checklist">
        <li className={s.hasUppercase ? 'met' : ''}>1 uppercase letter</li>
        <li className={s.hasLowercase ? 'met' : ''}>1 lowercase letter</li>
        <li className={s.hasNumber ? 'met' : ''}>1 number</li>
        <li className={s.hasSpecial ? 'met' : ''}>1 special character</li>
      </ul>
    </div>
  );
}

export default PasswordStrength;
