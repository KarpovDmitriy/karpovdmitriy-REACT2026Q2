import { useAppStore } from '../../store/useAppStore';
import './Flyout.css';

function Flyout() {
  const { selectedItems, unselectAll } = useAppStore();

  if (selectedItems.length === 0) return null;

  return (
    <div className="flyout">
      <span className="flyout-count">
        {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
      </span>
      <div className="flyout-actions">
        <button className="flyout-button flyout-button--unselect" onClick={unselectAll}>
          Unselect all
        </button>
        <button className="flyout-button flyout-button--download">
          Download
        </button>
      </div>
    </div>
  );
}

export default Flyout;
