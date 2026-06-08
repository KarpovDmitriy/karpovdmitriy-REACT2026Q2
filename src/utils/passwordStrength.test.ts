import { checkPasswordStrength } from './passwordStrength';

describe('checkPasswordStrength', () => {
  it('detects uppercase', () => { expect(checkPasswordStrength('A').hasUppercase).toBe(true); });
  it('detects lowercase', () => { expect(checkPasswordStrength('a').hasLowercase).toBe(true); });
  it('detects number', () => { expect(checkPasswordStrength('1').hasNumber).toBe(true); });
  it('detects special char', () => { expect(checkPasswordStrength('!').hasSpecial).toBe(true); });
  it('returns score 4 for strong password', () => { expect(checkPasswordStrength('Aa1!').score).toBe(4); });
  it('returns score 0 for empty', () => { expect(checkPasswordStrength('').score).toBe(0); });
  it('returns score 2 for partial', () => { expect(checkPasswordStrength('aA').score).toBe(2); });
});
