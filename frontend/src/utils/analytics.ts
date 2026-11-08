import { apiService } from '../services/api';

/**
 * Privacy-conscious client-side analytics helper.
 * Captures UTM marketing parameters (Instagram, Google, QR codes on snack pouches)
 * and records conversion funnel events without capturing personal identifying info.
 */

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('sb_anon_session_id');
    if (!sid) {
      sid = 'ses_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      sessionStorage.setItem('sb_anon_session_id', sid);
    }
    return sid;
  } catch {
    return 'ses_' + Date.now().toString(36);
  }
}

function captureUTMTags(): { utm_source: string; utm_medium?: string; utm_campaign?: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get('utm_source');
    const mediumParam = params.get('utm_medium');
    const campaignParam = params.get('utm_campaign');

    if (sourceParam) {
      sessionStorage.setItem('sb_utm_source', sourceParam.toLowerCase());
      if (mediumParam) sessionStorage.setItem('sb_utm_medium', mediumParam.toLowerCase());
      if (campaignParam) sessionStorage.setItem('sb_utm_campaign', campaignParam.toLowerCase());
    }

    const savedSource = sessionStorage.getItem('sb_utm_source') || 'direct';
    const savedMedium = sessionStorage.getItem('sb_utm_medium') || undefined;
    const savedCampaign = sessionStorage.getItem('sb_utm_campaign') || undefined;

    return {
      utm_source: savedSource,
      utm_medium: savedMedium,
      utm_campaign: savedCampaign
    };
  } catch {
    return { utm_source: 'direct' };
  }
}

export function trackMarketingEvent(
  eventType: 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'ADD_TO_CART' | 'CHECKOUT_START' | 'WHATSAPP_ENQUIRY' | 'ORDER_COMPLETED',
  metadata?: { productId?: string; orderId?: string }
): void {
  try {
    const utms = captureUTMTags();
    const sessionId = getOrCreateSessionId();

    apiService.logMarketingEvent({
      event_type: eventType,
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      page_url: window.location.pathname,
      product_id: metadata?.productId,
      order_id: metadata?.orderId,
      session_id: sessionId
    });
  } catch {
    // Fail silent
  }
}
