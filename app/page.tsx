import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Solve from "@/components/Solve";
import Work from "@/components/Work";
import Process from "@/components/Process";
import About from "@/components/About";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1} className="relative">
      <Nav />
      <Hero />
      <Marquee />
      <Solve />
      <Work />
      <Process />
      <About />
      <FinalCTA />
      <Footer />
    </main>
  );
}
