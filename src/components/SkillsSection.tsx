import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";
import { 
  TestTube,
  Wrench,
  Code,
  Settings,
  Sparkles
} from "lucide-react";

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Testing Methodologies",
      icon: <TestTube className="h-6 w-6" />,
      skills: [
        { name: "Manual Testing", level: 95 },
        { name: "Automated Testing", level: 90 },
        { name: "API Testing", level: 90 },
        { name: "Performance Testing", level: 85 },
      ],
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Automation Tools",
      icon: <Wrench className="h-6 w-6" />,
      skills: [
        { name: "Selenium WebDriver", level: 90 },
        { name: "TestNG", level: 85 },
        { name: "BDD Cucumber", level: 80 },
        { name: "Playwright", level: 80 },
        { name: "Appium", level: 80 },
      ],
      gradient: "from-cyan-500 to-blue-500",
      bgGradient: "from-cyan-500/10 to-blue-500/10"
    },
    {
      title: "Programming Languages",
      icon: <Code className="h-6 w-6" />,
      skills: [
        { name: "Java", level: 80 },
        { name: "TypeScript", level: 75 },
        { name: "SQL", level: 80 },
      ],
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      title: "Testing Tools",
      icon: <Settings className="h-6 w-6" />,
      skills: [
        { name: "JIRA", level: 95 },
        { name: "Postman", level: 90 },
        { name: "Jenkins", level: 85 },
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 75 },
      ],
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10"
    },
  ];

  

  return (
    <section id="skills" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20">
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
              Technical Expertise
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent" style={{ lineHeight: 1.2 }}>
            Skills & Proficiencies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Comprehensive testing skills across multiple domains, tools, and methodologies 
            built over 6 years of hands-on experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 justify-items-center">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="w-full max-w-md"
            >
              <Card className={`h-full bg-gradient-to-br ${category.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-r ${category.gradient} rounded-xl text-white shadow-lg`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-left">{category.title}</h3>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-left">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div 
                      key={skillIndex} 
                      className="space-y-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (skillIndex * 0.05) }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-left flex-1">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs font-bold ml-2">
                          {skill.level}%
                        </Badge>
                      </div>
                      <div className="relative">
                        <Progress value={skill.level} className="h-3 bg-gray-200" />
                        <div 
                          className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${category.gradient} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        
      </div>
    </section>
  );
}