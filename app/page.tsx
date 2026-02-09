import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Skills } from '@/components/skills';
import { Projects } from '@/components/projects';
import { Services } from '@/components/services';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { GlitchSection } from '@/components/glitch-section';
import { AntigravityBackground } from '@/components/antigravity-background';
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

      <AntigravityBackground
        count={250}
        magnetRadius={12}
        ringRadius={15}
        waveSpeed={0.3}
        waveAmplitude={0.6}
        particleSize={1.5}
        lerpSpeed={0.08}
        color="#ff7f3f"
        autoAnimate={true}
        particleVariance={0.7}
        rotationSpeed={0.2}
        depthFactor={0.8}
        pulseSpeed={2.5}
        particleShape="capsule"
        fieldStrength={12}
      />
      <Header />
      <main className="bg-background text-foreground relative z-10">
        <Hero />
        <About />
        <Skills />
        <GlitchSection />
        <Projects />
        <Services />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
