import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Truck, 
  Building2, 
  RefreshCw,
  FileSpreadsheet,
  X,
  Compass,
  Check,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';

interface DeliveryCoverageManagerProps {
  token: string;
}

const ALL_TRANSPORT_METHODS = [
  "State Roadlines",
  "Bus Cargo",
  "Regional Carrier Tempo",
  "Indian Post",
  "Private Transport Agencies"
];

export const DeliveryCoverageManager: React.FC<DeliveryCoverageManagerProps> = ({ token }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>('');

  // Form Fields
  const [formPincode, setFormPincode] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('');
  const [formDistrict, setFormDistrict] = useState<string>('');
  const [formState, setFormState] = useState<string>('Odisha');
  const [formZoneName, setFormZoneName] = useState<string>('South Odisha Hub');
  const [formStatus, setFormStatus] = useState<string>('REGULAR');
  const [formLocalities, setFormLocalities] = useState<string>('');
  const [formTransportModes, setFormTransportModes] = useState<string[]>(['State Roadlines', 'Bus Cargo']);
  const [formTransitDuration, setFormTransitDuration] = useState<string>('1-2 Days');
  const [formShippingRate, setFormShippingRate] = useState<number>(40);
  const [formChargesText, setFormChargesText] = useState<string>('₹40 flat / carton');
  const [formConditions, setFormConditions] = useState<string>('');
  const [formDailyTransit, setFormDailyTransit] = useState<boolean>(true);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formNotes, setFormNotes] = useState<string>('');

  // CSV Bulk Import ref & state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 300 };
      if (search.trim()) params.search = search.trim();
      if (filterState !== 'ALL') params.state = filterState;
      if (filterStatus !== 'ALL') params.status = filterStatus;
      if (filterDistrict !== 'ALL') params.district = filterDistrict;

      const res = await apiService.adminListPincodes(token, params);
      setRecords(res.records || []);
      setTotalCount(res.total || 0);
    } catch (err: any) {
      console.error('Failed to load pincodes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [search, filterState, filterStatus, filterDistrict]);

  // Extract unique districts from loaded records for quick filter
  const uniqueDistricts = Array.from(new Set(records.map((r) => r.district).filter(Boolean))).sort();

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormPincode('');
    setFormCity('');
    setFormDistrict('Gajapati');
    setFormState('Odisha');
    setFormZoneName('South Odisha Hub');
    setFormStatus('REGULAR');
    setFormLocalities('');
    setFormTransportModes(['State Roadlines', 'Bus Cargo', 'Regional Carrier Tempo']);
    setFormTransitDuration('1-2 Days');
    setFormShippingRate(40);
    setFormChargesText('₹40 flat / carton');
    setFormConditions('Scheduled daily factory dispatch route.');
    setFormDailyTransit(true);
    setFormIsActive(true);
    setFormNotes('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: any) => {
    setEditingRecord(rec);
    setFormPincode(rec.pincode);
    setFormCity(rec.city);
    setFormDistrict(rec.district);
    setFormState(rec.state);
    setFormZoneName(rec.zone_name || 'South Odisha Hub');
    setFormStatus(rec.serviceability_status || 'REGULAR');
    setFormLocalities(rec.localities || '');
    
    // Parse transport modes
    let modes: string[] = [];
    if (rec.transport_modes) {
      try {
        if (rec.transport_modes.startsWith('[')) {
          modes = JSON.parse(rec.transport_modes);
        } else {
          modes = rec.transport_modes.split(',').map((x: string) => x.trim());
        }
      } catch {
        modes = ['State Roadlines', 'Bus Cargo'];
      }
    }
    setFormTransportModes(modes);
    setFormTransitDuration(rec.transit_duration_label || '1-2 Days');
    setFormShippingRate(Number(rec.standard_shipping_rate || 40));
    setFormChargesText(rec.delivery_charges_text || `₹${rec.standard_shipping_rate || 40} flat / carton`);
    setFormConditions(rec.delivery_conditions || '');
    setFormDailyTransit(rec.daily_transit_available !== undefined ? rec.daily_transit_available : true);
    setFormIsActive(rec.is_active !== undefined ? rec.is_active : true);
    setFormNotes(rec.notes || '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPincode || !formCity || !formDistrict) {
      setModalError('Please fill in PIN code, City/Town, and District.');
      return;
    }
    if (!/^\d{6}$/.test(formPincode.trim())) {
      setModalError('PIN code must be exactly 6 digits.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    const payload = {
      pincode: formPincode.trim(),
      city: formCity.trim(),
      district: formDistrict.trim(),
      state: formState.trim(),
      zone_name: formZoneName.trim(),
      serviceability_status: formStatus,
      localities: formLocalities.trim(),
      transport_modes: JSON.stringify(formTransportModes),
      transit_duration_label: formTransitDuration.trim(),
      standard_shipping_rate: Number(formShippingRate),
      delivery_charges_text: formChargesText.trim(),
      delivery_conditions: formConditions.trim(),
      daily_transit_available: formDailyTransit,
      is_active: formIsActive,
      notes: formNotes.trim()
    };

    try {
      if (editingRecord) {
        await apiService.adminUpdatePincode(token, editingRecord.id, payload);
        showToast(`PIN ${formPincode} coverage updated successfully.`);
      } else {
        await apiService.adminCreatePincode(token, payload);
        showToast(`PIN ${formPincode} added to coverage.`);
      }
      setIsModalOpen(false);
      loadRecords();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save delivery coverage record.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (rec: any) => {
    if (!window.confirm(`Are you sure you want to delete PIN ${rec.pincode} (${rec.city}) from coverage records?`)) {
      return;
    }
    try {
      await apiService.adminDeletePincode(token, rec.id);
      showToast(`PIN ${rec.pincode} deleted.`);
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  const handleQuickStatusChange = async (rec: any, newStatus: string) => {
    try {
      await apiService.adminUpdatePincode(token, rec.id, { serviceability_status: newStatus });
      showToast(`PIN ${rec.pincode} status changed to ${newStatus}.`);
      setRecords((prev) => prev.map((r) => r.id === rec.id ? { ...r, serviceability_status: newStatus } : r));
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleCsvExport = () => {
    window.open(`${window.location.origin}/api/v1/logistics/admin/pincodes/export.csv`, '_blank');
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const res = await apiService.adminBulkImportPincodes(token, file);
      showToast(res.message || 'CSV imported successfully.');
      loadRecords();
    } catch (err: any) {
      alert(err.message || 'Failed to import CSV file.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleTransportMode = (mode: string) => {
    if (formTransportModes.includes(mode)) {
      setFormTransportModes(formTransportModes.filter((m) => m !== mode));
    } else {
      setFormTransportModes([...formTransportModes, mode]);
    }
  };

  const renderBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'REGULAR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Regular Delivery</span>
          </span>
        );
      case 'CUSTOM_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Custom Transit</span>
          </span>
        );
      case 'PENDING_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <HelpCircle className="w-3 h-3 text-blue-600" />
            <span>Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <XCircle className="w-3 h-3 text-gray-500" />
            <span>Unavailable</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-gold border border-gold/40 text-xs font-bold flex items-center justify-between shadow-royal">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-gold">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Controls Card */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-gold-light text-imperial font-mono text-[11px] font-bold">
                {totalCount} Total Hubs
              </span>
              <h3 className="font-serif font-black text-xl text-imperial">
                Regional Delivery Coverage Management
              </h3>
            </div>
            <p className="text-xs text-cocoa-muted mt-1">
              Configure serviceable PIN codes, transport routes, freight rates, and custom transit flags across Odisha and neighbouring Andhra Pradesh.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-2xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-royal cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add PIN Code</span>
            </button>

            <button
              type="button"
              onClick={handleCsvExport}
              className="px-3.5 py-2.5 rounded-2xl bg-cream hover:bg-gold-light/40 border border-ivory-border text-imperial font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4 text-emerald" />
              <span>Export CSV</span>
            </button>

            <label className="px-3.5 py-2.5 rounded-2xl bg-cream hover:bg-gold-light/40 border border-ivory-border text-imperial font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>{importing ? 'Importing...' : 'Bulk CSV'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvImport}
                disabled={importing}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={loadRecords}
              className="p-2.5 rounded-2xl bg-cream border border-ivory-border hover:border-gold text-cocoa hover:text-imperial transition-colors cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold-deep' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-ivory-border">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cocoa-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PIN, Village, Town..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-ivory-border bg-ivory focus:border-gold outline-none text-imperial font-medium"
            />
          </div>

          {/* State Filter */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-ivory-border bg-ivory text-imperial font-medium outline-none focus:border-gold"
          >
            <option value="ALL">All States (Odisha &amp; AP)</option>
            <option value="Odisha">Odisha</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
          </select>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-ivory-border bg-ivory text-imperial font-medium outline-none focus:border-gold"
          >
            <option value="ALL">All Districts ({uniqueDistricts.length})</option>
            {uniqueDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-ivory-border bg-ivory text-imperial font-medium outline-none focus:border-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGULAR">Regular Delivery</option>
            <option value="CUSTOM_TRANSIT">Custom Transit</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Gunupur 765022 Preservation Callout */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">System Notice on Custom Transit Policy:</strong>{' '}
          PIN code <strong>765022 (Gunupur Rural)</strong> is currently locked to <em>CUSTOM_TRANSIT</em> mode as configured by wholesale dispatch policy. Changes made below take effect in real-time across customer search cards and WhatsApp inquiry links.
        </div>
      </div>

      {/* PIN Codes Table Card */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/60 border-b border-ivory-border text-imperial font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">PIN &amp; Hub</th>
                <th className="py-3.5 px-4">District &amp; State</th>
                <th className="py-3.5 px-4">Coverage Status</th>
                <th className="py-3.5 px-4">Transit &amp; Freight</th>
                <th className="py-3.5 px-4">Covered Localities</th>
                <th className="py-3.5 px-4">Transport Modes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cocoa-muted">
                    <span className="animate-spin text-xl inline-block mr-2">⏳</span>
                    <span>Loading delivery coverage records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cocoa-muted">
                    No delivery records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                records.map((rec) => {
                  const isGunupurRural = rec.pincode === '765022';
                  return (
                    <tr 
                      key={rec.id} 
                      className={`hover:bg-cream/30 transition-colors ${
                        isGunupurRural ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {/* PIN & City */}
                      <td className="py-3 px-4 font-medium">
                        <div className="font-mono font-bold text-imperial flex items-center gap-1.5">
                          <span>{rec.pincode}</span>
                          {isGunupurRural && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-900 font-sans font-bold">
                              Policy
                            </span>
                          )}
                        </div>
                        <div className="text-cocoa font-semibold text-xs mt-0.5">{rec.city}</div>
                      </td>

                      {/* District & State */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-imperial">{rec.district}</div>
                        <div className="text-[11px] text-cocoa-muted">{rec.state}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {renderBadge(rec.serviceability_status)}
                          <div className="flex gap-1 text-[10px]">
                            {['REGULAR', 'CUSTOM_TRANSIT'].map((st) => (
                              rec.serviceability_status !== st && (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleQuickStatusChange(rec, st)}
                                  className="text-cocoa-muted hover:text-imperial underline cursor-pointer"
                                  title={`Switch to ${st}`}
                                >
                                  {st === 'REGULAR' ? 'Set Reg' : 'Set Custom'}
                                </button>
                              )
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Transit & Freight */}
                      <td className="py-3 px-4">
                        <div className="text-imperial font-medium">{rec.transit_duration_label || '1-2 Days'}</div>
                        <div className="text-emerald-deep font-bold text-[11px]">
                          {rec.delivery_charges_text || `₹${rec.standard_shipping_rate || 0}/carton`}
                        </div>
                      </td>

                      {/* Localities */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="line-clamp-2 text-cocoa-muted text-[11px]" title={rec.localities}>
                          {rec.localities || 'All areas under PIN'}
                        </div>
                      </td>

                      {/* Transport Modes */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-cocoa-muted text-[11px]">
                          {rec.transport_modes 
                            ? rec.transport_modes.replace(/[[\]"]/g, '').split(',').slice(0, 2).join(', ')
                            : 'State Roadlines'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rec)}
                            className="p-1.5 rounded-lg bg-cream hover:bg-gold-light text-cocoa hover:text-imperial transition-colors cursor-pointer"
                            title="Edit Location"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rec)}
                            className="p-1.5 rounded-lg bg-cream hover:bg-red-50 text-cocoa hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Location"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-ivory-border shadow-royal max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-ivory-border pb-4">
              <div>
                <h4 className="font-serif font-black text-xl text-imperial">
                  {editingRecord ? `Edit Coverage: PIN ${editingRecord.pincode}` : 'Add Regional Coverage Hub'}
                </h4>
                <p className="text-xs text-cocoa-muted">
                  Configure road transit routes, charges, villages, and serviceability tier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-cocoa hover:text-imperial hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-cocoa font-bold mb-1">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formPincode}
                    onChange={(e) => setFormPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 761200"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold font-mono font-bold text-imperial outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">City / Town *</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. Paralakhemundi"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">District *</label>
                  <input
                    type="text"
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    placeholder="e.g. Gajapati"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-cocoa font-bold mb-1">State</label>
                  <select
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                  >
                    <option value="Odisha">Odisha</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">Transit Corridor Zone</label>
                  <input
                    type="text"
                    value={formZoneName}
                    onChange={(e) => setFormZoneName(e.target.value)}
                    placeholder="e.g. South Odisha Factory Hub"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">Serviceability Tier</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold font-bold text-imperial outline-none"
                  >
                    <option value="REGULAR">Regular Delivery Available</option>
                    <option value="CUSTOM_TRANSIT">Custom Transit Available</option>
                    <option value="PENDING_VERIFICATION">Serviceability Pending</option>
                    <option value="UNAVAILABLE">Currently Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Localities & Villages */}
              <div>
                <label className="block text-cocoa font-bold mb-1">
                  Mapped Villages, Mandals, and Sub-Areas (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={formLocalities}
                  onChange={(e) => setFormLocalities(e.target.value)}
                  placeholder="e.g. Ranipeta, Betaguda, Forest Gate, Main Market, Upalada"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                />
              </div>

              {/* Supported Transport Methods */}
              <div>
                <label className="block text-cocoa font-bold mb-1.5">Supported Transport Methods</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TRANSPORT_METHODS.map((method) => {
                    const isChecked = formTransportModes.includes(method);
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => toggleTransportMode(method)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-2xs font-bold'
                            : 'bg-cream border-ivory-border text-cocoa-muted'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center text-[10px] ${
                          isChecked ? 'bg-emerald text-white border-emerald' : 'bg-white border-ivory-border'
                        }`}>
                          {isChecked && '✓'}
                        </span>
                        <span>{method}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-cocoa font-bold mb-1">Transit Duration Label</label>
                  <input
                    type="text"
                    value={formTransitDuration}
                    onChange={(e) => setFormTransitDuration(e.target.value)}
                    placeholder="e.g. 1-2 Days"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">Freight Rate (₹ / Carton)</label>
                  <input
                    type="number"
                    value={formShippingRate}
                    onChange={(e) => setFormShippingRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-cocoa font-bold mb-1">Charges Text</label>
                  <input
                    type="text"
                    value={formChargesText}
                    onChange={(e) => setFormChargesText(e.target.value)}
                    placeholder="e.g. ₹40 flat / carton"
                    className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                  />
                </div>
              </div>

              {/* Delivery Conditions */}
              <div>
                <label className="block text-cocoa font-bold mb-1">Delivery Conditions &amp; Transit Rules</label>
                <input
                  type="text"
                  value={formConditions}
                  onChange={(e) => setFormConditions(e.target.value)}
                  placeholder="e.g. Bus cargo pickup at station counter; door delivery for orders > 20kg"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-border bg-ivory focus:border-gold text-imperial font-medium outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formDailyTransit}
                    onChange={(e) => setFormDailyTransit(e.target.checked)}
                    className="rounded text-gold focus:ring-gold"
                  />
                  <span className="text-cocoa font-semibold">Daily Scheduled Transit</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="rounded text-gold focus:ring-gold"
                  />
                  <span className="text-cocoa font-semibold">Route Active on Website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cream border border-ivory-border text-cocoa hover:text-imperial font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-6 py-2.5 rounded-xl bg-imperial hover:bg-imperial-secondary text-gold font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-royal cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? <span className="animate-spin">⏳</span> : <Check className="w-4 h-4" />}
                  <span>Save Coverage</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

