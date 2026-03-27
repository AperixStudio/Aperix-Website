"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* ────────────────────────────────────────────────────────────
   ApexAboutPage — PRD §8.3.4
   Founder: James Kowalski, 12 years, Richmond.
   Team cards (3 members). Licences & certs. Community section.
   ──────────────────────────────────────────────────────────── */

const teamMembers = [
  {
    name: "James Kowalski",
    role: "Founder & Lead Electrician",
    bio: "12 years in the trade. James founded Apex in Richmond with one ute and a commitment to honest, code-compliant work. He still leads every major project personally.",
    gradient: "from-[#1d4ed8] to-[#1e3a8a]",
  },
  {
    name: "Ben Nguyen",
    role: "Senior Electrician",
    bio: "Specialises in commercial fit-outs and data cabling. Ben joined Apex in 2019 and has led over 150 commercial projects across Melbourne.",
    gradient: "from-[#0f172a] to-[#1e293b]",
  },
  {
    name: "Sam Patel",
    role: "Electrician & Emergency Lead",
    bio: "Our 24/7 emergency specialist. Sam handles after-hours call-outs and complex fault-finding with calm precision. Police checked and first-aid certified.",
    gradient: "from-[#f59e0b] to-[#d97706]",
  },
];

const certifications = [
  "Registered Electrical Contractor (REC)",
  "Certificate III in Electrotechnology",
  "Restricted Electrical Licence",
  "$20M Public Liability Insurance",
  "WorkSafe Victoria Compliant",
  "Energy Safe Victoria Registered",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ApexAboutPage() {
  const prefersReduced = useReducedMotion();

  const motionProps = prefersReduced
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: [0, 0, 0.58, 1] as const },
      };

  return (
    <>
      {/* hero */}
      <section className="bg-[#0f172a] py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-3 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            About Us
          </p>
          <h1 className="font-(family-name:--font-apex-display) text-3xl font-bold text-white md:text-4xl">
            The team behind the tools
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-(family-name:--font-apex-body) text-base text-white/70">
            Locally owned, Richmond based, and trusted by hundreds of Melbourne
            homes and businesses.
          </p>
        </div>
      </section>

      {/* founder story */}
      <section className="bg-white py-20 lg:py-28">
        <motion.div
          className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:gap-16"
          variants={stagger}
          {...motionProps}
        >
          {/* portrait placeholder */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center"
          >
            <div className="aspect-square w-full max-w-sm overflow-hidden rounded-xl bg-linear-to-br from-[#1d4ed8] to-[#0f172a]">
              <div className="flex h-full items-center justify-center">
                <span className="font-(family-name:--font-apex-body) text-xs uppercase tracking-widest text-white/30">
                  James Kowalski
                </span>
              </div>
            </div>
          </motion.div>

          {/* bio */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col justify-center"
          >
            <p className="mb-2 font-(family-name:--font-apex-body) text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              Our Founder
            </p>
            <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a]">
              James Kowalski
            </h2>
            <p className="mt-1 font-(family-name:--font-apex-body) text-sm font-medium text-[#1d4ed8]">
              Licensed Electrician · 12 Years Experience
            </p>

            <div className="mt-5 space-y-4 font-(family-name:--font-apex-body) text-base leading-relaxed text-[#64748b]">
              <p>
                I started Apex Electrical in 2012 with a single ute, a toolkit,
                and a belief that Melbourne deserved better from its electricians
                — honest quotes, clean work, and someone who actually shows up
                on time.
              </p>
              <p>
                Twelve years later, we&apos;re a team of three, based out of
                Richmond, servicing everything from switchboard upgrades in
                Fitzroy terraces to full commercial fit-outs in the CBD. We
                still answer our own phones, and I still personally oversee
                every major job.
              </p>
              <p>
                We&apos;re not the biggest electrical company in Melbourne. But
                I&apos;d put our work, our punctuality, and our customer service
                up against anyone in the industry.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* team cards */}
      <section className="bg-[#f8f9fa] py-20 lg:py-28">
        <motion.div
          className="mx-auto max-w-6xl px-6"
          variants={stagger}
          {...motionProps}
        >
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
              Meet the team
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* portrait placeholder */}
                <div
                  className={`aspect-4/3 bg-linear-to-br ${member.gradient}`}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="font-(family-name:--font-apex-body) text-xs uppercase tracking-widest text-white/30">
                      Photo
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-(family-name:--font-apex-display) text-lg font-bold text-[#0f172a]">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-(family-name:--font-apex-body) text-sm font-medium text-[#1d4ed8]">
                    {member.role}
                  </p>
                  <p className="mt-3 font-(family-name:--font-apex-body) text-sm leading-relaxed text-[#64748b]">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* licences & certifications */}
      <section className="bg-white py-20 lg:py-28">
        <motion.div
          className="mx-auto max-w-4xl px-6 text-center"
          variants={stagger}
          {...motionProps}
        >
          <motion.div variants={fadeUp}>
            <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
              Licences &amp; certifications
            </h2>
            <p className="mx-auto mt-3 max-w-md font-(family-name:--font-apex-body) text-base text-[#64748b]">
              Fully compliant with all Victorian and Australian electrical
              standards.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {certifications.map((cert) => (
              <span
                key={cert}
                className="rounded-lg border border-[#e2e8f0] bg-[#f8f9fa] px-5 py-3 font-(family-name:--font-apex-body) text-sm font-medium text-[#1e293b]"
              >
                {cert}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* community */}
      <section className="bg-[#f8f9fa] py-20 lg:py-28">
        <motion.div
          className="mx-auto max-w-4xl px-6 text-center"
          {...motionProps}
        >
          <h2 className="font-(family-name:--font-apex-display) text-3xl font-bold text-[#0f172a] md:text-4xl">
            Part of the community
          </h2>
          <div className="mx-auto mt-6 max-w-lg space-y-4 font-(family-name:--font-apex-body) text-base leading-relaxed text-[#64748b]">
            <p>
              We&apos;re proud to call Richmond home. We sponsor the local
              under-12s footy team, donate electrical work to the Richmond
              Community Centre each year, and offer discounted safety inspections
              for pensioners in the area.
            </p>
            <p>
              When you hire Apex, you&apos;re supporting a genuinely local
              business that puts money back into the neighbourhood.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
