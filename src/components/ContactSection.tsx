import React, { useState } from "react";
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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SectionHeading, WebCorner } from "./spidey/Spidey";

type FieldName = 'firstName' | 'lastName' | 'email' | 'subject' | 'message';

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
  const [errors, setErrors] = useState<Record<FieldName, string>>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    subject: false,
    message: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target as { name: string; value: string };
    const fieldName = name as FieldName;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // Live-validate when a field has been touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target as { name: string; value: string };
    const fieldName = name as FieldName;
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const validateField = (name: FieldName, value: string) => {
    const trimmed = (value || '').trim();
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'subject':
      case 'message':
        return trimmed ? '' : 'This field is required.';
      case 'email':
        if (!trimmed) return 'Email is required.';
        // Simple email validation
        return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(trimmed) ? '' : 'Enter a valid email address.';
      default:
        return '';
    }
  };

  const validateAll = () => {
    const nextErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message)
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every(v => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    // Validate client-side and show themed inline errors
    const isValid = validateAll();
    setTouched({ firstName: true, lastName: true, email: true, subject: true, message: true });
    if (!isValid) {
      return; // Do not submit
    }

    setIsSubmitting(true);

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
        setErrors({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        setTouched({ firstName: false, lastName: false, email: false, subject: false, message: false });
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

  const field = (
    name: FieldName | "company",
    label: string,
    placeholder: string,
    opts: { type?: string; textarea?: boolean; optional?: boolean } = {}
  ) => {
    const required = !opts.optional;
    const err = required ? touched[name as FieldName] && errors[name as FieldName] : "";
    const common = {
      id: name,
      name,
      value: formData[name],
      onChange: handleInputChange,
      onBlur: required ? handleBlur : undefined,
      placeholder,
      required,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${name}-error` : undefined,
      className: "sp-input",
    };
    return (
      <div className="sp-field">
        <label htmlFor={name}>
          {label}
          {opts.optional ? <span className="sp-optional"> (optional)</span> : null}
        </label>
        {opts.textarea ? <textarea rows={5} {...common} /> : <input type={opts.type ?? "text"} {...common} />}
        {err ? (
          <p className="sp-field-error" id={`${name}-error`}>
            <AlertCircle size={15} /> {err}
          </p>
        ) : null}
      </div>
    );
  };

  const info = [
    { icon: Mail, label: "Email", value: resume.personal.email, href: `mailto:${resume.personal.email}` },
    { icon: Phone, label: "Phone", value: resume.personal.phone, href: `tel:${resume.personal.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: resume.personal.location },
    { icon: Calendar, label: "Availability", value: "Open to new opportunities" },
  ];

  const links = [
    { icon: Github, label: resume.personal.github.replace(/^https?:\/\//, ""), href: resume.personal.github },
    { icon: Linkedin, label: "LinkedIn profile", href: resume.personal.linkedin },
    { icon: Download, label: "Download Resume (PDF)", href: resume.personal.resumePdf },
  ].filter((l) => l.href);

  return (
    <section id="contact" className="sp-section sp-section-night sp-contact">
      <div className="sp-stars" aria-hidden="true" />
      <div className="sp-signal" aria-hidden="true" />
      <WebCorner corner="tl" className="sp-section-web sp-section-web-light" />

      <div className="sp-container">
        <SectionHeading
          tone="dark"
          kicker="Send a Signal"
          title="Let's Work Together"
          subtitle="Got bugs terrorising your release? Your friendly neighbourhood QA engineer is one message away."
        />

        <div className="sp-contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sp-contact-side"
          >
            <div className="sp-panel">
              <h3 className="sp-panel-title">Contact Information</h3>
              <ul className="sp-info">
                {info.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <span className="sp-icon-badge">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="sp-info-label">{label}</span>
                      {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sp-panel">
              <h3 className="sp-panel-title">Connect With Me</h3>
              <div className="sp-links">
                {links.map(({ icon: Icon, label, href }) => (
                  <a key={label} className="sp-btn sp-btn-navy sp-btn-block" href={href} target="_blank" rel="noreferrer">
                    <Icon size={17} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form className="sp-panel sp-form" onSubmit={handleSubmit} noValidate>
              <h3 className="sp-panel-title">
                <Send size={20} /> Send a Message
              </h3>
              <div className="sp-form-row">
                {field("firstName", "First Name", "Peter")}
                {field("lastName", "Last Name", "Parker")}
              </div>
              {field("email", "Email", "your.email@company.com", { type: "email" })}
              {field("company", "Company", "Your company name", { optional: true })}
              {field("subject", "Subject", "Position inquiry")}
              {field("message", "Message", "Tell me about the role and how I can help...", { textarea: true })}

              {submitStatus === "success" ? (
                <p className="sp-form-status sp-form-ok" role="status">
                  <CheckCircle size={17} /> Signal received! I'll swing back to you soon.
                </p>
              ) : null}
              {submitStatus === "error" ? (
                <p className="sp-form-status sp-form-err" role="alert">
                  <AlertCircle size={17} /> Failed to send message. Please try again.
                </p>
              ) : null}

              <button type="submit" className="sp-btn sp-btn-red sp-btn-block" disabled={isSubmitting}>
                <Send size={17} /> {isSubmitting ? "Sending..." : "Send Message"}
              </button>
              <p className="sp-muted sp-small">I'll get back to you within 24 hours.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
