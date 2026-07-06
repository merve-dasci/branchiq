// Express web çatısını içe aktar (HTTP isteklerini ve API yönlendirmelerini yönetmek için)
import express from "express";
// Dosya yolları işlemleri için dahili Node.js 'path' kütüphanesini ekle
import path from "path";
// Yerel dosyaları asenkron okuma/yazma (Promise tabanlı) yapmak için 'fs' kütüphanesini ekle
import fs from "fs/promises";
// Frontend (React) kodlarını derleyip sunan Vite geliştirme sunucusunu içe aktar
import { createServer as createViteServer } from "vite";

// Express uygulamasını oluştur
const app = express();
// Sunucunun çalışacağı port numarasını belirle
const PORT = process.env.PORT || 3000;
// Veritabanı olarak kullanacağımız db.json dosyasının mutlak yolunu tanımla
const DB_FILE = path.join(process.cwd(), "db.json");

// Gelen isteklerin gövdesindeki (body) JSON verilerini okuyabilmek için express.json ara katmanını ekle
app.use(express.json());

// API İsteklerini sıraya sokan (request queue) ara katman yazılımı
// Dosya tabanlı veritabanında eş zamanlı yazma (race condition) ve dosya bozulmalarını önler
let apiQueue = Promise.resolve();
app.use("/api", (req, res, next) => {
  apiQueue = apiQueue.then(() => {
    return new Promise((resolve) => {
      // res.end çağrısını yakalayarak isteğin bittiğini tespit et ve sıradaki isteği başlat
      const originalEnd = res.end;
      res.end = function (...args) {
        originalEnd.apply(this, args);
        resolve();
      };

      // Bağlantı kopması veya hata durumlarını da ele al
      res.on("close", resolve);

      next();
    });
  });
});

// Veritabanı dosyasını (db.json) okuyup JSON nesnesine çeviren yardımcı fonksiyon
async function readDB() {
  try {
    // db.json dosyasını UTF-8 formatında oku
    const data = await fs.readFile(DB_FILE, "utf-8");
    // Okunan metin verisini JSON nesnesine parse et
    const parsed = JSON.parse(data);
    // Veritabanındaki tüm koleksiyonları güvenli varsayılan değerlerle (boş dizi) döndür
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
    if (error.code === 'ENOENT') {
      // db.json dosya bulunamazsa boş şablon döndür (ilk oluşturma için)
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
    // JSON ayrıştırma/format veya diğer kritik hatalarda hata fırlat (veri kaybını önlemek için)
    console.error("Critical error reading db.json (corrupted data):", error);
    throw error;
  }
}

// Güncellenmiş verileri db.json dosyasına yazıp kaydeden yardımcı fonksiyon
async function writeDB(data) {
  // JSON verilerini 2 karakter boşluk girintili (readable format) şekilde dosyaya kaydet
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// --- API YÖNLENDİRMELERİ (API ROUTES) ---

// Kullanıcı Giriş (Login) API Uç Noktası
app.post("/api/login", async (req, res) => {
  // İstek gövdesinden e-posta ve şifreyi al
  const { email, password } = req.body;
  // Güncel veritabanını oku
  const db = await readDB();
  // Veritabanında eşleşen e-posta ve şifreye sahip kullanıcıyı ara
  const user = db.users.find((u) => u.email === email && String(u.password) === String(password));

  if (user) {
    // Kullanıcı bulunduysa başarılı yanıtı ve kullanıcı bilgilerini dön
    res.json({ success: true, user });
  } else {
    // Bulunamadıysa 401 Unauthorized durum kodu ve hata mesajı dön
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});

// --- KULLANICI (USERS) API ---
app.get("/api/users", async (req, res) => {
  const db = await readDB();
  // Tüm kullanıcıları dizi halinde geri gönder
  res.json(db.users);
});

// --- ŞUBE (BRANCHES) API ---
// Tüm Şubeleri Getir
app.get("/api/branches", async (req, res) => {
  const db = await readDB();
  res.json(db.branches);
});

// Yeni Şube Ekle
app.post("/api/branches", async (req, res) => {
  const db = await readDB();
  // Veritabanındaki en yüksek şube sayısal ID değerini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.branches.reduce((max, b) => {
    const num = parseInt(b.id.replace('b', '')) || 0;
    return num > max ? num : max;
  }, 0);
  // Yeni şubeye benzersiz "b{sayı}" formatında ID ata ve veriyi hazırla
  const newBranch = { id: "b" + (maxId + 1), ...req.body };
  // Şubeyi diziye ekle
  db.branches.push(newBranch);
  // Veritabanına kaydet
  await writeDB(db);
  // 201 Created kodu ile eklenen yeni şubeyi dön
  res.status(201).json(newBranch);
});

// Şube Güncelle
app.put("/api/branches/:id", async (req, res) => {
  const db = await readDB();
  // URL parametresindeki ID değerine sahip şubenin dizideki konumunu (index) bul
  const index = db.branches.findIndex((b) => b.id === req.params.id);
  if (index !== -1) {
    // Şubeyi yeni gelen gövde (body) verileriyle güncelle (ID değerini koru)
    db.branches[index] = { ...db.branches[index], ...req.body };
    await writeDB(db);
    res.json(db.branches[index]);
  } else {
    // Şube bulunamadıysa 404 dön
    res.status(404).json({ message: "Branch not found" });
  }
});

// Şube Sil (Devre Dışı Bırak)
app.delete("/api/branches/:id", async (req, res) => {
  const db = await readDB();
  // Parametredeki ID hariç tüm şubeleri filtrele (böylece ilgili şube silinmiş olur)
  db.branches = db.branches.filter((b) => b.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- MENÜ ÜRÜNLERİ (MENU ITEMS) API ---
// Tüm Menü Elemanlarını Getir
app.get("/api/menuItems", async (req, res) => {
  const db = await readDB();
  res.json(db.menuItems);
});

// Yeni Menü Elemanı Ekle
app.post("/api/menuItems", async (req, res) => {
  const db = await readDB();
  // En yüksek sayısal ürün ID'sini hesapla
  const maxId = db.menuItems.reduce((max, m) => {
    const num = parseInt(m.id.replace('m', '')) || 0;
    return num > max ? num : max;
  }, 0);
  // "m{sayı}" formatında benzersiz ID ata
  const newItem = { id: "m" + (maxId + 1), ...req.body };
  db.menuItems.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

// Menü Elemanı Güncelle
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

// Menü Elemanı Sil
app.delete("/api/menuItems/:id", async (req, res) => {
  const db = await readDB();
  db.menuItems = db.menuItems.filter((m) => m.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- SİPARİŞLER (ORDERS) API ---
// Tüm Siparişleri Getir
app.get("/api/orders", async (req, res) => {
  const db = await readDB();
  res.json(db.orders);
});

// Yeni Sipariş Kaydet
app.post("/api/orders", async (req, res) => {
  const db = await readDB();
  // En yüksek sayısal sipariş ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.orders.reduce((max, o) => {
    const num = parseInt(o.id.replace('ord-', '')) || 0;
    return num > max ? num : max;
  }, 1000);
  const newOrder = { id: "ord-" + (maxId + 1), ...req.body };
  db.orders.push(newOrder);
  await writeDB(db);
  res.status(201).json(newOrder);
});

// Sipariş Durumu / Detayı Güncelle (Hazırlanıyor, Teslim Edildi vb.)
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

// Sipariş Sil
app.delete("/api/orders/:id", async (req, res) => {
  const db = await readDB();
  db.orders = db.orders.filter((o) => o.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- ÇALIŞAN PERSONEL (STAFF) API ---
// Tüm Personelleri Getir
app.get("/api/staff", async (req, res) => {
  const db = await readDB();
  res.json(db.staff);
});

// Yeni Personel Kaydet
app.post("/api/staff", async (req, res) => {
  const db = await readDB();
  // En yüksek sayısal personel ID'sini hesapla
  const maxId = db.staff.reduce((max, s) => {
    const num = parseInt(s.id.replace('s', '')) || 0;
    return num > max ? num : max;
  }, 0);
  // "s{sayı}" formatında benzersiz ID ata
  const newStaff = { id: "s" + (maxId + 1), ...req.body };
  db.staff.push(newStaff);
  await writeDB(db);
  res.status(201).json(newStaff);
});

// Personel Güncelle
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

// Personel Sil
app.delete("/api/staff/:id", async (req, res) => {
  const db = await readDB();
  db.staff = db.staff.filter((s) => s.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- DUYURULAR (ANNOUNCEMENTS) API ---
// Tüm Duyuruları Getir
app.get("/api/announcements", async (req, res) => {
  const db = await readDB();
  res.json(db.announcements);
});

// Yeni Duyuru Ekle (Duyuru panosunda en üstte görünmesi için unshift ile dizinin başına ekler)
app.post("/api/announcements", async (req, res) => {
  const db = await readDB();
  // En yüksek sayısal duyuru ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.announcements.reduce((max, a) => {
    const num = parseInt(a.id.replace('a', '')) || 0;
    return num > max ? num : max;
  }, 0);
  const newAnn = { id: "a" + (maxId + 1), ...req.body };
  db.announcements.unshift(newAnn);
  await writeDB(db);
  res.status(201).json(newAnn);
});

// Duyuru Sil
app.delete("/api/announcements/:id", async (req, res) => {
  const db = await readDB();
  db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- STOK ENVANTERİ (INVENTORY) API ---
// Tüm Envanter Listesini Getir
app.get("/api/inventory", async (req, res) => {
  const db = await readDB();
  res.json(db.inventory);
});

// Yeni Envanter Kalemi Ekle
app.post("/api/inventory", async (req, res) => {
  const db = await readDB();
  // En yüksek envanter ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.inventory.reduce((max, i) => {
    const num = parseInt(i.id.replace('inv-', '')) || 0;
    return num > max ? num : max;
  }, 0);
  const newItem = { id: "inv-" + (maxId + 1), ...req.body };
  db.inventory.push(newItem);
  await writeDB(db);
  res.status(201).json(newItem);
});

// Envanter Bilgisi Güncelle (Kritik limit, adet miktarı vb.)
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

// Envanter Kalemi Sil
app.delete("/api/inventory/:id", async (req, res) => {
  const db = await readDB();
  db.inventory = db.inventory.filter((i) => i.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- REZERVASYONLAR (RESERVATIONS) API ---
// Tüm Rezervasyonları Getir
app.get("/api/reservations", async (req, res) => {
  const db = await readDB();
  res.json(db.reservations);
});

// Yeni Rezervasyon Kaydet
app.post("/api/reservations", async (req, res) => {
  const db = await readDB();
  // En yüksek rezervasyon ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.reservations.reduce((max, r) => {
    const num = parseInt(r.id.replace('res-', '')) || 0;
    return num > max ? num : max;
  }, 100);
  const newRes = { id: "res-" + (maxId + 1), ...req.body };
  db.reservations.push(newRes);
  await writeDB(db);
  res.status(201).json(newRes);
});

// Rezervasyon Durumu Güncelle (Onaylandı, Geldi, İptal vb.)
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

// Rezervasyon İptal/Sil
app.delete("/api/reservations/:id", async (req, res) => {
  const db = await readDB();
  db.reservations = db.reservations.filter((r) => r.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- MASALAR (TABLES) API ---
// Tüm Masaların Bilgilerini Getir (Doluluk, Atanan Garson vb.)
app.get("/api/tables", async (req, res) => {
  const db = await readDB();
  res.json(db.tables);
});

// Yeni Masa Tanımla
app.post("/api/tables", async (req, res) => {
  const db = await readDB();
  // En yüksek masa ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.tables.reduce((max, t) => {
    const num = parseInt(t.id.replace('t-', '')) || 0;
    return num > max ? num : max;
  }, 0);
  const newTable = { id: "t-" + (maxId + 1), ...req.body };
  db.tables.push(newTable);
  await writeDB(db);
  res.status(201).json(newTable);
});

// Masa Durumu Güncelle (Boş, Dolu, Rezervli, Temizleniyor)
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

// Masayı Sil
app.delete("/api/tables/:id", async (req, res) => {
  const db = await readDB();
  db.tables = db.tables.filter((t) => t.id !== req.params.id);
  await writeDB(db);
  res.json({ success: true });
});

// --- KAMPANYALAR (CAMPAIGNS) API ---
app.get("/api/campaigns", async (req, res) => {
  const db = await readDB();
  res.json(db.campaigns);
});

app.post("/api/campaigns", async (req, res) => {
  const db = await readDB();
  // En yüksek kampanya ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.campaigns.reduce((max, c) => {
    const num = parseInt(c.id.replace('camp-', '')) || 0;
    return num > max ? num : max;
  }, 0);
  const newCamp = { id: "camp-" + (maxId + 1), ...req.body };
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

// --- RAPORLAR (REPORTS) API ---
app.get("/api/reports", async (req, res) => {
  const db = await readDB();
  res.json(db.reports);
});

app.post("/api/reports", async (req, res) => {
  const db = await readDB();
  // En yüksek rapor ID'sini hesapla (ID çakışmalarını önlemek için)
  const maxId = db.reports.reduce((max, r) => {
    const num = parseInt(r.id.replace('rep-', '')) || 0;
    return num > max ? num : max;
  }, 0);
  const newReport = { id: "rep-" + (maxId + 1), ...req.body };
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

// --- SUNUCU BAŞLATMA VE VITE ENTEGRASYONU ---
async function start() {
  // Eğer sunucu canlı üretim (production) ortamında değilse, geliştirme kolaylığı için Vite'ı entegre et
  if (process.env.NODE_ENV !== "production") {
    // Express içine gömmek üzere bir Vite geliştirme sunucusu nesnesi oluştur
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa", // Tek Sayfa Uygulaması (SPA) yönlendirmelerini etkinleştir
    });
    // Gelen istekleri Vite'ın kendi derleme/yenileme (HMR) ara yazılımlarından geçirmesi için yönlendir
    app.use(vite.middlewares);
  } else {
    // Üretim ortamında ise derlenmiş (dist) klasörünü statik olarak sun
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA yönlendirmeleri için tüm bilinmeyen rotaları index.html'e yönlendir
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Sunucuyu belirtilen portta dinlemeye başla (0.0.0.0 ile dış erişimlere izin verilir)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Sunucuyu başlat
start();
