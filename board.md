| Field                      | Keterangan                                |
| -------------------------- | ----------------------------------------- |
| `id`                       | Primary key auto increment atau UUID      |
| `product_id`               | Foreign key ke table `product`            |
| `quantity` / `stock`       | Stok saat ini                             |
| `min_stock` (optional)     | Batas minimal untuk alert / reorder       |
| `max_stock` (optional)     | Batas maksimal (misal warehouse capacity) |
| `location` (optional)      | Warehouse / shelf location                |
| `created_at`, `updated_at` | Timestamp untuk tracking                  |
