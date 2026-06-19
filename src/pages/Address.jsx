import { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../hooks/useAddress";
import AddressCard from "../components/AddressCard/AddressCard";
import { toast } from "react-toastify";
import "./address.css";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry"];

const EMPTY = { full_name:"", phone:"", street:"", landmark:"", city:"", state:"", pincode:"", address_type:"home", is_default:false };

const AddressPage = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefault } = useAddress(user?.token);

  const [showModal, setShowModal] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});

  const openAdd  = () => { setForm(EMPTY); setEditItem(null); setErrors({}); setShowModal(true); };
  const openEdit = (a) => { setForm({ ...a }); setEditItem(a); setErrors({}); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditItem(null); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim())  e.full_name = "Full name is required.";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g,""))) e.phone = "Enter valid 10-digit phone.";
    if (!form.street.trim())     e.street    = "Street address is required.";
    if (!form.city.trim())       e.city      = "City is required.";
    if (!form.state)             e.state     = "Select a state.";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editItem) {
        await updateAddress(editItem.id, form);
        toast.success("Address updated!");
      } else {
        await addAddress(form);
        toast.success("Address added!");
      }
      closeModal();
    } catch (err) {
      toast.error("Failed to save address.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await deleteAddress(id);
    toast.success("Address deleted.");
  };

  const handleSetDefault = async (id) => {
    await setDefault(id);
    toast.success("Default address updated.");
  };

  const F = (field) => ({
    value: form[field],
    onChange: (e) => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: "" })); }
  });

  return (
    <section className="address-page">
      <Container>
        <div className="address-header">
          <div>
            <h2>My Addresses</h2>
            <p>Manage your delivery addresses</p>
          </div>
          <button className="btn-add-addr" onClick={openAdd}>+ Add New Address</button>
        </div>

        {loading ? (
          <div className="addr-loading">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="addr-empty">
            <div style={{ fontSize: "48px" }}>📭</div>
            <h3>No addresses saved</h3>
            <p>Add a delivery address to speed up checkout.</p>
            <button className="btn-add-addr" onClick={openAdd}>+ Add Address</button>
          </div>
        ) : (
          <div className="addr-grid">
            {addresses.map(a => (
              <AddressCard
                key={a.id}
                address={a}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}

        <div className="addr-back">
          <button className="btn-outline-back" onClick={() => navigate(-1)}>← Back</button>
        </div>
      </Container>

      {/* Address Modal */}
      {showModal && (
        <div className="addr-modal-overlay" onClick={closeModal}>
          <div className="addr-modal" onClick={e => e.stopPropagation()}>
            <div className="addr-modal-header">
              <h3>{editItem ? "Edit Address" : "Add New Address"}</h3>
              <button className="addr-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="addr-modal-body">
              <div className="addr-form-row">
                <div className="addr-field">
                  <label>Full Name *</label>
                  <input placeholder="Enter full name" {...F("full_name")} />
                  {errors.full_name && <span className="field-err">{errors.full_name}</span>}
                </div>
                <div className="addr-field">
                  <label>Mobile Number *</label>
                  <input placeholder="10-digit mobile" maxLength={10} {...F("phone")} />
                  {errors.phone && <span className="field-err">{errors.phone}</span>}
                </div>
              </div>

              <div className="addr-field">
                <label>House No / Street *</label>
                <input placeholder="Flat, House No, Building, Street" {...F("street")} />
                {errors.street && <span className="field-err">{errors.street}</span>}
              </div>

              <div className="addr-field">
                <label>Landmark</label>
                <input placeholder="Nearby landmark (optional)" {...F("landmark")} />
              </div>

              <div className="addr-form-row">
                <div className="addr-field">
                  <label>City *</label>
                  <input placeholder="City" {...F("city")} />
                  {errors.city && <span className="field-err">{errors.city}</span>}
                </div>
                <div className="addr-field">
                  <label>Pincode *</label>
                  <input placeholder="6-digit pincode" maxLength={6} {...F("pincode")} />
                  {errors.pincode && <span className="field-err">{errors.pincode}</span>}
                </div>
              </div>

              <div className="addr-form-row">
                <div className="addr-field">
                  <label>State *</label>
                  <select {...F("state")}>
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="field-err">{errors.state}</span>}
                </div>
                <div className="addr-field">
                  <label>Address Type</label>
                  <div className="addr-type-toggle">
                    {["home","work"].map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`type-btn ${form.address_type === t ? "type-btn--active" : ""}`}
                        onClick={() => setForm(p => ({ ...p, address_type: t }))}
                      >{t === "home" ? "🏠 Home" : "🏢 Work"}</button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="addr-default-check">
                <input type="checkbox" checked={form.is_default} onChange={e => setForm(p => ({ ...p, is_default: e.target.checked }))} />
                <span>Set as default address</span>
              </label>
            </div>
            <div className="addr-modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editItem ? "Update Address" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddressPage;
