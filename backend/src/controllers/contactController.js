import ContactMessage from '../models/contactMessageModel.js';
import logger from '../utils/logger.js';

// POST /api/contact  (mock — saves to DB, logs "email sent")
export async function createMessage(req, res, next) {
  try {
    const { first_name, last_name, email, subject, message } = req.body || {};
    if (!first_name || !last_name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = await ContactMessage.create({
      first_name,
      last_name,
      email,
      phone: req.body.phone,
      store_id: req.body.store_id || null,
      subject,
      message,
    });

    logger.info(`[mock] Contact message #${contact.id} from ${email} — email sent (mock)`);
    res.status(201).json({ message: 'Message sent (mock)', contact });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/contact
export async function getMessages(_req, res, next) {
  try {
    const messages = await ContactMessage.findAll();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/contact/:id
export async function deleteMessage(req, res, next) {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    await ContactMessage.remove(message.id);
    logger.info(`[mock] Contact message #${message.id} deleted`);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
}