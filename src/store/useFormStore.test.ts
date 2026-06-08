import { useFormStore } from './useFormStore';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [], lastSubmissionId: null });
  });

  it('has initial state', () => {
    const state = useFormStore.getState();
    expect(state.submissions).toEqual([]);
    expect(state.countries.length).toBeGreaterThan(0);
    expect(state.lastSubmissionId).toBeNull();
  });

  it('addSubmission adds a submission', () => {
    const data = { name: 'John', age: 25, email: 'j@e.com', gender: 'male', acceptTerms: true, password: 'Abc1!x', confirmPassword: 'Abc1!x', country: 'Germany', image: 'data:image/png;base64,abc' };
    useFormStore.getState().addSubmission(data, 'uncontrolled');
    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('John');
    expect(state.submissions[0].source).toBe('uncontrolled');
    expect(state.lastSubmissionId).toBe(state.submissions[0].id);
  });

  it('addSubmission prepends new submissions', () => {
    const data1 = { name: 'A', age: 1, email: 'a@b.com', gender: 'male', acceptTerms: true, password: 'x', confirmPassword: 'x', country: 'France', image: '' };
    const data2 = { name: 'B', age: 2, email: 'b@c.com', gender: 'female', acceptTerms: true, password: 'y', confirmPassword: 'y', country: 'Italy', image: '' };
    useFormStore.getState().addSubmission(data1, 'uncontrolled');
    useFormStore.getState().addSubmission(data2, 'hook-form');
    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(2);
    expect(state.submissions[0].name).toBe('B');
    expect(state.submissions[1].name).toBe('A');
  });

  it('clearHighlight sets lastSubmissionId to null', () => {
    const data = { name: 'X', age: 1, email: 'x@y.com', gender: 'male', acceptTerms: true, password: 'p', confirmPassword: 'p', country: 'Japan', image: '' };
    useFormStore.getState().addSubmission(data, 'uncontrolled');
    expect(useFormStore.getState().lastSubmissionId).not.toBeNull();
    useFormStore.getState().clearHighlight();
    expect(useFormStore.getState().lastSubmissionId).toBeNull();
  });

  it('countries list is populated', () => {
    expect(useFormStore.getState().countries).toContain('Germany');
    expect(useFormStore.getState().countries).toContain('United States');
  });
});
