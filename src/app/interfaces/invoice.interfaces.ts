export interface IInvoiceItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid';
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface IInvoiceCreate {
  customerName: string;
  dueDate: string;
  items: { productId: number; productName: string; quantity: number; unitPrice: number }[];
  tax?: number;
}
