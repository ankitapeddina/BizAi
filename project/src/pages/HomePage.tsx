import { useEffect, useState } from 'react';
import { Users, Target, Package, Award, Play, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase, CompanyStat, Testimonial } from '../lib/supabase';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export function HomePage() {
  const [stats, setStats] = useState<CompanyStat[]>([]);
  const [team] = useState([
    {
      id: '1',
      name: 'Dindeswara seetaramasai',
      role: 'AI Engineer',
      expertise: 'Machine Learning, Automation, and Python',
      fun_fact: 'Loves building AI bots!',
      image_url: '/images/yoganand.jpg'
    },
    {
      id: '2',
      name: 'Ankitha',
      role: 'UI/UX Designer',
      expertise: 'Frontend, Branding, and Animation',
      fun_fact: 'Sketches every idea before coding!',
      image_url: '/images/tulasi.jpg'
    },
    {
      id: '3',
      name: 'Sohan',
      role: 'Project Manager',
      expertise: 'Team leadership and planning',
      fun_fact: 'Always brings good vibes to meetings!',
      image_url: '/images/vyshnavi.jpg'
    },
    {
      id: '4',
      name: 'Ram charan',
      role: 'Data Analyst',
      expertise: 'Data visualization and insights',
      fun_fact: 'Can find trends in anything!',
      image_url: '/images/bestwanthh.jpg'
    },
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});

  const heroAnimation = useScrollAnimation();
  const statsAnimation = useScrollAnimation();
  const teamAnimation = useScrollAnimation();
  const testimonialsAnimation = useScrollAnimation();

  // Load only stats and testimonials (not team)
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [statsRes, testimonialsRes] = await Promise.all([
      supabase.from('company_stats').select('*').order('display_order'),
      supabase.from('testimonials').select('*').eq('is_featured', true).order('created_at', { ascending: false })
    ]);

    if (statsRes.data) setStats(statsRes.data);
    if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
  };

  useEffect(() => {
    if (statsAnimation.isVisible && stats.length > 0) {
      stats.forEach(stat => {
        let current = 0;
        const increment = Math.ceil(stat.value / 50);
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [stat.id]: current }));
        }, 30);
      });
    }
  }, [statsAnimation.isVisible, stats]);

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = { Users, Target, Package, Award };
    return icons[iconName] || Users;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* HERO SECTION */}
      <div
        ref={heroAnimation.ref}
        className={`pt-24 pb-16 px-4 transition-all duration-1000 ${
          heroAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                AI-Powered Sales Forecasting
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Transform your business with cutting-edge artificial intelligence. Predict sales trends, optimize inventory, and maximize profits with 99% accuracy.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
                  Get Free Consultation
                </button>
                <button className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold transition-all hover:scale-105">
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-blue-600 ml-1" />
                  </div>
                </div>
                <p className="absolute bottom-4 text-white font-semibold">Watch Our AI in Action</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div
        ref={statsAnimation.ref}
        className={`py-16 bg-blue-600 dark:bg-blue-700 transition-all duration-1000 ${
          statsAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => {
              const Icon = getIcon(stat.icon);
              return (
                <div key={stat.id} className="text-center text-white">
                  <Icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <div className="text-4xl font-bold mb-2">
                    {animatedStats[stat.id] || 0}{stat.suffix}
                  </div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TEAM SECTION */}
      <div
        ref={teamAnimation.ref}
        className={`py-20 px-4 transition-all duration-1000 ${
          teamAnimation.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Industry experts with decades of combined experience in AI and business intelligence
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div
                key={member.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
                      hoveredMember === member.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-blue-300 text-sm mb-3">{member.role}</p>
                      <p className="text-sm mb-2 font-semibold">Expertise:</p>
                      <p className="text-sm mb-3">{member.expertise}</p>
                      <p className="text-sm italic">Fun fact: {member.fun_fact}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div
        ref={testimonialsAnimation.ref}
        className={`py-20 px-4 bg-gray-100 dark:bg-gray-800 transition-all duration-1000 ${
          testimonialsAnimation.isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Client Success Stories
          </h2>

          {testimonials.length > 0 && (
            <div className="relative">
              <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8 md:p-12">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300 text-center mb-8 italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </p>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {testimonials[currentTestimonial].client_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[currentTestimonial].position}, {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={() => setCurrentTestimonial(prev => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
