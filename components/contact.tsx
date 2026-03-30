'use client';

import React from "react";
import Image from 'next/image';
import { useState } from 'react';
import { BlurText } from './blur-text';
import { Mail, Phone, MapPin, MessageCircle, Github, Linkedin, Send } from 'lucide-react';

const CONTACT_INFO = {
  email: 'thuojesseph405@gmail.com',
  phone: '+254 768 682 374',
  whatsapp: '254768682374', // Format: country code + number (no spaces or dashes)
  location: 'Nairobi, Kenya',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/josephthuo',
    github: 'https://github.com/josephthuo',
    twitter: 'https://twitter.com/josephthuo',
  }
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Open WhatsApp with the message
    const whatsappMessage = encodeURIComponent(
      `Hello Joseph, my name is ${formData.name}.\n\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    );

    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');

    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${CONTACT_INFO.email}`;
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <BlurText
          text="Let's Work Together"
          className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance text-center"
          delay={100}
          animateBy="words"
          direction="top"
        />
        <BlurText
          text="Have a project in mind? Let's discuss how I can help bring your ideas to life."
          className="text-lg text-muted-foreground mb-16 text-center max-w-2xl mx-auto block"
          delay={200}
          animateBy="words"
          direction="bottom"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Image & Quick Contact */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Image */}
            <div className="relative mx-auto lg:mx-0 w-64 h-64 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-2xl">
              <Image
                src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.03 AM.jpeg"
                alt="Joseph Thuo - Contact"
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center gap-4 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-sm opacity-90">Chat on</div>
                  <div className="text-lg font-bold">WhatsApp</div>
                </div>
              </button>

              <button
                onClick={handleEmailClick}
                className="w-full flex items-center gap-4 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30"
              >
                <Mail className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-sm opacity-90">Email me at</div>
                  <div className="text-sm font-bold break-all">{CONTACT_INFO.email}</div>
                </div>
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 bg-background rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-semibold">{CONTACT_INFO.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">{CONTACT_INFO.location}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect Online</h4>
              <div className="flex gap-3">
                <a
                  href={CONTACT_INFO.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-background border border-border rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={CONTACT_INFO.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-background border border-border rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={CONTACT_INFO.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 bg-background border border-border rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-2xl p-8 border border-border shadow-xl">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Message Sent via WhatsApp!</h3>
                  <p className="text-foreground/80 text-center text-sm max-w-md">
                    Thank you for reaching out. Your WhatsApp has been opened with your message pre-filled.
                    I'll respond as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      placeholder="Project proposal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Send via WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const subject = encodeURIComponent(formData.subject || 'Project Inquiry');
                        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
                        window.location.href = `mailto:${CONTACT_INFO.email}?subject=${subject}&body=${body}`;
                      }}
                      className="flex-1 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30"
                    >
                      <Mail className="w-5 h-5" />
                      Send via Email
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Choose your preferred way to reach out. I typically respond within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
