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
  deliveryAddress?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  items: RentalItem[];
}
