import { Zap, Twitter, Github, Linkedin, Youtube } from 'lucide-react'

const footerLinks = {
  Product: ['Roadmaps', 'AI Mentor', 'Community', 'Progress Tracking', 'Certifications'],
  Explore: ['Frontend', 'Backend', 'Design', 'AI & ML', 'DevOps'],
  Company: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'],
  Legal:   ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

const socials = [
  { Icon: Twitter,  href: '#', label: 'Twitter'  },
  { Icon: Github,   href: '#', label: 'GitHub'   },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Youtube,  href: '#', label: 'YouTube'  },
]

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-purple to-transparent" />

      {/* Orbs */}
      <div className="orb orb-purple absolute bottom-0 left-0 w-96 h-96 opacity-40" />
      <div className="orb orb-cyan   absolute top-0 right-0 w-80 h-80 opacity-25" />

      <div className="relative max-w-[1280px] mx-auto px-6 pt-20 pb-10">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-card">
                <Zap size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Career<span className="gradient-text">Nav</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Stop guessing. Start scaling. Master any skill via curated roadmaps,
              real-world projects, and 24/7 AI mentorship.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center
                             hover:bg-brand-purple hover:shadow-glow transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-brand-purple transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4
                        pt-8 border-t border-white/10 text-sm text-gray-500">
          <p>© 2026 CareerNav Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <span className="text-brand-pink">♥</span> for ambitious learners worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
