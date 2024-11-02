import { Footer, Header } from "@/components/Header";
import { About } from "@/components/home/AboutSection";
import { HomeSection } from "@/components/HomeSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Header />
    <About />
    <Footer />
    </>
  );
}
