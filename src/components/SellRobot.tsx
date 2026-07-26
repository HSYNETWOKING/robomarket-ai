import React, { useState } from 'react';
import { Upload, Cpu, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { Robot } from '../types';

interface SellRobotProps {
  currentUserId: string | null;
  onListingCreated: (newRobot: Robot) => void;
  onLoginClick: () => void;
}

const CATEGORIES = [
  'Industrial', 'Humanoid', 'Medical', 'Agricultural', 'Security', 'Delivery', 'Cleaning', 'Educational', 'Entertainment', 'Research', 'Companion'
];

const PRESET_IMAGES = [
  {
    name: "Industrial Arm",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "Humanoid Concierge",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "Clinical Transport",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60"
  },
  {
    name: "Security Rover",
    url: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=800&auto=format&fit=crop&q=60"
  }
];

export default function SellRobot({ currentUserId, onListingCreated, onLoginClick }: SellRobotProps) {
  // Form values
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Industrial');
  const [condition, setCondition] = useState('new');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  // Specs
  const [manufacturer, setManufacturer] = useState('');
  const [payload, setPayload] = useState('');
  const [batteryLife, setBatteryLife] = useState('');
  const [speed, setSpeed] = useState('');
  const [weight, setWeight] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');
  const [warranty, setWarranty] = useState('');

  // Image choice
  const [selectedPresetImage, setSelectedPresetImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;

    if (!name || !price || !description || !location) {
      setErrorMessage('Please fill in all core listing components.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const imageUrl = useCustomImage ? customImageUrl : selectedPresetImage;

    const body = {
      name,
      description,
      category,
      price: Number(price),
      location,
      condition,
      imageUrl: imageUrl || PRESET_IMAGES[0].url,
      sellerId: currentUserId,
      sellerName: "Sandbox Merchant",
      specs: {
        manufacturer: manufacturer || 'Private Builder',
        payload: payload || 'N/A',
        batteryLife: batteryLife || 'Continuous Wired',
        speed: speed || 'Static',
        weight: weight || 'N/A',
        operatingSystem: operatingSystem || 'Proprietary firmware',
        warranty: warranty || 'No manufacturer warranty'
      }
    };

    try {
      const token = localStorage.getItem('robo_token');
      const response = await fetch('/api/robots', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Listing submission rejected by marketplace server.');
      }

      const data = await response.json();
      onListingCreated(data);
      setSuccess(true);
      
      // Reset core state
      setName('');
      setPrice('');
      setDescription('');
      setLocation('');
      setManufacturer('');
      setPayload('');
      setBatteryLife('');
      setSpeed('');
      setWeight('');
      setOperatingSystem('');
      setWarranty('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error uploading system parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-4" id="sell-login-prompt">
        <Cpu className="h-16 w-16 text-slate-300 mx-auto animate-pulse" />
        <h2 className="text-xl font-black text-slate-900">Merchant Dashboard Access</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Please connect your account to register robotic hardware systems, review invoices, or manage inventory.
        </p>
        <button
          onClick={onLoginClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
        >
          Connect Account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8" id="sell-form-viewport">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight flex items-center space-x-2">
          <Upload className="h-6 w-6 text-emerald-600" />
          <span>Register Robotic Hardware Listing</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          List equipment on the global RoboMarket catalog with automated spec verification.
        </p>
      </div>

      {success ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-2xs">
          <ShieldCheck className="h-16 w-16 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="text-xl font-black text-slate-900">Listing Registered!</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            Your robotic system <strong>{name}</strong> was registered. It is now visible in the admin review queue.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-5 py-3 rounded-xl border border-slate-200 cursor-pointer transition-colors"
          >
            List Another System
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Listing details inputs */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                Core Catalog Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">System Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Unitree G1 Humanoid"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Asking Price ($ USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 16000"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Category Class</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Equipment Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    <option value="new">Brand New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used / Pre-owned</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Location (City, Country)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Jose, CA"
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">System Description & Specs Overview</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe degrees of freedom, ROS2 compatibility, battery runtime, payload capacities..."
                    required
                    className="w-full h-24 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Engineering specs fields */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                Mechanical Specification Registry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Unitree Robotics"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Payload Capacity Limit</label>
                  <input
                    type="text"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder="e.g. 5 kg"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Battery Life / Autonomy</label>
                  <input
                    type="text"
                    value={batteryLife}
                    onChange={(e) => setBatteryLife(e.target.value)}
                    placeholder="e.g. 2 hours"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Velocity Speed</label>
                  <input
                    type="text"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="e.g. 2.0 m/s"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Gross Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 35 kg"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Operating OS Platform</label>
                  <input
                    type="text"
                    value={operatingSystem}
                    onChange={(e) => setOperatingSystem(e.target.value)}
                    placeholder="e.g. ROS 2 Humble"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-slate-500 uppercase block">Warranty Coverage</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 1-Year Manufacturer Warranty"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl p-3 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Image selectors, error message and CTA submit */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                Listing Image
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Custom Image Link</span>
                  <input
                    type="checkbox"
                    checked={useCustomImage}
                    onChange={(e) => setUseCustomImage(e.target.checked)}
                    className="accent-emerald-600 rounded cursor-pointer h-5 w-5"
                  />
                </div>

                {useCustomImage ? (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400 font-mono block">URL link starting with http/https</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 block font-mono">Preset illustrations:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setSelectedPresetImage(img.url)}
                          className={`relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition-all ${
                            selectedPresetImage === img.url ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-2xs' : 'border-slate-200'
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-[8px] text-white px-1.5 py-0.5 rounded font-mono truncate max-w-full">
                            {img.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Error messaging and core CTA submit button */}
            <div className="space-y-3">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-xl shadow-2xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-40 min-h-[48px]"
              >
                {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>Submit System Listing</span>
              </button>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <h4 className="text-[10px] font-bold font-mono text-slate-900 uppercase flex items-center space-x-1.5 mb-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Approval Workflow</span>
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Listings enter the pending queue upon submission. Open the <strong>Dashboard</strong> tab to approve or reject submitted systems.
                </p>
              </div>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
