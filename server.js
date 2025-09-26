const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

// ------------------ In-memory data ------------------
let groups = [
  {
    id: 1,
    name: "Jace",
    code: "11111",
    members: [
      {
        id: "m-1",
        fullName: "Alice",
        nickname: "Ali",
        contact: "0917-111-1111",
        address: "123 Mango St.",
        invitedBy: "Jace",
        notes: "Prefers morning check-ins.",
        one2one: 4,
      },
      {
        id: "m-2",
        fullName: "Bob",
        nickname: "Bobby",
        contact: "0917-222-2222",
        address: "45 Pine Ave.",
        invitedBy: "Jace",
        notes: "",
        one2one: 3,
      },
      {
        id: "m-3",
        fullName: "Charlie",
        nickname: "Char",
        contact: "0917-333-3333",
        address: "7 Oak Lane",
        invitedBy: "Jace",
        notes: "Needs follow-up re: schedule.",
        one2one: 5,
      },
    ],
  },
  {
    id: 2,
    name: "Josh",
    code: "22222",
    members: [
      {
        id: "m-4",
        fullName: "David",
        nickname: "Dave",
        contact: "0917-444-4444",
        address: "10 River Rd.",
        invitedBy: "Josh",
        notes: "",
        one2one: 6,
      },
      {
        id: "m-5",
        fullName: "Eve",
        nickname: "Evie",
        contact: "0917-555-5555",
        address: "88 Hill St.",
        invitedBy: "Josh",
        notes: "On vacation next week.",
        one2one: 4,
      },
      {
        id: "m-6",
        fullName: "Frank",
        nickname: "Franky",
        contact: "0917-666-6666",
        address: "300 Bay Blvd.",
        invitedBy: "Josh",
        notes: "",
        one2one: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Tim",
    code: "33333",
    members: [
      {
        id: "m-7",
        fullName: "Grace",
        nickname: "Grace",
        contact: "0917-777-7777",
        address: "21 Center St.",
        invitedBy: "Tim",
        notes: "",
        one2one: 5,
      },
      {
        id: "m-8",
        fullName: "Heidi",
        nickname: "Hei",
        contact: "0917-888-8888",
        address: "14 Market Rd.",
        invitedBy: "Tim",
        notes: "",
        one2one: 3,
      },
      {
        id: "m-9",
        fullName: "Ivan",
        nickname: "Ivy",
        contact: "0917-999-9999",
        address: "5 Lake Ave.",
        invitedBy: "Tim",
        notes: "",
        one2one: 4,
      },
      {
        id: "m-10",
        fullName: "Judy",
        nickname: "Jude",
        contact: "0917-000-0000",
        address: "2 Sunset Blvd.",
        invitedBy: "Tim",
        notes: "",
        one2one: 6,
      },
    ],
  },
  {
    id: 4,
    name: "Evan",
    code: "44444",
    members: [
      {
        id: "m-11",
        fullName: "Karl",
        nickname: "K",
        contact: "0918-111-1111",
        address: "9 Forest Rd.",
        invitedBy: "Evan",
        notes: "",
        one2one: 2,
      },
      {
        id: "m-12",
        fullName: "Liam",
        nickname: "Lee",
        contact: "0918-222-2222",
        address: "12 Palm St.",
        invitedBy: "Evan",
        notes: "",
        one2one: 3,
      },
      {
        id: "m-13",
        fullName: "Mia",
        nickname: "M",
        contact: "0918-333-3333",
        address: "33 Harbor Ln.",
        invitedBy: "Evan",
        notes: "Has mobility concerns.",
        one2one: 7,
      },
    ],
  },
  {
    id: 5,
    name: "Isaac",
    code: "55555",
    members: [
      {
        id: "m-14",
        fullName: "Nina",
        nickname: "Nin",
        contact: "0918-444-4444",
        address: "77 Orchard Rd.",
        invitedBy: "Isaac",
        notes: "",
        one2one: 6,
      },
      {
        id: "m-15",
        fullName: "Oscar",
        nickname: "Oz",
        contact: "0918-555-5555",
        address: "8 Ridge St.",
        invitedBy: "Isaac",
        notes: "",
        one2one: 5,
      },
      {
        id: "m-16",
        fullName: "Paul",
        nickname: "Pauly",
        contact: "0918-666-6666",
        address: "101 Elm St.",
        invitedBy: "Isaac",
        notes: "",
        one2one: 4,
      },
      {
        id: "m-17",
        fullName: "Quinn",
        nickname: "Q",
        contact: "0918-777-7777",
        address: "200 Cedar Ln.",
        invitedBy: "Isaac",
        notes: "",
        one2one: 3,
      },
    ],
  },
  {
    id: 6,
    name: "John",
    code: "66666",
    members: [
      {
        id: "m-18",
        fullName: "New Member",
        nickname: "Newbie",
        contact: "0918-888-8888",
        address: "1 New St.",
        invitedBy: "Leader",
        notes: "",
        one2one: 4,
      },
      {
        id: "m-19",
        fullName: "Another Member",
        nickname: "Another",
        contact: "0918-999-9999",
        address: "2 Another St.",
        invitedBy: "Leader",
        notes: "",
        one2one: 5,
      },
    ],
  },
];

let events = [
  {
    id: 1,
    groupId: 1,
    name: "Alpha Kickoff",
    date: "01/15/2025",
    attendance: [
      { name: "Alice", status: "Present" },
      { name: "Bob", status: "Late" },
      { name: "Charlie", status: "Absent" },
    ],
  },
  {
    id: 2,
    groupId: 1,
    name: "Alpha Weekly",
    date: "03/10/2025",
    attendance: [
      { name: "Alice", status: "Late" },
      { name: "Bob", status: "Present" },
      { name: "Charlie", status: "Present" },
    ],
  },
  {
    id: 3,
    groupId: 2,
    name: "Beta Sync",
    date: "02/05/2025",
    attendance: [
      { name: "David", status: "Present" },
      { name: "Eve", status: "Absent" },
      { name: "Frank", status: "Late" },
    ],
  },
  {
    id: 4,
    groupId: 2,
    name: "Beta Retrospective",
    date: "07/20/2025",
    attendance: [
      { name: "David", status: "Late" },
      { name: "Eve", status: "Present" },
      { name: "Frank", status: "Present" },
    ],
  },
  {
    id: 5,
    groupId: 3,
    name: "Gamma Planning",
    date: "04/12/2025",
    attendance: [
      { name: "Grace", status: "Present" },
      { name: "Heidi", status: "Present" },
      { name: "Ivan", status: "Absent" },
      { name: "Judy", status: "Late" },
    ],
  },
  {
    id: 6,
    groupId: 3,
    name: "Gamma Review",
    date: "09/18/2025",
    attendance: [
      { name: "Grace", status: "Late" },
      { name: "Heidi", status: "Absent" },
      { name: "Ivan", status: "Present" },
      { name: "Judy", status: "Present" },
    ],
  },
  {
    id: 7,
    groupId: 4,
    name: "Delta Training",
    date: "05/09/2025",
    attendance: [
      { name: "Karl", status: "Absent" },
      { name: "Liam", status: "Present" },
      { name: "Mia", status: "Present" },
    ],
  },
  {
    id: 8,
    groupId: 4,
    name: "Delta Simulation",
    date: "08/14/2025",
    attendance: [
      { name: "Karl", status: "Present" },
      { name: "Liam", status: "Late" },
      { name: "Mia", status: "Absent" },
    ],
  },
  {
    id: 9,
    groupId: 5,
    name: "Omega Strategy",
    date: "06/25/2025",
    attendance: [
      { name: "Nina", status: "Late" },
      { name: "Oscar", status: "Present" },
      { name: "Paul", status: "Present" },
      { name: "Quinn", status: "Absent" },
    ],
  },
  {
    id: 10,
    groupId: 5,
    name: "Omega Wrap-up",
    date: "11/02/2025",
    attendance: [
      { name: "Nina", status: "Present" },
      { name: "Oscar", status: "Late" },
      { name: "Paul", status: "Absent" },
      { name: "Quinn", status: "Present" },
    ],
  },
  {
    id: 11,
    groupId: 6,
    name: "New Beginnings",
    date: "03/22/2025",
    attendance: [
      { name: "New Member", status: "Present" },
      { name: "Another Member", status: "Late" },
    ],
  },
  {
    id: 12,
    groupId: 6,
    name: "Growth Session",
    date: "10/30/2025",
    attendance: [
      { name: "New Member", status: "Late" },
      { name: "Another Member", status: "Present" },
    ],
  },
];

// ------------------ Groups ------------------

// Get all groups
app.get("/groups", (req, res) => res.json(groups));

// Get single group
app.get("/groups/:id", (req, res) => {
  const group = groups.find((g) => g.id === parseInt(req.params.id));
  group ? res.json(group) : res.status(404).json({ error: "Group not found" });
});

// Create new group
app.post("/groups", (req, res) => {
  const newGroup = { id: Date.now(), members: [], ...req.body };
  groups.push(newGroup);
  res.status(201).json(newGroup);
});

// Update group
app.put("/groups/:id", (req, res) => {
  const idx = groups.findIndex((g) => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Group not found" });

  groups[idx] = { ...groups[idx], ...req.body };
  res.json(groups[idx]);
});

// ------------------ Members ------------------

// Add member to a group
app.post("/groups/:id/members", (req, res) => {
  const group = groups.find((g) => g.id === parseInt(req.params.id));
  if (!group) return res.status(404).json({ error: "Group not found" });

  const newMember = { id: `m-${Date.now()}`, ...req.body };
  group.members.push(newMember);
  res.status(201).json(newMember);
});

// Update member
app.put("/groups/:groupId/members/:memberId", (req, res) => {
  const group = groups.find((g) => g.id === parseInt(req.params.groupId));
  if (!group) return res.status(404).json({ error: "Group not found" });

  const idx = group.members.findIndex((m) => m.id === req.params.memberId);
  if (idx === -1) return res.status(404).json({ error: "Member not found" });

  group.members[idx] = { ...group.members[idx], ...req.body };
  res.json(group.members[idx]);
});

// ------------------ Events ------------------

// Get all events
app.get("/events", (req, res) => res.json(events));

// Get single event
app.get("/events/:id", (req, res) => {
  const event = events.find((e) => e.id === parseInt(req.params.id));
  event ? res.json(event) : res.status(404).json({ error: "Event not found" });
});

// Create event
app.post("/events", (req, res) => {
  const newEvent = { id: Date.now(), attendance: [], ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update event
app.put("/events/:id", (req, res) => {
  const idx = events.findIndex((e) => e.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Event not found" });

  events[idx] = { ...events[idx], ...req.body };
  res.json(events[idx]);
});

// ------------------ Start ------------------
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
