### Fast movers vs slow movers

**Insight:**
Cari tahu produk mana yang sering terjual (fast movers) dan mana yang jarang laku (slow movers) dalam periode tertentu → membantu prioritas stok dan promosi.

**Rumus:**

- **Sales frequency** = `jumlah transaksi per produk dalam periode X`
- Data yang dibutuhkan: `TransactionItem.quantity` (sudah ada)
- Tidak perlu field baru, cukup query agregasi.

**Visualisasi:**

- **Bar chart**: produk diurutkan dari frekuensi tertinggi ke terendah
- Tambahkan threshold (misalnya top 20% = fast movers, bottom 20% = slow movers)

**Impact:**

- Fast movers → harus cepat restock
- Slow movers → kandidat untuk diskon/clearance
- Bisa dipakai juga untuk keputusan display toko (produk high turnover ditempatkan di rak depan).

---

### Margin vs volume performance

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

### Discount sensitivity / promo effectiveness

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

### Seasonal or recent trend detection

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

### Category-level performance drill-down

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
