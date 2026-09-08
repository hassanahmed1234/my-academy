import React, { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Contact = () => {
  // Page load hone par screen ko top par scroll karne ke liye
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      // Express API Endpoint request
      const response = await API.post("/contact", formData);

      setStatus({
        type: "success",
        message: response.data?.message || "Thank you! Your message has been sent successfully.",
      });

      // Clear Form Fields
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-slate-950 min-h-screen text-slate-200 overflow-hidden pt-12 pb-24 relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-700px h-350px bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-400px h-400px bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* 1. HERO HEADER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
          <span>💬 We Are Here To Help</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          Get in Touch With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Our Team</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          Have questions about our courses, admission process, or live sessions? Send us a message and our support team will respond within 24 hours.
        </p>
      </section>

      {/* Dynamic Response Alert */}
        {status.message && (
          <div
            className={`p-4 rounded-xl border mb-6 flex items-start gap-3 transition-all ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-medium leading-relaxed">{status.message}</p>
          </div>
        )}

      {/* 2. CONTACT INFO & FORM SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Contact Information
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Reach out to us directly through any of the channels below or fill out the contact form.
            </p>

            {/* Email Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                ✉️
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Email Us</h3>
                <a href="mailto:support@academypro.com" className="text-white font-bold text-base hover:text-amber-400 transition-colors mt-0.5 block">
                  support@academypro.com
                </a>
                <p className="text-slate-500 text-xs mt-1">For general inquiries and student support</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Call or WhatsApp</h3>
                <a href="tel:+923001234567" className="text-white font-bold text-base hover:text-emerald-400 transition-colors mt-0.5 block">
                  +92 3172018866
                </a>
                <p className="text-slate-500 text-xs mt-1">Mon - Sat from 9:00 AM to 6:00 PM</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-4 hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                📍
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Main Campus / Office</h3>
                <p className="text-white font-bold text-base mt-0.5">
                  AcademyPro Islamic Campus
                </p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Korangi # 5, Karachi, Pakistan
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
              <p className="text-slate-400 text-sm mb-6">
                Fill in the details below and we will get back to you shortly.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center my-8">
                  <span className="text-3xl block mb-2">✅</span>
                  <h3 className="text-emerald-400 font-bold text-lg">JazakAllah Khair! Message Sent.</h3>
                  <p className="text-slate-300 text-xs mt-2">
                    Thank you for reaching out. Our team will review your query and respond via email soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Muhammad Ali"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ali@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Course Inquiry / Technical Support"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Message <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your query here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span>➔</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 3. LOCATION MAP SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="mb-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider">Find Us On Map</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Our Physical Location</h3>
            </div>
            <span className="text-xs text-slate-400">Open Mon - Sat (9:00 AM - 6:00 PM)</span>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-350px sm:h-400px rounded-2xl overflow-hidden border border-slate-800 grayscale invert contrast-125 opacity-90 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-500">
            <iframe
              title="Academy Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115852.44977036545!2d67.0646452946116!3d24.850558475354198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33b001f1b5347%3A0x62721b9d3b670534!2sMadarsa%20Faizul%20Quran!5e0!3m2!1sen!2s!4v1788682842534!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;