/**
 * Mock Organizations Data
 * Contains Institution and Hospital data for auto-fill functionality
 */

export interface Institution {
  id: string;
  name: string;
  location: string;
  numFinalYearStudents: number;
  headOfInstitution: string;
  headContact: string;
  spocName: string;
  spocContact: string;
  spocEmail: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  numBeds: number;
  numEmployees: number;
  headOfHospital: string;
  headContact: string;
  hrName: string;
  hrContact: string;
  emailContact: string;
}

export interface Report {
  id: string;
  type: "institution" | "hospital";
  organizationId: string;
  organizationName: string;
  costOfVisit: number;
  personOfContact: string;
  marketingConclusionOrObservation: string;
  createdDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

export const mockInstitutions: Institution[] = [
  {
    id: "INST-001",
    name: "Riverside High School",
    location: "New York, NY",
    numFinalYearStudents: 250,
    headOfInstitution: "Dr. Sarah Johnson",
    headContact: "+1-212-555-0101",
    spocName: "Mr. James Smith",
    spocContact: "+1-212-555-0102",
    spocEmail: "james.smith@riverside.edu",
  },
  {
    id: "INST-002",
    name: "Tech University",
    location: "San Francisco, CA",
    numFinalYearStudents: 450,
    headOfInstitution: "Prof. Michael Chen",
    headContact: "+1-415-555-0201",
    spocName: "Ms. Emily Rodriguez",
    spocContact: "+1-415-555-0202",
    spocEmail: "emily.rodriguez@techuniv.edu",
  },
  {
    id: "INST-003",
    name: "Central Institute of Management",
    location: "Boston, MA",
    numFinalYearStudents: 180,
    headOfInstitution: "Dr. Robert Miller",
    headContact: "+1-617-555-0301",
    spocName: "Mr. David Wong",
    spocContact: "+1-617-555-0302",
    spocEmail: "david.wong@cim.edu",
  },
  {
    id: "INST-004",
    name: "Global Institute of Technology",
    location: "Seattle, WA",
    numFinalYearStudents: 320,
    headOfInstitution: "Prof. Lisa Anderson",
    headContact: "+1-206-555-0401",
    spocName: "Ms. Catherine Lee",
    spocContact: "+1-206-555-0402",
    spocEmail: "catherine.lee@git.edu",
  },
];

export const mockHospitals: Hospital[] = [
  {
    id: "HOSP-001",
    name: "City Care Hospital",
    location: "Los Angeles, CA",
    numBeds: 450,
    numEmployees: 850,
    headOfHospital: "Dr. Patricia Wilson",
    headContact: "+1-213-555-0501",
    hrName: "Mr. John Davis",
    hrContact: "+1-213-555-0502",
    emailContact: "john.davis@citycare.org",
  },
  {
    id: "HOSP-002",
    name: "Metropolitan Medical Center",
    location: "Chicago, IL",
    numBeds: 680,
    numEmployees: 1200,
    headOfHospital: "Dr. Raymond Taylor",
    headContact: "+1-312-555-0601",
    hrName: "Ms. Sarah Thompson",
    hrContact: "+1-312-555-0602",
    emailContact: "sarah.thompson@metropolitan.org",
  },
  {
    id: "HOSP-003",
    name: "Sunshine Medical Hospital",
    location: "Miami, FL",
    numBeds: 350,
    numEmployees: 650,
    headOfHospital: "Dr. Jennifer Garcia",
    headContact: "+1-305-555-0701",
    hrName: "Mr. Michael Martinez",
    hrContact: "+1-305-555-0702",
    emailContact: "michael.martinez@sunshinemedical.org",
  },
  {
    id: "HOSP-004",
    name: "Highland Health System",
    location: "Denver, CO",
    numBeds: 400,
    numEmployees: 720,
    headOfHospital: "Dr. Steven Jackson",
    headContact: "+1-720-555-0801",
    hrName: "Ms. Amanda Brown",
    hrContact: "+1-720-555-0802",
    emailContact: "amanda.brown@highlands.org",
  },
];

export const mockReports: Report[] = [
  {
    id: "REP-101",
    type: "institution",
    organizationId: "INST-001",
    organizationName: "Riverside High School",
    costOfVisit: 500,
    personOfContact: "Dr. Sarah Johnson",
    marketingConclusionOrObservation: "Great response from students, high interest in programs.",
    createdDate: "May 14, 2026",
    status: "Pending",
  },
  {
    id: "REP-102",
    type: "hospital",
    organizationId: "HOSP-001",
    organizationName: "City Care Hospital",
    costOfVisit: 120,
    personOfContact: "Dr. Patricia Wilson",
    marketingConclusionOrObservation: "Positive feedback from HR team, opportunity for partnership.",
    createdDate: "May 12, 2026",
    status: "Approved",
  },
];
