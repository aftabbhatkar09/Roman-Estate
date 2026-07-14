'use client';
import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Lock,
  Bell,
  ShieldCheck,
  Save,
  Database,
  Smartphone
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { name: 'General', icon: Globe },
    { name: 'Security', icon: Lock },
    { name: 'Notifications', icon: Bell },
    { name: 'System', icon: Database },
  ];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your administrative preferences and system options.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.name
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-gray-500 hover:bg-white hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-3 text-indigo-600" />
                {activeTab} Settings
              </h2>
              <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-indigo-600 transition-all flex items-center shadow-lg shadow-indigo-500/20 active:scale-95">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
            </div>

            {activeTab === 'General' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Site Title</label>
                    <input
                      type="text"
                      defaultValue="Roman Estate"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="admin@romanestate.com"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Support Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center">
                      <Smartphone className="w-10 h-10 text-indigo-600 mr-4" />
                      <div>
                        <p className="font-bold text-indigo-900">Mobile App Integration</p>
                        <p className="text-xs text-indigo-700 font-medium">Sync with the Roman Estate agent app.</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner transition-colors">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'General' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <SettingsIcon className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">{activeTab} configuration options coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
