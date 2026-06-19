import "./addresscard.css";

const AddressCard = ({ address, selected, onSelect, onEdit, onDelete, onSetDefault }) => (
  <div
    className={`addr-card ${selected ? "addr-card--selected" : ""} ${address.is_default ? "addr-card--default" : ""}`}
    onClick={() => onSelect && onSelect(address)}
  >
    <div className="addr-card__header">
      <div className="addr-card__tags">
        <span className={`addr-tag addr-tag--${address.address_type}`}>{address.address_type.toUpperCase()}</span>
        {address.is_default && <span className="addr-tag addr-tag--default">DEFAULT</span>}
      </div>
      <div className="addr-card__actions">
        {!address.is_default && (
          <button className="addr-action-btn" onClick={(e) => { e.stopPropagation(); onSetDefault(address.id); }} title="Set as default">⭐</button>
        )}
        <button className="addr-action-btn" onClick={(e) => { e.stopPropagation(); onEdit(address); }} title="Edit">✏️</button>
        <button className="addr-action-btn addr-action-btn--danger" onClick={(e) => { e.stopPropagation(); onDelete(address.id); }} title="Delete">🗑️</button>
      </div>
    </div>
    <div className="addr-card__body">
      <p className="addr-name">{address.full_name}</p>
      <p className="addr-phone">📞 {address.phone}</p>
      <p className="addr-street">{address.street}{address.landmark ? `, ${address.landmark}` : ""}</p>
      <p className="addr-city">{address.city}, {address.state} — {address.pincode}</p>
    </div>
    {selected && <div className="addr-card__check">✓</div>}
  </div>
);

export default AddressCard;
