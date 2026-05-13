export type CategorySlug =
  | "scada"
  | "plc"
  | "dcs"
  | "ot-cybersecurity"
  | "iiot"
  | "hmi"
  | "industrial-networks"
  | "automation-robotics"
  | "standards"
  | "case-studies";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  keywords: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "scada",
    name: "SCADA",
    description: "Supervisory Control and Data Acquisition systems news, platforms, and updates.",
    keywords: ["scada", "supervisory control", "wonderware", "ignition", "wincc", "factorytalk"],
  },
  {
    slug: "plc",
    name: "PLC",
    description: "Programmable Logic Controllers — hardware, programming, and IEC 61131-3.",
    keywords: ["plc", "programmable logic", "iec 61131", "ladder", "siemens s7", "allen-bradley", "controllogix"],
  },
  {
    slug: "dcs",
    name: "DCS",
    description: "Distributed Control Systems for process industries.",
    keywords: ["dcs", "distributed control", "deltav", "experion", "ovation", "centum"],
  },
  {
    slug: "ot-cybersecurity",
    name: "OT Cybersecurity",
    description: "Operational Technology cybersecurity, ICS threats, and defense strategies.",
    keywords: ["cyber", "security", "ics security", "ot security", "vulnerab", "ransomware", "cisa", "iec 62443", "threat"],
  },
  {
    slug: "iiot",
    name: "IIoT & Industry 4.0",
    description: "Industrial IoT, smart manufacturing, and digital transformation.",
    keywords: ["iiot", "iot", "industry 4.0", "digital twin", "edge computing", "smart factory", "cloud"],
  },
  {
    slug: "hmi",
    name: "HMI / SCADA Graphics",
    description: "Human-Machine Interfaces, high-performance graphics, and visualization.",
    keywords: ["hmi", "human machine", "visualization", "graphics", "operator interface", "dashboard"],
  },
  {
    slug: "industrial-networks",
    name: "Industrial Networks",
    description: "Profinet, EtherNet/IP, Modbus, OPC UA, TSN, and fieldbus protocols.",
    keywords: ["profinet", "ethernet/ip", "modbus", "opc ua", "tsn", "fieldbus", "network", "protocol", "ethercat"],
  },
  {
    slug: "automation-robotics",
    name: "Automation & Robotics",
    description: "Industrial robotics, motion control, and factory automation.",
    keywords: ["robot", "robotic", "cobot", "motion control", "servo", "automation"],
  },
  {
    slug: "standards",
    name: "Standards & Regulations",
    description: "ISA, IEC, NIST, and global industrial standards updates.",
    keywords: ["standard", "iec ", "isa-", "nist", "regulation", "compliance", "62443", "61131", "61850"],
  },
  {
    slug: "case-studies",
    name: "Case Studies",
    description: "Real-world automation deployments and customer success stories.",
    keywords: ["case study", "case-study", "deployment", "success story", "customer", "implementation"],
  },
];

export function categorize(title: string, summary: string): CategorySlug[] {
  const text = `${title} ${summary}`.toLowerCase();
  const matches = CATEGORIES.filter((c) => c.keywords.some((k) => text.includes(k))).map((c) => c.slug);
  return matches.length ? matches : ["scada"];
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
