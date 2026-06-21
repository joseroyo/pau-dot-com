import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="Home" />
      <h1 className="text-[60px]">I REVIEW STUFF!!!</h1>
      <Window title="By Paul (ina) Cortes!" className="max-w-[748px] w-[100%] self-center mt-5">
        <h2>Hello!</h2>
        <p>Click on the tabs to see some of my reviews or more about me!</p>
      </Window>
      <Window title="Newsletter!" className="max-w-[748px] w-[100%] self-center mt-5">
        <NewsletterForm />
      </Window>
    </main>
  );
}
