import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { convertToBase64, validateImageFile } from '../../utils/imageUtils';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import '../form.css';

interface Props { onSuccess: () => void; }
interface FullFormValues { name: string; age: number; email: string; gender: string; acceptTerms: boolean; password: string; confirmPassword: string; country: string; image: string; }

function HookForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const [imageError, setImageError] = useState('');
  const { register, handleSubmit, watch, setValue } = useForm<FullFormValues>({
    defaultValues: { name: '', age: 0, email: '', gender: '', acceptTerms: false, password: '', confirmPassword: '', country: '', image: '' },
  });
  const passwordValue = watch('password') || '';

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { setImageError('Image is required.'); setValue('image', ''); return; }
    const err = validateImageFile(file);
    if (err) { setImageError(err); setValue('image', ''); return; }
    setImageError('');
    const base64 = await convertToBase64(file);
    setValue('image', base64);
  };

  const onSubmit = (values: FullFormValues) => {
    if (imageError) return;
    const data: FormData = { ...values, age: Number(values.age) };
    addSubmission(data, 'hook-form');
    onSuccess();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field"><label htmlFor="hf-name">Name</label><input id="hf-name" {...register('name')} type="text" /></div>
      <div className="form-field"><label htmlFor="hf-age">Age</label><input id="hf-age" {...register('age')} type="number" min="0" /></div>
      <div className="form-field"><label htmlFor="hf-email">Email</label><input id="hf-email" {...register('email')} type="email" /></div>
      <div className="form-field"><label htmlFor="hf-gender">Gender</label>
        <select id="hf-gender" {...register('gender')} defaultValue=""><option value="" disabled>Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
      </div>
      <div className="form-field"><label htmlFor="hf-password">Password</label><input id="hf-password" {...register('password')} type="password" /><PasswordStrength password={passwordValue} /></div>
      <div className="form-field"><label htmlFor="hf-confirmPassword">Confirm Password</label><input id="hf-confirmPassword" {...register('confirmPassword')} type="password" /></div>
      <div className="form-field"><label htmlFor="hf-country">Country</label><CountryAutocomplete id="hf-country" value={watch('country')} onChange={(v) => setValue('country', v)} /></div>
      <div className="form-field"><label htmlFor="hf-image">Profile Image (PNG/JPEG, max 2MB)</label><input id="hf-image" type="file" accept=".png,.jpg,.jpeg" onChange={onFileChange} /><span className="form-error">{imageError}</span></div>
      <div className="form-field form-checkbox"><input id="hf-terms" {...register('acceptTerms')} type="checkbox" /><label htmlFor="hf-terms">I accept the Terms and Conditions</label></div>
      <button type="submit" className="form-submit">Submit</button>
    </form>
  );
}

export default HookForm;
