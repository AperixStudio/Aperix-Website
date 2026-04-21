const PROJECTS = [
  {
    id: "rhinos",
    name: "Rhino’s Walk",
    domain: "rhinoswalk.com.au",
    stage: "Live",
    lead: "Harrison",
    support: "Thomas",
    tier: "Business",
    health: "Live · Healthy",
    healthState: "healthy",
    hosting: "Netlify",
    registrar: "VentraIP",
    dns: "Cloudflare",
    repo: "client-rhinos-walk-site",
    repoStatus: "Private",
    deploy: "Today · 11:42 AM",
    summary: "Production client website with active monitoring, domain routing, and post-launch maintenance.",
    notes: "Primary ops site. Good candidate for the first fully integrated health view with Netlify deploy status, uptime ping, and ownership notes.",
    links: [
      ["GitHub Repo", "Private repo in AperixStudio"],
      ["Netlify Project", "Deploys, env vars, previews"],
      ["Cloudflare Zone", "DNS, SSL, email routing"],
      ["VentraIP", "Registrar and renewal info"],
      ["Resend Domain", "Contact-form sending setup"],
      ["Vault Entry", "Passwords and service access"]
    ],
    checks: [
      ["Homepage response", "200 OK", "healthy", "2 min ago"],
      ["SSL certificate", "Valid", "healthy", "Today"],
      ["Contact form", "Delivering", "healthy", "Yesterday"],
      ["DNS routing", "Healthy", "healthy", "Today"]
    ],
    priorities: [
      ["Monthly backup/export", "Run content/export backup and note completion in the ops log."],
      ["Review Lighthouse baseline", "Keep an eye on performance and CLS after future content edits."],
      ["Check renewals", "Confirm domain renewal owner and renewal dates are documented."]
    ]
  },
  {
    id: "aperix",
    name: "Aperix Website",
    domain: "aperix.com.au",
    stage: "Live",
    lead: "Harrison",
    support: "Thomas",
    tier: "Agency",
    health: "Live · Minor Attention",
    healthState: "attention",
    hosting: "Netlify",
    registrar: "VentraIP",
    dns: "Cloudflare",
    repo: "Aperix-Website",
    repoStatus: "Org Repo",
    deploy: "Yesterday · 8:10 PM",
    summary: "Public-facing agency site with demos, pricing, portfolio, and contact pipeline.",
    notes: "This stays separate from client work. Admin should sync leads from the public contact route and create internal project records when a lead becomes a job.",
    links: [
      ["GitHub Repo", "AperixStudio/Aperix-Website"],
      ["Netlify Project", "Production hosting dashboard"],
      ["Cloudflare Zone", "DNS and forwarding"],
      ["Resend", "Contact email delivery"],
      ["PRD / Docs", "Source-of-truth planning docs"],
      ["Analytics", "Traffic and conversion insights"]
    ],
    checks: [
      ["Homepage response", "200 OK", "healthy", "3 min ago"],
      ["SSL certificate", "Valid", "healthy", "Today"],
      ["Contact env audit", "Reminder", "attention", "Yesterday"],
      ["DNS routing", "Healthy", "healthy", "Today"]
    ],
    priorities: [
      ["Lead intake sync", "Promote accepted enquiries into admin records."],
      ["Portfolio updates", "Link launched client sites back into case studies."],
      ["Health cards", "Expose SSL, domain, and form status on dashboard."]
    ]
  },
  {
    id: "hearthstone",
    name: "Hearthstone Café Demo",
    domain: "/demo/starter",
    stage: "Build",
    lead: "Thomas",
    support: "Harrison",
    tier: "Starter",
    health: "Build · Healthy",
    healthState: "healthy",
    hosting: "Inside Aperix",
    registrar: "N/A",
    dns: "N/A",
    repo: "Aperix-Website",
    repoStatus: "Shared",
    deploy: "Bundled with main site",
    summary: "A sales demo showing the Starter-tier offering and visual direction for small hospitality businesses.",
    notes: "Great pattern source for future café clients. Could later be promoted into a starter template or a cloned client repo.",
    links: [
      ["Demo Route", "Public demo inside the agency site"],
      ["Design Source", "Reusable components and brand pattern"],
      ["Template Candidate", "Potential aperix-site-starter seed"],
      ["Content Checklist", "Swap-ready hospitality sections"]
    ],
    checks: [
      ["Demo route", "Available", "healthy", "Today"],
      ["Banner labelling", "Active", "healthy", "Today"],
      ["Template extraction", "Planned", "attention", "This week"],
      ["Domain", "N/A", "neutral", "N/A"]
    ],
    priorities: [
      ["Refactor reusable blocks", "Turn demo sections into starter components."],
      ["Template split", "Move shared parts into aperix-site-starter."],
      ["Clone for prospects", "Use as a fast customisation base."]
    ]
  },
  {
    id: "lumina",
    name: "Lumina Med Spa",
    domain: "lumina-demo.aperix.com.au",
    stage: "Proposal",
    lead: "Thomas",
    support: "Harrison",
    tier: "Premium",
    health: "Needs Attention",
    healthState: "attention",
    hosting: "Netlify",
    registrar: "Cloudflare",
    dns: "Cloudflare",
    repo: "client-lumina-demo-site",
    repoStatus: "Private",
    deploy: "3 days ago",
    summary: "High-end premium demo with multi-page treatment, booking, FAQ, and about flows.",
    notes: "This style of project needs a richer client detail page: booking integrations, content approvals, treatment/legal review, and approval milestones.",
    links: [
      ["Repo", "Premium demo source"],
      ["Preview", "Stakeholder review link"],
      ["Booking Notes", "Future integration references"],
      ["Design Board", "Brand and visual references"],
      ["Checklist", "Legal / compliance reminders"]
    ],
    checks: [
      ["Stakeholder review", "Pending", "attention", "Today"],
      ["Deploy preview", "Available", "healthy", "3 days ago"],
      ["Domain routing", "Preview only", "attention", "Current"],
      ["Launch readiness", "Blocked", "attention", "Current"]
    ],
    priorities: [
      ["Refine booking flow", "Decide if form stays internal or becomes external integration."],
      ["Approval model", "Add owner and signoff tracking in admin."],
      ["Status alerts", "Surface pending content and launch blockers."]
    ]
  }
];

function getProjectById(id) {
  return PROJECTS.find((project) => project.id === id) || PROJECTS[0];
}

function getHealthDotClass(state) {
  if (state === "healthy") return "success";
  if (state === "attention") return "warning";
  if (state === "down") return "danger";
  if (state === "neutral") return "violet";
  return "accent";
}

function getDashboardStats() {
  const total = PROJECTS.length;
  const healthy = PROJECTS.filter((project) => project.healthState === "healthy").length;
  const attention = PROJECTS.filter((project) => project.healthState === "attention").length;
  const harrison = PROJECTS.filter((project) => project.lead === "Harrison").length;
  const thomas = PROJECTS.filter((project) => project.lead === "Thomas").length;

  return { total, healthy, attention, harrison, thomas };
}
