import type { Metadata } from 'next';
import { BlurText } from '@/components/blur-text';
import { ContactForm } from '@/components/contact/contact-form';
import { Toaster } from '@/components/ui/toaster';
import { TrackedExternalLink } from '@/components/tracked-external-link';
import { WebPageSchema } from '@/lib/seo/json-ld';
import { Breadcrumb } from '@/components/seo/breadcrumb';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with me. I\'m always open to new opportunities and collaborations.',
  alternates: {
    canonical: 'https://josephthuo.com/contact',
  },
  openGraph: {
    title: 'Contact | Joseph Thuo',
    description: 'Get in touch with me. I\'m always open to new opportunities and collaborations.',
    type: 'website',
    url: 'https://josephthuo.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <WebPageSchema
        name="Contact"
        description="Get in touch with me. I'm always open to new opportunities and collaborations."
        url="https://josephthuo.com/contact"
      />

      <main className="min-h-screen">
        {/* Breadcrumb */}
        <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb
              items={[{ name: 'Contact', item: 'https://josephthuo.com/contact' }]}
            />
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-4xl mx-auto">
            <BlurText
              text="Get in Touch"
              className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance text-center"
              delay={100}
              animateBy="words"
              direction="top"
            />
            <BlurText
              text="Have a project in mind or just want to say hello? I'd love to hear from you."
              className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto block"
              delay={200}
              animateBy="words"
              direction="bottom"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-primary mb-4">Contact Information</h2>
                  <p className="text-foreground/80 leading-relaxed">
                    I'm always open to new opportunities and collaborations. Whether you have a question or just want to say hello, feel free to reach out.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:joseph.thuo@email.com"
                        className="text-foreground/80 hover:text-primary transition"
                      >
                        joseph.thuo@email.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Location</h3>
                      <p className="text-foreground/80">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Connect Online</h3>
                  <div className="flex gap-3">
                    {[
                      {
                        name: 'GitHub',
                        url: 'https://github.com/josephthuo',
                        icon: (
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        ),
                      },
                      {
                        name: 'LinkedIn',
                        url: 'https://linkedin.com/in/josephthuo',
                        icon: (
                          <>
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                          </>
                        ),
                      },
                      {
                        name: 'Twitter',
                        url: 'https://twitter.com/josephthuo',
                        icon: (
                          <>
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5C5.5 22 2 17.2 2 13.5c0-4.2 3-7 7-7 1.8 0 2.5.5 4 1.8V5c0-1 1.2-2.2 2.5-2.2 1.3 0 2.5 1.2 2.5 2.2v1.2c1.5-1.5 4-2.5 4-2.5z" />
                          </>
                        ),
                      },
                    ].map((link) => (
                      <TrackedExternalLink
                        key={link.name}
                        href={link.url}
                        linkType="social"
                        className="inline-flex items-center justify-center w-10 h-10 bg-card border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition"
                        aria-label={link.name}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          {link.icon}
                        </svg>
                      </TrackedExternalLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-background rounded-xl p-8 border border-border">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Toaster />
    </>
  );
}
