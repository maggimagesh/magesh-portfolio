import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github, TestTube, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import resume from "../data/resume";

export function ProjectsSection() {
  const gradients = [
    { gradient: "from-purple-600 to-pink-600", bgGradient: "from-purple-500/10 to-pink-500/10" },
    { gradient: "from-cyan-600 to-blue-600", bgGradient: "from-cyan-500/10 to-blue-500/10" },
    { gradient: "from-green-600 to-emerald-600", bgGradient: "from-green-500/10 to-emerald-500/10" },
    { gradient: "from-orange-600 to-red-600", bgGradient: "from-orange-500/10 to-red-500/10" }
  ];

  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl"></div>
      
      <div className="container relative mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              Notable Projects
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent" style={{ lineHeight: 1.2 }}>
            Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Key testing projects that demonstrate expertise in automation, 
            strategy development, and quality improvement initiatives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          {resume.projects.map((proj, index) => {
            const g = gradients[index % gradients.length];
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="h-full w-full max-w-sm"
            >
              <Card className={`h-full flex flex-col bg-gradient-to-br ${g.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}>
                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${g.gradient} opacity-10 rounded-bl-full`}></div>
                
                <CardHeader className="pb-6 text-left">
                  <div className="flex items-start justify-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-3 mb-4">
                        <div className={`p-3 bg-gradient-to-r ${g.gradient} rounded-xl text-white shadow-lg`}>
                          <TestTube className="h-6 w-6" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium border-0 bg-gradient-to-r ${g.gradient} text-white`}
                        >
                          Project
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl mb-3 text-left">{proj.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-left">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`bg-gradient-to-r ${g.gradient} p-4 rounded-xl text-white shadow-lg`}
                  >
                    <div className="flex items-center justify-start gap-2">
                      <TestTube className="h-4 w-4" />
                      <p className="font-bold">Status: {proj.status ?? ""}</p>
                    </div>
                  </motion.div>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-6 text-left">
                  <div>
                    <h4 className="font-bold mb-4 text-lg">Technologies</h4>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {proj.tech.map((tech, techIndex) => (
                        <motion.div
                          key={techIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + techIndex * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-white/70 hover:bg-white/90 transition-all duration-300 cursor-pointer"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 justify-start">
                    {proj.link ? (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="flex-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2 w-full max-w-40 border-2 hover:scale-105 transition-all duration-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live
                        </Button>
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );})}
        </div>
      </div>
    </section>
  );
}