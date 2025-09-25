import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Building, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

export function ExperienceSection() {
  const gradients = [
    { gradient: "from-purple-600 to-pink-600", bgGradient: "from-purple-500/10 to-pink-500/10" },
    { gradient: "from-cyan-600 to-blue-600", bgGradient: "from-cyan-500/10 to-blue-500/10" },
    { gradient: "from-green-600 to-emerald-600", bgGradient: "from-green-500/10 to-emerald-500/10" }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
      </div>
      
      <div className="relative container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              Professional Journey
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white" style={{ lineHeight: 1.2 }}>
            Work Experience
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            6+ years of progressive experience in software quality assurance, 
            from manual testing to leading automation initiatives.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-green-500"></div>
          
          <div className="space-y-12">
            {resume.experience.map((exp, index) => {
              const g = gradients[index % gradients.length];
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-5 h-5 bg-gradient-to-r ${g.gradient} rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="ml-20">
                  <Card className={`bg-gradient-to-br ${g.bgGradient} backdrop-blur-lg border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]`}>
                    <CardHeader className="pb-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          
                          <CardTitle className="text-2xl mb-3 text-white text-left">
                            {exp.role}
                          </CardTitle>
                          
                          <div className="flex flex-wrap items-center justify-start gap-4 text-gray-300">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <ImageWithFallback src={exp.logo} alt={exp.company} className="w-5 h-5 rounded-sm border border-white/20 bg-white/10" />
                                <span className="font-medium">{exp.company}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-cyan-400" />
                              <span>{exp.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-400" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 text-white text-left">
                      <div>
                        <h4 className="font-bold mb-4 text-xl text-purple-200 text-left">Summary</h4>
                        <p className="text-gray-200 leading-relaxed">{exp.summary}</p>
                      </div>
                      <div>
                        <h4 className="font-bold mb-4 text-xl text-purple-200 text-left">Highlights</h4>
                        <div className="grid gap-3">
                          {exp.highlights.map((highlight, highlightIndex) => (
                            <motion.div 
                              key={highlightIndex}
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + highlightIndex * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                            >
                              <div className={`w-2 h-2 bg-gradient-to-r ${g.gradient} rounded-full mt-2.5 flex-shrink-0`} />
                              <span className="text-gray-200 leading-relaxed">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-4 text-xl text-purple-200 text-left">Technologies Used</h4>
                        <div className="flex flex-wrap justify-start gap-2">
                          {exp.skills.map((tech, techIndex) => (
                            <motion.div
                              key={techIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + techIndex * 0.05 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                              >
                                {tech}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            );})}
          </div>
        </div>
      </div>
    </section>
  );
}