import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema, FormSchemaType, setCountriesList } from '../../utils/validationSchema';
import { convertToBase64, validateImageFile } from '../../utils/imageUtils';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import '../form.css';

interface Props { onSuccess: () => void; }

function HookForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const countries = useFormStore((s) => s.countries);
  const [imageError, setImageError] = useState('');

  setCountriesList(countries);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<FormSchemaType>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: { name: '', age: undefined, email: '', gender: '', acceptTerms: false, password: '', confirmPassword: '', country: '', image: '' },
  });

  const passwordValue = watch('password') || '';

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) { setImageError('Image is required.'); setValue('image', '', { shouldValidate: true }); return; }
    const err = validateImageFile(file);
    if (err) { setImageError(err); setValue('image', '', { shouldValidate: true }); return; }
    setImageError('');
    const base64 = await convertToBase64(file);
    setValue('image', base64, { shouldValidate: true });
  };

  const onSubmit = (data: FormSchemaType) => {
    if (imageError) return;
    const formData: FormData = { ...data, age: Number(data.age), image: data.image || '' };
    addSubmission(formData, 'hook-form');
    onSuccess();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="hf-name">Name</label>
        <input id="hf-name" {...register('name')} type="text" />
        <span className="form-error">{errors.name?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-age">Age</label>
        <input id="hf-age" {...register('age')} type="number" min="0" />
        <span className="form-error">{errors.age?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-email">Email</label>
        <input id="hf-email" {...register('email')} type="email" />
        <span className="form-error">{errors.email?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-gender">Gender</label>
        <select id="hf-gender" {...register('gender')} defaultValue="">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className="form-error">{errors.gender?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-password">Password</label>
        <input id="hf-password" {...register('password')} type="password" />
        <PasswordStrength password={passwordValue} />
        <span className="form-error">{errors.password?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-confirmPassword">Confirm Password</label>
        <input id="hf-confirmPassword" {...register('confirmPassword')} type="password" />
        <span className="form-error">{errors.confirmPassword?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-country">Country</label>
        <CountryAutocomplete id="hf-country" value={watch('country')} onChange={(v) => setValue('country', v, { shouldValidate: true })} />
        <span className="form-error">{errors.country?.message || ''}</span>
      </div>
      <div className="form-field">
        <label htmlFor="hf-image">Profile Image (PNG/JPEG, max 2MB)</label>
        <input id="hf-image" type="file" accept=".png,.jpg,.jpeg" onChange={onFileChange} />
        <span className="form-error">{imageError || errors.image?.message || ''}</span>
      </div>
      <div className="form-field form-checkbox">
        <input id="hf-terms" {...register('acceptTerms')} type="checkbox" />
        <label htmlFor="hf-terms">I accept the Terms and Conditions</label>
        <span className="form-error">{errors.acceptTerms?.message || ''}</span>
      </div>
      <button type="submit" className="form-submit" disabled={!isValid || !!imageError}>Submit</button>
    </form>
  );
}

export default HookForm;
