import { Helmet } from 'react-helmet-async';

export function usePageMeta(title, description) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}