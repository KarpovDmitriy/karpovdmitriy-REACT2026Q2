import { useForm } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import { FormData } from '../../types';
import '../form.css';

interface Props { onSuccess: () => void; }

interface BasicFormValues { name: string; age: number; email: string; gender: string; acceptTerms: boolean; }

function HookForm({ onSuccess }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);
  const { register, handleSubmit } = useForm<BasicFormValues>({ defaultValues: { name: '', age: 0, email: '', gender: '', acceptTerms: false } });

  const onSubmit = (values: BasicFormValues) => {
    const data: FormData = { ...values, age: Number(values.age), password: '', confirmPassword: '', country: '', image: '' };
    addSubmission(data, 'hook-form');
    onSuccess();
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-field">
        <label htmlFor="hf-name">Name</label>
        <input id="hf-name" {...register('name')} type="text" />
      </div>
      <div className="form-field">
        <label htmlFor="hf-age">Age</label>
        <input id="hf-age" {...register('age')} type="number" min="0" />
      </div>
      <div className="form-field">
        <label htmlFor="hf-email">Email</label>
        <input id="hf-email" {...register('email')} type="email" />
      </div>
      <div className="form-field">
        <label htmlFor="hf-gender">Gender</label>
        <select id="hf-gender" {...register('gender')} defaultValue="">
          <option value="" disabled>Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-field form-checkbox">
        <input id="hf-terms" {...register('acceptTerms')} type="checkbox" />
        <label htmlFor="hf-terms">I accept the Terms and Conditions</label>
      </div>
      <button type="submit" className="form-submit">Submit</button>
    </form>
  );
}

export default HookForm;
