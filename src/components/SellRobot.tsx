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
    name: "HumanoidConcierge",
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
      const response = await fetch('/api/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        <Cpu className="h-16 w-16 text-zinc-300 dark:text-zinc-600 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Merchant Dashboard Blocked</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
          You must have an authenticated connection to post robotic hardware systems, review invoices, or query tracking nodes.
        </p>
        <button
          onClick={onLoginClick}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-6 py-3 rounded-lg cursor-pointer shadow-sm transition-colors min-h-[44px]"
        >
          Connect Sandbox Account
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" id="sell-form-viewport">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8">
        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white sm:text-2xl flex items-center space-x-2">
          <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span>Register Robotic Hardware Listing</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Registered equipment listings are forwarded to the Admin Approval Panel before going live on the marketplace floor.
        </p>
      </div>

      {success ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <ShieldCheck className="h-16 w-16 text-green-600 mx-auto animate-bounce" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Listing Submitted!</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your robotic system <strong>{name}</strong> was registered. It is now visible in your dashboard's "Pending Reviews" listing block.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold px-5 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer transition-colors min-h-[44px]"
          >
            List Another System
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Listing details inputs */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Core Catalog Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">System Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hume-X2 Concierge Bot"
                    required
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Asking Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 75000"
                    required
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Category class</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-850 dark:text-zinc-200 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="dark:bg-zinc-900">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Equipment Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-850 dark:text-zinc-200 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="new" className="dark:bg-zinc-900">Brand New</option>
                    <option value="refurbished" className="dark:bg-zinc-900">Refurbished</option>
                    <option value="used" className="dark:bg-zinc-900">Used / Pre-owned</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Physical Location (freight dispatch node)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Jose, CA"
                    required
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">System Description & Narrative</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe uptime, visual flaws, specific parts, task specialization parameters..."
                    required
                    className="w-full h-24 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 py-2 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Engineering specs fields */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Mechanical Specification Registry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Manufacturer brand</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Hume Dynamics"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Payload capacity limit</label>
                  <input
                    type="text"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder="e.g. 15 kg"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Autonomy / Battery Life</label>
                  <input
                    type="text"
                    value={batteryLife}
                    onChange={(e) => setBatteryLife(e.target.value)}
                    placeholder="e.g. 8 hours or AC Wired"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Velocity Speed</label>
                  <input
                    type="text"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="e.g. 1.2 m/s"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Gross Net Weight</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 65 kg"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Operating OS platform</label>
                  <input
                    type="text"
                    value={operatingSystem}
                    onChange={(e) => setOperatingSystem(e.target.value)}
                    placeholder="e.g. HumeOS v4 (Ubuntu based)"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold font-mono text-zinc-500 dark:text-zinc-400 uppercase block">Warranty Scope & Duration</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 1-year manufacturer mechanical warranty coverage"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-xs rounded-lg p-2.5 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Image selectors, error message and CTA submit */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold font-mono text-blue-700 dark:text-blue-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
                Listing Appearance Image
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Custom Image Link</span>
                  <input
                    type="checkbox"
                    checked={useCustomImage}
                    onChange={(e) => setUseCustomImage(e.target.checked)}
                    className="accent-zinc-900 dark:accent-white rounded cursor-pointer h-5 w-5"
                  />
                </div>

                {useCustomImage ? (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs rounded-lg p-2.5 focus:border-blue-600 focus:outline-none min-h-[44px]"
                    />
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono block">Provide absolute URL link starting with http/https</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">Select high-quality stock illustration preset:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          key={img.name}
                          type="button"
                          onClick={() => setSelectedPresetImage(img.url)}
                          className={`relative aspect-video rounded-md overflow-hidden border cursor-pointer transition-all ${
                            selectedPresetImage === img.url ? 'border-zinc-950 dark:border-white ring-1 ring-zinc-950 dark:ring-white shadow-sm' : 'border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-zinc-900/80 text-[8px] text-white px-1.5 py-0.5 rounded font-mono truncate max-w-full">
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
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-750 dark:text-red-400 text-[10px] rounded-lg shadow-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-40 min-h-[48px]"
              >
                {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>Submit System Listing</span>
              </button>

              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <h4 className="text-[10px] font-bold font-mono text-zinc-800 dark:text-zinc-200 uppercase flex items-center space-x-1.5 mb-1.5">
                  <Layers className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Sandbox QA Audit</span>
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Upon submission, this listing enters our sandbox "Pending Reviews" index. To make it instantly live, open the <strong>User/Admin Dashboard</strong> panel and click "Approve Listing" to instantly add it to the active marketplace catalog.
                </p>
              </div>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}
