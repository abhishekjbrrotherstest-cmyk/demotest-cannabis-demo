export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://demotest.example.com';

export const DUTCHIE_EMBED_URL =
  import.meta.env.VITE_DUTCHIE_EMBED_URL ||
  'https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec';

export const IMAGE_BASE = 'https://images.unsplash.com/';

export const img = (uid, w = 1200) =>
  `${IMAGE_BASE}${uid}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero1: img('photo-1603909223429-69bb7101f420', 1920),
  hero2: img('photo-1611072836531-5b6ba4c1d3bb', 1920),
  hero3: img('photo-1594736797933-d0501ba2fe65', 1920),
  leaf: img('photo-1596392636774-e0f18c5b6e9d'),
  storefront: img('photo-1587556930799-8dca6fad6d41'),
  flower: img('photo-1603909223429-69bb7101f420'),
  vape: img('photo-1611234196443-b1a6d7c0e5a0'),
  edibles: img('photo-1582058091505-f87a2e55a40f'),
  concentrate: img('photo-1611072836531-5b6ba4c1d3bb'),
  tincture: img('photo-1585435557343-3b092031a831'),
  topical: img('photo-1608571423902-eed4a5ad8108'),
  avatar1: img('photo-1494790108377-be9c29b29330', 600),
  avatar2: img('photo-1507003211169-0a1dd7228f2d', 600),
  avatar3: img('photo-1438761681033-6461ffad8d80', 600),
  avatar4: img('photo-1500648767791-00dcc994a43e', 600),
};

export const BRAND = {
  name: 'DemoTest Cannabis Co.',
  shortName: 'DemoTest',
  phone: '800-555-DEMO',
  email: 'hello@demotest.test',
};