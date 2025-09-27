// seed.js
require("dotenv").config();
const { Pool } = require("pg");

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

/**
 * Helper to convert "MM/DD/YYYY" -> "YYYY-MM-DD"
 */
function mmddyyyyToIso(mmddyyyy) {
  if (!mmddyyyy) return null;
  const [m, d, y] = mmddyyyy.split("/");
  if (!m || !d || !y) return null;
  // zero-pad
  const mm = m.padStart(2, "0");
  const dd = d.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

/* ====== Replace the arrays below with your provided dummy data ======
   I copied your groups & events data into the arrays for seeding.
   (You can also load from a JSON file if preferred.)
*/

// const GROUPS = [
//   {
//     id: 1,
//     name: "Jace",
//     code: "11111",
//     members: [
//       {
//         /* note: we ignore original string IDs and let DB assign numeric ids */
//         fullName: "Alice",
//         nickname: "Ali",
//         contact: "0917-111-1111",
//         address: "123 Mango St.",
//         invitedBy: "Jace",
//         notes: "Prefers morning check-ins.",
//         one2one: 4,
//       },
//       {
//         fullName: "Bob",
//         nickname: "Bobby",
//         contact: "0917-222-2222",
//         address: "45 Pine Ave.",
//         invitedBy: "Jace",
//         notes: "",
//         one2one: 3,
//       },
//       {
//         fullName: "Charlie",
//         nickname: "Char",
//         contact: "0917-333-3333",
//         address: "7 Oak Lane",
//         invitedBy: "Jace",
//         notes: "Needs follow-up re: schedule.",
//         one2one: 5,
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Josh",
//     code: "22222",
//     members: [
//       {
//         fullName: "David",
//         nickname: "Dave",
//         contact: "0917-444-4444",
//         address: "10 River Rd.",
//         invitedBy: "Josh",
//         notes: "",
//         one2one: 6,
//       },
//       {
//         fullName: "Eve",
//         nickname: "Evie",
//         contact: "0917-555-5555",
//         address: "88 Hill St.",
//         invitedBy: "Josh",
//         notes: "On vacation next week.",
//         one2one: 4,
//       },
//       {
//         fullName: "Frank",
//         nickname: "Franky",
//         contact: "0917-666-6666",
//         address: "300 Bay Blvd.",
//         invitedBy: "Josh",
//         notes: "",
//         one2one: 2,
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Tim",
//     code: "33333",
//     members: [
//       {
//         fullName: "Grace",
//         nickname: "Grace",
//         contact: "0917-777-7777",
//         address: "21 Center St.",
//         invitedBy: "Tim",
//         notes: "",
//         one2one: 5,
//       },
//       {
//         fullName: "Heidi",
//         nickname: "Hei",
//         contact: "0917-888-8888",
//         address: "14 Market Rd.",
//         invitedBy: "Tim",
//         notes: "",
//         one2one: 3,
//       },
//       {
//         fullName: "Ivan",
//         nickname: "Ivy",
//         contact: "0917-999-9999",
//         address: "5 Lake Ave.",
//         invitedBy: "Tim",
//         notes: "",
//         one2one: 4,
//       },
//       {
//         fullName: "Judy",
//         nickname: "Jude",
//         contact: "0917-000-0000",
//         address: "2 Sunset Blvd.",
//         invitedBy: "Tim",
//         notes: "",
//         one2one: 6,
//       },
//     ],
//   },
//   {
//     id: 4,
//     name: "Evan",
//     code: "44444",
//     members: [
//       {
//         fullName: "Karl",
//         nickname: "K",
//         contact: "0918-111-1111",
//         address: "9 Forest Rd.",
//         invitedBy: "Evan",
//         notes: "",
//         one2one: 2,
//       },
//       {
//         fullName: "Liam",
//         nickname: "Lee",
//         contact: "0918-222-2222",
//         address: "12 Palm St.",
//         invitedBy: "Evan",
//         notes: "",
//         one2one: 3,
//       },
//       {
//         fullName: "Mia",
//         nickname: "M",
//         contact: "0918-333-3333",
//         address: "33 Harbor Ln.",
//         invitedBy: "Evan",
//         notes: "Has mobility concerns.",
//         one2one: 7,
//       },
//     ],
//   },
//   {
//     id: 5,
//     name: "Isaac",
//     code: "55555",
//     members: [
//       {
//         fullName: "Nina",
//         nickname: "Nin",
//         contact: "0918-444-4444",
//         address: "77 Orchard Rd.",
//         invitedBy: "Isaac",
//         notes: "",
//         one2one: 6,
//       },
//       {
//         fullName: "Oscar",
//         nickname: "Oz",
//         contact: "0918-555-5555",
//         address: "8 Ridge St.",
//         invitedBy: "Isaac",
//         notes: "",
//         one2one: 5,
//       },
//       {
//         fullName: "Paul",
//         nickname: "Pauly",
//         contact: "0918-666-6666",
//         address: "101 Elm St.",
//         invitedBy: "Isaac",
//         notes: "",
//         one2one: 4,
//       },
//       {
//         fullName: "Quinn",
//         nickname: "Q",
//         contact: "0918-777-7777",
//         address: "200 Cedar Ln.",
//         invitedBy: "Isaac",
//         notes: "",
//         one2one: 3,
//       },
//     ],
//   },
//   {
//     id: 6,
//     name: "John",
//     code: "66666",
//     members: [
//       {
//         fullName: "New Member",
//         nickname: "Newbie",
//         contact: "0918-888-8888",
//         address: "1 New St.",
//         invitedBy: "Leader",
//         notes: "",
//         one2one: 4,
//       },
//       {
//         fullName: "Another Member",
//         nickname: "Another",
//         contact: "0918-999-9999",
//         address: "2 Another St.",
//         invitedBy: "Leader",
//         notes: "",
//         one2one: 5,
//       },
//     ],
//   },
// ];

// const EVENTS = [
//   {
//     id: 1,
//     groupId: 1,
//     name: "Alpha Kickoff",
//     date: "01/15/2025",
//     attendance: [
//       { name: "Alice", status: "Present" },
//       { name: "Bob", status: "Late" },
//       { name: "Charlie", status: "Absent" },
//     ],
//   },
//   {
//     id: 2,
//     groupId: 1,
//     name: "Alpha Weekly",
//     date: "03/10/2025",
//     attendance: [
//       { name: "Alice", status: "Late" },
//       { name: "Bob", status: "Present" },
//       { name: "Charlie", status: "Present" },
//     ],
//   },
//   {
//     id: 3,
//     groupId: 2,
//     name: "Beta Sync",
//     date: "02/05/2025",
//     attendance: [
//       { name: "David", status: "Present" },
//       { name: "Eve", status: "Absent" },
//       { name: "Frank", status: "Late" },
//     ],
//   },
//   {
//     id: 4,
//     groupId: 2,
//     name: "Beta Retrospective",
//     date: "07/20/2025",
//     attendance: [
//       { name: "David", status: "Late" },
//       { name: "Eve", status: "Present" },
//       { name: "Frank", status: "Present" },
//     ],
//   },
//   {
//     id: 5,
//     groupId: 3,
//     name: "Gamma Planning",
//     date: "04/12/2025",
//     attendance: [
//       { name: "Grace", status: "Present" },
//       { name: "Heidi", status: "Present" },
//       { name: "Ivan", status: "Absent" },
//       { name: "Judy", status: "Late" },
//     ],
//   },
//   {
//     id: 6,
//     groupId: 3,
//     name: "Gamma Review",
//     date: "09/18/2025",
//     attendance: [
//       { name: "Grace", status: "Late" },
//       { name: "Heidi", status: "Absent" },
//       { name: "Ivan", status: "Present" },
//       { name: "Judy", status: "Present" },
//     ],
//   },
//   {
//     id: 7,
//     groupId: 4,
//     name: "Delta Training",
//     date: "05/09/2025",
//     attendance: [
//       { name: "Karl", status: "Absent" },
//       { name: "Liam", status: "Present" },
//       { name: "Mia", status: "Present" },
//     ],
//   },
//   {
//     id: 8,
//     groupId: 4,
//     name: "Delta Simulation",
//     date: "08/14/2025",
//     attendance: [
//       { name: "Karl", status: "Present" },
//       { name: "Liam", status: "Late" },
//       { name: "Mia", status: "Absent" },
//     ],
//   },
//   {
//     id: 9,
//     groupId: 5,
//     name: "Omega Strategy",
//     date: "06/25/2025",
//     attendance: [
//       { name: "Nina", status: "Late" },
//       { name: "Oscar", status: "Present" },
//       { name: "Paul", status: "Present" },
//       { name: "Quinn", status: "Absent" },
//     ],
//   },
//   {
//     id: 10,
//     groupId: 5,
//     name: "Omega Wrap-up",
//     date: "11/02/2025",
//     attendance: [
//       { name: "Nina", status: "Present" },
//       { name: "Oscar", status: "Late" },
//       { name: "Paul", status: "Absent" },
//       { name: "Quinn", status: "Present" },
//     ],
//   },
//   {
//     id: 11,
//     groupId: 6,
//     name: "New Beginnings",
//     date: "03/22/2025",
//     attendance: [
//       { name: "New Member", status: "Present" },
//       { name: "Another Member", status: "Late" },
//     ],
//   },
//   {
//     id: 12,
//     groupId: 6,
//     name: "Growth Session",
//     date: "10/30/2025",
//     attendance: [
//       { name: "New Member", status: "Late" },
//       { name: "Another Member", status: "Present" },
//     ],
//   },
// ];

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code VARCHAR(32)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        full_name TEXT,
        nickname TEXT,
        contact TEXT,
        address TEXT,
        invited_by TEXT,
        notes TEXT,
        one2one SMALLINT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        name TEXT,
        date DATE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
        attendee_name TEXT,
        status VARCHAR(16) NOT NULL CHECK (status IN ('Present','Absent','Late'))
      );
    `);

    // optional: wipe existing data (uncomment if you want fresh seed)
    await client.query("DELETE FROM attendance");
    await client.query("DELETE FROM events");
    await client.query("DELETE FROM members");
    await client.query("DELETE FROM groups");

    // insert groups & members, keep map oldGroupId -> newGroupId
    const groupIdMap = new Map(); // old id -> new id
    for (const g of GROUPS) {
      const res = await client.query(
        `INSERT INTO groups (name, code) VALUES ($1,$2) RETURNING id`,
        [g.name, g.code]
      );
      const newGroupId = res.rows[0].id;
      groupIdMap.set(g.id, newGroupId);

      // insert members
      for (const m of g.members) {
        await client.query(
          `INSERT INTO members (group_id, full_name, nickname, contact, address, invited_by, notes, one2one)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [
            newGroupId,
            m.fullName,
            m.nickname,
            m.contact,
            m.address,
            m.invitedBy,
            m.notes,
            m.one2one,
          ]
        );
      }
    }

    // insert events and attendance
    for (const ev of EVENTS) {
      const groupId = groupIdMap.get(ev.groupId);
      const evDate = mmddyyyyToIso(ev.date);
      const evRes = await client.query(
        `INSERT INTO events (group_id, name, date) VALUES ($1,$2,$3) RETURNING id`,
        [groupId, ev.name, evDate]
      );
      const newEventId = evRes.rows[0].id;

      // insert attendance rows: try to match member by full_name within the same group
      for (const a of ev.attendance) {
        // find member id
        const memberRes = await client.query(
          `SELECT id FROM members WHERE group_id = $1 AND full_name = $2 LIMIT 1`,
          [groupId, a.name]
        );

        if (memberRes.rowCount > 0) {
          const memberId = memberRes.rows[0].id;
          await client.query(
            `INSERT INTO attendance (event_id, member_id, attendee_name, status) VALUES ($1,$2,$3,$4)`,
            [newEventId, memberId, null, a.status]
          );
        } else {
          // store name only
          await client.query(
            `INSERT INTO attendance (event_id, member_id, attendee_name, status) VALUES ($1, NULL, $2,$3)`,
            [newEventId, a.name, a.status]
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log("✅ Seed complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
