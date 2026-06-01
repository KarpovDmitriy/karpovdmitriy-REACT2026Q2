import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './DetailPanel.css';

function DetailPanel() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: detail, isLoading, isFetching, error } = usePokemonDetails(name);
  const handleClose = () => { navigate(`/?page=${searchParams.get('page') ?? '1'}`); };
  const isBackgroundRefetch = isFetching && !isLoading;

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={handleClose}>✕</button>
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error instanceof Error ? error : null} fallbackMessage="Failed to load details." />}
      {!isLoading && !error && detail && (
        <div className="detail-content">
          {isBackgroundRefetch && <div className="refetch-indicator">Refreshing...</div>}
          <h2 className="detail-name">{detail.name}</h2>
          {detail.sprite && <img className="detail-sprite" src={detail.sprite} alt={detail.name} />}
          <p className="detail-description">{detail.description}</p>
          <ul className="detail-stats">
            <li>Height: {detail.height}</li><li>Weight: {detail.weight}</li><li>Types: {detail.types.join(', ')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DetailPanel;
