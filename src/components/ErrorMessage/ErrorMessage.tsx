import './ErrorMessage.css';

interface ErrorMessageProps {
  error: Error | null;
  fallbackMessage?: string;
}

function formatErrorMessage(error: Error | null, fallback: string): string {
  if (!error) return fallback;

  const msg = error.message;

  if (msg.includes('not found') || msg.includes('404')) {
    return msg;
  }

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Network')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (msg.includes('status 5')) {
    return 'The server encountered an error. Please try again later.';
  }

  if (msg.includes('status 4')) {
    return 'The request could not be processed. Please check your input and try again.';
  }

  return msg || fallback;
}

function ErrorMessage({ error, fallbackMessage = 'An unexpected error occurred.' }: ErrorMessageProps) {
  const message = formatErrorMessage(error, fallbackMessage);

  return (
    <div className="error-message" role="alert">
      <span className="error-message-icon">⚠️</span>
      <span className="error-message-text">{message}</span>
    </div>
  );
}

export default ErrorMessage;
