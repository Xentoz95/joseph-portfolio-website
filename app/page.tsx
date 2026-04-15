import { Header } from '@/components/header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Skills } from '@/components/skills';
import { Projects } from '@/components/projects';
import { Services } from '@/components/services';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Testimonials } from '@/components/testimonials';
import { BackToTop } from '@/components/BackToTop';
import { PersonSchema, WebSiteSchema } from '@/lib/seo/json-ld';

const SITE_URL = 'https://josephthuo.com';
const SITE_NAME = 'Joseph Thuo Portfolio';
const AUTHOR_NAME = 'Joseph Thuo';
const AUTHOR_DESCRIPTION = 'Full Stack Developer specializing in modern web technologies, React, Next.js, and cloud-based solutions.';

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <PersonSchema
        name={AUTHOR_NAME}
        url={SITE_URL}
        jobTitle="Full Stack Developer"
        description={AUTHOR_DESCRIPTION}
        sameAs={[
          'https://github.com/josephthuo',
          'https://linkedin.com/in/josephthuo',
          'https://twitter.com/josephthuo',
        ]}
      />
      <WebSiteSchema
        name={SITE_NAME}
        url={SITE_URL}
        description={AUTHOR_DESCRIPTION}
      />

      <Header />
      <main className="bg-background text-foreground relative z-10 pt-16">
        <ScrollProgress />
        <Hero />
        <About />
        <Testimonials />
        <Skills />
        <Services />
        <Projects />
        <Contact />
        <Footer />
        <BackToTop />
      </main>
    </>
  );
}
