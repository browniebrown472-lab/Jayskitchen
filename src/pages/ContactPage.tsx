import React, { useState } from 'react';
import { RESTAURANT_INFO } from '../lib/constants';
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.message) return;

    // Format WhatsApp message as quick channel
    const text = `Hello Jay's Kitchen, I have an inquiry via your website:
Name: ${formData.name}
Contact: ${formData.contact}
Topic: ${formData.subject}
Message: ${formData.message}`;

    const waUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-stone-100/80 border-b border-stone-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800">
            <span>Accra, Ghana</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>Customer Support</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-950 tracking-tight">
            Contact Jay's Kitchen
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
            Questions about our menu, corporate catering, or ordering? Reach out to us directly or send a message on WhatsApp.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                We'd love to hear from you
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Whether you need assistance with an ongoing order, want custom portions for your event, or simply want to say hello, we are here to help.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              {/* Phone Card */}
              <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                    Phone Inquiries
                  </h3>
                  <a
                    href={`tel:${RESTAURANT_INFO.phoneRaw}`}
                    className="text-base font-bold text-stone-900 hover:text-red-600 transition-colors tabular-nums"
                  >
                    {RESTAURANT_INFO.phoneDisplay}
                  </a>
                  <p className="text-xs text-stone-500 mt-1">
                    Call for urgent order inquiries or direct questions.
                  </p>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                    WhatsApp Ordering & Support
                  </h3>
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-700 hover:text-emerald-800 transition-colors tabular-nums"
                  >
                    {RESTAURANT_INFO.phoneDisplay}
                  </a>
                  <p className="text-xs text-stone-500 mt-1">
                    Direct chat with our kitchen desk for instant order confirmation.
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-stone-100 text-stone-700 rounded-lg shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                    Kitchen Location
                  </h3>
                  <p className="text-base font-bold text-stone-900">
                    {RESTAURANT_INFO.location}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Delivering across East Legon, Cantonments, Osu, Airport, Spintex, Madina & surrounding Accra areas.
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="p-5 bg-white border border-stone-200 rounded-xl flex items-start gap-4 shadow-xs">
                <div className="p-3 bg-stone-100 text-stone-700 rounded-lg shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                    Opening Hours
                  </h3>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    {RESTAURANT_INFO.openingHours.map((h, i) => (
                      <div key={i} className="flex justify-between py-1 border-b border-stone-100 last:border-none">
                        <span className="font-medium text-stone-800">{h.days}</span>
                        <span className="text-stone-600">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-8">
                Fill in the form below and we will get back to you promptly. Submitting will also allow you to connect directly on WhatsApp.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                    Thank you for reaching out. We have received your inquiry and look forward to serving you authentic Nigerian food.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', contact: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Adeola Balogun"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Phone or Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="0201234567 or email"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order Tracking">Order Tracking</option>
                        <option value="Event / Catering">Event Catering</option>
                        <option value="Feedback">Feedback / Review</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Your Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today? Inquire about dishes, portions, or delivery..."
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Jay's Kitchen</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
