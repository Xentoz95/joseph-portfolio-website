import { Skills } from '@/components/skills';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BackToTop } from '@/components/BackToTop';
import { PersonSchema, WebSiteSchema } from '@/lib/seo/json-ld';

const SITE_URL = 'https://josephthuo.com';
const SITE_NAME = 'Joseph Thuo Portfolio';
const AUTHOR_NAME = 'Joseph Thuo';
const AUTHOR_DESCRIPTION = 'Full Stack Developer specializing in modern web technologies, React, Next.js, and cloud-based solutions.';

export const metadata = {
  title: `Skills | ${SITE_NAME}`,
  description: 'Explore my technical skills and expertise in web development, React, Next.js, TypeScript, and cloud technologies.',
};

export default function SkillsPage() {
  return (
    <>
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
        <Skills />
        <Footer />
        <BackToTop />
      </main>
    </>
  );
}