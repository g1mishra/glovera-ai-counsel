"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ConsultationFormData } from "@/types";

const GetStartedForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: "",
    email: "",
    preferred_date: "",
    time_slot: "",
    consultation_type: "video",
    current_education: "",
    areas_of_interest: [],
    additional_notes: "",
  });

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const educationLevels = [
    "High School",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Other",
  ];

  const interestAreas = [
    "Computer Science",
    "Business",
    "Engineering",
    "Arts",
    "Medicine",
    "Law",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule consultation");
      }

      const data = await response.json();
      router.push(`/consultation-confirmed?id=${data.id}`);
    } catch (error) {
      console.error("Error scheduling consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(interest)
        ? prev.areas_of_interest.filter((i) => i !== interest)
        : [...prev.areas_of_interest, interest],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="preferred_date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred Date
          </label>
          <input
            type="date"
            id="preferred_date"
            name="preferred_date"
            required
            value={formData.preferred_date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          />
        </div>

        <div>
          <label
            htmlFor="time_slot"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Preferred Time
          </label>
          <select
            id="time_slot"
            name="time_slot"
            required
            value={formData.time_slot}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="current_education"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Education Level
        </label>
        <select
          id="current_education"
          name="current_education"
          required
          value={formData.current_education}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
        >
          <option value="">Select education level</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Interest
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interestAreas.map((interest) => (
            <label
              key={interest}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                checked={formData.areas_of_interest.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="rounded text-[#FF4B26] focus:ring-[#FF4B26]"
              />
              <span>{interest}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="additional_notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Additional Notes (Optional)
        </label>
        <textarea
          id="additional_notes"
          name="additional_notes"
          rows={4}
          value={formData.additional_notes}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF4B26]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-[#FF4B26] text-white font-semibold rounded-lg hover:bg-[#E63E1C] transition-colors disabled:bg-gray-400"
      >
        {loading ? "Scheduling..." : "Schedule Consultation"}
      </button>
    </form>
  );
};

export default GetStartedForm;
