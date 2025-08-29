export enum EInventoryStockType {
  ORDER = 'Order',
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales',
  CANCEL = 'Cancel',
}

export enum EStatusDelivery {
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
  DROPPED = 'Dropped',
  COMPLETED = 'Completed',
  CANCEL = 'Cancel',
}

export enum EStatusPayment {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export enum EInventoryLogType {
  ORDER = 'Order', // purchase from supplier
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales', // POS sale
  CANCEL = 'Cancel', // sale or PO cancelled
  ADJUSTMENT = 'Adjustment', // manual admin correction
}
