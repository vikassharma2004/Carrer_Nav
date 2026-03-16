import Navbar            from '../components/layout/Navbar'
import Footer            from '../components/layout/Footer'
import HeroSection       from '../components/sections/HeroSection'
import AnatomySection    from '../components/sections/AnatomySection'
import AIMentorSection   from '../components/sections/AIMentorSection'
import CommunitySection  from '../components/sections/CommunitySection'
import ProgressSection   from '../components/sections/ProgressSection'
import MentorCTASection  from '../components/sections/MentorCTASection'
import RoadmapLibrary    from '../components/sections/RoadmapLibrary'
import FinalCTA          from '../components/sections/FinalCTA'
import ScrollPath        from '../components/ui/ScrollPath'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white font-sans">
      <ScrollPath />
      <Navbar />
      <main>
        <HeroSection />
        <AnatomySection />
        <AIMentorSection />
        <CommunitySection />
        <ProgressSection />
        <MentorCTASection />
        <RoadmapLibrary />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
