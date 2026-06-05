import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import FormCard from '../components/FormCard/FormCard';
import { useFormStore } from '../store/useFormStore';
import './MainPage.css';

function MainPage() {
  const [modalType, setModalType] = useState<'uncontrolled' | 'hook-form' | null>(null);
  const submissions = useFormStore((s) => s.submissions);

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>React Forms</h1>
        <div className="main-actions">
          <button className="btn btn-primary" onClick={() => setModalType('uncontrolled')}>Uncontrolled Form</button>
          <button className="btn btn-secondary" onClick={() => setModalType('hook-form')}>React Hook Form</button>
        </div>
      </header>
      <Modal isOpen={modalType === 'uncontrolled'} onClose={() => setModalType(null)} title="Uncontrolled Form">
        <p>Uncontrolled form coming soon...</p>
      </Modal>
      <Modal isOpen={modalType === 'hook-form'} onClose={() => setModalType(null)} title="React Hook Form">
        <p>Hook form coming soon...</p>
      </Modal>
      {submissions.length > 0 && (
        <section className="submissions">
          <h2>Submissions ({submissions.length})</h2>
          <div className="submissions-grid">
            {submissions.map((s) => <FormCard key={s.id} submission={s} />)}
          </div>
        </section>
      )}
      {submissions.length === 0 && <p className="empty-state">No submissions yet. Open a form to get started.</p>}
    </div>
  );
}

export default MainPage;
