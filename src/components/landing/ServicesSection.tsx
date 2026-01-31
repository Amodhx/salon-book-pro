import { motion } from 'framer-motion';
import { Scissors, Sparkles } from 'lucide-react';
import { menServices, womenServices, type Service } from '@/store/salonStore';

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card rounded-xl p-6 h-full transition-all duration-300 hover:shadow-gold hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-display text-lg text-foreground">{service.name}</h4>
          <span className="text-accent font-semibold">${service.price}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {service.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-4 h-px bg-accent" />
            {service.duration} min
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm tracking-[0.2em] uppercase font-body mb-4">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Crafted for Excellence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From precision cuts to luxurious treatments, our expert stylists deliver 
            an unparalleled experience tailored to your unique style.
          </p>
        </motion.div>

        {/* Men's Services */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl text-foreground">Men's Grooming</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Women's Services */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-rose flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-2xl text-foreground">Women's Beauty</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {womenServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
