import Image from 'next/image';
import { Header } from '@/components/header';
import { ScrollProgress } from '@/components/ScrollProgress';
import { BlurText } from '@/components/blur-text';
import { BookOpen, Code, Award, Clock, Target, Lightbulb, Rocket, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'Learning Journey | Joseph Thuo Portfolio',
  description: 'Explore my continuous learning journey, skills development, and the technologies I have mastered over the years.',
  keywords: ['learning', 'skills', 'development', 'web development', 'education', 'growth'],
};

export default function LearningPage() {
  const milestones = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Started with HTML, CSS, and JavaScript fundamentals. Built my first static websites and learned the basics of web development.',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      year: '2020',
      title: 'Deep Dive into React',
      description: 'Learned React and modern JavaScript frameworks. Built my first single-page applications and understood component architecture.',
      icon: <Code className="w-6 h-6" />,
    },
    {
      year: '2021',
      title: 'Full Stack Mastery',
      description: 'Added backend skills: Node.js, databases, API design. Started building complete web applications with authentication and databases.',
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      year: '2022',
      title: 'Professional Growth',
      description: 'Worked on real client projects, learned system design, and mastered deployment and DevOps practices.',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      year: '2023-Present',
      title: 'Continuous Learning',
      description: 'Exploring AI/ML integration, advanced animations, and building scalable systems. Always staying current with emerging technologies.',
      icon: <Lightbulb className="w-6 h-6" />,
    },
  ];

  const skillsByCategory = [
    {
      category: 'Frontend Development',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3', 'Framer Motion'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      category: 'Backend Development',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      category: 'DevOps & Tools',
      skills: ['Git', 'Docker', 'AWS', 'Vercel', 'CI/CD', 'Linux'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      category: 'Design & UX',
      skills: ['Figma', 'UI Design', 'Responsive Design', 'Accessibility', 'Design Systems'],
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const learningStats = [
    { value: '500+', label: 'Hours of Learning', icon: <Clock className="w-8 h-8" /> },
    { value: '50+', label: 'Courses Completed', icon: <BookOpen className="w-8 h-8" /> },
    { value: '100+', label: 'Projects Built', icon: <Code className="w-8 h-8" /> },
    { value: '12', label: 'Certifications', icon: <Award className="w-8 h-8" /> },
  ];

  return (
    <>
      <Header />
      <ScrollProgress />
      <main className="bg-background text-foreground pt-16">
      {/* Hero Section with image on left */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Left side - Image, Large */}
            <div className="flex items-center order-1">
              <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[520px] xl:h-[580px] rounded-3xl overflow-hidden border-4 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white">
                <Image
                  src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.16 AM.jpeg"
                  alt="Joseph Thuo - Learning & Growth"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="eager"
                />
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="flex flex-col justify-center space-y-6 order-2">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  My <span className="text-primary">Learning</span> Journey
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Explore my continuous learning journey, skills development, and the technologies I have mastered over the years.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#skills"
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200"
                  >
                    View Skills
                  </a>
                  <a
                    href="#timeline"
                    className="inline-flex items-center px-6 py-3 border-2 border-foreground/20 text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    See Timeline
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <BlurText
              text="Learning by the Numbers"
              className="text-4xl font-bold text-foreground mb-2"
              delay={100}
              animateBy="words"
              direction="top"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {learningStats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-center"
              >
                <div className="text-primary mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <BlurText
              text="Skills & Expertise"
              className="text-5xl sm:text-6xl font-bold text-foreground mb-4"
              delay={100}
              animateBy="words"
              direction="top"
            />
            <BlurText
              text="Technologies and tools I've mastered throughout my journey"
              className="text-lg text-foreground/70 max-w-xl mx-auto"
              delay={200}
              animateBy="words"
              direction="bottom"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillsByCategory.map((cat, index) => (
              <div
                key={index}
                className="bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${cat.color} text-white text-sm font-semibold mb-6`}>
                  <Target className="w-4 h-4" />
                  {cat.category}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cat.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color}`} />
                      <span className="text-foreground/90">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Timeline */}
      <section id="timeline" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <BlurText
              text="My Journey Through Time"
              className="text-5xl sm:text-6xl font-bold text-foreground mb-4"
              delay={100}
              animateBy="words"
              direction="top"
            />
            <BlurText
              text="Key milestones in my continuous learning adventure"
              className="text-lg text-foreground/70 max-w-xl mx-auto"
              delay={200}
              animateBy="words"
              direction="bottom"
            />
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background transform -translate-x-1/2 z-10" />

                  {/* Content card */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          {milestone.icon}
                        </div>
                        <div>
                          <span className="text-primary font-bold text-lg">{milestone.year}</span>
                          <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                        </div>
                      </div>
                      <p className="text-foreground/70 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Learning Goals */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-card to-secondary/10 rounded-3xl p-10 sm:p-16 border border-primary/30 text-center">
            <div className="mb-8">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
              <BlurText
                text="What's Next?"
                className="text-4xl sm:text-5xl font-bold text-foreground mb-4"
                delay={100}
                animateBy="words"
                direction="top"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="p-4">
                <h4 className="font-bold text-primary mb-2">AI & Machine Learning</h4>
                <p className="text-foreground/70 text-sm">Deepening understanding of neural networks and AI integration in web applications</p>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-primary mb-2">Web3 & Blockchain</h4>
                <p className="text-foreground/70 text-sm">Exploring decentralized applications and smart contract development</p>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-primary mb-2">Performance & Scale</h4>
                <p className="text-foreground/70 text-sm">Mastering advanced optimization techniques and large-scale system architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
