import { useRef, FormEvent } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import '../form.css';

interface Props { onSuccess: () => void; }

function UncontrolledForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    const fd = new window.FormData(formRef.current);
    const data: FormData = {
      name: (fd.get('name') as string) || '',
      age: Number(fd.get('age')) || 0,
      email: (fd.get('email') as string) || '',
      gender: (fd.get('gender') as string) || '',
      acceptTerms: fd.get('acceptTerms') === 'on',
      password: '',
      confirmPassword: '',
      country: '',
      image: '',
    };
    addSubmission(data, 'uncontrolled');
    onSuccess();
  };

  return (
    <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" name="name" type="text" />
      </div>
      <div className="form-field">
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" name="age" type="number" min="0" />
      </div>
      <div className="form-field">
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" name="email" type="email" />
      </div>
      <div className="form-field">
        <label htmlFor="uc-gender">Gender</label>
        <select id="uc-gender" name="gender" defaultValue="">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-field form-checkbox">
        <input id="uc-terms" name="acceptTerms" type="checkbox" />
        <label htmlFor="uc-terms">I accept the Terms and Conditions</label>
      </div>
      <button type="submit" className="form-submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;
