import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-center">
          Under Dev: Shifting from HTML/CSS/JS to Next.js
        </h1>
        <Image
          src="/img/rocket.png"
          alt="Rocket"
          width={200}
          height={200}
          priority
          className="animate-bounce"
        />
      </div>
    </main>
  );
}
