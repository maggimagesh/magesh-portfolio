import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Mail, Phone, MapPin, Download, Sparkles, Bug, Shield, Zap, User, AtSign, MapPin as Location } from "lucide-react";
import { motion } from "motion/react";
import resume from "../data/resume";

// Custom ContactCard component with specific styling
function ContactCard({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl w-full max-w-lg mt-4 mr-16 rounded-xl ${className || ''}`}
      {...props}
    >
      <div className="p-8 pr-20 space-y-6 text-white">
        {children}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-32 text-purple-300/20"
        >
          <Bug size={60} />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-32 left-20 text-cyan-300/20"
        >
          <Shield size={80} />
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-60 left-1/3 text-pink-300/20"
        >
          <Zap size={50} />
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-white text-left"
          >
            <div className="space-y-6">
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent text-left"
                style={{ lineHeight: 1.2 }}
              >
                {resume.personal.name}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl lg:text-2xl text-gray-300 leading-relaxed text-left"
              >
                {resume.profile}
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-3 justify-start"
            >
              {resume.skills.slice(0, 6).map((skill, index) => (
                <Badge 
                  key={skill}
                  variant="outline" 
                  className="border-purple-400/50 text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300"
                >
                  {skill}
                </Badge>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-start"
            >
              {resume.personal.resumePdf ? (
                <a href={resume.personal.resumePdf} target="_blank" rel="noreferrer">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <Download className="h-5 w-5" />
                    Download Resume
                  </Button>
                </a>
              ) : null}
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-purple-400/50 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300"
              >
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            <ContactCard>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-cyan-200 bg-clip-text text-transparent text-left">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: AtSign, text: resume.personal.email },
                  { icon: Phone, text: resume.personal.phone },
                  { icon: Location, text: resume.personal.location }
                ].map(({ icon: Icon, text }, index) => (
                  <motion.div 
                    key={text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">{text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/20">
                <h4 className="font-bold mb-4 text-purple-200 text-left">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Experience", value: "6+ Years", color: "from-purple-400 to-purple-600" },
                    { label: "Projects", value: "Multiple applications Tested", color: "from-cyan-400 to-cyan-600" },
                    { label: "Bug Reports", value: "1000+", color: "from-pink-400 to-pink-600" },
                    { label: "Automation", value: "Multiple frameworks", color: "from-indigo-400 to-indigo-600" }
                  ].map(({ label, value, color }) => (
                    <motion.div 
                      key={label}
                      whileHover={{ scale: 1.05 }}
                      className="text-left p-4 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col"
                    >
                      <p className="text-gray-400 text-base mb-2">{label}</p>
                      <p className={`font-bold text-xl bg-gradient-to-r ${color} bg-clip-text text-transparent break-words`}>
                        {value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ContactCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}