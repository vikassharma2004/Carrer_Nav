import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const SKILL_TAGS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js',
  'Node.js', 'Python', 'Django', 'FastAPI', 'Go',
  'Rust', 'Java', 'Spring Boot', 'C#', '.NET',
  'UI/UX Design', 'Figma', 'Product Design', 'Design Systems',
  'AI / ML', 'LLMs', 'Data Science', 'Computer Vision',
  'DevOps', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'System Design', 'Databases', 'PostgreSQL', 'MongoDB',
  'Cybersecurity', 'Blockchain', 'Mobile Dev', 'Flutter',
]

const EXP_LEVELS = [
  { label: '1–2 yrs',  value: 1,  emoji: '🌱' },
  { label: '3–5 yrs',  value: 3,  emoji: '⚡' },
  { label: '6–9 yrs',  value: 6,  emoji: '🚀' },
  { label: '10+ yrs',  value: 10, emoji: '🏆' },
]

export default function Step1Expertise({ data, onChange }) {
  const toggle = (skill) => {
    const skills = data.expertise || []
    onChange({
      expertise: skills.includes(skill)
        ? skills.filter(s => s !== skill)
        : [...skills, skill],
    })
  }

  const selected = data.expertise || []

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8"
    >
      {/* Heading */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                        bg-brand-purple/10 border border-brand-purple/20
                        text-brand-purple text-xs font-semibold mb-3">
          <Sparkles size={12} /> Step 1 of 5
        </div>
        <h2 className="text-3xl font-extrabold text-brand-navy leading-tight">
          What do you <span className="gradient-text">teach?</span>
        </h2>
        <p className="text-brand-gray text-sm mt-2">
          Select your core skills. Learners will find you through these tags.
        </p>
      </div>

      {/* Skill tags */}
      <div>
        <p className="text-sm font-semibold text-brand-navy mb-3">
          Pick your skills{' '}
          <span className="text-brand-gray font-normal">({selected.length} selected)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILL_TAGS.map((skill) => {
            const on = selected.includes(skill)
            return (
              <motion.button
                key={skill} type="button"
                onClick={() => toggle(skill)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 transition-all duration-200
                  ${on
                    ? 'bg-brand-purple text-white border-brand-purple shadow-[0_0_16px_rgba(123,97,255,0.45)]'
                    : 'bg-brand-lavender text-brand-gray border-gray-200 hover:border-brand-purple/40 hover:text-brand-purple'
                  }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {skill}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Experience level */}
      <div>
        <p className="text-sm font-semibold text-brand-navy mb-3">Years of experience</p>
        <div className="grid grid-cols-4 gap-3">
          {EXP_LEVELS.map(({ label, value, emoji }) => {
            const on = data.experienceYears === value
            return (
              <motion.button
                key={label} type="button"
                onClick={() => onChange({ experienceYears: value })}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all
                  ${on
                    ? 'bg-brand-purple/10 border-brand-purple text-brand-purple shadow-card'
                    : 'bg-brand-lavender border-gray-200 text-brand-gray hover:border-brand-purple/30'
                  }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold">{label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Bio */}
      <div>
        <p className="text-sm font-semibold text-brand-navy mb-2">
          Your mentor bio <span className="text-brand-gray font-normal">(optional)</span>
        </p>
        <textarea
          rows={3}
          placeholder="Tell learners about yourself, your background, and why you mentor…"
          value={data.bio || ''}
          onChange={(e) => onChange({ bio: e.target.value })}
          className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 bg-brand-lavender
                     text-brand-navy placeholder-gray-400 text-sm font-medium resize-none
                     focus:outline-none focus:border-brand-purple focus:bg-white transition-all duration-200"
        />
      </div>
    </motion.div>
  )
}
