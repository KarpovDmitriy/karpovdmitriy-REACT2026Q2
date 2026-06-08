import { formSchema, setCountriesList } from './validationSchema';

describe('formSchema', () => {
  beforeEach(() => { setCountriesList(['Germany', 'France']); });

  const validData = { name: 'John', age: 25, email: 'john@example.com', gender: 'male', acceptTerms: true, password: 'Abc123!', confirmPassword: 'Abc123!', country: 'Germany', image: 'data:image/png;base64,abc' };

  it('validates correct data', async () => {
    await expect(formSchema.validate(validData)).resolves.toBeDefined();
  });

  it('rejects name starting with lowercase', async () => {
    await expect(formSchema.validate({ ...validData, name: 'john' })).rejects.toThrow();
  });

  it('rejects negative age', async () => {
    await expect(formSchema.validate({ ...validData, age: -1 })).rejects.toThrow();
  });

  it('rejects invalid email', async () => {
    await expect(formSchema.validate({ ...validData, email: 'nope' })).rejects.toThrow();
  });

  it('rejects mismatched passwords', async () => {
    await expect(formSchema.validate({ ...validData, confirmPassword: 'different' })).rejects.toThrow();
  });

  it('rejects unknown country', async () => {
    await expect(formSchema.validate({ ...validData, country: 'Narnia' })).rejects.toThrow();
  });

  it('rejects unaccepted terms', async () => {
    await expect(formSchema.validate({ ...validData, acceptTerms: false })).rejects.toThrow();
  });
});
