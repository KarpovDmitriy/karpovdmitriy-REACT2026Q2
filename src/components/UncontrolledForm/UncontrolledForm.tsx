import { useRef, useState, FormEvent } from 'react';
import { formSchema, setCountriesList } from '../../utils/validationSchema';
import { convertToBase64, validateImageFile } from '../../utils/imageUtils';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import '../form.css';

interface Props { onSuccess: () => void; }

function UncontrolledForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const countries = useFormStore((s) => s.countries);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new window.FormData(formRef.current);
    const imageFile = (formRef.current.elements.namedItem('imageFile') as HTMLInputElement)?.files?.[0];

    let imageBase64 = '';
    let imageError: string | null = null;

    if (!imageFile) {
      imageError = 'Image is required.';
    } else {
      imageError = validateImageFile(imageFile);
      if (!imageError) {
        imageBase64 = await convertToBase64(imageFile);
      }
    }

    setCountriesList(countries);

    const raw = {
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

    try {
      const validated = await formSchema.validate(raw, { abortEarly: false });
      if (imageError) {
        setErrors({ image: imageError });
        return;
      }
      const data: FormData = { ...validated, image: imageBase64 };
      addSubmission(data, 'uncontrolled');
      onSuccess();
    } catch (err) {
      const newErrors: Record<string, string> = {};
      if (imageError) newErrors.image = imageError;
      if (err && typeof err === 'object' && 'inner' in err) {
        const yupErr = err as { inner: Array<{ path?: string; message: string }> };
        yupErr.inner.forEach((e) => { if (e.path && !newErrors[e.path]) newErrors[e.path] = e.message; });
      }
      setErrors(newErrors);
    }
  };

  return (
    <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" type="text" />
        <span className="form-error">{errors.name || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" min="0" />
        <span className="form-error">{errors.age || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" />
        <span className="form-error">{errors.email || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender" defaultValue="">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className="form-error">{errors.gender || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-password">Password</label>
        <input id="uc-password" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <PasswordStrength password={password} />
        <span className="form-error">{errors.password || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-confirmPassword">Confirm Password</label>
        <input id="uc-confirmPassword" name="confirmPassword" type="password" />
        <span className="form-error">{errors.confirmPassword || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-country">Country</label>
        <CountryAutocomplete id="uc-country" />
        <span className="form-error">{errors.country || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="uc-image">Profile Image (PNG/JPEG, max 2MB)</label>
        <input id="uc-image" name="imageFile" type="file" accept=".png,.jpg,.jpeg" />
        <span className="form-error">{errors.image || ''}</span>
      </div>
      <div className="form-field form-checkbox">
        <input id="uc-terms" name="acceptTerms" type="checkbox" />
        <label htmlFor="uc-terms">I accept the Terms and Conditions</label>
        <span className="form-error">{errors.acceptTerms || ''}</span>
      </div>
      <button type="submit" className="form-submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
