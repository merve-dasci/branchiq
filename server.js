import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Helper function to read DB
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return {
      users: parsed.users || [],
      branches: parsed.branches || [],
      menuItems: parsed.menuItems || [],
      orders: parsed.orders || [],
      staff: parsed.staff || [],
      announcements: parsed.announcements || [],
      inventory: parsed.inventory || [],
      reservations: parsed.reservations || [],
      tables: parsed.tables || [],
      campaigns: parsed.campaigns || [],
      reports: parsed.reports || []
    };
  } catch (error) {
    console.error("Error reading db.json, returning empty template", error);
    return { 
      users: [], 
      branches: [], 
      menuItems: [], 
      orders: [], 
      staff: [], 
      announcements: [],
      inventory: [],
      reservations: [],
      tables: [],
      campaigns: [],
      reports: []
    };
  }
}

// Helper function to write DB
async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// API Routes
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const db = await readDB();
  const user = db.users.find((u) => u.email === email && String(u.password) === String(password));
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});

// Users REST
app.get("/api/users", async (req, res) => {
  const db = await readDB();
  res.json(db.users);
});

// Branches REST
app.get("/api/branches", async (req, res) => {
  const db = await readDB();
  res.json(db.branches);
});

app.post("/api/branches", async (req, res) => {
  const db = await readDB();
  const newBranch = { id: "b" + (db.branches.length + 1), ...req.body };
  db.branches.push(newBranch);
  await writeDB(db);
  res.status(201).json(newBranch);
});

app.put("/api/branches/:id", async (req, res) => {
  const db = await readDB();
  const index = db.branches.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    db.branches[index] = { ...db.branches[index], ...req.body };
    await writeDB(db);
    res.json(db.branches[index]);
  } else {
    res.status(404).json({ message: "Branch not found" });
  }
});

app.delete("/api/branches/:id", async (req, res) => {
  const db = await readDB();
  db.branches = db.branches.filter((b) => b.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Menu Items REST
app.get("/api/menuItems", async (req, res) => {
  const db = await readDB();
  res.json(db.menuItems);
});

app.post("/api/menuItems", async (req, res) => {
  const db = await readDB();
  const newItem = { id: "m" + (db.menuItems.length + 1), ...req.body };
  db.menuItems.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

app.put("/api/menuItems/:id", async (req, res) => {
  const db = await readDB();
  const index = db.menuItems.findIndex((m) => m.id === req.params.id);
  if (index !== -1) {
    db.menuItems[index] = { ...db.menuItems[index], ...req.body };
    await writeDB(db);
    res.json(db.menuItems[index]);
  } else {
    res.status(404).json({ message: "Menu item not found" });
  }
});

app.delete("/api/menuItems/:id", async (req, res) => {
  const db = await readDB();
  db.menuItems = db.menuItems.filter((m) => m.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Orders REST
app.get("/api/orders", async (req, res) => {
  const db = await readDB();
  res.json(db.orders);
});

app.post("/api/orders", async (req, res) => {
  const db = await readDB();
  const newOrder = { id: "ord-" + (1000 + db.orders.length + 1), ...req.body };
  db.orders.push(newOrder);
  await writeDB(db);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id", async (req, res) => {
  const db = await readDB();
  const index = db.orders.findIndex((o) => o.id === req.params.id);
  if (index !== -1) {
    db.orders[index] = { ...db.orders[index], ...req.body };
    await writeDB(db);
    res.json(db.orders[index]);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  const db = await readDB();
  db.orders = db.orders.filter((o) => o.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Staff REST
app.get("/api/staff", async (req, res) => {
  const db = await readDB();
  res.json(db.staff);
});

app.post("/api/staff", async (req, res) => {
  const db = await readDB();
  const newStaff = { id: "s" + (db.staff.length + 1), ...req.body };
  db.staff.push(newStaff);
  await writeDB(db);
  res.status(201).json(newStaff);
});

app.put("/api/staff/:id", async (req, res) => {
  const db = await readDB();
  const index = db.staff.findIndex((s) => s.id === req.params.id);
  if (index !== -1) {
    db.staff[index] = { ...db.staff[index], ...req.body };
    await writeDB(db);
    res.json(db.staff[index]);
  } else {
    res.status(404).json({ message: "Staff member not found" });
  }
});

app.delete("/api/staff/:id", async (req, res) => {
  const db = await readDB();
  db.staff = db.staff.filter((s) => s.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Announcements REST
app.get("/api/announcements", async (req, res) => {
  const db = await readDB();
  res.json(db.announcements);
});

app.post("/api/announcements", async (req, res) => {
  const db = await readDB();
  const newAnn = { id: "a" + (db.announcements.length + 1), ...req.body };
  db.announcements.unshift(newAnn);
  await writeDB(db);
  res.status(201).json(newAnn);
});

app.delete("/api/announcements/:id", async (req, res) => {
  const db = await readDB();
  db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Inventory REST
app.get("/api/inventory", async (req, res) => {
  const db = await readDB();
  res.json(db.inventory);
});

app.post("/api/inventory", async (req, res) => {
  const db = await readDB();
  const newItem = { id: "inv-" + (db.inventory.length + 1), ...req.body };
  db.inventory.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

app.put("/api/inventory/:id", async (req, res) => {
  const db = await readDB();
  const index = db.inventory.findIndex((i) => i.id === req.params.id);
  if (index !== -1) {
    db.inventory[index] = { ...db.inventory[index], ...req.body };
    await writeDB(db);
    res.json(db.inventory[index]);
  } else {
    res.status(404).json({ message: "Inventory item not found" });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  const db = await readDB();
  db.inventory = db.inventory.filter((i) => i.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Reservations REST
app.get("/api/reservations", async (req, res) => {
  const db = await readDB();
  res.json(db.reservations);
});

app.post("/api/reservations", async (req, res) => {
  const db = await readDB();
  const newRes = { id: "res-" + (100 + db.reservations.length + 1), ...req.body };
  db.reservations.push(newRes);
  await writeDB(db);
  res.status(201).json(newRes);
});

app.put("/api/reservations/:id", async (req, res) => {
  const db = await readDB();
  const index = db.reservations.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.reservations[index] = { ...db.reservations[index], ...req.body };
    await writeDB(db);
    res.json(db.reservations[index]);
  } else {
    res.status(404).json({ message: "Reservation not found" });
  }
});

app.delete("/api/reservations/:id", async (req, res) => {
  const db = await readDB();
  db.reservations = db.reservations.filter((r) => r.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Tables REST
app.get("/api/tables", async (req, res) => {
  const db = await readDB();
  res.json(db.tables);
});

app.post("/api/tables", async (req, res) => {
  const db = await readDB();
  const newTable = { id: "t-" + (db.tables.length + 1), ...req.body };
  db.tables.push(newTable);
  await writeDB(db);
  res.status(201).json(newTable);
});

app.put("/api/tables/:id", async (req, res) => {
  const db = await readDB();
  const index = db.tables.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.tables[index] = { ...db.tables[index], ...req.body };
    await writeDB(db);
    res.json(db.tables[index]);
  } else {
    res.status(404).json({ message: "Table not found" });
  }
});

app.delete("/api/tables/:id", async (req, res) => {
  const db = await readDB();
  db.tables = db.tables.filter((t) => t.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Campaigns REST
app.get("/api/campaigns", async (req, res) => {
  const db = await readDB();
  res.json(db.campaigns);
});

app.post("/api/campaigns", async (req, res) => {
  const db = await readDB();
  const newCamp = { id: "camp-" + (db.campaigns.length + 1), ...req.body };
  db.campaigns.push(newCamp);
  await writeDB(db);
  res.status(201).json(newCamp);
});

app.put("/api/campaigns/:id", async (req, res) => {
  const db = await readDB();
  const index = db.campaigns.findIndex((c) => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index] = { ...db.campaigns[index], ...req.body };
    await writeDB(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ message: "Campaign not found" });
  }
});

app.delete("/api/campaigns/:id", async (req, res) => {
  const db = await readDB();
  db.campaigns = db.campaigns.filter((c) => c.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Reports REST
app.get("/api/reports", async (req, res) => {
  const db = await readDB();
  res.json(db.reports);
});

app.post("/api/reports", async (req, res) => {
  const db = await readDB();
  const newReport = { id: "rep-" + (db.reports.length + 1), ...req.body };
  db.reports.push(newReport);
  await writeDB(db);
  res.status(201).json(newReport);
});

app.put("/api/reports/:id", async (req, res) => {
  const db = await readDB();
  const index = db.reports.findIndex((r) => r.id === req.params.id);
  if (index !== -1) {
    db.reports[index] = { ...db.reports[index], ...req.body };
    await writeDB(db);
    res.json(db.reports[index]);
  } else {
    res.status(404).json({ message: "Report not found" });
  }
});

app.delete("/api/reports/:id", async (req, res) => {
  const db = await readDB();
  db.reports = db.reports.filter((r) => r.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// Start server with Vite middleware integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
