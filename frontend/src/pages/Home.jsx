import { usePageMeta } from '../hooks/usePageMeta';
import { homeApi } from '../api/contentApi';
import { useFetch } from '../hooks/useFetch';
import HeroCarousel from '../components/home/HeroCarousel';
import HomeSections from '../components/home/HomeSections';

export default function Home() {
  usePageMeta(
    'DemoTest Cannabis Co. — PA Medical Cannabis Dispensary',
    'DemoTest Cannabis Co. — five Pennsylvania medical cannabis dispensary locations, Dutchie order-ahead menu, and patient education.'
  );

  const sectionsState = useFetch(() => homeApi.getSections(), []);

  return (
    <>
      <HeroCarousel />
      <HomeSections sections={sectionsState.data?.sections} />
    </>
  );
}