import { Router } from 'express';
import {
  createStore,
  updateStore,
  deleteStore,
  adminGetStore,
  adminListStores,
} from '../controllers/storeController.js';
import {
  createPost,
  updatePost,
  deletePost,
  adminGetPost,
  adminListPosts,
} from '../controllers/blogController.js';
import { createFaq, updateFaq, deleteFaq, adminGetFaq, adminListFaqs } from '../controllers/faqController.js';
import {
  createCareer,
  updateCareer,
  deleteCareer,
  adminGetCareer,
  adminListCareers,
} from '../controllers/careerController.js';
import {
  getMessages,
  deleteMessage,
} from '../controllers/contactController.js';
import {
  listUsers,
  updateUserStatus,
} from '../controllers/userController.js';
import { dashboard } from '../controllers/adminController.js';
import {
  createBanner,
  updateBanner,
  deleteBanner,
  createSection,
  updateSection,
  deleteSection,
  adminListBanners,
  adminListSections,
  adminGetBanner,
  adminGetSection,
} from '../controllers/homeController.js';
import {
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
  adminListAboutSections,
  adminGetAboutSection,
} from '../controllers/aboutController.js';
import {
  adminListPages,
  adminGetPage,
  adminCreatePage,
  adminUpdatePage,
  adminDeletePage,
  adminPublishPage,
} from '../controllers/pageController.js';
import {
  adminListMenus,
  adminGetMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  moveMenuItem,
} from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requirePermission, requireStoreScope } from '../middleware/rbacMiddleware.js';
import { auditLogger } from '../middleware/auditLogger.js';

const router = Router();

// All admin routes require auth + a permission.
router.use(protect);

// Dashboard — any authenticated staff can view
router.get('/dashboard', dashboard);

// ---- Home (banners + sections) ----
router.get('/home/banners', requirePermission('home.manage'), adminListBanners);
router.get('/home/banners/:id', requirePermission('home.manage'), adminGetBanner);
router.post('/home/banners', requirePermission('home.manage'), auditLogger, createBanner);
router.put('/home/banners/:id', requirePermission('home.manage'), auditLogger, updateBanner);
router.delete('/home/banners/:id', requirePermission('home.manage'), auditLogger, deleteBanner);
router.get('/home/sections', requirePermission('home.manage'), adminListSections);
router.get('/home/sections/:id', requirePermission('home.manage'), adminGetSection);
router.post('/home/sections', requirePermission('home.manage'), auditLogger, createSection);
router.put('/home/sections/:id', requirePermission('home.manage'), auditLogger, updateSection);
router.delete('/home/sections/:id', requirePermission('home.manage'), auditLogger, deleteSection);

// ---- About ----
router.get('/about', requirePermission('about.manage'), adminListAboutSections);
router.get('/about/:id', requirePermission('about.manage'), adminGetAboutSection);
router.post('/about', requirePermission('about.manage'), auditLogger, createAboutSection);
router.put('/about/:id', requirePermission('about.manage'), auditLogger, updateAboutSection);
router.delete('/about/:id', requirePermission('about.manage'), auditLogger, deleteAboutSection);

// ---- Pages ----
router.get('/pages', requirePermission('pages.manage'), adminListPages);
router.get('/pages/:id', requirePermission('pages.manage'), adminGetPage);
router.post('/pages', requirePermission('pages.manage'), auditLogger, adminCreatePage);
router.put('/pages/:id', requirePermission('pages.manage'), auditLogger, adminUpdatePage);
router.delete('/pages/:id', requirePermission('pages.delete'), auditLogger, adminDeletePage);
router.post('/pages/:id/publish', requirePermission('pages.manage'), auditLogger, adminPublishPage);

// ---- Stores ----
router.get('/stores', requirePermission('stores.edit'), adminListStores);
router.get('/stores/:id', requirePermission('stores.edit'), adminGetStore);
router.post('/stores', requirePermission('stores.edit'), requireStoreScope(), auditLogger, createStore);
router.put('/stores/:id', requirePermission('stores.edit'), requireStoreScope(), auditLogger, updateStore);
router.delete('/stores/:id', requirePermission('stores.delete'), requireStoreScope(), auditLogger, deleteStore);

// ---- Blog ----
router.get('/blog', requirePermission('blog.manage'), adminListPosts);
router.get('/blog/:id', requirePermission('blog.manage'), adminGetPost);
router.post('/blog', requirePermission('blog.manage'), auditLogger, createPost);
router.put('/blog/:id', requirePermission('blog.manage'), auditLogger, updatePost);
router.delete('/blog/:id', requirePermission('blog.delete'), auditLogger, deletePost);

// ---- FAQs ----
router.get('/faqs', requirePermission('faqs.manage'), adminListFaqs);
router.get('/faqs/:id', requirePermission('faqs.manage'), adminGetFaq);
router.post('/faqs', requirePermission('faqs.manage'), auditLogger, createFaq);
router.put('/faqs/:id', requirePermission('faqs.manage'), auditLogger, updateFaq);
router.delete('/faqs/:id', requirePermission('faqs.delete'), auditLogger, deleteFaq);

// ---- Careers ----
router.get('/careers', requirePermission('careers.manage'), adminListCareers);
router.get('/careers/:id', requirePermission('careers.manage'), adminGetCareer);
router.post('/careers', requirePermission('careers.manage'), auditLogger, createCareer);
router.put('/careers/:id', requirePermission('careers.manage'), auditLogger, updateCareer);
router.delete('/careers/:id', requirePermission('careers.delete'), auditLogger, deleteCareer);

// ---- Menus ----
router.get('/menus', requirePermission('menus.manage'), adminListMenus);
router.post('/menus', requirePermission('menus.manage'), auditLogger, createMenu);
router.get('/menus/:id', requirePermission('menus.manage'), adminGetMenu);
router.put('/menus/:id', requirePermission('menus.manage'), auditLogger, updateMenu);
router.delete('/menus/:id', requirePermission('menus.manage'), auditLogger, deleteMenu);
router.post('/menus/:id/items', requirePermission('menus.manage'), auditLogger, createMenuItem);
router.put('/menu-items/:id', requirePermission('menus.manage'), auditLogger, updateMenuItem);
router.delete('/menu-items/:id', requirePermission('menus.manage'), auditLogger, deleteMenuItem);
router.post('/menu-items/:id/move', requirePermission('menus.manage'), auditLogger, moveMenuItem);

// ---- Contact ----
router.get('/contact', requirePermission('contact.view'), getMessages);
router.delete('/contact/:id', requirePermission('contact.delete'), auditLogger, deleteMessage);

// ---- Users ----
router.get('/users', requirePermission('users.view'), listUsers);
router.put('/users/:id/status', requirePermission('users.manage'), auditLogger, updateUserStatus);

export default router;