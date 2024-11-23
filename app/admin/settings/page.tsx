"use client";

import React, { useState } from "react";
import {
  Bell,
  Lock,
  Mail,
  Shield,
  Globe,
  Database,
  Sliders,
  Calendar,
  Save,
  AlertCircle,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex px-6 pt-4">
          {[
            { id: "general", label: "General", icon: Sliders },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "api", label: "API & Integration", icon: Database },
            { id: "localization", label: "Localization", icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-t-lg text-sm font-medium ${
                activeTab === tab.id
                  ? "text-[#FF4B26] border-b-2 border-[#FF4B26] bg-[#FFF5F3]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Settings Content */}
        <div className="p-6 border-t border-gray-100">
          {activeTab === "general" && (
            <div className="space-y-6">
              <SettingSection title="Application Details">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Glovera Admin"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@glovera.edu"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent"
                    />
                  </div>
                </div>
              </SettingSection>

              <SettingSection title="Program Settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Auto-approve Programs
                      </h4>
                      <p className="text-sm text-gray-500">
                        Automatically approve new program submissions
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Program Updates Notification
                      </h4>
                      <p className="text-sm text-gray-500">
                        Send notifications for program updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </SettingSection>

              <SettingSection title="Application Schedule">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Application Window
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>30 days</option>
                      <option>45 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Period
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>21 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <SettingSection title="Email Notifications">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        New Applications
                      </h4>
                      <p className="text-sm text-gray-500">
                        Receive notifications for new student applications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Program Updates
                      </h4>
                      <p className="text-sm text-gray-500">
                        Notifications for program modifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        System Alerts
                      </h4>
                      <p className="text-sm text-gray-500">
                        Important system notifications and updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </SettingSection>

              <SettingSection title="Notification Preferences">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Digest Frequency
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>Immediately</option>
                      <option>Daily Digest</option>
                      <option>Weekly Digest</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quiet Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="time"
                        defaultValue="22:00"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent"
                      />
                      <input
                        type="time"
                        defaultValue="08:00"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <SettingSection title="Authentication">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Session Timeout
                      </h4>
                      <p className="text-sm text-gray-500">
                        Automatically log out after inactivity
                      </p>
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                </div>
              </SettingSection>

              <SettingSection title="Password Policy">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Minimum Password Length
                      </h4>
                      <p className="text-sm text-gray-500">
                        Set minimum characters required
                      </p>
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>8 characters</option>
                      <option>10 characters</option>
                      <option>12 characters</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Password Expiration
                      </h4>
                      <p className="text-sm text-gray-500">
                        Force password change periodically
                      </p>
                    </div>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:border-transparent">
                      <option>Never</option>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>
              </SettingSection>
            </div>
          )}

          {/* Save Changes Button */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button className="btn-secondary">Cancel</button>
            <button className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection = ({ title, children }: SettingSectionProps) => (
  <section>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </section>
);

const Switch = ({ defaultChecked = false }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  return (
    <button
      onClick={() => setIsChecked(!isChecked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4B26] focus:ring-offset-2 ${
        isChecked ? "bg-[#FF4B26]" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default Settings;
