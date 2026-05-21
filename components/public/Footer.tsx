'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Settings {
  companyEmail?: string;
  companyPhone?: string;
  companyLocation?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
   <footer className="relative bg-[#050814] border-t border-white/10 py-14 px-4 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-40">
  <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500 blur-[140px]" />
  <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-purple-600 blur-[160px]" />
</div>
   <div className="relative max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500  mb-4">Arc Tech</h3>
            <p className="text-white/60 text-sm leading-relaxed">Professional software development and web solutions from Islamabad, Pakistan.</p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/career" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-cyan-300 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {settings?.companyEmail ? (
                <li className="hover:text-cyan-300 transition-colors">
                  <a href={`mailto:${settings.companyEmail}`}>{settings.companyEmail}</a>
                </li>
              ) : (
                <li>contact@arctech.pk</li>
              )}
              {settings?.companyPhone ? (
                <li className="hover:text-cyan-300 transition-colors">
                  <a href={`tel:${settings.companyPhone}`}>{settings.companyPhone}</a>
                </li>
              ) : null}
              {settings?.companyLocation ? (
                <li>{settings.companyLocation}</li>
              ) : (
                <li>Islamabad, Pakistan</li>
              )}
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5">
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4 flex-wrap">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full
bg-cyan-500/10 text-cyan-300 border border-cyan-400/20
hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]
transition-all"
                  title="Facebook"
                >
                  f
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full
bg-cyan-500/10 text-cyan-300 border border-cyan-400/20
hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]
transition-all"
                  title="Twitter/X"
                >
                  𝕏
                </a>
              )}
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                 className="w-10 h-10 flex items-center justify-center rounded-full
bg-cyan-500/10 text-cyan-300 border border-cyan-400/20
hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]
transition-all"
                  title="LinkedIn"
                >
                  in
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full
bg-cyan-500/10 text-cyan-300 border border-cyan-400/20
hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]
transition-all"
                  title="Instagram"
                >
                  ig
                </a>
              )}
            </div>
          </div>
        </div>

       <div className="border-t border-white/10 pt-6">
  <p className="text-center text-white/40 text-sm">
    © 2026 Arc Tech • All systems operational • Islamabad, Pakistan
  </p>
</div>
      </div>
    </footer>
  );
}
