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
  Navigation
} from 'lucide-react';

const CATEGORIES = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Environment',
  'Infrastructure',
  'Public Safety',
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
    category: 'Education',
    problemType: 'General Community Need',
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
      const pType = initialData.problemType || 'General Community Need';
      setFormData({
        title: initialData.problemType ? `${initialData.problemType}` : '',
        category: initialData.category || 'Education',
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
        category: 'Education',
        problemType: 'General Community Need',
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
          // Free reverse geocoding via OpenStreetMap Nominatim
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-8">
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedProblem ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-teal-950/80 border border-teal-600 rounded-full flex items-center justify-center mx-auto text-teal-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold">Problem Registered!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your challenge has been logged into the community resolution engine.
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block">
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                Tracking ID
              </span>
              <span className="font-mono text-xl text-teal-400 font-bold">
                {submittedProblem.problemId || 'SS-2026-CONFIRMED'}
              </span>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="text-2xl font-black flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-400" />
                Report Community Challenge
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Directly submit an issue to university innovators and industry teams.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-400" /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Problem Type
                </label>
                <input
                  required
                  type="text"
                  name="problemType"
                  value={formData.problemType}
                  onChange={handleChange}
                  placeholder="e.g., Digital Classrooms"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none text-sm"
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Detailed Description</label>
              <textarea
                required
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the background, severity, and who is affected..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none text-sm"
              />
            </div>

            {/* Geolocation Section */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-teal-400" /> Incident Geolocation
                </span>
                <p className="text-[11px] text-slate-400">
                  {formData.latitude && formData.longitude ? (
                    <span className="text-teal-400 font-mono">
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
                className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50 shrink-0"
              >
                {locating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    <span>Detecting GPS...</span>
                  </>
                ) : locationSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GPS Acquired</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>Auto-Detect Location</span>
                  </>
                )}
              </button>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" /> Landmark / Area
                </label>
                <input
                  required
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Ward 12 Main St"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">City</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Visakhapatnam"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">State</label>
                <input
                  required
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Andhra Pradesh"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-teal-400" /> Evidence Photos (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-teal-400 hover:file:bg-slate-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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