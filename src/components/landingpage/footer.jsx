import React from "react";
import { Twitter, Linkedin, Github, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Section: Grid Layout - Adjusted to 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                P
              </span>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Prashikshan</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Bridging the gap between academia and industry. We empower students with verified internships and expert mentorship.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="md:pl-8">
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="#">Browse Internships</FooterLink>
              <FooterLink href="#">Mentorship Program</FooterLink>
              <FooterLink href="#">Skill Assessment</FooterLink>
              <FooterLink href="#">Verify Certificates</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">For Colleges</FooterLink>
              <FooterLink href="#">For Companies</FooterLink>
              <FooterLink href="#">Contact Support</FooterLink>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Prashikshan. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ children, href }) {
  return (
    <li>
      <a 
        href={href} 
        className="text-slate-500 hover:text-blue-600 transition-colors duration-200"
      >
        {children}
      </a>
    </li>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
    >
      {icon}
    </a>
  );
}