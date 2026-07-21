import React, { useState } from 'react';
import { Bot, Mail, MapPin, Globe, Cpu, ShieldCheck, Heart, User } from 'lucide-react';

interface AboutProps {
  onBrowse: () => void;
}

export function AboutView({ onBrowse }: AboutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="about-viewport">
      <div className="text-center space-y-2">
        <Bot className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto animate-pulse" />
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">About RoboMarket AI</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          An autonomous commercial robot marketplace connecting global buyers, robotics researchers, and certified manufacturers with AI-powered safety verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-150 dark:border-blue-900/60 p-2 rounded-lg text-blue-600 dark:text-blue-400 inline-block">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Solving Procurement Risk</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Acquiring heavy robotic hardware or custom humanoid assistants carries high capital risks. Buyers often face fraudulent listings, inconsistent battery or payload descriptions, and insecure transactions. RoboMarket AI uses Gemini to analyze listings and specs, warning buyers about discrepancies before money transfers.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-150 dark:border-green-900/60 p-2 rounded-lg text-green-600 dark:text-green-400 inline-block">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Interactive Specifications</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Compare complex physical degrees of freedom, battery ratings, payload configurations, and operating software using our structured side-by-side spec grid. Generate simplified English summaries of hardware metrics instantly using our integrated AI explainer.
          </p>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-center space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono uppercase tracking-widest">Target Systems</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Our platform actively facilitates the buying, selling, and leasing of industrial 6-axis arms, bipedal humanoid guides, medical/pharmaceutical delivery bots, autonomous agricultural drones, high-terrain security platforms, and STEM educational micro-controllers.
        </p>
        <button
          onClick={onBrowse}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-5 py-3 rounded-lg cursor-pointer transition-colors shadow-sm min-h-[44px]"
        >
          Explore Catalog Floors
        </button>
      </div>
    </div>
  );
}

export function ContactView() {
  const [success, setSuccess] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="contact-viewport">
      <div className="text-center space-y-2">
        <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto animate-bounce" />
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Contact Robotics Hub</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Coordinate freight inspections, dispatch nodes, or report listing violations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 text-center space-y-2.5 shadow-sm">
          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Freight Nodes</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            RoboMarket HQ<br />
            100 Innovation Way, Suite 400<br />
            San Jose, CA 95110
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 text-center space-y-2.5 shadow-sm">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Email Dispatch</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            General Inquiries: info@robomarket.ai<br />
            Support: support@robomarket.ai<br />
            Verifications: audit@robomarket.ai
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 text-center space-y-2.5 shadow-sm">
          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto" />
          <h2 className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Sandbox Terminal</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Running Container: Port 3000<br />
            Cloud Run Instance<br />
            Developer Console Active
          </p>
        </div>
      </div>

      {/* Demo Contact Form */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 max-w-xl mx-auto space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono uppercase tracking-wider">Send Dispatch Query</h3>
        {success ? (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/45 text-green-750 dark:text-green-400 text-xs rounded-xl text-center">
            Sandbox ticket successfully dispatched! Our freight coordinators will verify your requirements.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                required
                className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-2.5 text-xs text-zinc-800 dark:text-zinc-100 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all min-h-[44px]"
              />
              <input
                type="email"
                placeholder="Corporate Email"
                required
                className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-2.5 text-xs text-zinc-800 dark:text-zinc-100 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all min-h-[44px]"
              />
            </div>
            <textarea
              placeholder="Outline your freight logistics requirements or security listing flags..."
              required
              className="w-full h-24 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-2.5 text-xs text-zinc-800 dark:text-zinc-100 rounded-lg focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all py-2"
            />
            <button
              type="submit"
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold px-6 py-3 rounded-lg cursor-pointer transition-all shadow-sm min-h-[44px]"
            >
              Upload Sandbox Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
