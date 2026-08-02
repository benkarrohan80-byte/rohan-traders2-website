import React, { useState, useEffect } from 'react';
import { Package, Search, Phone, Calendar, MapPin, Clock, ArrowLeft, CheckCircle2, AlertCircle, XCircle, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { ScrapRequest } from '../types';

interface MyInfoViewProps {
  onBack: () => void;
  onGoToSell: () => void;
}

export const MyInfoView: React.FC<MyInfoViewProps> = ({ onBack, onGoToSell }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searched, setSearched] = useState(false);
  const [userRequests, setUserRequests] = useState<ScrapRequest[]>([]);
  const [requestToCancel, setRequestToCancel] = useState<ScrapRequest | null>(null);

  useEffect(() => {
    // Auto populate if user previously submitted with a phone number
    const savedPhone = localStorage.getItem('rohan_scrap_user_phone');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      fetchRequestsForPhone(savedPhone);
    }
  }, []);

  const fetchRequestsForPhone = (phoneToSearch: string) => {
    const raw = localStorage.getItem('rohan_scrap_requests');
    if (raw) {
      try {
        const allRequests: ScrapRequest[] = JSON.parse(raw);
        const cleanSearch = phoneToSearch.trim().replace(/\D/g, '');
        const matched = allRequests.filter(req => {
          const cleanReqPhone = req.phone.trim().replace(/\D/g, '');
          return cleanReqPhone.includes(cleanSearch) || cleanSearch.includes(cleanReqPhone);
        });
        setUserRequests(matched);
      } catch (err) {
        console.error('Failed to parse scrap requests', err);
      }
    }
    setSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    localStorage.setItem('rohan_scrap_user_phone', phoneNumber.trim());
    fetchRequestsForPhone(phoneNumber);
  };

  const handleCancelRequest = () => {
    if (!requestToCancel) return;
    const raw = localStorage.getItem('rohan_scrap_requests');
    if (raw) {
      try {
        const allRequests: ScrapRequest[] = JSON.parse(raw);
        const updated = allRequests.map(req => {
          if (req.id === requestToCancel.id) {
            return { ...req, status: 'Cancelled' as const, cancelledBy: 'user' as const };
          }
          return req;
        });
        localStorage.setItem('rohan_scrap_requests', JSON.stringify(updated));
        // Refresh local state
        setUserRequests(prev => prev.map(r => r.id === requestToCancel.id ? { ...r, status: 'Cancelled' as const, cancelledBy: 'user' as const } : r));
      } catch (err) {
        console.error(err);
      }
    }
    setRequestToCancel(null);
  };

  const getStatusBadge = (status: ScrapRequest['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending (प्रतीक्षा में)
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed (पूरा हुआ)
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled (रद्द)
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected (अस्वीकृत)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <p className="text-sm text-gray-500 mt-1">
            अपने मोबाइल नंबर से अपने स्क्रैप पिकअप ऑर्डर की स्थिति देखें।
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/50">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-sm font-bold text-gray-800">
              Enter Your Phone Number <span className="text-xs font-normal text-gray-500">(अपना फोन नंबर दर्ज करें)</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 text-base font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Search className="w-4 h-4" /> Check Orders (ऑर्डर देखें)
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 className="text-lg font-extrabold text-gray-900">
                Your Scrap Pickup Requests ({userRequests.length})
              </h2>
              {userRequests.length > 0 && (
                <span className="text-xs font-semibold text-gray-500">
                  Phone: <strong className="text-gray-900">{phoneNumber}</strong>
                </span>
              )}
            </div>

            {userRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">No Orders Found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    इस मोबाइल नंबर ({phoneNumber}) से कोई स्क्रैप रिक्वेस्ट नहीं मिली है।
                  </p>
                </div>
                <button
                  onClick={onGoToSell}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  Create Scrap Pickup Request Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md shadow-gray-200/40 hover:border-orange-200 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                            ID: {req.id}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {new Date(req.createdAt).toLocaleDateString('hi-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 mt-1.5">
                          {req.name}
                        </h3>
                      </div>

                      <div>{getStatusBadge(req.status)}</div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-2 text-gray-700">
                          <Tag className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold block text-xs text-gray-500">Scrap Items & Details</span>
                            <div className="font-semibold text-gray-900 mt-0.5">
                              {req.scrapTypes.map((st, idx) => (
                                <span key={idx} className="inline-block bg-white border border-gray-200 rounded-lg px-2 py-0.5 text-xs mr-1.5 mb-1 font-medium text-gray-800">
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 pt-1">
                          <Package className="w-4 h-4 text-orange-500 shrink-0" />
                          <div>
                            <span className="font-bold text-xs text-gray-500 mr-2">Total Weight:</span>
                            <span className="font-extrabold text-orange-600 text-sm bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                              {req.estimatedWeight || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold block text-xs text-gray-500">Pickup Address</span>
                            <span className="font-medium text-gray-900 text-xs leading-relaxed block mt-0.5">
                              {req.address}
                            </span>
                          </div>
                        </div>

                        {req.preferredDate && (
                          <div className="flex items-center gap-2 text-gray-700 pt-1">
                            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                            <div>
                              <span className="font-bold text-xs text-gray-500 mr-2">Preferred Date:</span>
                              <span className="font-semibold text-gray-900 text-xs">
                                {req.preferredDate}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {req.imageUrl && (
                      <div className="pt-1">
                        <span className="font-bold block text-xs text-gray-500 mb-1">Uploaded Photo:</span>
                        <a href={req.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block group">
                          <img
                            src={req.imageUrl}
                            alt="Scrap item"
                            className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform"
                          />
                        </a>
                      </div>
                    )}

                    {req.notes && (
                      <div className="text-xs text-gray-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                        <strong className="text-amber-800">Note: </strong> {req.notes}
                      </div>
                    )}

                    {req.status === 'Rejected' && (
                      <div className="text-xs text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200/80">
                        <strong className="font-bold text-rose-900 block mb-0.5">
                          ❌ Reason for Rejection (अस्वीकृति का कारण):
                        </strong>
                        {req.rejectionReason || 'Request rejected by admin.'}
                      </div>
                    )}

                    {/* Actions */}
                    {req.status === 'Pending' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setRequestToCancel(req)}
                          className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Cancel Request (ऑर्डर रद्द करें)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {requestToCancel && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-100 shadow-2xl space-y-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-900">Cancel Scrap Request?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  क्या आप वाकई ऑर्डर <span className="font-mono font-bold text-gray-800">{requestToCancel.id}</span> को रद्द करना चाहते हैं?
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setRequestToCancel(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl cursor-pointer transition-colors"
                >
                  No, Keep it (नहीं)
                </button>
                <button
                  onClick={handleCancelRequest}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Yes, Cancel (हां, रद्द करें)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
