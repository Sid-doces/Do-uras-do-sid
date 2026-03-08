import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("docuras.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    hours TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    city_id INTEGER NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    observations TEXT,
    status TEXT DEFAULT 'Reserva enviada',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    alt TEXT DEFAULT 'Produto'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  -- Ensure columns exist in case table was created with old schema
  PRAGMA table_info(cities);
`);

// Check and add missing columns to cities
const citiesInfo = db.prepare("PRAGMA table_info(cities)").all() as any[];
const columnNames = citiesInfo.map(c => c.name);
if (!columnNames.includes('location')) {
  db.prepare("ALTER TABLE cities ADD COLUMN location TEXT DEFAULT ''").run();
}
if (!columnNames.includes('hours')) {
  db.prepare("ALTER TABLE cities ADD COLUMN hours TEXT DEFAULT ''").run();
}

// Migrate whatsapp_link to whatsapp_number if needed
const whatsappLink = db.prepare("SELECT value FROM settings WHERE key = 'whatsapp_link'").get() as any;
if (whatsappLink) {
  const number = whatsappLink.value.replace('https://wa.me/', '').split('?')[0];
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('whatsapp_number', ?)").run(number);
  db.prepare("DELETE FROM settings WHERE key = 'whatsapp_link'").run();
}

// Default settings
db.exec(`
  INSERT OR IGNORE INTO settings (key, value) VALUES ('pix_key', '000.000.000-00');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('signal_value', '5.00');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('payment_message', 'Para confirmar o pedido é necessário realizar um PIX de sinal. Envie o comprovante via WhatsApp para confirmação.');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('whatsapp_number', '5511992707236');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('instagram_link', 'https://instagram.com/docurasdosid');
  INSERT OR IGNORE INTO settings (key, value) VALUES ('about_text', 'Especializada em doces artesanais e confeitaria premium, a Doçuras do Sid traz o melhor sabor para seus momentos especiais.');

  -- Default images
  INSERT OR IGNORE INTO images (id, url) VALUES (1, 'https://picsum.photos/seed/cake1/600/800');
  INSERT OR IGNORE INTO images (id, url) VALUES (2, 'https://picsum.photos/seed/cake2/600/800');
  INSERT OR IGNORE INTO images (id, url) VALUES (3, 'https://picsum.photos/seed/cake3/600/800');
  INSERT OR IGNORE INTO images (id, url) VALUES (4, 'https://picsum.photos/seed/cake4/600/800');

  -- Default products
  INSERT OR IGNORE INTO products (id, name, price) VALUES (1, 'Torta de Manteiga Escocesa 150g', '15.00');
  INSERT OR IGNORE INTO products (id, name, price) VALUES (2, 'Torta de Manteiga Escocesa 200g', '20.00');
  INSERT OR IGNORE INTO products (id, name, price) VALUES (3, 'Torta de Manteiga Escocesa 250g', '25.00');
  INSERT OR IGNORE INTO products (id, name, price) VALUES (4, 'Kit 5 unidades (150g cada)', '67.50');
  INSERT OR IGNORE INTO products (id, name, price) VALUES (5, 'Kit 5 unidades (200g cada)', '95.00');
  INSERT OR IGNORE INTO products (id, name, price) VALUES (6, 'Kit 5 unidades (250g cada)', '112.50');
`);

// Force update if it's the old default
db.prepare("UPDATE settings SET value = '5511992707236' WHERE key = 'whatsapp_number' AND value = '5500000000000'").run();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // API Routes - Cities
  app.get("/api/cities", (req, res) => {
    try {
      const cities = db.prepare("SELECT * FROM cities ORDER BY name ASC").all();
      res.json(cities);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/cities", (req, res) => {
    const { name, location, hours } = req.body;
    try {
      const info = db.prepare("INSERT INTO cities (name, location, hours) VALUES (?, ?, ?)").run(name, location, hours);
      res.json({ id: info.lastInsertRowid, name, location, hours });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/cities/:id", (req, res) => {
    const { name, location, hours } = req.body;
    try {
      db.prepare("UPDATE cities SET name = ?, location = ?, hours = ? WHERE id = ?").run(name, location, hours, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/cities/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM cities WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // API Routes - Reservations
  app.get("/api/reservations", (req, res) => {
    try {
      const reservations = db.prepare(`
        SELECT r.*, c.name as city_name, c.location as city_location, c.hours as city_hours
        FROM reservations r 
        JOIN cities c ON r.city_id = c.id 
        ORDER BY r.created_at DESC
      `).all();
      res.json(reservations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reservations", (req, res) => {
    const { name, whatsapp, city_id, product, quantity, observations } = req.body;
    if (!name || !whatsapp || !city_id || !product || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const info = db.prepare(`
        INSERT INTO reservations (name, whatsapp, city_id, product, quantity, observations) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, whatsapp, city_id, product, quantity, observations);
      res.json({ id: info.lastInsertRowid });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch("/api/reservations/:id/status", (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // API Routes - Images
  app.get("/api/images", (req, res) => {
    try {
      const images = db.prepare("SELECT * FROM images ORDER BY id ASC").all();
      res.json(images);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/images/:id", (req, res) => {
    const { url } = req.body;
    try {
      db.prepare("UPDATE images SET url = ? WHERE id = ?").run(url, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // API Routes - Products
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products ORDER BY id ASC").all();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/products", (req, res) => {
    const { name, price, description } = req.body;
    try {
      const info = db.prepare("INSERT INTO products (name, price, description) VALUES (?, ?, ?)").run(name, price, description);
      res.json({ id: info.lastInsertRowid, name, price, description });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/products/:id", (req, res) => {
    const { name, price, description } = req.body;
    try {
      db.prepare("UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?").run(name, price, description, req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // API Routes - Settings
  app.get("/api/settings", (req, res) => {
    try {
      const settings = db.prepare("SELECT * FROM settings").all();
      const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      res.json(settingsObj);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    try {
      const update = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
      const transaction = db.transaction((data) => {
        for (const [key, value] of Object.entries(data)) {
          update.run(key, value);
        }
      });
      transaction(settings);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
