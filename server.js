require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const pool = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("✅ Backend API (Postgres) is running");
});

/* ------------------ GROUPS ------------------ */

// Get all groups
app.get("/groups", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM groups ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single group
app.get("/groups/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM groups WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Group not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create group
app.post("/groups", async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update group
app.put("/groups/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      "UPDATE groups SET name=$1, description=$2 WHERE id=$3 RETURNING *",
      [name, description, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Group not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete group
app.delete("/groups/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM groups WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Group not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ MEMBERS ------------------ */

// Add member to group
app.post("/groups/:id/members", async (req, res) => {
  try {
    const { nickname, journey } = req.body;
    const result = await pool.query(
      "INSERT INTO members (group_id, nickname, journey) VALUES ($1, $2, $3) RETURNING *",
      [req.params.id, nickname, journey]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update member
app.put("/groups/:groupId/members/:memberId", async (req, res) => {
  try {
    const { nickname, journey } = req.body;
    const result = await pool.query(
      "UPDATE members SET nickname=$1, journey=$2 WHERE id=$3 AND group_id=$4 RETURNING *",
      [nickname, journey, req.params.memberId, req.params.groupId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Member not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete member
app.delete("/groups/:groupId/members/:memberId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM members WHERE id=$1 AND group_id=$2 RETURNING *",
      [req.params.memberId, req.params.groupId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Member not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ EVENTS ------------------ */

// Get all events
app.get("/events", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create event
app.post("/events", async (req, res) => {
  try {
    const { name, date } = req.body;
    const result = await pool.query(
      "INSERT INTO events (name, date) VALUES ($1, $2) RETURNING *",
      [name, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
app.put("/events/:id", async (req, res) => {
  try {
    const { name, date } = req.body;
    const result = await pool.query(
      "UPDATE events SET name=$1, date=$2 WHERE id=$3 RETURNING *",
      [name, date, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Event not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
app.delete("/events/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Event not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ ATTENDANCE ------------------ */

// Get attendance for an event
app.get("/events/:eventId/attendance", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.status, m.nickname, m.group_id
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       WHERE a.event_id = $1
       ORDER BY m.nickname ASC`,
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add/update attendance for a member in an event
app.post("/events/:eventId/attendance", async (req, res) => {
  try {
    const { member_id, status } = req.body;

    // Check if attendance already exists
    const existing = await pool.query(
      "SELECT * FROM attendance WHERE event_id=$1 AND member_id=$2",
      [req.params.eventId, member_id]
    );

    if (existing.rows.length > 0) {
      // Update
      const updated = await pool.query(
        "UPDATE attendance SET status=$1 WHERE event_id=$2 AND member_id=$3 RETURNING *",
        [status, req.params.eventId, member_id]
      );
      return res.json(updated.rows[0]);
    } else {
      // Insert
      const inserted = await pool.query(
        "INSERT INTO attendance (event_id, member_id, status) VALUES ($1, $2, $3) RETURNING *",
        [req.params.eventId, member_id, status]
      );
      return res.status(201).json(inserted.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete attendance record
app.delete("/events/:eventId/attendance/:attendanceId", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM attendance WHERE id=$1 AND event_id=$2 RETURNING *",
      [req.params.attendanceId, req.params.eventId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Attendance not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ START ------------------ */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
