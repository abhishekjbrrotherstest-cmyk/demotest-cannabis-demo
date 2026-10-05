import dotenv from 'dotenv';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

dotenv.config();

const DUTCHIE_URL = process.env.DUTCHIE_EMBED_URL || 'https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Real Unsplash cannabis / dispensary imagery
const U = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMG = {
  HERO1: U('photo-1603909223429-69bb7101f420', 1920),
  HERO2: U('photo-1554306297-0c86e837d24b', 1920),
  HERO3: U('photo-1594736797933-d0501ba2fe65', 1920),
  LEAF: U('photo-1579165466741-7f35e4755660'),
  STOREFRONT: U('photo-1587556930799-8dca6fad6d41'),
  FLOWER: U('photo-1603909223429-69bb7101f420', 1200),
  VAPE: U('photo-1530213786676-41ad9f7736f6', 1200),
  EDIBLE: U('photo-1582058091505-f87a2e55a40f', 1200),
  CONCENTRATE: U('photo-1512152272829-e3139592d56f', 1200),
  TINCTURE: U('photo-1585435557343-3b092031a831', 1200),
  TOPICAL: U('photo-1608571423902-eed4a5ad8108', 1200),
  AV1: U('photo-1494790108377-be9c29b29330', 600),
  AV2: U('photo-1507003211169-0a1dd7228f2d', 600),
  AV3: U('photo-1438761681033-6461ffad8d80', 600),
  AV4: U('photo-1500648767791-00dcc994a43e', 600),
  DISP1: U('photo-1603909223429-69bb7101f420'),
  DISP2: U('photo-1504805572947-34fad45aed93'),
  DISP3: U('photo-1587556930799-8dca6fad6d41'),
  DISP4: U('photo-1594736797933-d0501ba2fe65'),
  DISP5: U('photo-1587556930799-8dca6fad6d41'),
};

const ROLE_NAMES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  STORE_MANAGER: 'store_manager',
  MARKETING: 'marketing_manager',
};

const PERMISSIONS = [
  ['stores.edit', 'stores'],
  ['stores.delete', 'stores'],
  ['blog.manage', 'blog'],
  ['blog.delete', 'blog'],
  ['faqs.manage', 'faqs'],
  ['faqs.delete', 'faqs'],
  ['careers.manage', 'careers'],
  ['careers.delete', 'careers'],
  ['contact.view', 'contact'],
  ['contact.delete', 'contact'],
  ['users.view', 'users'],
  ['users.manage', 'users'],
  ['dashboard.view', 'dashboard'],
  ['home.manage', 'home'],
  ['about.manage', 'about'],
  ['pages.manage', 'pages'],
  ['pages.delete', 'pages'],
  ['menus.manage', 'menus'],
];

const ROLE_PERMISSIONS = {
  [ROLE_NAMES.SUPER_ADMIN]: PERMISSIONS.map(([name]) => name),
  [ROLE_NAMES.ADMIN]: [
    'stores.edit',
    'blog.manage',
    'faqs.manage',
    'careers.manage',
    'contact.view',
    'contact.delete',
    'users.view',
    'dashboard.view',
    'home.manage',
    'about.manage',
    'pages.manage',
    'pages.delete',
    'menus.manage',
  ],
  [ROLE_NAMES.STORE_MANAGER]: ['stores.edit', 'dashboard.view', 'contact.view'],
  [ROLE_NAMES.MARKETING]: ['blog.manage', 'blog.delete', 'faqs.manage', 'faqs.delete', 'careers.manage', 'dashboard.view'],
};

const USERS = [
  {
    first_name: 'Demo', last_name: 'Admin', email: 'admin@demotest.test', password: 'Admin123!',
    phone: '555-0101', role: ROLE_NAMES.SUPER_ADMIN,
  },
  {
    first_name: 'Sub', last_name: 'Admin', email: 'subadmin@demotest.test', password: 'SubAdmin123!',
    phone: '555-0102', role: ROLE_NAMES.ADMIN,
  },
  {
    first_name: 'Store', last_name: 'Manager', email: 'manager@demotest.test', password: 'Manager123!',
    phone: '555-0103', role: ROLE_NAMES.STORE_MANAGER, storeIndex: 0,
  },
  {
    first_name: 'Marketing', last_name: 'Manager', email: 'marketing@demotest.test', password: 'Market123!',
    phone: '555-0104', role: ROLE_NAMES.MARKETING,
  },
];

const STORES = [
  {
    slug: 'pittsburgh', name: 'DemoTest Pittsburgh', address: '4521 Liberty Ave',
    city: 'Pittsburgh', state: 'PA', zip: '15224', latitude: 40.4598, longitude: -79.9498,
    phone: '412-555-0121', email: 'pittsburgh@demotest.test',
    description: 'Our flagship store in the heart of Lawrenceville, with on-site parking and a private consultation room.',
    image_url: IMG.DISP1,
    parking_info: 'Free dedicated lot behind the building plus two-hour street parking on Liberty Ave.',
    accessibility_info: 'Step-free entrance, automatic doors, accessible restroom, and quiet check-in line.',
  },
  {
    slug: 'philadelphia', name: 'DemoTest Philadelphia', address: '2130 Sansom St',
    city: 'Philadelphia', state: 'PA', zip: '19103', latitude: 39.9509, longitude: -75.1725,
    phone: '215-555-0122', email: 'philadelphia@demotest.test',
    description: 'A center-city dispensary steps from Rittenhouse Square with grab-and-go pickup.',
    image_url: IMG.DISP2,
    parking_info: 'Valet available evenings; metered street parking on Sansom St.',
    accessibility_info: 'Step-free entrance with automatic doors and accessible checkout counter.',
  },
  {
    slug: 'reading', name: 'DemoTest Reading', address: '1400 N 5th St',
    city: 'Reading', state: 'PA', zip: '19601', latitude: 40.3443, longitude: -75.9274,
    phone: '610-555-0123', email: 'reading@demotest.test',
    description: 'Wide-open floorplan and a large education lounge for new patients.',
    image_url: IMG.DISP3,
    parking_info: 'Large free parking lot on-site with EV charging spots.',
    accessibility_info: 'Fully step-free store, service animals welcome, and staff trained in accessibility support.',
  },
  {
    slug: 'allentown', name: 'DemoTest Allentown', address: '2801 Hamilton Blvd',
    city: 'Allentown', state: 'PA', zip: '18104', latitude: 40.5908, longitude: -75.5202,
    phone: '610-555-0124', email: 'allentown@demotest.test',
    description: 'Drive-up pickup window plus a cozy consultation space for caregivers.',
    image_url: IMG.DISP4,
    parking_info: 'Drive-up lane for order pickup; free parking for in-store visits.',
    accessibility_info: 'Step-free entry, low counter access, and a caregiver waiting area.',
  },
  {
    slug: 'erie', name: 'DemoTest Erie', address: '3600 Peach St',
    city: 'Erie', state: 'PA', zip: '16508', latitude: 42.1056, longitude: -80.0837,
    phone: '814-555-0125', email: 'erie@demotest.test',
    description: 'Lake-side neighborhood dispensary known for its warm, patient-first staff.',
    image_url: IMG.DISP5,
    parking_info: 'Free on-site lot with ADA-accessible spaces near the entrance.',
    accessibility_info: 'Step-free entrance, automatic doors, and seated ordering kiosks.',
  },
];

const WEEKLY_HOURS = [
  { day_of_week: 0, open_time: '11:00:00', close_time: '17:00:00' },
  { day_of_week: 1, open_time: '10:00:00', close_time: '19:00:00' },
  { day_of_week: 2, open_time: '10:00:00', close_time: '19:00:00' },
  { day_of_week: 3, open_time: '10:00:00', close_time: '19:00:00' },
  { day_of_week: 4, open_time: '10:00:00', close_time: '20:00:00' },
  { day_of_week: 5, open_time: '10:00:00', close_time: '20:00:00' },
  { day_of_week: 6, open_time: '10:00:00', close_time: '19:00:00' },
];

const BLOG_POSTS = [
  {
    title: 'How to Get a Medical Marijuana Card in Pennsylvania',
    slug: 'how-to-get-a-medical-card-in-pennsylvania',
    author: 'Dr. Lena Whitfield',
    category: 'Medical Card',
    tags: 'medical card,PA,registration,mmj',
    publish_date: '2026-09-01',
    content: 'Step-by-step guide to the PA medical marijuana program: eligibility conditions, physician certification, registration with the PA DOH, and what to bring to the dispensary.',
    featured_image: IMG.FLOWER,
    seo_title: 'Pennsylvania Medical Marijuana Card Guide (2026)',
    meta_description: 'Everything you need to get your PA medical card — eligibility, doctor certification, state registration, and first purchase tips.',
  },
  {
    title: 'Sativa vs Indica vs Hybrid: A Patient-First Guide',
    slug: 'sativa-vs-indica-vs-hybrid-guide',
    author: 'Mark Rivera',
    category: 'Education',
    tags: 'sativa,indica,hybrid,effects,education',
    publish_date: '2026-08-20',
    content: 'Plain-language breakdown of how strains are classified, why terpenes matter as much as THC, and how to choose products that fit your goals.',
    featured_image: IMG.LEAF,
  },
  {
    title: 'Dosing Explained: Start Low and Go Slow',
    slug: 'dosing-start-low-go-slow',
    author: 'Dr. Lena Whitfield',
    category: 'Education',
    tags: 'dosing,edibles,thc,mg,new patients',
    publish_date: '2026-08-04',
    content: 'A practical guide to finding your dose: edible onset times, milligram math, and why everyone reacts differently.',
    featured_image: IMG.CONCENTRATE,
  },
  {
    title: 'Caregivers in the PA Program: What You Need to Know',
    slug: 'caregivers-pa-program-guide',
    author: 'Priya Sharma',
    category: 'Caregivers',
    tags: 'caregiver,PA,program,assist',
    publish_date: '2026-07-18',
    content: 'Who can be a caregiver, how to apply, and how many patients a caregiver can support in the Pennsylvania program.',
    featured_image: IMG.STOREFRONT,
  },
  {
    title: 'Terpenes 101: Citrus, Pine, and Earth',
    slug: 'terpenes-101-guide',
    author: 'Mark Rivera',
    category: 'Education',
    tags: 'terpenes,aroma,cannabinoids,guide',
    publish_date: '2026-07-02',
    content: 'Meet the aromas behind the effects: limonene, myrcene, pinene, and caryophyllene — and what to look for on a label.',
    featured_image: IMG.EDIBLE,
  },
  {
    title: 'Visiting DemoTest for the First Time',
    slug: 'first-visit-checklist',
    author: 'Priya Sharma',
    category: 'Company',
    tags: 'first visit,checklist,dispensary,what to expect',
    publish_date: '2026-06-15',
    content: 'A friendly walkthrough of your first dispensary visit: what to bring, what to expect at the door, and how ordering works.',
    featured_image: IMG.TINCTURE,
  },
];

const FAQS = [
  { question: 'Who can purchase medical cannabis in Pennsylvania?', answer: 'Any resident 18 or older (21+ for flower) with a valid Pennsylvania medical marijuana card issued by the PA DOH.', category: 'Medical Card', display_order: 1 },
  { question: 'How do I get a medical marijuana card?', answer: 'Get certified by a registered physician, then register with the Pennsylvania Department of Health and pay the fee. Your card arrives by mail in about 7-14 days.', category: 'Medical Card', display_order: 2 },
  { question: 'Can I use an out-of-state medical card in Pennsylvania?', answer: 'No. Pennsylvania does not currently recognize out-of-state cards. You need a PA-issued card to purchase here.', category: 'Medical Card', display_order: 3 },
  { question: 'How much can I purchase at once?', answer: 'PA patients may buy up to a 90-day supply per transaction. Our staff will help you stay within your legal daily and 90-day limits.', category: 'Medical Card', display_order: 4 },
  { question: 'What do I need to bring to the dispensary?', answer: "Your valid PA medical card and a government-issued photo ID. New patients should also bring their DOH patient ID number.", category: 'Purchasing', display_order: 5 },
  { question: 'Can I order ahead for pickup?', answer: 'Yes — every DemoTest location supports online order-ahead through our Dutchie-powered menu. Order, get a text when it is ready, and pick up at the counter.', category: 'Purchasing', display_order: 6 },
  { question: 'Do you offer delivery?', answer: 'Yes, within approved delivery zones. First delivery orders are free at every location.', category: 'Purchasing', display_order: 7 },
  { question: 'What forms of payment do you accept?', answer: 'Because banking rules vary, most locations accept cash and use a cashless ATM on site. Some locations accept select cards in-store.', category: 'Purchasing', display_order: 8 },
  { question: 'What is a caregiver and how do I bring one?', answer: 'A caregiver is a qualified adult who buys and transports medicine for you. They must be registered with the PA DOH. Bring their caregiver card along with yours.', category: 'Products', display_order: 9 },
  { question: 'How do edibles and tinctures differ?', answer: 'Edibles are digested and take 30-90 minutes to kick in but last longer. Tinctures are absorbed under the tongue and act in 15-30 minutes. Always start low and go slow.', category: 'Products', display_order: 10 },
];

const CAREERS = [
  {
    title: 'Patient Care Associate — Pittsburgh',
    location: 'Pittsburgh, PA',
    employment_type: 'Full-time',
    description: 'Welcome patients, verify cards, and help them find products that fit their needs.',
    requirements: 'Experience in patient-facing retail preferred; strong communication and empathy required; must be 18+ and pass a background check.',
    responsibilities: 'Greet patients at the door, verify medical cards, assist with product selection, and keep the sales floor tidy.',
  },
  {
    title: 'Certified Pharmacist — Philadelphia',
    location: 'Philadelphia, PA',
    employment_type: 'Full-time',
    description: 'Lead clinical consultations and ensure safe, informed product recommendations.',
    requirements: 'Active PharmD license and PA pharmacist registration; cannabis or behavioral health experience a plus.',
    responsibilities: 'Run consultation hours, review patient profiles, train staff on dosing and safety, and support compliance.',
  },
  {
    title: 'Delivery Driver — Allentown',
    location: 'Allentown, PA',
    employment_type: 'Part-time',
    description: 'Deliver verified orders within approved zones with care and discretion.',
    requirements: 'Valid PA driver’s license, clean record, and the ability to lift 25 lbs.',
    responsibilities: 'Route delivery orders, verify recipient IDs, log deliveries, and keep the vehicle clean.',
  },
  {
    title: 'Marketing Coordinator — Reading',
    location: 'Reading, PA',
    employment_type: 'Full-time',
    description: 'Help plan local events, loyalty programs, and patient education sessions.',
    requirements: '1-2 years marketing experience; content and social media skills welcome.',
    responsibilities: 'Coordinate weekly promos, manage the events calendar, and support the blog.',
  },
  {
    title: 'Inventory Technician — Erie',
    location: 'Erie, PA',
    employment_type: 'Full-time',
    description: 'Keep the vault accurate, organized, and audit-ready.',
    requirements: 'Detail-oriented and reliable; inventory or compliance experience a plus.',
    responsibilities: 'Perform daily counts, reconcile deliveries, tag products, and support monthly audits.',
  },
];

const CONTACT_MESSAGES = [
  { first_name: 'Dan', last_name: 'Kessler', email: 'dan@example.com', phone: '555-1101', subject: 'Questions about my card renewal', message: 'My card expires next month. Can I still shop while it renews? Thanks!' },
  { first_name: 'Amara', last_name: 'Okafor', email: 'amara@example.com', phone: '555-1102', subject: 'Caregiver registration help', message: 'I am trying to register as a caregiver for my mom and got stuck on step 3 of the DOH portal.' },
  { first_name: 'Jon', last_name: 'Stewart', email: 'jon@example.com', phone: '555-1103', subject: 'Event idea: low-dosage workshop', message: 'Would you host an evening workshop on low-dose edibles for older patients? I can help organize it.' },
];

// 3 rotating hero banners
const HERO_BANNERS = [
  {
    title: 'Medicine-first. Patient-obsessed.',
    subtitle: 'Five Pennsylvania dispensaries, one standard of care. Browse the live menu and order ahead through Dutchie.',
    image_url: IMG.HERO1,
    mobile_image_url: IMG.HERO1,
    cta_primary_text: 'Shop the Menu',
    cta_primary_link: '/shop',
    cta_secondary_text: 'Find a Store',
    cta_secondary_link: '/locations',
    overlay_opacity: 55,
    display_order: 1,
  },
  {
    title: 'Your PA Medical Card, Step by Step',
    subtitle: 'Certification, DOH registration, and your first visit — our guide walks you through every step.',
    image_url: IMG.HERO2,
    mobile_image_url: IMG.HERO2,
    cta_primary_text: 'Read the Guide',
    cta_primary_link: '/medical-card',
    cta_secondary_text: 'Ask a Question',
    cta_secondary_link: '/faq',
    overlay_opacity: 60,
    display_order: 2,
  },
  {
    title: 'Rewards That Add Up',
    subtitle: 'Earn points on every purchase and unlock member-only deals across all five locations.',
    image_url: IMG.HERO3,
    mobile_image_url: IMG.HERO3,
    cta_primary_text: 'See Tiers',
    cta_primary_link: '/rewards/tiers',
    cta_secondary_text: 'Join Rewards',
    cta_secondary_link: '/rewards',
    overlay_opacity: 55,
    display_order: 3,
  },
];

// 8 home sections (rendered in display_order)
const HOME_SECTIONS = [
  {
    section_key: 'hero', title: 'Compassionate Medical Cannabis', subtitle: 'Order ahead from a real Dutchie menu, get education-first advice, and earn rewards at five Pennsylvania locations.',
    description: 'A patient-first dispensary demo powered by a full-stack medical cannabis stack.', image_url: IMG.HERO1,
    cta_text: 'Shop the Menu', cta_link: '/shop', background_color: 'dark', display_order: 1,
  },
  {
    section_key: 'trust-badges', title: 'Trusted & Licensed', subtitle: null,
    description: 'PA DOH dispensary permit · Free delivery on first order · Loyalty rewards on every visit', image_url: null,
    cta_text: null, cta_link: null, background_color: 'cream', display_order: 2,
  },
  {
    section_key: 'store-locator', title: 'Five locations. One standard of care.', subtitle: 'Pick a store to see hours, events, and its live Dutchie menu.',
    description: null, image_url: IMG.STOREFRONT,
    cta_text: 'View all locations', cta_link: '/locations', background_color: 'cream', display_order: 3,
  },
  {
    section_key: 'medical-card', title: 'New to the Pennsylvania program?', subtitle: 'Certification, the DOH registration, fees, and your first visit — our guide walks you through every step.',
    description: null, image_url: IMG.LEAF,
    cta_text: 'Read the guide', cta_link: '/medical-card', background_color: 'brand', display_order: 4,
  },
  {
    section_key: 'faq-preview', title: 'Frequently asked questions', subtitle: 'The answers most patients ask us first.',
    description: null, image_url: null,
    cta_text: 'All FAQs', cta_link: '/faq', background_color: 'cream', display_order: 5,
  },
  {
    section_key: 'rewards', title: 'Rewards that add up', subtitle: 'Earn points on every purchase and unlock member-only deals.',
    description: 'Bronze, Silver, Gold, and Onyx tiers with escalating perks.', image_url: IMG.EDIBLE,
    cta_text: 'See rewards', cta_link: '/rewards', background_color: 'cream', display_order: 6,
  },
  {
    section_key: 'community', title: 'Community first', subtitle: 'Workshops, caregiver support groups, and local giving — every month.',
    description: null, image_url: IMG.VAPE,
    cta_text: 'Join us', cta_link: '/community', background_color: 'alt', display_order: 7,
  },
  {
    section_key: 'blog-preview', title: 'From the blog', subtitle: 'Patient education written and reviewed by our clinical team.',
    description: null, image_url: null,
    cta_text: 'All articles', cta_link: '/blog', background_color: 'alt', display_order: 8,
  },
  {
    section_key: 'newsletter', title: 'Deals, events & education', subtitle: 'Subscribe for monthly education, location events, and loyalty updates. No spam, ever.',
    description: null, image_url: null,
    cta_text: null, cta_link: null, background_color: 'dark', display_order: 9,
  },
];

// 7 about sections
const ABOUT_SECTIONS = [
  {
    section_type: 'story', title: 'Our Story', subtitle: 'From a single counter to five PA neighborhoods.',
    content: 'DemoTest began with a simple idea: a medical cannabis dispensary that treats patients like people, not tickets. Every store is built around seated consultations, honest budtenders, and education-first measurements.',
    image_url: IMG.STOREFRONT, display_order: 1,
  },
  {
    section_type: 'mission', title: 'Our Mission', subtitle: 'Care you can measure.',
    content: 'We believe medicine should feel like care. That means transparent dosing, clinician-reviewed guidance, and a warm front counter no matter which DemoTest you walk into.',
    image_url: IMG.LEAF, display_order: 2,
  },
  {
    section_type: 'values', title: 'Our Values',
    subtitle: 'Four promises we keep every day.',
    content: JSON.stringify([
      { label: 'Compassion', text: 'Every patient is met with patience, never judgment.' },
      { label: 'Quality', text: 'Lab-tested products and temperature-safe storage, always.' },
      { label: 'Education', text: 'A curriculum written and reviewed by clinicians.' },
      { label: 'Community', text: 'Workshops, caregiver groups, and local giving.' },
    ]),
    image_url: null, display_order: 3,
  },
  {
    section_type: 'team', title: 'Our Team',
    subtitle: 'The people behind the counter.',
    content: JSON.stringify([
      { name: 'Demo Admin', role: 'CEO & Co-founder', bio: 'Pharmacist by training, community builder by habit.', image: IMG.AV1 },
      { name: 'Priya Sharma', role: 'VP of Patient Care', bio: 'Leads our consultation program and budtender education.', image: IMG.AV2 },
      { name: 'Mark Rivera', role: 'Director of Education', bio: 'Writes the curriculum and hosts our workshops.', image: IMG.AV3 },
      { name: 'Dr. Lena Whitfield', role: 'Chief Clinical Officer', bio: 'Oversees dosing guidance and clinical consulting.', image: IMG.AV4 },
    ]),
    image_url: null, display_order: 4,
  },
  {
    section_type: 'features', title: 'Why Choose DemoTest',
    subtitle: 'Six reasons patients pick us.',
    content: JSON.stringify([
      { label: 'Order-ahead menu', text: 'Real Dutchie embed at every store.' },
      { label: '5 PA locations', text: 'Pittsburgh to Erie, we are everywhere.' },
      { label: 'First delivery free', text: 'Fast, discreet, approved-zone delivery.' },
      { label: 'Loyalty rewards', text: 'Points on every purchase, four tiers.' },
      { label: 'Education lounge', text: 'Workshops and one-on-one sessions.' },
      { label: 'Accessible stores', text: 'Step-free entry at every location.' },
    ]),
    image_url: null, display_order: 5,
  },
  {
    section_type: 'community', title: 'Community',
    subtitle: 'In it together, every month.',
    content: 'From low-dose edibles workshops to caregiver support groups, our stores host free community programming each month. Ask any location for the current calendar.',
    image_url: IMG.CONCENTRATE, display_order: 6,
  },
  {
    section_type: 'cta', title: 'Visit a DemoTest Location',
    subtitle: 'Five stores across Pennsylvania, all in the DemoTest family.',
    content: '/locations',
    image_url: IMG.HERO3, display_order: 7,
  },
];

// Custom CMS pages
const PAGES = [
  {
    title: 'Patient Guide', slug: 'patient-guide',
    content:
      '<h2>Getting started</h2><p>Bring your PA medical card and a government-issued photo ID. New patients may also want their DOH patient ID number handy.</p><h2>Your first visit</h2><p>Check in at the front desk, consult with a budtender, and start low and go slow with dosing.</p><h2>Ordering ahead</h2><p>Use the Dutchie menu to reserve products — we will text you when your order is ready for pickup.</p>',
    hero_image_url: IMG.LEAF, status: 'published',
    seo_title: 'Patient Guide | DemoTest Cannabis Co.', meta_description: 'How to prepare for your first DemoTest visit.', og_image: IMG.LEAF,
  },
  {
    title: 'Loyalty Program Terms', slug: 'loyalty-program-terms',
    content:
      '<h2>How points work</h2><p>Earn 1 point per dollar spent. Points expire after 12 months of account inactivity.</p><h2>Redemption</h2><p>Redeem points at any DemoTest location in 500-point increments toward products and accessories.</p>',
    hero_image_url: IMG.EDIBLE, status: 'published',
    seo_title: 'Loyalty Program Terms | DemoTest', meta_description: 'DemoTest rewards program terms and conditions.', og_image: IMG.EDIBLE,
  },
  {
    title: 'Dispensary Etiquette', slug: 'dispensary-etiquette',
    content:
      '<h2>Be ready at the door</h2><p>Have your medical card and ID out before you reach the front desk.</p><h2>Ask anything</h2><p>Questions about dosing, interactions, or strains? Our budtenders love them.</p><h2>Check the events</h2><p>Many locations host workshops — see the store events page for the latest.</p>',
    hero_image_url: IMG.STOREFRONT, status: 'published',
    seo_title: 'Dispensary Etiquette | DemoTest', meta_description: 'What to expect when visiting a DemoTest location.', og_image: IMG.STOREFRONT,
  },
];

// Navigation menus (key_name must be unique; used by Header, MobileNav, Footer)
const MENUS = [
  { key_name: 'header', label: 'Primary' },
  { key_name: 'mobile', label: 'Mobile' },
  { key_name: 'footer', label: 'Footer' },
];

// [label, url, sort_order]
const MENU_ITEMS = {
  header: [
    ['Home', '/', 1],
    ['Shop', '/shop', 2],
    ['FAQ', '/faq', 3],
    ['About Us', '/about', 4],
    ['Blog', '/blog', 5],
    ['Contact', '/contact', 6],
  ],
  mobile: [
    ['Home', '/', 1],
    ['Shop', '/shop', 2],
    ['Locations', '/locations', 3],
    ['FAQ', '/faq', 4],
    ['Medical Card', '/medical-card', 5],
    ['Rewards', '/rewards', 6],
    ['About', '/about', 7],
    ['Community', '/community', 8],
    ['Blog', '/blog', 9],
    ['Careers', '/careers', 10],
    ['Contact', '/contact', 11],
  ],
  footer: [
    ['Shop', '/shop', 1],
    ['Locations', '/locations', 2],
    ['FAQ', '/faq', 3],
    ['Rewards', '/rewards', 4],
    ['About Us', '/about', 5],
    ['Community', '/community', 6],
    ['Blog', '/blog', 7],
    ['Careers', '/careers', 8],
    ['Contact', '/contact', 9],
  ],
};

// A few events per store (upcoming — keep dynamic relative to seed date)
const STORE_EVENTS = (storeIndex) => [
  { title: 'New Patient Orientation', description: 'A relaxed 45-minute walkthrough of the program, card rules, and our menu.', event_date: '2026-10-14', start_time: '18:00:00', end_time: '19:00:00', location_detail: `DemoTest ${['Pittsburgh', 'Philadelphia', 'Reading', 'Allentown', 'Erie'][storeIndex]} — education lounge`, register_url: null, status: 'open' },
  { title: 'Low-Dose Edibles Workshop', description: 'How onset times and milligrams work — perfect if edibles have been hit or miss.', event_date: '2026-10-28', start_time: '19:00:00', end_time: '20:30:00', location_detail: 'Main sales floor', register_url: null, status: 'open' },
  { title: 'Caregiver Support Group', description: 'Monthly peer support and PA program updates for registered caregivers.', event_date: '2026-11-12', start_time: '17:30:00', end_time: '18:30:00', location_detail: `DemoTest ${['Pittsburgh', 'Philadelphia', 'Reading', 'Allentown', 'Erie'][storeIndex]} — consultation room`, register_url: null, status: 'open' },
];

async function clearTables() {
  const tables = [
    'audit_logs', 'role_permissions', 'users', 'job_applications', 'contact_messages',
    'store_events', 'store_holiday_hours', 'store_hours', 'stores', 'careers', 'faqs',
    'blog_posts', 'home_sections', 'hero_banners', 'about_sections', 'pages',
    'menu_items', 'menus',
    'media', 'seo_metadata', 'settings', 'permissions', 'roles',
  ];
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const t of tables) {
    await pool.query(`TRUNCATE TABLE \`${t}\``);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
}

async function seedRoles({ permissionIdsByRole }) {
  const roleIds = {};
  for (const [name, desc] of [
    [ROLE_NAMES.SUPER_ADMIN, 'Full system access'],
    [ROLE_NAMES.ADMIN, 'Day-to-day store operations management'],
    [ROLE_NAMES.STORE_MANAGER, 'Operates within a single assigned store'],
    [ROLE_NAMES.MARKETING, 'Manages content, FAQs, and campaigns'],
  ]) {
    const [result] = await pool.query('INSERT INTO roles (name, description) VALUES (?, ?)', [name, desc]);
    roleIds[name] = result.insertId;
  }

  for (const [name, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
    for (const p of permissionNames) {
      const pid = permissionIdsByRole[p];
      await pool.query(
        'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
        [roleIds[name], pid]
      );
    }
  }
  return roleIds;
}

async function seedUsers(roleIds, storeIds) {
  for (const u of USERS) {
    const roleId = roleIds[u.role];
    const storeId = u.storeIndex !== undefined ? storeIds[u.storeIndex] : null;
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role_id, store_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
      [u.first_name, u.last_name, u.email, u.phone, await bcrypt.hash(u.password, 10), roleId, storeId]
    );
  }
}

async function main() {
  console.log('Seeding DemoTest Cannabis Co. database...');
  await clearTables();

  // Permissions
  const permissionIdsByRole = {};
  for (const [name, module] of PERMISSIONS) {
    const [result] = await pool.query('INSERT INTO permissions (name, module) VALUES (?, ?)', [name, module]);
    permissionIdsByRole[name] = result.insertId;
  }

  // Roles + role_permissions
  const roleIds = await seedRoles({ permissionIdsByRole });

  // Stores
  const storeIds = [];
  for (const s of STORES) {
    const [result] = await pool.query(
      `INSERT INTO stores
         (slug, name, address, city, state, zip, latitude, longitude, phone, email, description,
          image_url, dutchie_menu_id, dutchie_menu_url, google_maps_url, parking_info, accessibility_info, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        s.slug, s.name, s.address, s.city, s.state, s.zip, s.latitude, s.longitude,
        s.phone, s.email, s.description, s.image_url,
        `demotest-${s.slug}`, DUTCHIE_URL,
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address} ${s.city} ${s.state}`)}`,
        s.parking_info, s.accessibility_info,
      ]
    );
    storeIds.push(result.insertId);
    for (const h of WEEKLY_HOURS) {
      await pool.query(
        'INSERT INTO store_hours (store_id, day_of_week, open_time, close_time) VALUES (?, ?, ?, ?)',
        [result.insertId, h.day_of_week, h.open_time, h.close_time]
      );
    }
    for (const ev of STORE_EVENTS(storeIds.length - 1)) {
      await pool.query(
        `INSERT INTO store_events (store_id, title, description, event_date, start_time, end_time, location_detail, register_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [result.insertId, ev.title, ev.description, ev.event_date, ev.start_time, ev.end_time, ev.location_detail, ev.register_url || null, ev.status]
      );
    }
  }

  // Users
  await seedUsers(roleIds, storeIds);

  // Blog posts
  for (const p of BLOG_POSTS) {
    await pool.query(
      `INSERT INTO blog_posts
         (title, slug, featured_image, content, author, category, tags, publish_date, seo_title, meta_description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [
        p.title, p.slug, p.featured_image, p.content, p.author, p.category,
        p.tags || null, p.publish_date || null, p.seo_title || null, p.meta_description || null,
      ]
    );
  }

  // FAQs
  for (const f of FAQS) {
    await pool.query(
      'INSERT INTO faqs (question, answer, category, display_order, status) VALUES (?, ?, ?, ?, \'active\')',
      [f.question, f.answer, f.category, f.display_order]
    );
  }

  // Careers
  for (const c of CAREERS) {
    await pool.query(
      `INSERT INTO careers (title, location, employment_type, description, requirements, responsibilities, status)
       VALUES (?, ?, ?, ?, ?, ?, 'open')`,
      [c.title, c.location, c.employment_type, c.description, c.requirements, c.responsibilities]
    );
  }

  // Contact messages
  for (const m of CONTACT_MESSAGES) {
    await pool.query(
      `INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [m.first_name, m.last_name, m.email, m.phone, m.subject, m.message]
    );
  }

  // Hero banners
  for (const b of HERO_BANNERS) {
    await pool.query(
      `INSERT INTO hero_banners
         (title, subtitle, image_url, mobile_image_url, cta_primary_text, cta_primary_link,
          cta_secondary_text, cta_secondary_link, overlay_opacity, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        b.title, b.subtitle, b.image_url, b.mobile_image_url,
        b.cta_primary_text, b.cta_primary_link, b.cta_secondary_text, b.cta_secondary_link,
        b.overlay_opacity, b.display_order,
      ]
    );
  }

  // Home sections
  for (const s of HOME_SECTIONS) {
    await pool.query(
      `INSERT INTO home_sections
         (section_key, title, subtitle, description, image_url, cta_text, cta_link, background_color, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        s.section_key, s.title || null, s.subtitle || null, s.description || null,
        s.image_url || null, s.cta_text || null, s.cta_link || null,
        s.background_color || 'cream', s.display_order,
      ]
    );
  }

  // About sections
  for (const a of ABOUT_SECTIONS) {
    await pool.query(
      `INSERT INTO about_sections (section_type, title, subtitle, content, image_url, display_order, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [a.section_type, a.title, a.subtitle || null, a.content || null, a.image_url || null, a.display_order]
    );
  }

  // Pages
  for (const p of PAGES) {
    await pool.query(
      `INSERT INTO pages (title, slug, content, hero_image_url, seo_title, meta_description, og_image, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.title, p.slug, p.content, p.hero_image_url, p.seo_title || null, p.meta_description || null, p.og_image || null, p.status]
    );
  }

  // Navigation menus
  const menuIds = {};
  for (const m of MENUS) {
    const [result] = await pool.query(
      'INSERT INTO menus (key_name, label, status) VALUES (?, ?, \'active\')',
      [m.key_name, m.label]
    );
    menuIds[m.key_name] = result.insertId;
    if (MENU_ITEMS[m.key_name]) {
      for (const [label, url, order] of MENU_ITEMS[m.key_name]) {
        await pool.query(
          'INSERT INTO menu_items (menu_id, label, url, sort_order, status) VALUES (?, ?, ?, ?, \'active\')',
          [menuIds[m.key_name], label, url, order]
        );
      }
    }
  }

  // Settings — brand + Dutchie URL (single source of truth)
  await pool.query('INSERT IGNORE INTO settings (key_name, value) VALUES (\'brand_name\', \'DemoTest Cannabis Co.\')');
  await pool.query('INSERT IGNORE INTO settings (key_name, value) VALUES (\'dutchie_embed_url\', ?)', [DUTCHIE_URL]);

  console.log('');
  console.log('=== Seed complete ===');
  console.log('');
  console.log('Demo login credentials (backend):');
  console.log('  Super Admin   admin@demotest.test     / Admin123!');
  console.log('  Admin         subadmin@demotest.test  / SubAdmin123!');
  console.log('  Store Manager manager@demotest.test   / Manager123!');
  console.log('  Marketing     marketing@demotest.test / Market123!');
  console.log('');
  console.log(`Dutchie embed URL: ${DUTCHIE_URL}`);
  console.log(`Stores seeded: ${storeIds.length} (every store menu = ${DUTCHIE_URL})`);
  console.log(`Hero banners: ${HERO_BANNERS.length} · Home sections: ${HOME_SECTIONS.length} · About sections: ${ABOUT_SECTIONS.length} · Pages: ${PAGES.length}`);
  console.log(`Menus: ${MENUS.length} (${Object.values(MENU_ITEMS).reduce((n, items) => n + items.length, 0)} items total)`);
  console.log('Frontend admin login: /admin/login (uses the same backend credentials).');
  await pool.end();
}

main().catch(async (err) => {
  console.error('Seeding failed:', err);
  await pool.end();
  process.exit(1);
});