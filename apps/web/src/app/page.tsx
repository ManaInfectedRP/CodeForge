import { LandingContent } from '@/components/LandingContent';
import { getPaths, getTestimonials } from '@/lib/content';

export default function HomePage() {
  // "public" is the holder path for the free sample course, it has no logo and no roadmap
  const paths = getPaths().filter((p) => p.slug !== 'public');
  return <LandingContent paths={paths} reviews={getTestimonials()} />;
}
