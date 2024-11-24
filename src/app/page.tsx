import { Footer, Header } from "@/components/Header";
import { About } from "@/components/home/AboutSection";

import { AppLayout } from "@/layout/AppLayout";


export default function Home() {
  return (
    <>
    < AppLayout >
    <About />
    <Footer />
    </AppLayout>
    </>
  );
}
