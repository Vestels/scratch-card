import Image from "next/image";
import ScratchCardComponent from "./components/scratchCard";
import CopyIcon from "./components/copyIcon";

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
          priority={true}
        />

        <div className="scratch-slot">
          <ScratchCardComponent />
        </div>
      </div>

      <div className="info-container">
        <strong className="label">Ticket Number:</strong>
        <span className="ticket-number">0123456789</span>
        <CopyIcon text="0123456789" />
      </div>
    </main>
  );
}
