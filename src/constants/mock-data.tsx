// src/data/mockSubjects.ts

export type Subject = {
  id: number;
  code: string;
  name: string;
  department: string;
  description: string;
  createdAt: string;
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    department: "CS",
    description: "Fundamentals of programming using structured and object-oriented approaches.",
    createdAt: "2024-01-15T08:30:00Z",
  },
  {
    id: 2,
    code: "CS201",
    name: "Data Structures",
    department: "CS",
    description: "Study of algorithms, arrays, linked lists, stacks, queues, and trees.",
    createdAt: "2024-02-10T09:00:00Z",
  },
  {
    id: 3,
    code: "IT101",
    name: "Fundamentals of Networking",
    department: "IT",
    description: "Introduction to networking concepts, protocols, and infrastructure.",
    createdAt: "2024-03-05T10:15:00Z",
  },
 
];