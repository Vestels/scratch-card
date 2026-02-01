import Image from "next/image";
import ScratchCardComponent from "./components/scratchCard";

export default function Home() {
  return (
    <main>
      <h1>Good luck!</h1>
      <div className="ticket-container">
        <Image
          className="ticket"
          src={"/scratch/respect_festival.png"}
          width={1200}
          height={300}
          draggable={false}
          alt=""
          priority
        />

        <div className="scratch-slot">
          <ScratchCardComponent />
        </div>
      </div>
    </main>
  );
}
