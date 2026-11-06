import type { CartItem } from '../types';

export interface WhatsAppOrderDetails {
  customerName: string;
  businessName?: string;
  phoneNumber: string;
  deliveryAddress?: string;
  city: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  totalWeightKg: number;
  isWholesale: boolean;
  storeWhatsAppNumber: string;
}

function sanitizeWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
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
  const locationTag = `📍 *Paralakhemundi, Gajapati, Odisha*`;
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

  const footer = `*(Please review availability and dispatch timeline from Paralakhemundi unit)*`;

  const fullMessage = `${header}\n${locationTag}\n${divider}\n${customerInfo}\n${divider}\n*SELECTED PRODUCTS:*\n\n${itemsList}\n${divider}\n${summary}\n${divider}\n${footer}`;

  const cleanPhone = sanitizeWhatsAppPhone(storeWhatsAppNumber);
  const encodedText = encodeURIComponent(fullMessage);

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateSingleProductInquiryUrl(
  productName: string,
  weightLabel: string,
  storeWhatsAppNumber: string
): string {
  const message = `Namaste Sri Balaji team (Paralakhemundi), I would like to inquire about wholesale availability and pricing for:\n\n*Product:* ${productName}\n*Weight/Size:* ${weightLabel}\n\nPlease share your current rate card and minimum dispatch volume.`;
  const cleanPhone = sanitizeWhatsAppPhone(storeWhatsAppNumber);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
