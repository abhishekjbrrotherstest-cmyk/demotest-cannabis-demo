import Menu from '../models/menuModel.js';
import logger from '../utils/logger.js';

// GET /api/menus — public: active menus with active items
export async function getMenus(req, res, next) {
  try {
    const menus = await Menu.findAllWithItems();
    res.json({ menus });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/menus
export async function adminListMenus(req, res, next) {
  try {
    const menus = await Menu.findAllMenus();
    const result = [];
    for (const menu of menus) {
      result.push({ ...menu, items: await Menu.findItemsByMenu(menu.id) });
    }
    res.json({ menus: result });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/menus/:id
export async function adminGetMenu(req, res, next) {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json({ menu: { ...menu, items: await Menu.findItemsByMenu(menu.id) } });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/menus
export async function createMenu(req, res, next) {
  try {
    if (!req.body.key_name) {
      return res.status(400).json({ message: 'key_name is required' });
    }
    const existing = await Menu.findByKey(req.body.key_name);
    if (existing) return res.status(409).json({ message: 'A menu with that key already exists' });
    const menu = await Menu.createMenu(req.body);
    logger.info(`Menu created: ${menu.key_name}`);
    res.status(201).json({ menu });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/menus/:id
export async function updateMenu(req, res, next) {
  try {
    const existing = await Menu.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Menu not found' });
    if (req.body.key_name) {
      const dup = await Menu.findByKey(req.body.key_name);
      if (dup && dup.id !== existing.id) {
        return res.status(409).json({ message: 'A menu with that key already exists' });
      }
    }
    const menu = await Menu.updateMenu(existing.id, req.body);
    logger.info(`Menu updated: ${menu.key_name}`);
    res.json({ menu });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/menus/:id
export async function deleteMenu(req, res, next) {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    await Menu.removeMenu(menu.id);
    logger.info(`Menu deleted: ${menu.key_name}`);
    res.json({ message: 'Menu deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/menus/:id/items
export async function createMenuItem(req, res, next) {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    if (!req.body.label) {
      return res.status(400).json({ message: 'label is required' });
    }
    const item = await Menu.createItem({ ...req.body, menu_id: menu.id });
    logger.info(`Menu item created: ${item.label}`);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/menu-items/:id
export async function updateMenuItem(req, res, next) {
  try {
    const existing = await Menu.findItemById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Menu item not found' });
    const item = await Menu.updateItem(existing.id, req.body);
    logger.info(`Menu item updated: ${item.label}`);
    res.json({ item });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/menu-items/:id
export async function deleteMenuItem(req, res, next) {
  try {
    const item = await Menu.findItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    await Menu.removeItem(item.id);
    logger.info(`Menu item deleted: ${item.label}`);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/menu-items/:id/move  { direction: 'up' | 'down' }
export async function moveMenuItem(req, res, next) {
  try {
    const { direction } = req.body || {};
    if (!['up', 'down'].includes(direction)) {
      return res.status(400).json({ message: 'direction must be "up" or "down"' });
    }
    const { item, items } = await Menu.moveItem(req.params.id, direction);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    logger.info(`Menu item moved ${direction}: ${item.label}`);
    res.json({ items });
  } catch (err) {
    next(err);
  }
}