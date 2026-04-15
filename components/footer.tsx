'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Joseph Thuo</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">
              Creative web developer and system builder crafting digital solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-2">
              {['About', 'Skills', 'Projects', 'Services', 'Contact'].map((link, i) => (
                <li key={i}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-foreground/70 hover:text-primary transition text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {['Web Development', 'UI/UX Design', 'System Building', 'Dashboards', 'Consulting'].map(
                (service, i) => (
                  <li key={i}>
                    <span className="text-foreground/70 text-sm">{service}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <p className="text-foreground/70 text-sm mb-4">
              joseph.thuo@email.com
            </p>
            <div className="flex gap-3">
              {['LinkedIn', 'GitHub', 'Twitter'].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="inline-flex items-center justify-center w-9 h-9 bg-card border border-border rounded-lg hover:border-primary hover:text-primary hover:shadow-sm transition-all duration-300 text-xs font-semibold"
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/70">
          <p>
            © {currentYear} Joseph Thuo. All rights reserved. Built with modern web technologies.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
