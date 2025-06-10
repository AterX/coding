import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { CommunityStats } from '@/components/home/CommunityStats';
import { HowItWorks } from '@/components/home/HowItWorks';
import { LatestIdeas } from '@/components/home/LatestIdeas';

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedProjects />
      <CommunityStats />
      <HowItWorks />
      <LatestIdeas />
    </div>
  );
}