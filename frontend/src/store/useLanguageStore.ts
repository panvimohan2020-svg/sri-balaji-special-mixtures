import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedLanguage = 'en' | 'or' | 'te' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.collections': 'Collections',
    'nav.bulkOrders': 'Bulk Orders',
    'nav.trackOrder': 'Track Order',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.retailMode': 'Retail Mode',
    'nav.wholesaleMode': 'Wholesale Rates',
    'nav.watchIntro': 'Watch Intro',
    'nav.intro': 'Intro',
    'nav.search': 'Search snacks',
    'nav.voice': 'Voice Order',
    'nav.wishlist': 'Wishlist',
    'nav.account': 'Account',
    'nav.bag': 'Bag',
    'nav.switch': 'Switch',
    'nav.active': 'Active',
    'nav.language': 'Language',

    // Announcement Bar
    'announcement.tradition': '30+ Years of Tradition',
    'announcement.freshCrispy': 'Fresh & Crispy Savouries from Paralakhemundi',
    'announcement.callStore': 'Call Store',
    'announcement.whatsapp': 'WhatsApp Desk',

    // Hero Section
    'hero.badge': '30+ Years of Tradition • Paralakhemundi, Odisha',
    'hero.title': 'Made with Tradition.',
    'hero.titleAccent': 'Loved for the Crunch.',
    'hero.desc': 'Discover fresh, crispy, and authentic Indian savouries prepared with the taste of tradition. Handcrafted daily on Gandhi School Road by Adari Krishna Rao & Adari Dilleshwar Rao.',
    'hero.exploreBtn': 'Explore Our Snacks',
    'hero.wholesaleBtn': 'Wholesale Enquiry',
    'hero.pureVeg': '100% Pure Veg',
    'hero.handcrafted': 'Handcrafted Daily',
    'hero.legacy': '30+ Years Legacy',

    // Categories & Discovery
    'categories.heading': 'Taste Discovery',
    'categories.subheading': 'Explore our signature range of authentic mixtures, savouries, and traditional snacks',
    'cat.all': 'All Snacks',
    'cat.specialMixtures': 'Special Mixtures',
    'cat.murrukulu': 'Murrukulu & Sev',
    'cat.pakodi': 'Pakodi & Savouries',
    'cat.commercialBulk': 'Wholesale Cartons',
    'cat.combos': 'Combo Bundles',

    // Product Cards & Catalogue
    'catalog.title': 'Authentic Savouries & Traditional Mixtures',
    'catalog.subtitle': 'Freshly fried daily using pure refined vegetable oil and authentic South Odisha spice blends.',
    'catalog.filterAll': 'All Snacks',
    'catalog.quickView': 'Quick View',
    'catalog.addToBag': 'Add to Bag',
    'catalog.added': 'Added to Bag',
    'catalog.outOfStock': 'Out of Stock',
    'catalog.moq': 'Min Order',
    'catalog.savePercent': 'Save',
    'catalog.spiceLevel': 'Spice Level',
    'catalog.inStock': 'In Stock',
    'catalog.explore': 'Explore',
    'catalog.specialCollection': 'Special Collection',
    'catalog.searchPlaceholder': 'Search by snack name, spice or taste...',
    'catalog.sortBy': 'Sort by',
    'catalog.sortFeatured': 'Featured Tradition',
    'catalog.sortPriceAsc': 'Price: Low to High',
    'catalog.sortPriceDesc': 'Price: High to Low',
    'catalog.sortName': 'Alphabetical (A-Z)',
    'catalog.onlyWishlist': 'Saved Wishlist',
    'catalog.resetFilters': 'Reset Filters',

    // Cart & Checkout
    'cart.title': 'Your Snacking Bag',
    'cart.empty': 'Your bag is empty.',
    'cart.emptyDesc': 'Explore our authentic mixtures and add fresh snacks to your bag!',
    'cart.subtotal': 'Bag Subtotal',
    'cart.coupon': 'Apply Coupon Code',
    'cart.apply': 'Apply',
    'cart.couponSavings': 'Coupon Discount',
    'cart.loyaltyRedeem': 'Redeem Balaji Crunch Points',
    'cart.pointsDiscount': 'Loyalty Points Discount',
    'cart.deliveryCharges': 'Delivery Charges',
    'cart.freeDelivery': 'Free Delivery',
    'cart.estimatedTotal': 'Grand Total',
    'cart.checkoutWhatsApp': 'Order via WhatsApp Desk',
    'cart.payOnline': 'Pay Securely Online',
    'cart.continueShopping': 'Continue Shopping',
    'cart.clearCart': 'Clear Bag',
    'cart.cartSummary': 'Order Summary',
    'cart.totalWeight': 'Total Weight',
    'cart.remove': 'Remove',

    // AI & Voice Assistant
    'ai.title': 'Balaji Mitra – AI Snack Discovery',
    'ai.subtitle': 'Ask anything about spice levels, tea-time pairings, or bulk wholesale orders',
    'ai.askPlaceholder': 'Ask e.g. "Which snack is good with evening tea?"...',
    'ai.send': 'Send',
    'voice.title': 'Voice Ordering Assistant',
    'voice.listening': 'Listening... Speak your snack craving or quantity',
    'voice.confirmTitle': 'Confirm Interpreted Voice Items',
    'voice.confirmBtn': 'Confirm & Add to Bag',

    // Loyalty & Referral
    'loyalty.title': 'Balaji Crunch Rewards',
    'loyalty.balance': 'Your Reward Points',
    'loyalty.referralTitle': 'Refer Friends & Earn ₹100',
    'loyalty.shareWhatsApp': 'Share via WhatsApp',

    // Wholesale B2B
    'wholesale.title': 'Wholesale B2B Dealer Portal',
    'wholesale.subtitle': 'Direct factory supply for Kirana stores, grocery merchants, tea vendors, and distributors across South Odisha & Andhra border regions.',
    'wholesale.moqBanner': 'Wholesale pricing unlocks automatically at Minimum Order Quantities (MOQ).',
    'wholesale.specSheet': 'Download Wholesale Catalog & Rate Card',
    'wholesale.checkPincode': 'Check Delivery Serviceability',

    // Track Order
    'track.title': 'Track Your Snack Order',
    'track.subtitle': 'Enter your order reference number (e.g. SB-20261108-XXXX) to check live status.',
    'track.placeholder': 'Enter Order Reference #',
    'track.searchBtn': 'Track Status',

    // About & Contact
    'about.title': 'Our 30-Year Heritage',
    'about.subtitle': 'A family recipe perfected in Paralakhemundi since 1995.',
    'contact.title': 'Contact Store & Factory',
    'contact.subtitle': 'Visit our Gandhi School Road kitchen counter or call our order desk.',
    'contact.address': 'Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200',

    // Footer
    'footer.tagline': 'Taste the Tradition',
    'footer.desc': 'Authentic South Odisha mixtures and savouries handcrafted using Sri Adari Krishna Rao’s original 1995 recipes. Crunchy, fresh, and delivered factory-direct.',
    'footer.masterCrafters': 'Founders & Master Crafters:',
    'footer.craftersNames': 'Adari Krishna Rao (Father) & Adari Dilleshwar Rao (Son)',
    'footer.exploreStore': 'Explore Store',
    'footer.specialties': 'Specialties',
    'footer.dispatches': 'Dispatched from Gandhi School Road, Paralakhemundi, Gajapati, Odisha – 761200.',
    'footer.rights': 'All Rights Reserved. Handcrafted with pride in Paralakhemundi, Odisha.'
  },
  or: {
    // Navigation
    'nav.home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'nav.shop': 'ସପିଂ',
    'nav.collections': 'ସଂଗ୍ରହ',
    'nav.bulkOrders': 'ହୋଲସେଲ',
    'nav.trackOrder': 'ଅର୍ଡର ଟ୍ରାକ୍',
    'nav.about': 'ଆମ ବିଷୟରେ',
    'nav.contact': 'ଯୋଗାଯୋଗ',
    'nav.retailMode': 'ଖୁଚୁରା ମୋଡ୍',
    'nav.wholesaleMode': 'ହୋଲସେଲ ଦର',
    'nav.watchIntro': 'ଭିଡିଓ ଦେଖନ୍ତୁ',
    'nav.intro': 'ଭିଡିଓ',
    'nav.search': 'ସ୍ନାକ୍ସ ଖୋଜନ୍ତୁ',
    'nav.voice': 'ଭଏସ୍ ଅର୍ଡର',
    'nav.wishlist': 'ଇଚ୍ଛା ତାଲିକା',
    'nav.account': 'ଆକାଉଣ୍ଟ',
    'nav.bag': 'ବ୍ୟାଗ୍',
    'nav.switch': 'ବଦଳାନ୍ତୁ',
    'nav.active': 'ସକ୍ରିୟ',
    'nav.language': 'ଭାଷା',

    // Announcement Bar
    'announcement.tradition': '୩୦+ ବର୍ଷର ବିଶ୍ୱସ୍ତ ପରମ୍ପରା',
    'announcement.freshCrispy': 'ପାରଳାଖେମୁଣ୍ଡିର ସତେଜ ଓ କୁଡ଼ୁକୁଡ଼ିଆ ସ୍ନାକ୍ସ',
    'announcement.callStore': 'କଲ୍ କରନ୍ତୁ',
    'announcement.whatsapp': 'ହ୍ୱାଟ୍ସଆପ୍ ଡେସ୍କ',

    // Hero Section
    'hero.badge': '୩୦+ ବର୍ଷର ପରମ୍ପରା • ପାରଳାଖେମୁଣ୍ଡି, ଓଡ଼ିଶା',
    'hero.title': 'ପାରମ୍ପରିକ ସ୍ୱାଦରେ ପ୍ରସ୍ତୁତ,',
    'hero.titleAccent': 'କୁଡୁକୁଡିଆ ସ୍ୱାଦରେ ପସନ୍ଦ।',
    'hero.desc': 'ଶ୍ରୀ ଅଦାରୀ କୃଷ୍ଣା ରାଓ ଏବଂ ଅଦାରୀ ଦିଲ୍ଲେଶ୍ୱର ରାଓଙ୍କ ଦ୍ୱାରା ୧୯୯୫ ମସିହାରୁ ପ୍ରସ୍ତୁତ ପ୍ରାମାଣିକ ମିକ୍ସଚର୍ ଓ ସ୍ନାକ୍ସ। ଗାନ୍ଧୀ ସ୍କୁଲ ରୋଡ଼, ପାରଳାଖେମୁଣ୍ଡି।',
    'hero.exploreBtn': 'ଆମ ସ୍ନାକ୍ସ ଦେଖନ୍ତୁ',
    'hero.wholesaleBtn': 'ହୋଲସେଲ ଅନୁସନ୍ଧାନ',
    'hero.pureVeg': '୧୦୦% ଶୁଦ୍ଧ ଶାକାହାରୀ',
    'hero.handcrafted': 'ପ୍ରତିଦିନ ହାତ ତିଆରି',
    'hero.legacy': '୩୦+ ବର୍ଷର ବିଶ୍ୱାସ',

    // Categories & Discovery
    'categories.heading': 'ସ୍ୱାଦର ଅନୁଭୂତି',
    'categories.subheading': 'ଆମର ପ୍ରସିଦ୍ଧ ମିକ୍ସଚର୍, ମୁରୁକୁଲୁ ଏବଂ ପାରମ୍ପରିକ ସ୍ନାକ୍ସ ଅନ୍ୱେଷଣ କରନ୍ତୁ',
    'cat.all': 'ସମସ୍ତ ସ୍ନାକ୍ସ',
    'cat.specialMixtures': 'ସ୍ପେଶାଲ ମିକ୍ସଚର୍',
    'cat.murrukulu': 'ମୁରୁକୁଲୁ ଓ ସେଭ୍',
    'cat.pakodi': 'ପକୋଡ଼ି ଓ ନମକିନ୍',
    'cat.commercialBulk': 'ହୋଲସେଲ କାର୍ଟନ୍',
    'cat.combos': 'କମ୍ବୋ ପ୍ୟାକ୍',

    // Product Cards & Catalogue
    'catalog.title': 'ପ୍ରାମାଣିକ ସ୍ନାକ୍ସ ଓ ପାରମ୍ପରିକ ମିକ୍ସଚର୍',
    'catalog.subtitle': 'ପ୍ରତିଦିନ ଖାଣ୍ଟି ରିଫାଇଣ୍ଡ ତେଲ ଏବଂ ଦକ୍ଷିଣ ଓଡ଼ିଶାର ପାରମ୍ପରିକ ମସଲାରେ ତାଜା ପ୍ରସ୍ତୁତ।',
    'catalog.filterAll': 'ସମସ୍ତ ସ୍ନାକ୍ସ',
    'catalog.quickView': 'ଦେଖନ୍ତୁ',
    'catalog.addToBag': 'ବ୍ୟାଗରେ ଯୋଡନ୍ତୁ',
    'catalog.added': 'ଯୋଡ଼ାଗଲା!',
    'catalog.outOfStock': 'ଶେଷ ହୋଇଯାଇଛି',
    'catalog.moq': 'ସର୍ବନିମ୍ନ',
    'catalog.savePercent': 'ରିହାତି',
    'catalog.spiceLevel': 'ମସଲା',
    'catalog.inStock': 'ଉପଲବ୍ଧ ଅଛି',
    'catalog.explore': 'ଦେଖନ୍ତୁ',
    'catalog.specialCollection': 'ସ୍ପେଶାଲ ସଂଗ୍ରହ',
    'catalog.searchPlaceholder': 'ସ୍ନାକ୍ସ ନାମ କିମ୍ବା ସ୍ୱାଦ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
    'catalog.sortBy': 'କ୍ରମ ଅନୁସାରେ',
    'catalog.sortFeatured': 'ଲୋକପ୍ରିୟ ସ୍ନାକ୍ସ',
    'catalog.sortPriceAsc': 'ଦର: କମ୍ ରୁ ଅଧିକ',
    'catalog.sortPriceDesc': 'ଦର: ଅଧିକ ରୁ କମ୍',
    'catalog.sortName': 'ବର୍ଣ୍ଣମାଳା (A-Z)',
    'catalog.onlyWishlist': 'ସଂରକ୍ଷିତ ତାଲିକା',
    'catalog.resetFilters': 'ଫିଲ୍ଟର୍ ହଟାନ୍ତୁ',

    // Cart & Checkout
    'cart.title': 'ଆପଣଙ୍କ ସ୍ନାକ୍ସ ବ୍ୟାଗ୍',
    'cart.empty': 'ଆପଣଙ୍କ ବ୍ୟାଗ୍ ଖାଲି ଅଛି।',
    'cart.emptyDesc': 'ଆମର ସ୍ୱାଦିଷ୍ଟ ମିକ୍ସଚର୍ ଦେଖି ବ୍ୟାଗରେ ଯୋଡନ୍ତୁ!',
    'cart.subtotal': 'ମୋଟ ରାଶି',
    'cart.coupon': 'କୁପନ୍ କୋଡ୍ ପ୍ରୟୋଗ କରନ୍ତୁ',
    'cart.apply': 'ଲାଗୁ କରନ୍ତୁ',
    'cart.couponSavings': 'କୁପନ୍ ରିହାତି',
    'cart.loyaltyRedeem': 'ବାଲାଜୀ ପଏଣ୍ଟ ବ୍ୟବହାର କରନ୍ତୁ',
    'cart.pointsDiscount': 'ପଏଣ୍ଟ ରିହାତି',
    'cart.deliveryCharges': 'ଡେଲିଭରୀ ଶୁଳ୍କ',
    'cart.freeDelivery': 'ମାଗଣା ଡେଲିଭରୀ',
    'cart.estimatedTotal': 'ସର୍ବମୋଟ ରାଶି',
    'cart.checkoutWhatsApp': 'ହ୍ୱାଟ୍ସଆପ୍ ରେ ଅର୍ଡର କରନ୍ତୁ',
    'cart.payOnline': 'ଅନଲାଇନ୍ ପେମେଣ୍ଟ',
    'cart.continueShopping': 'ଅଧିକ ସପିଂ କରନ୍ତୁ',
    'cart.clearCart': 'ବ୍ୟାଗ୍ ଖାଲି କରନ୍ତୁ',
    'cart.cartSummary': 'ଅର୍ଡର ସାରାଂଶ',
    'cart.totalWeight': 'ମୋଟ ଓଜନ',
    'cart.remove': 'ହଟାନ୍ତୁ',

    // AI & Voice Assistant
    'ai.title': 'ବାଲାଜୀ ମିତ୍ର – AI ସ୍ନାକ୍ସ ସହାୟକ',
    'ai.subtitle': 'ଚାହା ସହିତ କେଉଁ ସ୍ନାକ୍ସ ଭଲ, ମସଲା ମାତ୍ରା କିମ୍ବା ବଲ୍କ ଅର୍ଡର ବିଷୟରେ ପଚାରନ୍ତୁ',
    'ai.askPlaceholder': 'ପଚାରନ୍ତୁ ଯଥା "ସନ୍ଧ୍ୟା ଚାହା ପାଇଁ କେଉଁ ମିକ୍ସଚର୍ ଭଲ?"...',
    'ai.send': 'ପଠାନ୍ତୁ',
    'voice.title': 'ଭଏସ୍ ଅର୍ଡରିଂ ସହାୟକ',
    'voice.listening': 'ଶୁଣୁଛି... ଆପଣ କେଉଁ ସ୍ନାକ୍ସ ଚାହାଁନ୍ତି କୁହନ୍ତୁ',
    'voice.confirmTitle': 'ଭଏସ୍ ଅର୍ଡର ଯାଞ୍ଚ କରନ୍ତୁ',
    'voice.confirmBtn': 'ନିଶ୍ଚିତ କରି ବ୍ୟାଗରେ ଯୋଡନ୍ତୁ',

    // Loyalty & Referral
    'loyalty.title': 'ବାଲାଜୀ କ୍ରଞ୍ଚ ରିୱାର୍ଡସ୍',
    'loyalty.balance': 'ଆପଣଙ୍କ ପଏଣ୍ଟ ବାଲାନ୍ସ',
    'loyalty.referralTitle': 'ସାଙ୍ଗମାନଙ୍କୁ ସେୟାର୍ କରି ₹୧୦୦ ପାଆନ୍ତୁ',
    'loyalty.shareWhatsApp': 'ହ୍ୱାଟ୍ସଆପ୍ ରେ ସେୟାର୍ କରନ୍ତୁ',

    // Wholesale B2B
    'wholesale.title': 'ହୋଲସେଲ B2B ଡିଲର୍ ପୋର୍ଟାଲ୍',
    'wholesale.subtitle': 'କିରାନା ଷ୍ଟୋର୍, ଗ୍ରୋସରୀ ଦୋକାନ, ଚାହା ଦୋକାନ ଏବଂ ବିତରକଙ୍କ ପାଇଁ ସିଧାସଳଖ ଫ୍ୟାକ୍ଟ୍ରି ଯୋଗାଣ।',
    'wholesale.moqBanner': 'ସର୍ବନିମ୍ନ ଅର୍ଡର ମାତ୍ରା (MOQ) ରେ ହୋଲସେଲ ଦର ସ୍ୱୟଂଚାଳିତ ଭାବେ ଲାଗୁ ହୁଏ।',
    'wholesale.specSheet': 'ହୋଲସେଲ କାଟାଲଗ୍ ଓ ଦର ତାଲିକା ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    'wholesale.checkPincode': 'ଡେଲିଭରୀ ସୁବିଧା ଯାଞ୍ଚ କରନ୍ତୁ',

    // Track Order
    'track.title': 'ଆପଣଙ୍କ ଅର୍ଡର ଟ୍ରାକ୍ କରନ୍ତୁ',
    'track.subtitle': 'ଅର୍ଡର ସ୍ଥିତି ଜାଣିବା ପାଇଁ ଆପଣଙ୍କ ରେଫରେନ୍ସ ନମ୍ବର (ଯଥା SB-20261108-XXXX) ଦିଅନ୍ତୁ।',
    'track.placeholder': 'ଅର୍ଡର ରେଫରେନ୍ସ ନମ୍ବର ଦିଅନ୍ତୁ',
    'track.searchBtn': 'ସ୍ଥିତି ଦେଖନ୍ତୁ',

    // About & Contact
    'about.title': 'ଆମର ୩୦ ବର୍ଷର ପରମ୍ପରା',
    'about.subtitle': '୧୯୯୫ ରୁ ପାରଳାଖେମୁଣ୍ଡିରେ ଆରମ୍ଭ ହୋଇଥିବା ଏକ ପାରିବାରିକ ସ୍ୱାଦର କାହାଣୀ।',
    'contact.title': 'ଦୋକାନ ଏବଂ ଫ୍ୟାକ୍ଟ୍ରି ସହିତ ଯୋଗାଯୋଗ',
    'contact.subtitle': 'ଗାନ୍ଧୀ ସ୍କୁଲ ରୋଡ଼ ସ୍ଥିତ ଆମ ଦୋକାନକୁ ଆସନ୍ତୁ କିମ୍ବା ଫୋନ୍ କରନ୍ତୁ।',
    'contact.address': 'ଗାନ୍ଧୀ ସ୍କୁଲ ରୋଡ୍, ପୋଷ୍ଟ ଅଫିସ୍ ନିକଟ, ପାରଳାଖେମୁଣ୍ଡି, ଗଜପତି, ଓଡ଼ିଶା – ୭୬୧୨୦୦',

    // Footer
    'footer.tagline': 'ପାରମ୍ପରିକ ସ୍ୱାଦର ଅନୁଭବ',
    'footer.desc': 'ଶ୍ରୀ ଅଦାରୀ କୃଷ୍ଣା ରାଓଙ୍କ ଦ୍ୱାରା ୧୯୯୫ ରୁ ପ୍ରସ୍ତୁତ ପ୍ରାମାଣିକ ମିକ୍ସଚର୍। ପାରଳାଖେମୁଣ୍ଡି, ଗଜପତି, ଓଡ଼ିଶା।',
    'footer.masterCrafters': 'ପ୍ରତିଷ୍ଠାତା ଓ ମାଷ୍ଟର କାରିଗର:',
    'footer.craftersNames': 'ଅଦାରୀ କୃଷ୍ଣା ରାଓ (ପିତା) ଏବଂ ଅଦାରୀ ଦିଲ୍ଲେଶ୍ୱର ରାଓ (ପୁତ୍ର)',
    'footer.exploreStore': 'ଦୋକାନ ଦେଖନ୍ତୁ',
    'footer.specialties': 'ସ୍ପେଶାଲ ସ୍ନାକ୍ସ',
    'footer.dispatches': 'ଗାନ୍ଧୀ ସ୍କୁଲ ରୋଡ୍, ପୋଷ୍ଟ ଅଫିସ୍ ନିକଟ, ପାରଳାଖେମୁଣ୍ଡି, ଗଜପତି, ଓଡ଼ିଶା – ୭୬୧୨୦୦ ରୁ ପ୍ରେରଣ।',
    'footer.rights': 'ସର୍ବସ୍ୱତ୍ୱ ସଂରକ୍ଷିତ। ପାରଳାଖେମୁଣ୍ଡିରେ ଗର୍ବର ସହିତ ନିର୍ମିତ।'
  },
  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.shop': 'షాప్',
    'nav.collections': 'సేకరణలు',
    'nav.bulkOrders': 'బల్క్ ఆర్డర్లు',
    'nav.trackOrder': 'ట్రాక్ ఆర్డర్',
    'nav.about': 'మా గురించి',
    'nav.contact': 'సంప్రదించండి',
    'nav.retailMode': 'రిటైల్ మోడ్',
    'nav.wholesaleMode': 'హోల్‌సేల్ ధరలు',
    'nav.watchIntro': 'వీడియో చూడండి',
    'nav.intro': 'వీడియో',
    'nav.search': 'స్నాక్స్ వెతకండి',
    'nav.voice': 'వాయిస్ ఆర్డర్',
    'nav.wishlist': 'కోరికల జాబితా',
    'nav.account': 'ఖాతా',
    'nav.bag': 'బ్యాగ్',
    'nav.switch': 'మార్చండి',
    'nav.active': 'యాక్టివ్',
    'nav.language': 'భాష',

    // Announcement Bar
    'announcement.tradition': '30 ఏళ్ల సంప్రదాయ స్వచ్ఛత',
    'announcement.freshCrispy': 'పారలాఖెముండి తాజా మరియు కరకరలాడే స్నాక్స్',
    'announcement.callStore': 'కాల్ చేయండి',
    'announcement.whatsapp': 'వాట్సాప్ డెస్క్',

    // Hero Section
    'hero.badge': '30 ఏళ్ల సంప్రదాయం • పారలాఖెముండి, ఒడిశా',
    'hero.title': 'సంప్రదాయంతో తయారీ,',
    'hero.titleAccent': 'కరకరలాడే రుచితో ప్రేమ.',
    'hero.desc': 'శ్రీ అదారి కృష్ణారావు మరియు అదారి దిల్లేశ్వరరావు గార్లచే ప్రతిరోజూ తాజాగా తయారు చేయబడిన స్వచ్ఛమైన భారతీయ స్నాక్స్. గాంధీ స్కూల్ రోడ్, పారలాఖెముండి.',
    'hero.exploreBtn': 'మా స్నాక్స్ చూడండి',
    'hero.wholesaleBtn': 'హోల్‌సేల్ వివరాలు',
    'hero.pureVeg': '100% స్వచ్ఛమైన శాకాహారం',
    'hero.handcrafted': 'రోజూ తాజాగా తయారీ',
    'hero.legacy': '30 ఏళ్ల ఘన చరిత్ర',

    // Categories & Discovery
    'categories.heading': 'రుచుల ప్రయాణం',
    'categories.subheading': 'మా ప్రత్యేక మిక్చర్లు, మురుకులు మరియు సాంప్రదాయ స్నాక్స్ శోధించండి',
    'cat.all': 'అన్ని స్నాక్స్',
    'cat.specialMixtures': 'స్పెషల్ మిక్చర్లు',
    'cat.murrukulu': 'మురుకులు & సేవ్‌',
    'cat.pakodi': 'పకోడీ & కారాలు',
    'cat.commercialBulk': 'హోల్‌సేల్ కార్టన్లు',
    'cat.combos': 'కాంబో ప్యాక్‌లు',

    // Product Cards & Catalogue
    'catalog.title': 'సాంప్రదాయ స్నాక్స్ మరియు రుచికరమైన మిక్చర్లు',
    'catalog.subtitle': 'స్వచ్ఛమైన నూనె మరియు దక్షిణ ఒడిశా సుగంధ ద్రవ్యాలతో రోజూ తాజాగా తయారు చేస్తాము.',
    'catalog.filterAll': 'అన్ని స్నాక్స్',
    'catalog.quickView': 'వివరాలు',
    'catalog.addToBag': 'బ్యాగ్‌లో చేర్చండి',
    'catalog.added': 'చేర్చబడింది!',
    'catalog.outOfStock': 'స్టాక్ అయిపోయింది',
    'catalog.moq': 'కనిష్ట ఆర్డర్',
    'catalog.savePercent': 'ఆదా',
    'catalog.spiceLevel': 'కారం స్థాయి',
    'catalog.inStock': 'స్టాక్‌లో ఉంది',
    'catalog.explore': 'చూడండి',
    'catalog.specialCollection': 'ప్రత్యేక సేకరణ',
    'catalog.searchPlaceholder': 'స్నాక్ పేరు లేదా రుచి ద్వారా వెతకండి...',
    'catalog.sortBy': 'క్రమబద్ధీకరించు',
    'catalog.sortFeatured': 'ప్రత్యేక ప్రాధాన్యత',
    'catalog.sortPriceAsc': 'ధర: తక్కువ నుండి ఎక్కువ',
    'catalog.sortPriceDesc': 'ధర: ఎక్కువ నుండి తక్కువ',
    'catalog.sortName': 'అక్షర క్రమం (A-Z)',
    'catalog.onlyWishlist': 'కోరికల జాబితా',
    'catalog.resetFilters': 'ఫిల్టర్లు తీసివేయండి',

    // Cart & Checkout
    'cart.title': 'మీ స్నాక్స్ బ్యాగ్',
    'cart.empty': 'మీ బ్యాగ్ ఖాళీగా ఉంది.',
    'cart.emptyDesc': 'మా తాజా మిక్చర్లను చూసి బ్యాగ్‌లో చేర్చండి!',
    'cart.subtotal': 'మొత్తం ధర',
    'cart.coupon': 'కూపన్ కోడ్ వర్తింపజేయండి',
    'cart.apply': 'వర్తింపజేయి',
    'cart.couponSavings': 'కూపన్ తగ్గింపు',
    'cart.loyaltyRedeem': 'బాలాజీ పాయింట్లు ఉపయోగించండి',
    'cart.pointsDiscount': 'పాయింట్ల తగ్గింపు',
    'cart.deliveryCharges': 'డెలివరీ ఛార్జీలు',
    'cart.freeDelivery': 'ఉచిత డెలివరీ',
    'cart.estimatedTotal': 'మొత్తం బిల్లు',
    'cart.checkoutWhatsApp': 'వాట్సాప్ ద్వారా ఆర్డర్ చేయండి',
    'cart.payOnline': 'ఆన్‌లైన్ చెల్లింపు చేయండి',
    'cart.continueShopping': 'షాపింగ్ కొనసాగించండి',
    'cart.clearCart': 'బ్యాగ్ క్లియర్ చేయండి',
    'cart.cartSummary': 'ఆర్డర్ సారాంశం',
    'cart.totalWeight': 'మొత్తం బరువు',
    'cart.remove': 'తొలగించు',

    // AI & Voice Assistant
    'ai.title': 'బాలాజీ మిత్ర – AI స్నాక్స్ సహాయకుడు',
    'ai.subtitle': 'టీ టైమ్ స్నాక్స్, కారం స్థాయి లేదా బల్క్ ఆర్డర్ల వివరాలు అడగండి',
    'ai.askPlaceholder': 'ఉదాహరణకు "సాయంత్రం టీతో ఏ స్నాక్ బాగుంటుంది?"...',
    'ai.send': 'పంపు',
    'voice.title': 'వాయిస్ ఆర్డరింగ్ సహాయకుడు',
    'voice.listening': 'వింటున్నాము... మీకు కావలసిన స్నాక్ పేరు చెప్పండి',
    'voice.confirmTitle': 'వాయిస్ ఆర్డర్ వివరాలు సరిచూసుకోండి',
    'voice.confirmBtn': 'నిర్ధారించి బ్యాగ్‌లో చేర్చండి',

    // Loyalty & Referral
    'loyalty.title': 'బాలాజీ క్రంచ్ రివార్డ్స్',
    'loyalty.balance': 'మీ రివార్డ్ పాయింట్లు',
    'loyalty.referralTitle': 'స్నేహితులకు పంపండి మరియు ₹100 పొందండి',
    'loyalty.shareWhatsApp': 'వాట్సాప్‌లో పంపండి',

    // Wholesale B2B
    'wholesale.title': 'హోల్‌సేల్ B2B డీలర్ పోర్టల్',
    'wholesale.subtitle': 'కిరాణా షాపులు, టీ వ్యాపారులు మరియు డిస్ట్రిబ్యూటర్ల కోసం నేరుగా ఫ్యాక్టరీ సరఫరా.',
    'wholesale.moqBanner': 'కనిష్ట ఆర్డర్ పరిమాణం (MOQ) వద్ద హోల్‌సేల్ ధరలు వర్తిస్తాయి.',
    'wholesale.specSheet': 'హోల్‌సేల్ కేటలాగ్ మరియు ధరల పట్టిక డౌన్‌లోడ్ చేసుకోండి',
    'wholesale.checkPincode': 'డెలివరీ సేవలను తనిఖీ చేయండి',

    // Track Order
    'track.title': 'మీ ఆర్డర్‌ను ట్రాక్ చేయండి',
    'track.subtitle': 'ఆర్డర్ స్థితిని తెలుసుకోవడానికి మీ రిఫరెన్స్ నంబర్ (ఉదా. SB-20261108-XXXX) నమోదు చేయండి.',
    'track.placeholder': 'ఆర్డర్ రిఫరెన్స్ నంబర్ ఇవ్వండి',
    'track.searchBtn': 'స్థితి చూడండి',

    // About & Contact
    'about.title': 'మా 30 ఏళ్ల సంప్రదాయం',
    'about.subtitle': '1995 నుండి పారలాఖెముండిలో ప్రారంభమైన ఒక కుటుంబం యొక్క రుచికరమైన ప్రయాణం.',
    'contact.title': 'స్టోర్ మరియు ఫ్యాక్టరీ వివరాలు',
    'contact.subtitle': 'గాంధీ స్కూల్ రోడ్డులోని మా స్టోర్‌ను సందర్శించండి లేదా ఫోన్ చేయండి.',
    'contact.address': 'గాంధీ స్కూల్ రోడ్, పోస్ట్ ఆఫీస్ దగ్గర, పారలాఖెముండి, గజపతి, ఒడిశా – 761200',

    // Footer
    'footer.tagline': 'సంప్రదాయ రుచి',
    'footer.desc': 'శ్రీ అదారి కృష్ణారావు గారి 1995 నాటి ఒరిజినల్ రెసిపీలతో తయారు చేసిన తాజా మిక్చర్లు. పారలాఖెముండి, ఒడిశా.',
    'footer.masterCrafters': 'వ్యవస్థాపకులు మరియు మాస్టర్ నిపుణులు:',
    'footer.craftersNames': 'అదారి కృష్ణారావు (తండ్రి) & అదారి దిల్లేశ్వరరావు (కుమారుడు)',
    'footer.exploreStore': 'స్టోర్ చూడండి',
    'footer.specialties': 'ప్రత్యేకతలు',
    'footer.dispatches': 'గాంధీ స్కూల్ రోడ్, పోస్ట్ ఆఫీస్ దగ్గర, పారలాఖెముండి, గజపతి, ఒడిశా – 761200 నుండి పంపబడుతుంది.',
    'footer.rights': 'సర్వ హక్కులు ప్రత్యేకించబడ్డాయి. పారలాఖెముండిలో గర్వంగా తయారీ.'
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.shop': 'शॉप',
    'nav.collections': 'कलेक्शन',
    'nav.bulkOrders': 'थोक ऑर्डर्स',
    'nav.trackOrder': 'ऑर्डर ट्रैक',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क करें',
    'nav.retailMode': 'रिटेल मोड',
    'nav.wholesaleMode': 'थोक दरें',
    'nav.watchIntro': 'वीडियो देखें',
    'nav.intro': 'वीडियो',
    'nav.search': 'स्नैक्स खोजें',
    'nav.voice': 'बोलकर मंगाएं',
    'nav.wishlist': 'विशलिस्ट',
    'nav.account': 'खाता',
    'nav.bag': 'बैग',
    'nav.switch': 'बदलें',
    'nav.active': 'सक्रिय',
    'nav.language': 'भाषा',

    // Announcement Bar
    'announcement.tradition': '30+ वर्षों की परंपरा',
    'announcement.freshCrispy': 'पारलाखेमुंडी के ताज़ा और कुरकुरे नमकीन',
    'announcement.callStore': 'स्टोर पर कॉल करें',
    'announcement.whatsapp': 'व्हाट्सएप डेस्क',

    // Hero Section
    'hero.badge': '30+ वर्षों की परंपरा • पारलाखेमुंडी, ओडिशा',
    'hero.title': 'परंपरा से निर्मित,',
    'hero.titleAccent': 'कुरकुराहट से भरपूर।',
    'hero.desc': 'श्री अदरी कृष्णा राव और अदरी दिल्लेश्वर राव द्वारा प्रतिदिन ताज़ा निर्मित प्रामाणिक भारतीय नमकीन और मिक्सचर। गांधी स्कूल रोड, पारलाखेमुंडी।',
    'hero.exploreBtn': 'हमारे स्नैक्स देखें',
    'hero.wholesaleBtn': 'थोक पूछताछ',
    'hero.pureVeg': '100% शुद्ध शाकाहारी',
    'hero.handcrafted': 'रोज़ाना ताज़ा निर्मित',
    'hero.legacy': '30+ वर्षों का विश्वास',

    // Categories & Discovery
    'categories.heading': 'स्वादों की खोज',
    'categories.subheading': 'हमारे प्रामाणिक मिक्सचर, मुरुकुलु और पारंपरिक नमकीन का अन्वेषण करें',
    'cat.all': 'सभी स्नैक्स',
    'cat.specialMixtures': 'स्पेशल मिक्सचर',
    'cat.murrukulu': 'मुरुकुलु व सेव',
    'cat.pakodi': 'पकोड़ी व नमकीन',
    'cat.commercialBulk': 'थोक कार्टन',
    'cat.combos': 'कॉम्बो पैक',

    // Product Cards & Catalogue
    'catalog.title': 'पारंपरिक नमकीन और स्पेशल मिक्सचर',
    'catalog.subtitle': 'प्रतिदिन शुद्ध तेल और दक्षिण ओडिशा के पारंपरिक मसालों से ताज़ा तैयार।',
    'catalog.filterAll': 'सभी स्नैक्स',
    'catalog.quickView': 'तुरंत देखें',
    'catalog.addToBag': 'बैग में जोड़ें',
    'catalog.added': 'जोड़ा गया!',
    'catalog.outOfStock': 'समाप्त',
    'catalog.moq': 'न्यूनतम',
    'catalog.savePercent': 'बचत',
    'catalog.spiceLevel': 'तीखापन',
    'catalog.inStock': 'उपलब्ध है',
    'catalog.explore': 'देखें',
    'catalog.specialCollection': 'स्पेशल कलेक्शन',
    'catalog.searchPlaceholder': 'स्नैक नाम या स्वाद से खोजें...',
    'catalog.sortBy': 'क्रम अनुसार',
    'catalog.sortFeatured': 'लोकप्रिय नमकीन',
    'catalog.sortPriceAsc': 'कीमत: कम से ज्यादा',
    'catalog.sortPriceDesc': 'कीमत: ज्यादा से कम',
    'catalog.sortName': 'वर्णमाला (A-Z)',
    'catalog.onlyWishlist': 'सहेजी गई विशलिस्ट',
    'catalog.resetFilters': 'फ़िल्टर हटाएं',

    // Cart & Checkout
    'cart.title': 'आपका स्नैक्स बैग',
    'cart.empty': 'आपका बैग खाली है।',
    'cart.emptyDesc': 'हमारे ताज़ा मिक्सचर देखें और बैग में पसंदीदा स्नैक्स जोड़ें!',
    'cart.subtotal': 'कुल राशि',
    'cart.coupon': 'कूपन कोड लगाएं',
    'cart.apply': 'लागू करें',
    'cart.couponSavings': 'कूपन छूट',
    'cart.loyaltyRedeem': 'बालाजी पॉइंट्स का उपयोग करें',
    'cart.pointsDiscount': 'पॉइंट्स छूट',
    'cart.deliveryCharges': 'डिलीवरी शुल्क',
    'cart.freeDelivery': 'मुफ्त डिलीवरी',
    'cart.estimatedTotal': 'कुल योग',
    'cart.checkoutWhatsApp': 'व्हाट्सएप पर ऑर्डर करें',
    'cart.payOnline': 'सुरक्षित ऑनलाइन भुगतान',
    'cart.continueShopping': 'खरीदारी जारी रखें',
    'cart.clearCart': 'बैग खाली करें',
    'cart.cartSummary': 'ऑर्डर सारांश',
    'cart.totalWeight': 'कुल वजन',
    'cart.remove': 'हटाएं',

    // AI & Voice Assistant
    'ai.title': 'बालाजी मित्र – AI स्नैक सहायक',
    'ai.subtitle': 'चाय के स्नैक्स, तीखापन या थोक ऑर्डर के बारे में कुछ भी पूछें',
    'ai.askPlaceholder': 'पूछें जैसे "शाम की चाय के साथ क्या अच्छा रहेगा?"...',
    'ai.send': 'भेजें',
    'voice.title': 'वॉयस ऑर्डरिंग सहायक',
    'voice.listening': 'सुन रहे हैं... अपना पसंदीदा स्नैक या मात्रा बोलें',
    'voice.confirmTitle': 'वॉयस ऑर्डर की पुष्टि करें',
    'voice.confirmBtn': 'पुष्टि करें और बैग में जोड़ें',

    // Loyalty & Referral
    'loyalty.title': 'बालाजी क्रंच रिवॉर्ड्स',
    'loyalty.balance': 'आपके रिवॉर्ड पॉइंट्स',
    'loyalty.referralTitle': 'मित्रों को शेयर करें और ₹100 पाएं',
    'loyalty.shareWhatsApp': 'व्हाट्सएप पर शेयर करें',

    // Wholesale B2B
    'wholesale.title': 'थोक B2B डीलर पोर्टल',
    'wholesale.subtitle': 'किराना स्टोर, किराना व्यापारी, चाय विक्रेता और वितरकों के लिए सीधे फैक्ट्री आपूर्ति।',
    'wholesale.moqBanner': 'न्यूनतम ऑर्डर मात्रा (MOQ) पर थोक दरें स्वतः लागू होती हैं।',
    'wholesale.specSheet': 'थोक कैटलॉग और मूल्य सूची डाउनलोड करें',
    'wholesale.checkPincode': 'डिलीवरी सेवा जांचें',

    // Track Order
    'track.title': 'अपना ऑर्डर ट्रैक करें',
    'track.subtitle': 'स्थिति जानने के लिए अपना संदर्भ नंबर (जैसे SB-20261108-XXXX) दर्ज करें।',
    'track.placeholder': 'ऑर्डर संदर्भ नंबर दर्ज करें',
    'track.searchBtn': 'स्थिति देखें',

    // About & Contact
    'about.title': 'हमारी 30 वर्षों की परंपरा',
    'about.subtitle': '1995 से पारलाखेमुंडी में शुरू हुई पारिवारिक स्वाद की अनोखी कहानी।',
    'contact.title': 'स्टोर और फैक्ट्री से संपर्क करें',
    'contact.subtitle': 'गांधी स्कूल रोड स्थित हमारे स्टोर पर पधारें या कॉल करें।',
    'contact.address': 'गांधी स्कूल रोड, पोस्ट ऑफिस के पास, पारलाखेमुंडी, गजपति, ओडिशा – 761200',

    // Footer
    'footer.tagline': 'परंपरा का स्वाद',
    'footer.desc': '1995 से श्री अदरी कृष्णा राव की मूल विधियों से तैयार किए गए प्रामाणिक नमकीन और मिक्सचर। पारलाखेमुंडी, ओडिशा।',
    'footer.masterCrafters': 'संस्थापक और मास्टर कारीगर:',
    'footer.craftersNames': 'अदरी कृष्णा राव (पिता) और अदरी दिल्लेश्वर राव (पुत्र)',
    'footer.exploreStore': 'स्टोर देखें',
    'footer.specialties': 'विशेषताएं',
    'footer.dispatches': 'गांधी स्कूल रोड, पोस्ट ऑफिस के पास, पारलाखेमुंडी, गजपति, ओडिशा – 761200 से प्रेषित।',
    'footer.rights': 'सर्वाधिकार सुरक्षित। पारलाखेमुंडी, ओडिशा में गर्व से निर्मित।'
  }
};

interface LanguageStoreState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultText?: string) => string;
}

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: SupportedLanguage) => {
        set({ language: lang });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      },
      t: (key: string, defaultText?: string): string => {
        const lang = get().language;
        const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
        return dict[key] || TRANSLATIONS.en[key] || defaultText || key;
      }
    }),
    {
      name: 'sri-balaji-language-preference',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.lang = state.language;
        }
      }
    }
  )
);

/**
 * Convenient React Hook for components that guarantees reactive re-renders
 * whenever the selected language changes.
 */
export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = useLanguageStore((state) => state.t);

  return {
    language,
    setLanguage,
    t: (key: string, defaultText?: string) => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || defaultText || key;
    }
  };
};
