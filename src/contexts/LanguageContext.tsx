import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'et' | 'en';

const translations = {
  et: {
    // Navigation
    nav_home: 'Avaleht',
    nav_shop: 'Pood',
    nav_contact: 'Kontakt',
    nav_admin: 'Admin',
    auth_logout: 'Logi välja',

    // Hero
    hero_badge: 'Käsitöö & Kirg',
    hero_title1: 'Anname vanale mööblile',
    hero_title2: 'uue elu',
    hero_subtitle: 'Restaureerime armastusega vana mööblit ning müüme ainulaadseid vintage mööblieksemplare. Iga ese räägib oma lugu.',
    hero_browse: 'Sirvi tooteid',
    hero_contact: 'Võta ühendust',

    // Values
    values_label: 'Meie väärtused',
    values_title: 'Miks valida meid?',
    values_subtitle: 'Oleme pühendunud kvaliteedile ja jätkusuutlikkusele',
    values_craft: 'Käsitöö',
    values_craft_desc: 'Iga ese restaureeritakse hoolikalt käsitsi, kasutades traditsioonilisi tehnikaid.',
    values_passion: 'Kirg',
    values_passion_desc: 'Armastame vana mööblit ja anname endast parima, et tuua välja selle ilu.',
    values_sustain: 'Jätkusuutlikkus',
    values_sustain_desc: 'Restaureerimine on keskkonnasõbralik viis mööbli eluea pikendamiseks.',

    // Featured
    featured_label: 'Kollektsioon',
    featured_title: 'Valitud tooted',
    featured_subtitle: 'Avasta meie parimad restaureeritud mööbliesemed',
    featured_viewAll: 'Vaata kõiki',

    // CTA
    cta_title: 'Kas sul on mööbel, mis vajab uue elu?',
    cta_subtitle: 'Võta meiega ühendust ja arutame, kuidas saame sinu lemmikut mööblit restaureerida.',
    cta_button: 'Küsi hinnapakkumist',

    // Shop
    shop_label: 'Kollektsioon',
    shop_title: 'Meie Pood',
    shop_subtitle: 'Sirvi meie hoolikalt restaureeritud mööblit. Iga ese on ainulaadne — osta endale sobiv!',
    shop_all: 'Kõik',
    shop_empty_all: 'Kõik tooted on hetkel müüdud.',
    shop_empty_cat: 'Selles kategoorias tooteid hetkel pole.',

    // Contact
    contact_label: 'Ühendus',
    contact_title: 'Kontakt',
    contact_subtitle: 'Võta meiega ühendust küsimuste, hinnapakkumiste või lihtsalt vestluse jaoks.',
    contact_visit: 'Külasta meid',
    contact_address: 'Aadress',
    contact_phone: 'Telefon',
    contact_email: 'E-post',
    contact_hours: 'Lahtiolekuajad',
    contact_send: 'Saada sõnum',
    contact_name: 'Nimi',
    contact_your_name: 'Sinu nimi',
    contact_your_email: 'sinu@email.ee',
    contact_phone_opt: 'Telefon (valikuline)',
    contact_subject: 'Teema',
    contact_subject_placeholder: 'Milles saame aidata?',
    contact_message: 'Sõnum',
    contact_message_placeholder: 'Kirjelda oma soovi...',
    contact_sent: 'Sõnum saadetud! Võtame teiega peagi ühendust.',

    // Product card
    product_buy: 'Osta',
    product_added: 'Lisatud',
    product_added_toast: 'lisatud ostukorvi',

    // Order (was reservation)
    order_title: 'Ostukorv',
    order_empty: 'Ostukorv on tühi',
    order_empty_subtitle: 'Sirvi meie poodi ja osta endale sobiv restaureeritud mööbel.',
    order_go_shop: 'Mine poodi',
    order_confirmed: 'Tellimus kinnitatud!',
    order_confirmed_msg: 'Aitäh! Arve saadetakse Teie poolt märgitud e-postile kui oleme tellimuse kätte saanud!',
    order_back_shop: 'Tagasi poodi',
    order_items_in: 'ostukorvis',
    order_product: 'toode',
    order_products: 'toodet',
    order_confirm: 'Kinnita tellimus',
    order_delivery: 'Kättetoimetamise viis:',
    order_pickup: 'Tulen poodi järgi',
    order_delivery_opt: 'Kohaletoimetamine',
    order_name: 'Nimi *',
    order_email: 'E-post *',
    order_phone: 'Telefon *',
    order_address: 'Kohaletoimetamise aadress *',
    order_address_placeholder: 'Täisaadress koos postiindeksiga',
    order_total: 'Kokku',
    order_after: 'Arve saadetakse Teie e-postile pärast tellimuse kinnitamist.',
    order_confirming: 'Kinnitamine...',
    order_confirm_btn: 'Kinnita tellimus',
    order_continue: 'Jätka sirvimist',
    order_error: 'Viga tellimuse tegemisel. Palun proovi uuesti.',
    order_address_required: 'Palun sisesta kohaletoimetamise aadress',

    // Admin
    admin_products: 'Tooted',
    admin_orders: 'Tellimused',
    admin_add: 'Lisa toode',
    admin_new: 'Uus toode',
    admin_edit: 'Muuda toodet',
    admin_name: 'Nimi',
    admin_category: 'Kategooria',
    admin_price: 'Hind (€)',
    admin_sale_price: 'Soodushind (€)',
    admin_sale_placeholder: 'Jäta tühjaks kui pole',
    admin_images: 'Pildid',
    admin_description: 'Kirjeldus',
    admin_save: 'Lisa toode',
    admin_saving: 'Salvestamine...',
    admin_save_edit: 'Salvesta muudatused',
    admin_cancel: 'Tühista',
    admin_delete_product: 'Kustuta toode?',
    admin_delete_confirm: 'Kas oled kindel, et soovid toote "{name}" kustutada? Seda toimingut ei saa tagasi võtta.',
    admin_delete: 'Kustuta',
    admin_reserved: 'Müüdud',
    admin_photos: 'pilti',
    admin_updated: 'Toode uuendatud',
    admin_added: 'Toode lisatud',
    admin_add_image: 'Lisa vähemalt üks pilt',
    admin_edit_fail: 'Muutmine ebaõnnestus',
    admin_add_fail: 'Lisamine ebaõnnestus',
    admin_delete_fail: 'Kustutamine ebaõnnestus',
    admin_deleted: 'Toode kustutatud',
    admin_no_orders: 'Tellimusi pole veel.',
    admin_order_deleted: 'Tellimus ja tooted kustutatud',
    admin_back_to_sale: 'Tagasi müüki',
    admin_all_back: 'Kõik tagasi müüki',
    admin_return_confirm_single: 'Toode muutub taas ostetavaks ja tellimus kustutatakse.',
    admin_return_confirm_multi: 'Kõik tooted muutuvad taas ostetavaks ja tellimus kustutatakse.',
    admin_return_item: 'Toode muutub taas ostetavaks.',
    admin_delete_order_single: 'Kustuta tellimus?',
    admin_delete_order_multi: 'Kustuta kogu tellimus?',
    admin_delete_order_desc_single: 'See kustutab tellimuse ja toote jäädavalt. Seda ei saa tagasi võtta.',
    admin_delete_order_desc_multi: 'See kustutab tellimuse JA kõik müüdud tooted. Seda ei saa tagasi võtta.',
    admin_return_single: 'Pane tagasi müüki?',
    admin_return_multi: 'Pane kõik tagasi müüki?',
    admin_delete_all: 'Kustuta kõik',
    admin_delivery: '🚚 Kohaletoimetamine',
    admin_pickup: '🏪 Poest järgi',
    admin_back_sale_success: 'Tooted tagasi müügis',
    admin_no_access: 'Ligipääs keelatud',
    admin_no_rights: 'Sul ei ole admin õigusi.',

    // Admin login
    login_title: 'Admin sisselogimine',
    login_email: 'E-post',
    login_password: 'Parool',
    login_button: 'Logi sisse',
    login_loading: 'Palun oota...',
    login_error: 'Vale e-post või parool',
    login_success: 'Sisselogimine õnnestus',

    // Not found
    notfound_title: '404',
    notfound_message: 'Lehte ei leitud',
    notfound_back: 'Tagasi avalehele',

    // Footer
    footer_tagline: 'Anname vanale mööblile uue elu. Käsitööna restaureeritud mööbel Eesti südamest.',
    footer_links: 'Kiirlingid',
    footer_contact: 'Kontakt',
    footer_rights: 'Kõik õigused kaitstud.',
    footer_subtitle: 'Restaureerimine & Müük',

    // Hours
    hours_mon_fri: 'E-R: 10:00 - 18:00',
    hours_sat: 'L: 10:00 - 15:00',
    hours_sun: 'P: Suletud',

    // Address
    address_line1: 'Keskväljak 10',
    address_line2: '76607 Keila, Eesti',
    address_short: 'Keskväljak 10, Keila',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_shop: 'Shop',
    nav_contact: 'Contact',
    nav_admin: 'Admin',
    auth_logout: 'Log out',

    // Hero
    hero_badge: 'Craftsmanship & Passion',
    hero_title1: 'We give old furniture',
    hero_title2: 'a new life',
    hero_subtitle: 'We lovingly restore old furniture and sell unique vintage pieces. Each item tells its own story.',
    hero_browse: 'Browse products',
    hero_contact: 'Get in touch',

    // Values
    values_label: 'Our values',
    values_title: 'Why choose us?',
    values_subtitle: 'We are dedicated to quality and sustainability',
    values_craft: 'Craftsmanship',
    values_craft_desc: 'Each piece is carefully restored by hand using traditional techniques.',
    values_passion: 'Passion',
    values_passion_desc: 'We love old furniture and do our best to bring out its beauty.',
    values_sustain: 'Sustainability',
    values_sustain_desc: 'Restoration is an eco-friendly way to extend the life of furniture.',

    // Featured
    featured_label: 'Collection',
    featured_title: 'Featured products',
    featured_subtitle: 'Discover our best restored furniture pieces',
    featured_viewAll: 'View all',

    // CTA
    cta_title: 'Do you have furniture that needs a new life?',
    cta_subtitle: 'Get in touch and let\'s discuss how we can restore your favorite piece of furniture.',
    cta_button: 'Get a quote',

    // Shop
    shop_label: 'Collection',
    shop_title: 'Our Shop',
    shop_subtitle: 'Browse our carefully restored furniture. Each piece is unique — buy the one that suits you!',
    shop_all: 'All',
    shop_empty_all: 'All products are currently sold.',
    shop_empty_cat: 'No products in this category at the moment.',

    // Contact
    contact_label: 'Contact',
    contact_title: 'Contact',
    contact_subtitle: 'Get in touch with us for questions, quotes or just a chat.',
    contact_visit: 'Visit us',
    contact_address: 'Address',
    contact_phone: 'Phone',
    contact_email: 'Email',
    contact_hours: 'Opening hours',
    contact_send: 'Send message',
    contact_name: 'Name',
    contact_your_name: 'Your name',
    contact_your_email: 'your@email.com',
    contact_phone_opt: 'Phone (optional)',
    contact_subject: 'Subject',
    contact_subject_placeholder: 'How can we help?',
    contact_message: 'Message',
    contact_message_placeholder: 'Describe your request...',
    contact_sent: 'Message sent! We will get back to you soon.',

    // Product card
    product_buy: 'Buy',
    product_added: 'Added',
    product_added_toast: 'added to cart',

    // Order
    order_title: 'Cart',
    order_empty: 'Cart is empty',
    order_empty_subtitle: 'Browse our shop and buy your favorite restored furniture.',
    order_go_shop: 'Go to shop',
    order_confirmed: 'Order confirmed!',
    order_confirmed_msg: 'Thank you! An invoice will be sent to your email once we have received your order!',
    order_back_shop: 'Back to shop',
    order_items_in: 'in cart',
    order_product: 'product',
    order_products: 'products',
    order_confirm: 'Confirm order',
    order_delivery: 'Delivery method:',
    order_pickup: 'Pick up from store',
    order_delivery_opt: 'Home delivery',
    order_name: 'Name *',
    order_email: 'Email *',
    order_phone: 'Phone *',
    order_address: 'Delivery address *',
    order_address_placeholder: 'Full address with postal code',
    order_total: 'Total',
    order_after: 'An invoice will be sent to your email after order confirmation.',
    order_confirming: 'Confirming...',
    order_confirm_btn: 'Confirm order',
    order_continue: 'Continue browsing',
    order_error: 'Error placing order. Please try again.',
    order_address_required: 'Please enter a delivery address',

    // Admin
    admin_products: 'Products',
    admin_orders: 'Orders',
    admin_add: 'Add product',
    admin_new: 'New product',
    admin_edit: 'Edit product',
    admin_name: 'Name',
    admin_category: 'Category',
    admin_price: 'Price (€)',
    admin_sale_price: 'Sale price (€)',
    admin_sale_placeholder: 'Leave empty if none',
    admin_images: 'Images',
    admin_description: 'Description',
    admin_save: 'Add product',
    admin_saving: 'Saving...',
    admin_save_edit: 'Save changes',
    admin_cancel: 'Cancel',
    admin_delete_product: 'Delete product?',
    admin_delete_confirm: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    admin_delete: 'Delete',
    admin_reserved: 'Sold',
    admin_photos: 'photos',
    admin_updated: 'Product updated',
    admin_added: 'Product added',
    admin_add_image: 'Add at least one image',
    admin_edit_fail: 'Update failed',
    admin_add_fail: 'Adding failed',
    admin_delete_fail: 'Deletion failed',
    admin_deleted: 'Product deleted',
    admin_no_orders: 'No orders yet.',
    admin_order_deleted: 'Order and products deleted',
    admin_back_to_sale: 'Return to sale',
    admin_all_back: 'All back to sale',
    admin_return_confirm_single: 'Product will become available for purchase and order will be deleted.',
    admin_return_confirm_multi: 'All products will become available for purchase and order will be deleted.',
    admin_return_item: 'Product will become available for purchase.',
    admin_delete_order_single: 'Delete order?',
    admin_delete_order_multi: 'Delete entire order?',
    admin_delete_order_desc_single: 'This will permanently delete the order and product. This cannot be undone.',
    admin_delete_order_desc_multi: 'This will delete the order AND all sold products. This cannot be undone.',
    admin_return_single: 'Return to sale?',
    admin_return_multi: 'Return all to sale?',
    admin_delete_all: 'Delete all',
    admin_delivery: '🚚 Home delivery',
    admin_pickup: '🏪 Store pickup',
    admin_back_sale_success: 'Products back on sale',
    admin_no_access: 'Access denied',
    admin_no_rights: 'You do not have admin rights.',

    // Admin login
    login_title: 'Admin login',
    login_email: 'Email',
    login_password: 'Password',
    login_button: 'Log in',
    login_loading: 'Please wait...',
    login_error: 'Wrong email or password',
    login_success: 'Login successful',

    // Not found
    notfound_title: '404',
    notfound_message: 'Page not found',
    notfound_back: 'Return to Home',

    // Footer
    footer_tagline: 'We give old furniture a new life. Handcrafted restored furniture from the heart of Estonia.',
    footer_links: 'Quick links',
    footer_contact: 'Contact',
    footer_rights: 'All rights reserved.',
    footer_subtitle: 'Restoration & Sales',

    // Hours
    hours_mon_fri: 'Mon-Fri: 10:00 - 18:00',
    hours_sat: 'Sat: 10:00 - 15:00',
    hours_sun: 'Sun: Closed',

    // Address
    address_line1: 'Keskväljak 10',
    address_line2: '76607 Keila, Estonia',
    address_short: 'Keskväljak 10, Keila',
  },
} as const;

export type Translations = Record<keyof typeof translations['et'], string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('moor-lang');
    return (saved === 'en' ? 'en' : 'et') as Language;
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('moor-lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
