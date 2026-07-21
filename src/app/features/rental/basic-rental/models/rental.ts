export interface RentalItem {
  id?: number;
  itemId: number;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  additionalFee: number;
  subtotal?: number;
}

export interface Rental {
  id?: number;
  rentalNumber?: string;
  customerId?: number;
  customerName?: string;
  rentalTypeId?: number;
  rentalTypeName?: string;
  paymentMethodId?: number | null;
  paymentMethodName?: string;
  status?: string;
  rentalDate?: string;
  startDate?: string;
  expectedReturnDate?: string;
  subtotal?: number;
  discount: number;
  shippingFee: number;
  additionalFee: number;
  totalAmount?: number;
  downPayment: number;
  remainingAmount?: number;
  actualReturnDate?: string;
  paid?: boolean;
  whatsappSent?: boolean;
  overdueDays?: number;
  lateFeePerDay?: number;
  calculatedLateFee?: number;
  totalWithLateFee?: number;
  deliveryAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  items: RentalItem[];
}

export interface ItemAvailability {
  itemId: number;
  itemName: string;
  availableQuantity: number;
  reservedQuantity: number;
  rentedQuantity: number;
}

export interface ItemUnit {
  id: number;
  itemId: number;
  itemName: string;
  assetCode: string;
  serialNumber?: string;
  status: string;
  conditionStatus: string;
  active: boolean;
}

export interface RentalItemUnit {
  id: number;
  rentalItemId: number;
  itemUnitId: number;
  itemName: string;
  assetCode: string;
  status: string;
  reservedAt?: string;
  deliveredAt?: string;
  returnedAt?: string;
}

export interface RentalStatusHistory {
  id: number;
  previousStatus?: string;
  newStatus: string;
  reason?: string;
  changedAt: string;
  changedBy: string;
}
