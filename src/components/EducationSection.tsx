import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, GraduationCap, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import resume from "../data/resume";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

export function EducationSection() {
  return (
    <section id="education" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              Education
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent" style={{ lineHeight: 1.2 }}>
            Academic Background
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {resume.education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="w-full max-w-sm"
            >
              <Card className="h-full bg-white/70 dark:bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 justify-start text-left">
                    <div className="p-2 rounded-md bg-white/70 dark:bg-white/10 border border-white/20">
                      <ImageWithFallback src={edu.logo} alt={edu.institution} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-left">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground text-left">{edu.institution}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-left">
                  <div className="flex items-center gap-2 justify-start">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span>{edu.period}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-start">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    <span>{edu.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


