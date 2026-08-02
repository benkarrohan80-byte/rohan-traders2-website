import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Trash2, CheckCircle, Clock, ShieldCheck, Search, Filter, Lock, XCircle } from 'lucide-react';
import { ScrapRequest } from '../types';
import { COMPANY_DETAILS } from '../data/scrapCategories';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [requests, setRequests] = useState<ScrapRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [requestToReject, setRequestToReject] = useState<{ req: ScrapRequest; reason: string } | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const saved = localStorage.getItem('rohan_scrap_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        setRequests([]);
      }
    } else {
      // Demo requests if empty
      const demoData: ScrapRequest[] = [
        {
          id: 'REQ-849201',
          name: 'Amit Kumar',
          phone: '9822341234',
          address: 'Plot 12, Kalyan Road, Ahilyanagar',
          scrapTypes: ['Cardboard (पुट्ठा)', 'Plastic Scrap'],
          estimatedWeight: '45 kg',
          preferredDate: '2026-08-03',
          notes: 'Corrugated carton boxes and plastic wrap scrap',
          createdAt: '01 Aug 2026, 04:30 PM',
          status: 'Pending',
        },
        {
          id: 'REQ-849198',
          name: 'Suresh Patil',
          phone: '9890123456',
          address: 'Shop No 4, Shivnagar, Ahilyanagar',
          scrapTypes: ['Paper / Raddi', 'Plastic'],
          estimatedWeight: '120 kg',
          preferredDate: '2026-08-02',
          notes: 'Carton boxes and plastic containers',
          createdAt: '01 Aug 2026, 02:15 PM',
          status: 'Completed',
        },
      ];
      setRequests(demoData);
      localStorage.setItem('rohan_scrap_requests', JSON.stringify(demoData));
    }
  };

  const updateStatus = (id: string, newStatus: ScrapRequest['status']) => {
    const target = requests.find(req => req.id === id);
    if (target?.status === 'Cancelled' && target.cancelledBy === 'user') {
      // Customer cancelled this request -> Locked for admin
      return;
    }
    if (newStatus === 'Rejected') {
      if (target) {
        setRequestToReject({ req: target, reason: target.rejectionReason || '' });
      }
      return;
    }
    const updated = requests.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status: newStatus,
          cancelledBy: undefined,
          rejectionReason: undefined,
        };
      }
      return req;
    });
    setRequests(updated);
    localStorage.setItem('rohan_scrap_requests', JSON.stringify(updated));
  };

  const handleConfirmReject = () => {
    if (!requestToReject) return;
    const updated = requests.map(req => {
      if (req.id === requestToReject.req.id) {
        return {
          ...req,
          status: 'Rejected' as const,
          cancelledBy: 'admin' as const,
          rejectionReason: requestToReject.reason.trim() || 'Request rejected by admin',
        };
      }
      return req;
    });
    setRequests(updated);
    localStorage.setItem('rohan_scrap_requests', JSON.stringify(updated));
    setRequestToReject(null);
  };

  const [requestToDelete, setRequestToDelete] = useState<ScrapRequest | null>(null);

  const confirmDeleteRequest = () => {
    if (!requestToDelete) return;
    const updated = requests.filter(req => req.id !== requestToDelete.id);
    setRequests(updated);
    localStorage.setItem('rohan_scrap_requests', JSON.stringify(updated));
    setRequestToDelete(null);
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.scrapTypes.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-10 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Scrap Requests Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage incoming scrap selling submissions and doorstep pickups
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Admin Authenticated
            </span>
            <button
              onClick={() => {
                if (onLogout) onLogout();
              }}
              className="text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              Lock Admin Panel (लॉगआउट)
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{requests.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {requests.filter(r => r.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Contacted</p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {requests.filter(r => r.status === 'Contacted').length}
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {requests.filter(r => r.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, phone, or scrap type..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Completed', 'Cancelled', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  filterStatus === status
                    ? 'bg-orange-500 text-white shadow-2xs'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No requests found</h3>
            <p className="text-xs text-gray-500 mt-1">There are no scrap requests matching your current search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-gray-900 text-lg">{req.name}</span>
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-md">
                      {req.id}
                    </span>
                    <span className="text-xs text-gray-400">{req.createdAt}</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    📞 <a href={`tel:${req.phone}`} className="text-orange-600 hover:underline">{req.phone}</a>
                  </p>

                  <p className="text-xs text-gray-600">
                    📍 <span className="font-medium">{req.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-bold text-gray-500 mr-1">Scrap:</span>
                    {req.scrapTypes.map((t, idx) => (
                      <span key={idx} className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-lg border border-orange-200/50">
                        {t}
                      </span>
                    ))}
                    {req.estimatedWeight && (
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg ml-2">
                        {req.estimatedWeight}
                      </span>
                    )}
                  </div>

                  {req.imageUrl && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-gray-400 block mb-1">Photo:</span>
                      <img
                        src={req.imageUrl}
                        alt="Scrap item"
                        onClick={() => setPreviewImage(req.imageUrl!)}
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-2xs"
                        title="Click to zoom photo"
                      />
                    </div>
                  )}

                  {req.notes && (
                    <p className="text-xs text-gray-500 italic pt-1">
                      Note: "{req.notes}"
                    </p>
                  )}

                  {req.status === 'Rejected' && (
                    <div className="mt-2 bg-rose-50 border border-rose-200/80 rounded-xl p-2.5 flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-rose-800 block">
                          ❌ Rejection Reason (अस्वीकृति का कारण):
                        </span>
                        <span className="text-xs text-rose-700 font-medium">
                          {req.rejectionReason || 'No reason specified'}
                        </span>
                      </div>
                      <button
                        onClick={() => setRequestToReject({ req, reason: req.rejectionReason || '' })}
                        className="text-[11px] font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer shrink-0"
                      >
                        Edit Reason
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Actions & Status Selector */}
                <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 shrink-0">
                  
                  {/* Status Dropdown / Locked State */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Status</label>
                    {req.status === 'Cancelled' && req.cancelledBy === 'user' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200/80 cursor-not-allowed select-none" title="Customer cancelled this order. Status is locked.">
                        <XCircle className="w-3.5 h-3.5 text-red-500" /> Cancelled (Customer - Locked)
                      </span>
                    ) : (
                      <select
                        value={req.status}
                        onChange={e => updateStatus(req.id, e.target.value as ScrapRequest['status'])}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 focus:outline-none cursor-pointer ${
                          req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          req.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          req.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2 pt-4">
                    <a
                      href={`tel:${req.phone}`}
                      title="Call Customer"
                      className="p-2.5 bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-700 rounded-xl transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <a
                      href={`https://wa.me/91${req.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp Customer"
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setRequestToDelete(req)}
                      title="Delete Request"
                      className="p-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-500 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {requestToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-100 shadow-2xl space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-900">Delete Scrap Request?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete request <span className="font-mono font-bold text-gray-800">{requestToDelete.id}</span> from <span className="font-bold text-gray-800">{requestToDelete.name}</span>?
                </p>
                <p className="text-xs text-red-500 font-semibold mt-1">
                  (यह रिक्वेस्ट permanently डिलीट हो जाएगी)
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setRequestToDelete(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl cursor-pointer transition-colors"
                >
                  Cancel (रद्द करें)
                </button>
                <button
                  onClick={confirmDeleteRequest}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Delete (डिलीट करें)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Zoom Modal */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in cursor-pointer"
          >
            <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-black">
              <img
                src={previewImage}
                alt="Enlarged Scrap"
                className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
                title="Close"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {requestToReject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    Reject Order (ऑर्डर अस्वीकृत करें)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Customer: <span className="font-semibold text-gray-800">{requestToReject.req.name}</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Reason for Rejection (अस्वीकृति का कारण दर्ज करें):
                </label>
                <textarea
                  value={requestToReject.reason}
                  onChange={(e) => setRequestToReject({ ...requestToReject, reason: e.target.value })}
                  placeholder="e.g. Out of pickup service area, Material condition not acceptable, Low weight quantity..."
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div>
                <span className="text-[11px] font-bold text-gray-400 block mb-1.5">Quick Reasons (त्वरित कारण चुनें):</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Out of service area',
                    'Material condition not acceptable',
                    'Scrap weight too low',
                    'Incorrect contact details',
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRequestToReject({ ...requestToReject, reason: chip })}
                      className="text-[11px] font-medium bg-gray-100 hover:bg-rose-100 hover:text-rose-800 text-gray-700 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRequestToReject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all cursor-pointer"
                >
                  Confirm Rejection (अस्वीकृत करें)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
