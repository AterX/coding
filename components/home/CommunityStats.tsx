'use client';

import { motion } from 'framer-motion';
import { Users, Code, Lightbulb, Share2 } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function CommunityStats() {
  const stats = [
    { 
      icon: <Users className="h-10 w-10" />, 
      value: "5,000+", 
      label: "Miembros activos",
      description: "Autodidactas compartiendo conocimiento",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: <Code className="h-10 w-10" />, 
      value: "3,200+", 
      label: "Proyectos publicados",
      description: "De todo tipo de tecnologías",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: <Lightbulb className="h-10 w-10" />, 
      value: "1,800+", 
      label: "Ideas compartidas",
      description: "Inspiración para nuevos desarrollos",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      icon: <Share2 className="h-10 w-10" />, 
      value: "850+", 
      label: "Colaboraciones",
      description: "Entre miembros de la comunidad",
      color: "from-purple-500 to-pink-500"
    }
  ];
  
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 animate-matrix-sweep"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            <span className="gradient-text">Una comunidad en crecimiento</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Números que reflejan la pasión por el desarrollo autodidacta
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-primary/10 hover-lift hover:border-primary/30 transition-all duration-500 group-hover:bg-card/80">
                {/* Glowing background effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:animate-pulse`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  
                  <h3 className="text-4xl font-bold mb-3 gradient-text">{stat.value}</h3>
                  <p className="font-semibold text-lg mb-2 text-foreground">{stat.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}