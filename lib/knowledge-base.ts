export interface KnowledgeChunk {
  id: string;
  topic: string;
  content: string;
  tags: string[];
  embedding?: number[];
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "what-is-inventures",
    topic: "About InVentures",
    content:
      "InVentures GmbH is a Vienna-based advisory and execution firm with two tracks: (A) AI-driven enterprise transformation — from readiness assessment to implementation of AI agents, workflow automation and data platforms; (B) Real Estate & Hospitality transactions — buy-side/sell-side advisory, project management and deal structuring. No PowerPoint consulting — hands-on execution with measurable results.",
    tags: ["about", "overview", "what", "who"],
  },
  {
    id: "target-clients",
    topic: "Target Clients",
    content:
      "Tech & AI track: mid-market companies and corporates in Telecom, Insurance, Education, Legal and Hospitality looking to operationally transform. Real Estate track: institutional investors, family offices, developers and hospitality operators focused on residential, commercial and hotel assets in EU and MENA.",
    tags: ["clients", "customers", "who", "target", "industries"],
  },
  {
    id: "main-offering",
    topic: "Main Offering",
    content:
      "Combination of strategic advisory and operational execution. Not pure consulting, not a pure product. InVentures assembles project-specific expert teams from a proven network spanning Legal, Finance, Tech and Industry — and leads execution with a committed timeline: 6–9 months for the Tech track, 3–6 months for the Real Estate track.",
    tags: ["offering", "services", "how", "timeline", "execution"],
  },
  {
    id: "founder",
    topic: "Founder",
    content:
      "Mag. David Brainin — lawyer, serial CEO, 25+ years operational experience, transaction record exceeding EUR 450 million. Founder and CEO of Geolad GmbH (30+ employees), commissioned by Deutsche Telekom and A1 Group to build the largest telecom data hub in the MENA region. Partners include Viettel (Vietnam), Orange (Poland), Huawei, Zain Group (Middle East), Ericsson. 8 years of GDPR implementation, EU AI Act ready.",
    tags: ["founder", "david", "brainin", "background", "experience", "who"],
  },
  {
    id: "usp",
    topic: "USP vs McKinsey/Deloitte",
    content:
      "Three differentiators: (1) Founder perspective — Brainin has founded, built and scaled companies himself. He knows operational reality from the inside. (2) No overhead — no 20-person consulting army, but a lean, project-specific network of top specialists. (3) Committed timelines with measurable KPIs instead of open-ended mandates.",
    tags: ["usp", "difference", "why", "versus", "consulting", "advantage"],
  },
  {
    id: "regulatory",
    topic: "Regulatory & Compliance Expertise",
    content:
      "8 years of hands-on GDPR implementation across Telecom, Real Estate, Hospitality and Science. Data Protection Impact Assessments for AI systems. EU AI Act readiness: risk classification, conformity assessments, documentation obligations. Compliant AI governance frameworks. Cross-border data transfer structuring (EU, MENA, ASEAN) under Schrems II requirements.",
    tags: ["gdpr", "ai act", "compliance", "regulatory", "dsgvo", "regulation"],
  },
  {
    id: "network",
    topic: "Expert Network",
    content:
      "Legal: Lansky & Partner RAe, Prader Rechtsanwälte, DSC Rechtsanwälte, Herbst Kinsky RAe. Finance: Raiffeisen Bank International, Wiener Privatbank SE, VCs, Family Offices. Real Estate: EPI Immobilien Group, Akkadia Immobilien, Arcotel Hotels, Plaza Group. Industry: Deutsche Telekom, A1 Group, Uniqa Versicherung. Plus undisclosed Family Offices.",
    tags: ["network", "partners", "team", "experts", "who", "law", "finance"],
  },
  {
    id: "next-step",
    topic: "Contact & Next Step",
    content:
      "Send an email to info@inventures.at or leave your contact details. The team responds within 24 hours. The initial conversation is non-binding and serves to define scope — whether it is a fit becomes clear in week 1.",
    tags: ["contact", "next step", "email", "meeting", "start", "how to begin"],
  },
  {
    id: "services-detail",
    topic: "Services",
    content:
      "Five services: (1) Strategic Sparring & Advisory — C-level reflection, transaction support, interim management. (2) AI & Data Consulting — AI readiness assessment, AI agents, data strategy, EU AI Act compliance. (3) AI Transformation & Implementation — workflow automation, intelligent document management, change management. (4) Incubator & Company Building — ideation, incorporation, fundraising, scaling. (5) Accelerator — structured mentoring, network access, investor introductions, go-to-market support.",
    tags: ["services", "offerings", "what", "list"],
  },
  {
    id: "clients-references",
    topic: "Clients & References",
    content:
      "Key references include Deutsche Telekom, A1 Group, Orange, Zain Group, Viettel, Huawei, Ericsson (Telecom & AI), European Stroke Organisation, SFU Wien, Donau Universität Krems (Science & Education), Raiffeisen Bank International, Wiener Privatbank SE (Finance), Lansky & Partner RAe (Legal), Arcotel Hotels, Plaza Group, Ibis Group (Hospitality), ORF, Integrationshaus Wien (Media & Social Impact).",
    tags: ["clients", "references", "customers", "who", "worked with"],
  },
  {
    id: "process",
    topic: "Process & Timeline",
    content:
      "5-step process: Week 1 — Initial Meeting (scope, objectives, quick wins). Week 2–3 — Case Analysis (deep dive into processes, data, stakeholders). Week 4–5 — Strategy Plan (action plan with KPIs, responsibilities, milestones). Month 2–6 — Execution (AI integration, automation, change management). Month 6–9 — Revenue Impact (measurable OPEX reduction and activated revenue streams). Total: 6–9 months from first meeting to measurable impact.",
    tags: ["process", "timeline", "how long", "steps", "months"],
  },
  {
    id: "stats",
    topic: "Key Stats",
    content:
      "EUR 450M+ transaction record. EU & Asia markets. 6 sectors covered. 20+ years as CEO. 6–9 months to measurable results. 30%+ typical OPEX savings in target processes.",
    tags: ["stats", "numbers", "results", "track record", "performance"],
  },
  {
    id: "ai-act-overview",
    topic: "EU AI Act — Overview & Legal Status",
    content:
      "The EU AI Act (Regulation EU 2024/1689) is a Regulation — not a Directive. It applies directly and uniformly in all EU member states without national transposition. No implementation window, no national interpretation. It entered into force on 1 August 2024 with staggered transitional periods. From each respective deadline, obligations apply directly in Austria, Germany, France and all other member states.",
    tags: ["eu ai act", "regulation", "compliance", "law", "legal", "artificial intelligence"],
  },
  {
    id: "ai-act-timeline",
    topic: "EU AI Act — Key Deadlines",
    content:
      "The EU AI Act applies in stages: (1) Since 2 February 2025: Bans on unacceptable-risk AI and AI literacy obligations. Prohibited: social scoring, manipulative AI, mass facial data scraping, emotion recognition in workplaces and schools. (2) Since 2 August 2025: Obligations for General Purpose AI (GPAI) providers and governance/reporting structures. (3) 2 August 2026 — major deadline: High-risk AI rules become enforceable for systems in biometrics, critical infrastructure, law enforcement, education, employment, credit and public services. (4) 2 August 2027: High-risk AI in regulated products — extended transition. GPAI models on market before August 2025 must be fully compliant. The Digital Omnibus package may slightly adjust certain deadlines.",
    tags: ["eu ai act", "timeline", "deadlines", "2026", "2027", "high risk", "compliance", "dates"],
  },
  {
    id: "ai-act-gdpr-intersection",
    topic: "EU AI Act & GDPR Intersection",
    content:
      "GDPR Article 9 prohibits processing special categories of personal data (ethnicity, political opinions, religious beliefs, biometric/genetic data, health data, sexual orientation). The AI Act creates a narrow exception in Article 10(5): providers of high-risk AI may process special categories when strictly necessary for bias detection and correction. However, the AI Act does not override GDPR — all GDPR Article 9(2) requirements still apply. Two critical constraints: (1) Subsidiarity — the exception only applies if synthetic or anonymised data cannot be used instead. (2) Strict necessity — a high legal threshold requiring continuous verification.",
    tags: ["gdpr", "dsgvo", "eu ai act", "data protection", "biometric", "health", "bias", "compliance"],
  },
  {
    id: "ai-act-safeguards",
    topic: "EU AI Act — Safeguards & Scope Limits for Sensitive Data",
    content:
      "When processing special categories under AI Act Article 10(5), four conditions apply: (1) Pseudonymisation, transfer restrictions, enhanced security measures — and processing records must document why sensitive data processing was unavoidable. (2) Strict necessity — continuous re-evaluation required. (3) Limited scope — the exception only applies to high-risk AI systems (biometrics, critical infrastructure, education, employment, credit scoring, law enforcement, migration, justice). Operators of low-risk systems have no exception whatsoever.",
    tags: ["gdpr", "ai act", "safeguards", "sensitive data", "pseudonymisation", "high risk", "compliance", "legal"],
  },
  {
    id: "ai-act-biometrics",
    topic: "EU AI Act — Biometrics: The Hardest Regulatory Area",
    content:
      "Biometric data is already a special category under GDPR. The AI Act adds another layer: Prohibited (since February 2025, no exceptions): AI systems that categorise people by biometric data to infer race, political opinions, trade union membership, religion, sexual orientation. Also absolutely prohibited: building facial databases by scraping facial images from the internet or CCTV footage. Biometric categorisation systems for other sensitive characteristics are classified as high-risk — subject to all compliance obligations from August 2026. This means: any company using AI systems that process biometric data — even indirectly — must demonstrate conformity assessments, risk management systems, technical documentation and human oversight mechanisms from August 2026.",
    tags: ["biometrics", "facial recognition", "eu ai act", "prohibited", "high risk", "compliance", "2026", "scraping", "cctv"],
  },
  {
    id: "ai-act-inventures-gdpr-advantage",
    topic: "Why InVentures' GDPR Experience Is the EU AI Act Advantage",
    content:
      "InVentures has been implementing GDPR compliance operationally since 2018 — across Telecom, Real Estate, Hospitality and Science. Data Protection Impact Assessments for automated decision-making systems, cross-border data transfers under Schrems II, privacy-by-design architectures. The EU AI Act is not a new discipline for InVentures — it is an extension. 8 years of Article 9 GDPR expertise means Article 10(5) of the AI Act is a new tool, not a shock. Experience with DPIAs for telecom data platforms directly translates to Fundamental Rights Impact Assessments for high-risk AI systems. This is the gap between tech consultancies (no regulatory depth) and law firms (no operational implementation). InVentures does both.",
    tags: ["gdpr", "dsgvo", "ai act", "advantage", "expertise", "inventures", "why", "usp", "dpia", "compliance"],
  },
  {
    id: "ai-act-penalties",
    topic: "EU AI Act — Penalties",
    content:
      "Penalties for violations of EU AI Act prohibitions: up to €35 million or 7% of global annual revenue — whichever is higher. This is significantly more than GDPR (maximum 4%). For violations of other obligations (high-risk systems): up to €15 million or 3% of global revenue. For providing incorrect information to authorities: up to €7.5 million or 1.5%. Organisations that believe they can ignore or delay compliance risk existential financial consequences.",
    tags: ["penalties", "fines", "eu ai act", "35 million", "7 percent", "risk", "compliance", "consequences"],
  },
  {
    id: "ai-act-inventures-expertise",
    topic: "InVentures EU AI Act Compliance Services",
    content:
      "InVentures brings 8 years of hands-on GDPR implementation into EU AI Act compliance. Services: AI system risk classification (unacceptable / high / limited / minimal risk), conformity assessments, Data Protection Impact Assessments (DPIA) for AI, technical documentation, compliant AI governance frameworks, and cross-border data transfer structuring under Schrems II (EU, MENA, ASEAN). The August 2026 deadline creates immediate compliance pressure for organisations deploying AI in biometrics, HR, education, finance or public services.",
    tags: ["eu ai act", "compliance", "gdpr", "inventures", "services", "risk", "assessment", "governance", "2026"],
  },
];
