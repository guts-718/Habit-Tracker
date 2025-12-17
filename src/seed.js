import { createTaskTemplate } from "./models/taskTemplate.js";

createTaskTemplate({
  name: "DSA + CP",
  planned_minutes: 120,
  weight: 3,
  days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"],
  type: "MENTAL",
  difficulty: 3,
  strictness: "HIGH"
});

createTaskTemplate({
  name: "System Design",
  planned_minutes: 90,
  weight: 4,
  days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri","Sat","Sun"],
  type: "MENTAL",
  difficulty: 4,
  strictness: "HIGH"
});

createTaskTemplate({
  name: "Gym",
  planned_minutes: 90,
  weight: 5,
  days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  type: "PHYSICAL",
  difficulty: 5,
  strictness: "MEDIUM"
});

createTaskTemplate({
  name: "Run",
  planned_minutes: 90,
  weight: 4,
  days_of_week: ["Mon", "Tue", "Wed", "Thu","Fri","Sun"],
  type: "PHYSICAL",
  difficulty: 4,
  strictness: "LOW"
});

console.log("✅ Seed data inserted");
