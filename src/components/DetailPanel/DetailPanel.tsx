import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPokemonDetails } from '../../services/api';
import { PokemonDetail } from '../../types';
import Loader from '../Loader/Loader';
import './DetailPanel.css';

function DetailPanel() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPokemonDetails(name)
      .then((data) => {
        if (!cancelled) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load details.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  const handleClose = () => {
    const page = searchParams.get('page') ?? '1';
    navigate(`/?page=${page}`);
  };

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={handleClose}>
        ✕
      </button>
      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && detail && (
        <div className="detail-content">
          <h2 className="detail-name">{detail.name}</h2>
          {detail.sprite && (
            <img className="detail-sprite" src={detail.sprite} alt={detail.name} />
          )}
          <p className="detail-description">{detail.description}</p>
          <ul className="detail-stats">
            <li>Height: {detail.height}</li>
            <li>Weight: {detail.weight}</li>
            <li>Types: {detail.types.join(', ')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DetailPanel;
