export enum EPurchaseStatus {
  PENDING = 'pending', // baru dibuat
  APPROVED = 'approved', // disetujui untuk diproses
  DELIVERED = 'delivered', // barang sudah dikirim supplier
  COMPLETED = 'completed', // barang sudah diterima penuh
  CANCELLED = 'cancelled',
}

export enum EPaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
}
