import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ShopStore from './pages/ShopStore';
import Locations from './pages/Locations';
import StoreDetail from './pages/StoreDetail';
import LocationsEvents from './pages/LocationsEvents';
import FAQ from './pages/FAQ';
import MedicalCard from './pages/MedicalCard';
import Rewards from './pages/Rewards';
import RewardsTiers from './pages/RewardsTiers';
import About from './pages/About';
import Community from './pages/Community';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import CareerDetail from './pages/CareerDetail';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import CmsPage from './pages/CmsPage';
import Search from './pages/Search';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';
import AdminBlog from './pages/admin/AdminBlog';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminCareers from './pages/admin/AdminCareers';
import AdminContact from './pages/admin/AdminContact';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHome from './pages/admin/AdminHome';
import AdminAbout from './pages/admin/AdminAbout';
import AdminPages from './pages/admin/AdminPages';
import AdminMenus from './pages/admin/AdminMenus';
import AdminStoresEdit from './pages/admin/AdminStoresEdit';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminFaqEdit from './pages/admin/AdminFaqEdit';
import AdminCareerEdit from './pages/admin/AdminCareerEdit';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:storeSlug" element={<ShopStore />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<StoreDetail />} />
        <Route path="/locations/events" element={<LocationsEvents />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/medical-card" element={<MedicalCard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/rewards/tiers" element={<RewardsTiers />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/category/:category" element={<Blog />} />
        <Route path="/blog/tag/:tag" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:id" element={<CareerDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pages/:slug" element={<CmsPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sitemap" element={<Sitemap />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/accessibility" element={<Legal />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="home/banners/:id" element={<AdminHome />} />
        <Route path="home/sections/:id" element={<AdminHome />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="about/:id" element={<AdminAbout />} />
        <Route path="pages" element={<AdminPages />} />
        <Route path="pages/:id" element={<AdminPages />} />
        <Route path="menus" element={<AdminMenus />} />
        <Route path="stores" element={<AdminStores />} />
        <Route path="stores/:id/edit" element={<AdminStoresEdit />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="blog/new" element={<AdminBlogEdit />} />
        <Route path="blog/:id/edit" element={<AdminBlogEdit />} />
        <Route path="faqs" element={<AdminFAQs />} />
        <Route path="faqs/new" element={<AdminFaqEdit />} />
        <Route path="faqs/:id/edit" element={<AdminFaqEdit />} />
        <Route path="careers" element={<AdminCareers />} />
        <Route path="careers/new" element={<AdminCareerEdit />} />
        <Route path="careers/:id/edit" element={<AdminCareerEdit />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}