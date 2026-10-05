-- ============================================================
-- DemoTest Cannabis Co. — MySQL Schema
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- role_permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(40) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  store_id INT UNSIGNED DEFAULT NULL,
  status ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
  last_login DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_users_role (role_id),
  KEY idx_users_email (email),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- stores
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stores (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(80) NOT NULL,
  state CHAR(2) NOT NULL DEFAULT 'PA',
  zip VARCHAR(10) NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(160) DEFAULT NULL,
  description TEXT,
  image_url VARCHAR(500) DEFAULT NULL,
  dutchie_menu_id VARCHAR(120) DEFAULT NULL,
  dutchie_menu_url VARCHAR(500) DEFAULT NULL,
  google_maps_url VARCHAR(500) DEFAULT NULL,
  parking_info TEXT,
  accessibility_info TEXT,
  status ENUM('active','closed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stores_city (city),
  KEY idx_stores_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- store_hours
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_hours (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id INT UNSIGNED NOT NULL,
  day_of_week TINYINT NOT NULL, -- 0=Sunday .. 6=Saturday
  open_time TIME DEFAULT NULL,
  close_time TIME DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_store_day (store_id, day_of_week),
  CONSTRAINT fk_hours_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- store_holiday_hours
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_holiday_hours (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  open_time TIME DEFAULT NULL,
  close_time TIME DEFAULT NULL,
  closed TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_holiday_store_date (store_id, date),
  CONSTRAINT fk_holiday_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- blog_posts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  featured_image VARCHAR(500) DEFAULT NULL,
  content LONGTEXT,
  author VARCHAR(120) NOT NULL,
  category VARCHAR(80) DEFAULT NULL,
  tags VARCHAR(500) DEFAULT NULL,
  publish_date DATE DEFAULT NULL,
  seo_title VARCHAR(200) DEFAULT NULL,
  meta_description VARCHAR(320) DEFAULT NULL,
  og_image VARCHAR(500) DEFAULT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  PRIMARY KEY (id),
  KEY idx_blog_status_publish (status, publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- faqs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  question VARCHAR(300) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','archived') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id),
  KEY idx_faq_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- careers
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS careers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  employment_type VARCHAR(40) NOT NULL DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT,
  responsibilities TEXT,
  status ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_careers_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- job_applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  career_id INT UNSIGNED NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  resume_url VARCHAR(500) DEFAULT NULL,
  cover_letter TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_applications_career (career_id),
  CONSTRAINT fk_applications_career FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- contact_messages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  store_id INT UNSIGNED DEFAULT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_created (created_at),
  CONSTRAINT fk_contact_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- media
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  mime_type VARCHAR(80) DEFAULT NULL,
  size INT UNSIGNED DEFAULT 0,
  uploaded_by INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_media_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- seo_metadata
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_metadata (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_path VARCHAR(255) NOT NULL UNIQUE,
  seo_title VARCHAR(200) DEFAULT NULL,
  meta_description VARCHAR(320) DEFAULT NULL,
  og_title VARCHAR(200) DEFAULT NULL,
  og_description VARCHAR(320) DEFAULT NULL,
  og_image VARCHAR(500) DEFAULT NULL,
  canonical_url VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- settings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  key_name VARCHAR(120) NOT NULL UNIQUE,
  value TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- audit_logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED DEFAULT NULL,
  action VARCHAR(120) NOT NULL,
  entity VARCHAR(80) DEFAULT NULL,
  entity_id VARCHAR(40) DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_user (user_id),
  KEY idx_audit_entity (entity, entity_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- home_sections (Home page content blocks, rendered in order)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS home_sections (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_key VARCHAR(60) NOT NULL UNIQUE,
  title VARCHAR(200) DEFAULT NULL,
  subtitle VARCHAR(320) DEFAULT NULL,
  description TEXT,
  image_url VARCHAR(500) DEFAULT NULL,
  cta_text VARCHAR(120) DEFAULT NULL,
  cta_link VARCHAR(500) DEFAULT NULL,
  background_color VARCHAR(20) DEFAULT 'brand',
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- hero_banners (rotating hero carousel slides)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_banners (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(400) DEFAULT NULL,
  image_url VARCHAR(500) NOT NULL,
  mobile_image_url VARCHAR(500) DEFAULT NULL,
  cta_primary_text VARCHAR(120) DEFAULT NULL,
  cta_primary_link VARCHAR(500) DEFAULT NULL,
  cta_secondary_text VARCHAR(120) DEFAULT NULL,
  cta_secondary_link VARCHAR(500) DEFAULT NULL,
  overlay_opacity INT NOT NULL DEFAULT 55,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- about_sections (About page content blocks, rendered in order)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_sections (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  section_type VARCHAR(40) NOT NULL DEFAULT 'story',
  title VARCHAR(200) DEFAULT NULL,
  subtitle VARCHAR(320) DEFAULT NULL,
  content TEXT,
  image_url VARCHAR(500) DEFAULT NULL,
  display_order INT NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- pages (custom CMS pages, rendered via /p/:slug)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  content LONGTEXT,
  hero_image_url VARCHAR(500) DEFAULT NULL,
  seo_title VARCHAR(200) DEFAULT NULL,
  meta_description VARCHAR(320) DEFAULT NULL,
  og_image VARCHAR(500) DEFAULT NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pages_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- store_events (location events calendar)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_id INT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  location_detail VARCHAR(320) DEFAULT NULL,
  register_url VARCHAR(500) DEFAULT NULL,
  status ENUM('open','closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_events_store_date (store_id, event_date),
  CONSTRAINT fk_events_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- menus (navigation menus — header, mobile, footer)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menus (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  key_name VARCHAR(60) NOT NULL UNIQUE,
  label VARCHAR(120) NOT NULL,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- menu_items (links inside a menu)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  menu_id INT UNSIGNED NOT NULL,
  label VARCHAR(120) NOT NULL,
  url VARCHAR(500) NOT NULL DEFAULT '/',
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('active','hidden') NOT NULL DEFAULT 'active',
  PRIMARY KEY (id),
  KEY idx_menu_items_menu (menu_id),
  CONSTRAINT fk_items_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;