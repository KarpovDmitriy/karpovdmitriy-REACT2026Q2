import { FormSubmission } from '../../types';
import './FormCard.css';

interface Props { submission: FormSubmission; isNew: boolean; }

function FormCard({ submission, isNew }: Props) {
  return (
    <div className={`form-card ${isNew ? 'form-card--new' : ''}`}>
      <div className="form-card-header">
        <span className="form-card-source">{submission.source === 'hook-form' ? 'React Hook Form' : 'Uncontrolled Form'}</span>
      </div>
      {submission.image && <img className="form-card-image" src={submission.image} alt={submission.name} />}
      <div className="form-card-body">
        <p><strong>Name:</strong> {submission.name}</p>
        <p><strong>Age:</strong> {submission.age}</p>
        <p><strong>Email:</strong> {submission.email}</p>
        <p><strong>Gender:</strong> {submission.gender}</p>
        <p><strong>Country:</strong> {submission.country}</p>
      </div>
    </div>
  );
}

export default FormCard;
