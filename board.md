---

### 1. Fast movers vs slow movers

**Insight:**
Cari tahu produk mana yang sering terjual (fast movers) dan mana yang jarang laku (slow movers) dalam periode tertentu → membantu prioritas stok dan promosi.

**Rumus:**

* **Sales frequency** = `jumlah transaksi per produk dalam periode X`
* Data yang dibutuhkan: `TransactionItem.quantity` (sudah ada)
* Tidak perlu field baru, cukup query agregasi.

**Visualisasi:**

* **Bar chart**: produk diurutkan dari frekuensi tertinggi ke terendah
* Tambahkan threshold (misalnya top 20% = fast movers, bottom 20% = slow movers)

**Impact:**

* Fast movers → harus cepat restock
* Slow movers → kandidat untuk diskon/clearance
* Bisa dipakai juga untuk keputusan display toko (produk high turnover ditempatkan di rak depan).

---

### 2. Stock vs sales velocity

**Insight:**
Lihat apakah stok produk bisa mencukupi jika kecepatan penjualan saat ini berlanjut → deteksi risiko kehabisan stok.

**Rumus:**

- **Sales velocity (per hari)** = `total quantity terjual dalam X hari ÷ X`
- **Days to zero stock** = `stock ÷ sales velocity`
- Data yang dibutuhkan: `Product.stock` (sudah ada) + `TransactionItem.quantity`
- Tidak perlu field baru, bisa dihitung dari data sekarang.

**Visualisasi:**

- **Table atau gauge chart**: Days to zero stock per produk
- Highlight jika < 7 hari (misalnya warna merah).

**Impact:**

- Langsung tahu produk mana yang butuh restock cepat
- Bisa hindari stock-out yang bikin pelanggan kecewa.

---

### 3. Margin vs volume performance

**Insight:**
Produk bisa laku keras tapi margin tipis → penting cek profitability per item.

**Rumus:**

- **Profit per product** = `(sell_price – cost_price – tax – discount) × quantity`
- **Margin per unit (%)** = `(sell_price – cost_price – tax – discount) ÷ sell_price`
- Data sudah ada di `TransactionItem` (tidak perlu field baru).

**Visualisasi:**

- **Bubble chart:**
  - X-axis: volume penjualan
  - Y-axis: profit margin
  - Bubble size: revenue

- Warna bisa dipakai untuk kategori produk.

**Impact:**

- Lihat produk mana "volume tinggi tapi untung kecil" → bisa dinaikkan harga
- Lihat produk "volume rendah tapi margin gede" → cocok jadi produk premium.

---

### 4. Discount sensitivity / promo effectiveness

**Insight:**
Produk yang penjualannya naik signifikan saat diberi diskon berarti sensitif ke harga → cocok untuk promo reguler.

**Rumus:**

- **Avg sales with discount** vs **Avg sales without discount** per produk
- Data: `TransactionItem.discount` dan `quantity` (sudah ada)
- Tidak perlu field baru.

**Visualisasi:**

- **Clustered bar chart** per produk (with vs without discount)
- Atau **% uplift chart**: ((sales with discount – sales without discount)/sales without discount) × 100%

**Impact:**

- Tentukan produk mana yang _wajib_ dipromokan untuk meningkatkan volume
- Jangan buang diskon untuk produk yang sudah laku tanpa promo.

---

### 5. Tax contribution per product

**Insight:**
Lihat produk mana yang memberi kontribusi pajak terbesar → berguna untuk pelaporan dan strategi pricing.

**Rumus:**

- **Tax per product** = `tax_rate × sell_price × quantity`
- Data: `TransactionItem.tax_rate`, `sell_price`, `quantity` (sudah ada).

**Visualisasi:**

- **Stacked bar chart**: kontribusi pajak per kategori atau per produk.

**Impact:**

- Mempermudah laporan pajak
- Bisa bantu strategi harga untuk produk dengan pajak tinggi.

---

### 6. Seasonal or recent trend detection

**Insight:**
Deteksi produk yang penjualannya naik tajam (trending) atau turun drastis (at risk).

**Rumus:**

- **Trend index** = `(penjualan 7 hari terakhir) ÷ (penjualan 30 hari terakhir ÷ 4)`
  - Jika > 1.5 → trending up
  - Jika < 0.5 → trending down

- Data: `TransactionItem.quantity` (sudah ada).

**Visualisasi:**

- **Line chart** per produk untuk lihat tren
- Atau **heatmap**: warna hijau untuk naik, merah untuk turun.

**Impact:**

- Bisa tahu produk hype → stok harus cepat naik
- Bisa tahu produk yang mulai redup → mungkin perlu promo.

---

### 7. Category-level performance drill-down

**Insight:**
Lihat kesehatan kategori produk secara umum → apakah kategori tertentu mendominasi penjualan.

**Rumus:**

- **Category velocity** = total quantity terjual per kategori
- **Category margin** = total profit per kategori
- Data sudah ada di `TransactionItem.category` dan harga.

**Visualisasi:**

- **Treemap atau stacked bar** → kategori besar terlihat jelas.

**Impact:**

- Tahu kategori mana yang tumbuh atau melemah
- Bisa memutuskan fokus pengadaan barang.

---

### 8. Stock aging / dead stock alert

**Insight:**
Produk yang stoknya lama tidak bergerak → potensi stok mati dan modal mengendap.

**Rumus:**

- **Last sold date** = max(`TransactionItem.created_at`) per produk
- **Days since last sale** = today – last_sold_date
- Mungkin perlu tambahkan 1 field opsional: `Product.last_sold_at` untuk cepat query (tapi bisa juga hitung via transaksi).

**Visualisasi:**

- **Table atau alert list** → produk dengan `days since last sale > 30`

**Impact:**

- Mudah cari kandidat produk untuk clearance
- Bisa tekan biaya holding stok.

---

### 9. Price change impact (opsional)

**Insight:**
Lihat dampak perubahan harga terhadap volume penjualan → deteksi price elasticity.

**Rumus:**

- Bandingkan **avg sales sebelum dan sesudah harga berubah**
- Perlu catatan harga per transaksi (sudah ada: `sell_price`).
- Mungkin butuh field opsional `Product.price_history` kalau harga sering berubah.

**Visualisasi:**

- **Line chart** volume penjualan vs harga
- Tambahkan marker ketika harga berubah.

**Impact:**

- Tahu apakah kenaikan harga bikin volume turun tajam
- Bisa atur strategi harga lebih presisi.

---
