import { CartItem } from '../types';

export interface WhatsAppOrderDetails {
  customerName: string;
  businessName?: string;
  phoneNumber: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  totalWeightKg: number;
  isWholesale: boolean;
  storeWhatsAppNumber: string;
}

export function generateWhatsAppOrderUrl(details: WhatsAppOrderDetails): string {
  const {
    customerName,
    businessName,
    phoneNumber,
    deliveryAddress,
    city,
    notes,
    items,
    totalAmount,
    totalWeightKg,
    isWholesale,
    storeWhatsAppNumber
  } = details;

  const header = `🛍️ *NEW ${isWholesale ? 'WHOLESALE' : 'RETAIL'} ORDER ENQUIRY – SRI BALAJI*`;
  const divider = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
  const customerInfo = [
    `👤 *Name:* ${customerName.trim()}`,
    businessName ? `🏢 *Shop/Business:* ${businessName.trim()}` : null,
    `📱 *Phone:* ${phoneNumber.trim()}`,
    `📍 *Delivery City:* ${city.trim()}`,
    deliveryAddress ? `🏠 *Address:* ${deliveryAddress.trim()}` : null
  ].filter(Boolean).join('\n');

  const itemsList = items.map((item, index) => {
    const subtotal = item.unitPrice * item.quantity;
    return `${index + 1}. *${item.productName}*\n   └ Weight: ${item.weightLabel} | Qty: ${item.quantity} pkgs | Rate: ₹${item.unitPrice} | Total: ₹${subtotal}`;
  }).join('\n\n');

  const summary = [
    `📦 *Total Items / Packages:* ${items.reduce((s, i) => s + i.quantity, 0)}`,
    `⚖️ *Estimated Net Weight:* ${totalWeightKg} kg`,
    `💰 *Estimated Order Value:* ₹${totalAmount.toLocaleString('en-IN')}`,
    notes ? `📝 *Special Instructions:* ${notes.trim()}` : null
  ].filter(Boolean).join('\n');

  const footer = `*(Please review and share availability, batch dispatch dates, and transport options)*`;

  const fullMessage = `${header}\n${divider}\n${customerInfo}\n${divider}\n*SELECTED PRODUCTS:*\n\n${itemsList}\n${divider}\n${summary}\n${divider}\n${footer}`;

  const cleanPhone = storeWhatsAppNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(fullMessage);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateSingleProductInquiryUrl(
  productName: string,
  weightLabel: string,
  storeWhatsAppNumber: string
): string {
  const message = `Namaste Sri Balaji team, I would like to inquire about bulk/wholesale availability and pricing for:\n\n*Product:* ${productName}\n*Weight/Size:* ${weightLabel}\n\nPlease share your current rate card and minimum dispatch volume.`;
  const cleanPhone = storeWhatsAppNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

