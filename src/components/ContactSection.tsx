import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import resume from "../data/resume";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Send,
  Calendar,
  Download,
  Sparkles,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
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
            <Sparkles className="h-5 w-5 text-purple-300" />
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              Get In Touch
            </Badge>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white" style={{ lineHeight: 1.2 }}>
            Let's Work Together
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Ready to bring quality assurance expertise to your team. 
            Let's discuss how I can help improve your testing processes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 max-w-lg mx-auto"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader className="text-left">
                    <CardTitle className="text-white text-xl flex items-center justify-start gap-2">
                      <MessageCircle className="h-5 w-5 text-purple-400" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { icon: Mail, label: "Email", value: resume.personal.email, color: "text-purple-400" },
                      { icon: Phone, label: "Phone", value: resume.personal.phone, color: "text-cyan-400" },
                      { icon: MapPin, label: "Location", value: resume.personal.location, color: "text-green-400" },
                      { icon: Calendar, label: "Availability", value: "Open to new opportunities", color: "text-pink-400" }
                    ].map(({ icon: Icon, label, value, color }, index) => (
                      <motion.div 
                        key={label}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      >
                        <div className={`p-3 ${color} bg-white/10 rounded-lg`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{label}</p>
                          <p className="text-sm text-gray-300">{value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader className="text-left">
                    <CardTitle className="text-white text-xl">Connect With Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Github, label: resume.personal.github.replace(/^https?:\/\//, ""), gradient: "from-gray-600 to-gray-800", href: resume.personal.github },
                      { icon: Linkedin, label: resume.personal.linkedin.replace(/^https?:\/\//, ""), gradient: "from-blue-600 to-blue-800", href: resume.personal.linkedin },
                      { icon: Download, label: "Download Resume (PDF)", gradient: "from-purple-600 to-pink-600", href: resume.personal.resumePdf }
                    ].map(({ icon: Icon, label, gradient, href }, index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {href ? (
                          <a href={href} target="_blank" rel="noreferrer">
                            <Button 
                              variant="outline" 
                              className={`w-full justify-start gap-3 bg-gradient-to-r ${gradient} text-white border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-300`}
                            >
                              <Icon className="h-4 w-4" />
                              {label}
                            </Button>
                          </a>
                        ) : null}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-lg mx-auto"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                  <CardHeader className="text-left">
                    <CardTitle className="text-white text-xl flex items-center justify-start gap-2">
                      <Send className="h-5 w-5 text-purple-400" />
                      Send a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <label htmlFor="firstName" className="text-white font-medium">First Name</label>
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name" 
                            required
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                          className="space-y-2"
                        >
                          <label htmlFor="lastName" className="text-white font-medium">Last Name</label>
                          <Input 
                            id="lastName" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name" 
                            required
                            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <label htmlFor="email" className="text-white font-medium text-left">Email</label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@company.com" 
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="space-y-2"
                      >
                        <label htmlFor="company" className="text-white font-medium text-left">Company</label>
                        <Input 
                          id="company" 
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Your Company Name" 
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                      >
                        <label htmlFor="subject" className="text-white font-medium text-left">Subject</label>
                        <Input 
                          id="subject" 
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Position Inquiry" 
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="space-y-2"
                      >
                        <label htmlFor="message" className="text-white font-medium text-left">Message</label>
                        <textarea 
                          id="message" 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell me about the role and how I can help..."
                          rows={4}
                          required
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 resize-none min-h-[100px] max-h-[200px] overflow-y-auto w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                          style={{ height: '100px', minHeight: '100px', maxHeight: '200px' }}
                        />
                      </motion.div>
                      
                      {/* Status Messages */}
                      {submitStatus === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-green-400 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Message sent successfully! I'll get back to you soon.
                        </motion.div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Failed to send message. Please try again.
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </motion.div>
                    </form>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-xs text-gray-400 text-left"
                    >
                      I'll get back to you within 24 hours.
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
        </div>
    </section>
  );
}