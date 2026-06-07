import { useRef, useState, FormEvent } from 'react';
import { convertToBase64, validateImageFile } from '../../utils/imageUtils';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import '../form.css';

interface Props { onSuccess: () => void; }

function UncontrolledForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new window.FormData(formRef.current);
    const imageFile = (formRef.current.elements.namedItem('imageFile') as HTMLInputElement)?.files?.[0];
    let imageBase64 = '';
    if (imageFile) {
      const err = validateImageFile(imageFile);
      if (!err) imageBase64 = await convertToBase64(imageFile);
    }
    const data: FormData = {
      name: (fd.get('name') as string) || '',
      age: Number(fd.get('age')) || 0,
      email: (fd.get('email') as string) || '',
      gender: (fd.get('gender') as string) || '',
      acceptTerms: fd.get('acceptTerms') === 'on',
      password: (fd.get('password') as string) || '',
      confirmPassword: (fd.get('confirmPassword') as string) || '',
      country: (fd.get('country') as string) || '',
      image: imageBase64,
    };
    addSubmission(data, 'uncontrolled');
    onSuccess();
  };

  return (
    <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-field"><label htmlFor="uc-name">Name</label><input id="uc-name" name="name" type="text" /></div>
      <div className="form-field"><label htmlFor="uc-age">Age</label><input id="uc-age" name="age" type="number" min="0" /></div>
      <div className="form-field"><label htmlFor="uc-email">Email</label><input id="uc-email" name="email" type="email" /></div>
      <div className="form-field"><label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender" defaultValue=""><option value="" disabled>Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
      </div>
      <div className="form-field"><label htmlFor="uc-password">Password</label><input id="uc-password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} /><PasswordStrength password={password} /></div>
      <div className="form-field"><label htmlFor="uc-confirmPassword">Confirm Password</label><input id="uc-confirmPassword" name="confirmPassword" type="password" /></div>
      <div className="form-field"><label htmlFor="uc-country">Country</label><CountryAutocomplete id="uc-country" /></div>
      <div className="form-field"><label htmlFor="uc-image">Profile Image (PNG/JPEG, max 2MB)</label><input id="uc-image" name="imageFile" type="file" accept=".png,.jpg,.jpeg" /></div>
      <div className="form-field form-checkbox"><input id="uc-terms" name="acceptTerms" type="checkbox" /><label htmlFor="uc-terms">I accept the Terms and Conditions</label></div>
      <button type="submit" className="form-submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
