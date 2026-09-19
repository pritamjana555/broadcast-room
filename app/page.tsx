import { Categories } from "./components/home/categories";
import { ConversationMarquee } from "./components/home/conversation-marquee";
import { CreateRoomCTA } from "./components/home/create-room-cta";
import { HomeFooter } from "./components/home/footer";
import { Hero } from "./components/home/hero";
import { HowItWorks } from "./components/home/how-it-works";
import { LiveRooms } from "./components/home/live-rooms";
import { HomeNavbar } from "./components/home/navbar";

export default function Home() {
  return (
    <main className="home-page">
      <HomeNavbar />
      <Hero />
      <div className="post-hero">
        <ConversationMarquee />

        <LiveRooms />

        <Categories />

        <HowItWorks />

        <CreateRoomCTA />

        <HomeFooter />
      </div>
    </main>
  );
}