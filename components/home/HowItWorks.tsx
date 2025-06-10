'use client';

import { motion } from 'framer-motion';
import { Rocket, Users, Lightbulb, Award } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Rocket className="h-8 w-8 text-white" />,
      title: "Publica tus proyectos",
      description: "Comparte tus creaciones con la comunidad y recibe feedback constructivo.",
      color: "from-blue-500 to-cyan-500",
      number: "01"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-white" />,
      title: "Propón ideas",
      description: "¿Tienes una idea pero no sabes cómo empezar? Compártela y encuentra colaboradores.",
      color: "from-yellow-500 to-orange-500",
      number: "02"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Conecta con otros",
      description: "Forma parte de una red de autodidactas con intereses similares.",
      color: "from-green-500 to-emerald-500",
      number: "03"
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Crece y evoluciona",
      description: "Aprende de otros proyectos y mejora tus habilidades a tu propio ritmo.",
      color: "from-purple-500 to-pink-500",
      number: "04"
    }
  ];
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-matrix-sweep"></div>
        {/* Floating particles */}
        <div className="absolute inset-0 particles-bg opacity-20"></div>
      </div>
      
      <div className="container relative px-4 md:px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-6">
            <span className="gradient-text">¿Cómo funciona devibecoding?</span>
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Una plataforma diseñada por y para autodidactas en tecnología
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm glow-primary opacity-80">
                  {step.number}
                </div>
                
                {/* Icon container */}
                <div className={`relative bg-gradient-to-br ${step.color} rounded-2xl p-6 mb-6 hover-lift group-hover:animate-pulse transition-all duration-300`}>
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">{step.icon}</div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -z-10 transform -translate-x-1/2">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary animate-gradient-shift opacity-50"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}