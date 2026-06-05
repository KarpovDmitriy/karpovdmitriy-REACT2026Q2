import { create } from 'zustand';
import { FormData, FormSubmission } from '../types';

const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada',
  'China', 'Czech Republic', 'Denmark', 'Egypt', 'Finland', 'France',
  'Germany', 'Greece', 'India', 'Ireland', 'Italy', 'Japan', 'Mexico',
  'Netherlands', 'New Zealand', 'Norway', 'Poland', 'Portugal', 'Russia',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Turkey',
  'United Kingdom', 'United States',
];

interface AppState {
  submissions: FormSubmission[];
  countries: string[];
  lastSubmissionId: string | null;

  addSubmission: (data: FormData, source: 'uncontrolled' | 'hook-form') => void;
  clearHighlight: () => void;
}

export const useFormStore = create<AppState>((set) => ({
  submissions: [],
  countries: COUNTRIES,
  lastSubmissionId: null,

  addSubmission: (data, source) => {
    const submission: FormSubmission = {
      ...data,
      id: crypto.randomUUID(),
      source,
      submittedAt: Date.now(),
    };
    set((state) => ({
      submissions: [submission, ...state.submissions],
      lastSubmissionId: submission.id,
    }));
  },

  clearHighlight: () => {
    set({ lastSubmissionId: null });
  },
}));
