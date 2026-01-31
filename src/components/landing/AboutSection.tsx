import { motion } from 'framer-motion';
import { Award, Clock, Heart, Users } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Expert Stylists',
    description: 'Our team of certified professionals brings years of experience and artistry to every appointment.',
  },
  {
    icon: Heart,
    title: 'Premium Products',
    description: 'We use only the finest, salon-exclusive products to ensure exceptional results.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book appointments that fit your lifestyle with our easy online booking system.',
  },
  {
    icon: Users,
    title: 'Personalized Care',
    description: 'Every service is tailored to your unique needs and preferences.',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-accent text-sm tracking-[0.2em] uppercase font-body mb-4">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Where Beauty Meets
              <span className="text-gradient-gold block">Timeless Elegance</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For over a decade, our salon has been the premier destination for those who 
              appreciate the art of personal care. We blend traditional techniques with 
              contemporary trends to create looks that are uniquely you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our sanctuary offers a retreat from the everyday, where every detail is 
              designed to make you feel pampered, refreshed, and confident.
            </p>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-card rounded-xl p-6 text-center hover:shadow-gold transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-display text-lg text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
