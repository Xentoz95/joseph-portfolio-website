'use client';

import { BlurText } from './blur-text';
import { FadeIn } from './FadeIn';

export function Services() {
  const services = [
    {
      title: 'Website Design & Development',
      description:
        'Modern, responsive websites and web applications built with latest technologies. From landing pages to complex applications.',
      features: ['Responsive Design', 'SEO Optimized', 'Performance Tuned', 'Modern Stack'],
    },
    {
      title: 'System & Tool Building',
      description:
        'Custom systems for business operations including HR management, inventory tracking, and access control solutions.',
      features: ['Database Design', 'User Interface', 'Automation', 'Scalability'],
    },
    {
      title: 'Dashboard & Analytics',
      description:
        'Interactive dashboards and reporting solutions for data visualization, tracking, and business intelligence.',
      features: ['Data Visualization', 'Real-time Updates', 'Custom Reports', 'Integration'],
    },
    {
      title: 'UI/UX Design',
      description:
        'User-centered design solutions focused on creating intuitive and beautiful interfaces for web and applications.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    },
    {
      title: 'Digital Setup & Productivity',
      description:
        'Setup and optimization of digital tools, workflow automation, and productivity enhancement solutions for teams.',
      features: ['Process Automation', 'Tool Setup', 'Integration', 'Training'],
    },
    {
      title: 'Consulting & Strategy',
      description:
        'Technology consulting to help businesses choose the right tools, systems, and digital solutions for their needs.',
      features: ['Tech Assessment', 'Strategy Planning', 'Implementation', 'Support'],
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 mb-16">
          <FadeIn delay={100} className="text-primary font-semibold text-lg tracking-wide">
            What I Can Do For You
          </FadeIn>
          <FadeIn delay={150} className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Services Offered
          </FadeIn>
        </div>
        <FadeIn delay={250} className="text-lg text-muted-foreground mb-16 max-w-3xl block">
          Comprehensive solutions tailored to your business needs, from web development to custom systems and digital transformation
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service, i) => (
            <FadeIn
              key={i}
              delay={i * 100}
              className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary transition">{service.title}</h3>
              <p className="text-foreground/80 mb-6 text-sm leading-relaxed">{service.description}</p>

              <ul className="space-y-3">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-sm text-foreground/90 group-hover:text-foreground transition">{feature}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>

        {/* Process */}
        <div className="bg-foreground/5 rounded-3xl p-8 sm:p-12 border border-border/50">
          <FadeIn delay={300} className="text-3xl font-bold text-foreground mb-12">
            My Working Process
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                desc: 'Understanding your needs, goals, and vision for the project',
              },
              {
                step: '02',
                title: 'Planning',
                desc: 'Creating detailed strategy and timeline for successful execution',
              },
              {
                step: '03',
                title: 'Development',
                desc: 'Building high-quality solutions with clean, maintainable code',
              },
              {
                step: '04',
                title: 'Delivery',
                desc: 'Testing, optimization, and handoff with ongoing support',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-primary/40 mb-4">{item.step}</div>
                <h4 className="text-xl font-bold text-foreground mb-3">{item.title}</h4>
                <p className="text-foreground/75 text-sm leading-relaxed">{item.desc}</p>

                {i < 3 && (
                  <div className="hidden lg:block absolute top-6 -right-4 text-primary/50 text-3xl font-light">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
