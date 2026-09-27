import React, { useState, useEffect } from 'react';
import { createProblem } from '../../services/problemService';
import { 
  X, 
  Upload, 
  MapPin, 
  AlertTriangle, 
  Tag, 
  FileText, 
  CheckCircle, 
  Loader2,
  HelpCircle,
  Navigation,
  FolderOpen
} from 'lucide-react';

const CATEGORIES = [
  'Environment',
  'Infrastructure',
  'Education',
  'Healthcare',
  'Public Safety',
  'Agriculture',
  'Governance & Services',
  'Economic Opportunity'
];

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function ProblemSubmissionModal({
  isOpen,
  onClose,
  initialData,
  onProblemSubmitted
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Environment',
    problemType: 'Waste management',
    severity: 'Medium',
    description: '',
    location: '',
    city: '',
    state: '',
    latitude: '',
    longitude: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [submittedProblem, setSubmittedProblem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      const pType = initialData.problemType || 'Waste management';
      setFormData({
        title: initialData.problemType ? `${initialData.problemType}` : '',
        category: initialData.category || 'Environment',
        problemType: pType,
        severity: 'Medium',
        description: initialData.defaultDescription || '',
        location: '',
        city: '',
        state: '',
        latitude: '',
        longitude: ''
      });
    } else {
      setFormData({
        title: '',
        category: 'Environment',
        problemType: 'Waste management',
        severity: 'Medium',
        description: '',
        location: '',
        city: '',
        state: '',
        latitude: '',
        longitude: ''
      });
    }
    setImages([]);
    setError(null);
    setSubmittedProblem(null);
    setLocationSuccess(false);
    setLocating(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationSuccess(false);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.address || {};

          const resolvedArea =
            address.suburb ||
            address.neighbourhood ||
            address.road ||
            address.residential ||
            (data.display_name ? data.display_name.split(',')[0] : '');

          const resolvedCity =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            address.state_district ||
            '';

          const resolvedState = address.state || '';

          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            location: resolvedArea || prev.location || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: resolvedCity || prev.city,
            state: resolvedState || prev.state
          }));

          setLocationSuccess(true);
        } catch (geoErr) {
          console.warn('Reverse geocode fallback:', geoErr);
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6)
          }));
          setLocationSuccess(true);
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        setLocating(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Location permission denied. Please allow GPS access in your browser or type manually.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Location information is currently unavailable.');
            break;
          case geoError.TIMEOUT:
            setError('Location detection timed out. Please enter location manually.');
            break;
          default:
            setError('Failed to acquire location coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const finalProblemType = formData.problemType.trim() || formData.title.trim() || 'General Community Need';

      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('category', formData.category);
      payload.append('problemType', finalProblemType);
      payload.append('problem_type', finalProblemType);
      payload.append('description', formData.description.trim());
      payload.append('location', formData.location.trim());
      payload.append('city', formData.city.trim());
      payload.append('state', formData.state.trim());
      payload.append('severity', formData.severity);

      if (formData.latitude) {
        payload.append('latitude', formData.latitude);
      }
      if (formData.longitude) {
        payload.append('longitude', formData.longitude);
      }

      images.forEach((file) => {
        payload.append('images', file);
      });

      const res = await createProblem(payload);
      const created = res.data?.problem || res.data || res.problem || res;
      setSubmittedProblem(created);
      
      if (onProblemSubmitted) {
        onProblemSubmitted(created);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to submit problem. Check backend connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedProblem(null);
    setError(null);
    setLocationSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-7 sm:p-8 text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)] my-8">
        
        {/* Close Icon Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedProblem ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#E6F7F8] border border-[#009FA6]/30 rounded-full flex items-center justify-center mx-auto text-[#009FA6]">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Problem Registered!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Your challenge has been logged into the community resolution engine.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                Tracking ID
              </span>
              <span className="font-mono text-xl text-[#009FA6] font-bold">
                {submittedProblem.problemId || 'SS-2026-CONFIRMED'}
              </span>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-[#009FA6] text-white font-medium hover:bg-[#008389] shadow-sm transition cursor-pointer text-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header with rounded teal icon */}
            <div className="flex items-start gap-3.5 pb-1">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F7F8] border border-[#009FA6]/20 flex items-center justify-center text-[#009FA6] shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Report Community Challenge
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly submit an issue to university innovators and industry teams.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Waste management"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
              />
            </div>

            {/* Category / Problem Type / Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#009FA6]" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-600" /> Problem Type
                </label>
                <input
                  required
                  type="text"
                  name="problemType"
                  value={formData.problemType}
                  onChange={handleChange}
                  placeholder="e.g. Waste management"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Detailed Description</label>
              <textarea
                required
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="illegal open dumping, inadequate garbage collection routes, and lack of segregation..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition resize-y"
              />
            </div>

            {/* Geolocation Section Banner */}
            <div className="p-3.5 bg-[#E6F7F8]/50 border border-[#009FA6]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#009FA6]" /> Incident Geolocation
                </span>
                <p className="text-[11px] text-slate-500">
                  {formData.latitude && formData.longitude ? (
                    <span className="text-[#009FA6] font-mono font-medium">
                      GPS: {formData.latitude}, {formData.longitude}
                    </span>
                  ) : (
                    'Pin live device GPS coordinates for the municipal command center.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locating}
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-[#009FA6] border border-[#009FA6]/40 hover:bg-[#009FA6] hover:text-white text-xs font-semibold cursor-pointer shadow-2xs transition-all disabled:opacity-50 shrink-0"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#009FA6]" />
                    <span>Detecting GPS...</span>
                  </>
                ) : locationSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>GPS Acquired</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Auto-Detect Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#009FA6]" /> Landmark / Area
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Ward 12 Main St"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Visakhapatnam"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">State</label>
                <input
                  required
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Andhra Pradesh"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#009FA6]/20 focus:border-[#009FA6] transition"
                />
              </div>
            </div>

            {/* Evidence Photos */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-[#009FA6]" /> Evidence Photos (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition">
                  <FolderOpen className="w-3.5 h-3.5 text-[#009FA6]" />
                  <span>Choose Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">
                  {images.length > 0 ? `${images.length} file(s) selected` : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#009FA6] hover:bg-[#008389] text-white font-semibold text-xs shadow-sm transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Problem'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}