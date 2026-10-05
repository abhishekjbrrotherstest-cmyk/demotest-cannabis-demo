import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Mock fallback API. Real embed: https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let productsCache = null;

async function getProducts() {
  if (!productsCache) {
    const raw = await readFile(path.join(__dirname, '../data/dutchie-products.json'), 'utf-8');
    productsCache = JSON.parse(raw);
  }
  return productsCache;
}

function embedUrl(storeId) {
  // Primary real URL, regardless of which store is requested.
  return process.env.DUTCHIE_EMBED_URL || 'https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec';
}

// GET /api/dutchie/config
export async function getConfig(_req, res, next) {
  try {
    res.json({ embedUrl: embedUrl(), source: 'https://dutchie.com/embedded-menu/ct-clone-canabiss-meriden-med-rec' });
  } catch (err) {
    next(err);
  }
}

// GET /api/dutchie/menu/:storeId
export async function getMenu(req, res, next) {
  try {
    const products = await getProducts();
    const storeId = req.params.storeId;
    res.json({
      storeId,
      storeName: 'DemoTest Cannabis Co. — Meriden',
      embedUrl: embedUrl(storeId),
      categories: [...new Set(products.map((p) => p.category))],
      products,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dutchie/menu/:storeId/:category
export async function getMenuByCategory(req, res, next) {
  try {
    const products = await getProducts();
    const { storeId, category } = req.params;
    const normalized = String(category).toLowerCase();
    const filtered = products.filter((p) => p.category.toLowerCase() === normalized);
    res.json({
      storeId,
      category,
      products: filtered,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/dutchie/product/:productId
export async function getProduct(req, res, next) {
  try {
    const products = await getProducts();
    const product = products.find((p) => p.id === req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    next(err);
  }
}