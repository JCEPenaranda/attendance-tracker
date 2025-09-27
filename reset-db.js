// reset-db.js
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // important for Render external connections
});

/**
 * Helper: Convert "MM/DD/YYYY" -> "YYYY-MM-DD"
 */
function mmddyyyyToIso(mmddyyyy) {
  if (!mmddyyyy) return null;
  const [m, d, y] = mmddyyyy.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// ===== Dummy data (same as seed.js) =====
const GROUPS = [
  {
    id: 1,
    name: "Jace",
    code: "11111",
    members: [
      {
        fullName: "Alice",
        nickname: "Ali",
        contact: "0917-111-1111",
        address: "123 Mango St.",
        invitedBy: "Jace",
        notes: "Prefers morning check-ins.",
        one2one: 4,
      },
      {
        fullName: "Bob",
        nickname: "Bobby",
        contact: "0917-222-2222",
        address: "45 Pine Ave.",
        invitedBy: "Jace",
        notes: "",
        one2one: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Josh",
    code: "22222",
    members: [
      {
        fullName: "David",
        nickname: "Dave",
        contact: "0917-444-4444",
        address: "10 River Rd.",
        invitedBy: "Josh",
        notes: "",
        one2one: 6,
      },
    ],
  },
];

const EVENTS = [
  {
    id: 1,
    groupId: 1,
    name: "Alpha Kickoff",
    date: "01/15/2025",
    attendance: [
      { name: "Alice", status: "Present" },
      { name: "Bob", status: "Late" },
    ],
  },
];

async function reset() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("🔄 Dropping existing tables...");
    await client.query(
      `DROP TABLE IF EXISTS attendance, events, members, groups CASCADE;`
    );

    console.log("📦 Recreating schema...");
    await client.query(`
      CREATE TABLE groups (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code VARCHAR(32)
      );
    `);

    await client.query(`
      CREATE TABLE members (
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
      CREATE TABLE events (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        name TEXT,
        date DATE
      );
    `);

    await client.query(`
      CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
        attendee_name TEXT,
        status VARCHAR(16) NOT NULL CHECK (status IN ('Present','Absent','Late'))
      );
    `);

    console.log("🌱 Seeding groups and members...");
    const groupIdMap = new Map();

    for (const g of GROUPS) {
      const res = await client.query(
        `INSERT INTO groups (name, code) VALUES ($1, $2) RETURNING id`,
        [g.name, g.code]
      );
      const newGroupId = res.rows[0].id;
      groupIdMap.set(g.id, newGroupId);

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

    console.log("🌱 Seeding events and attendance...");
    for (const ev of EVENTS) {
      const groupId = groupIdMap.get(ev.groupId);
      const evRes = await client.query(
        `INSERT INTO events (group_id, name, date) VALUES ($1,$2,$3) RETURNING id`,
        [groupId, ev.name, mmddyyyyToIso(ev.date)]
      );
      const newEventId = evRes.rows[0].id;

      for (const a of ev.attendance) {
        const memberRes = await client.query(
          `SELECT id FROM members WHERE group_id=$1 AND full_name=$2 LIMIT 1`,
          [groupId, a.name]
        );

        if (memberRes.rowCount > 0) {
          await client.query(
            `INSERT INTO attendance (event_id, member_id, status) VALUES ($1,$2,$3)`,
            [newEventId, memberRes.rows[0].id, a.status]
          );
        } else {
          await client.query(
            `INSERT INTO attendance (event_id, attendee_name, status) VALUES ($1,$2,$3)`,
            [newEventId, a.name, a.status]
          );
        }
      }
    }

    await client.query("COMMIT");
    console.log("✅ Database reset and seeded successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Reset failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
