import * as yup from 'yup';

const COUNTRIES_LIST: string[] = [];

export function setCountriesList(countries: string[]) {
  COUNTRIES_LIST.length = 0;
  COUNTRIES_LIST.push(...countries);
}

export function getCountriesList(): string[] {
  return COUNTRIES_LIST;
}

function validateEmail(email: string): boolean {
  const atIndex = email.indexOf('@');
  if (atIndex < 1) return false;
  const afterAt = email.slice(atIndex + 1);
  if (email.indexOf('@', atIndex + 1) !== -1) return false;
  if (!afterAt || afterAt.length < 3) return false;
  const dotIndex = afterAt.indexOf('.');
  if (dotIndex < 1 || dotIndex === afterAt.length - 1) return false;
  return true;
}

export const formSchema = yup.object({
  name: yup
    .string()
    .required('Name is required.')
    .test('uppercase-first', 'Name must start with an uppercase letter.', (val) => {
      if (!val) return false;
      return val[0] === val[0].toUpperCase() && val[0] !== val[0].toLowerCase();
    }),
  age: yup
    .number()
    .typeError('Age must be a number.')
    .required('Age is required.')
    .min(0, 'Age cannot be negative.')
    .integer('Age must be a whole number.'),
  email: yup
    .string()
    .required('Email is required.')
    .test('valid-email', 'Enter a valid email address.', (val) => {
      if (!val) return false;
      return validateEmail(val);
    }),
  gender: yup.string().required('Gender is required.'),
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the Terms and Conditions.')
    .required('You must accept the Terms and Conditions.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required.')
    .oneOf([yup.ref('password')], 'Passwords must match.'),
  country: yup
    .string()
    .required('Country is required.')
    .test('valid-country', 'Please select a valid country from the list.', (val) => {
      if (!val) return false;
      return COUNTRIES_LIST.includes(val);
    }),
  image: yup.string().required('Image is required.'),
});

export type FormSchemaType = yup.InferType<typeof formSchema>;
