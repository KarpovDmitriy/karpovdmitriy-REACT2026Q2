import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import './MainPage.css';

function MainPage() {
  const [modalType, setModalType] = useState<'uncontrolled' | 'hook-form' | null>(null);

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
      <p className="empty-state">No submissions yet. Open a form to get started.</p>
    </div>
  );
}

export default MainPage;
