import Dexie from "dexie";

const db = new Dexie("StudyOrganizerDB");
db.version(3).stores({
  lectures: "++id, subject, day, time, location, userId",
  tasks: "++id, title, subject, dueDate, priority",
  materials: "++id, fileUrl, subject, uploadDate, userId",
});

export default db;