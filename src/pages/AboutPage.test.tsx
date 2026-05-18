import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  const renderAbout = () =>
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

  it('displays the About title', () => {
    renderAbout();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('displays author name', () => {
    renderAbout();
    expect(screen.getByText('Dmitriy Karpov')).toBeInTheDocument();
  });

  it('contains a link to RS School React course', () => {
    renderAbout();
    const link = screen.getByRole('link', { name: /RS School React Course/i });
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('contains a link back to home', () => {
    renderAbout();
    const link = screen.getByRole('link', { name: /Back to Home/i });
    expect(link).toBeInTheDocument();
  });
});
