import { publicCatalog } from "@/lib/repository";
import {
  HeroSection,
  TrustSection,
  ProcessSection,
  IndustriesGrid,
  FinalCtaSection,
  CertificationStrip,
} from "@/components/sections";
import { ServicesGrid, ProductsGrid } from "@/components/products";
import { BeforeAfterSection } from "@/components/before-after";
import { ProjectsGrid } from "@/components/projects";
import { Resources } from "@/components/resources";
import { ContactSection } from "@/components/contact";

export default async function Home() {
  const catalog = await publicCatalog();
  return (
    <main id="main">
      <HeroSection
        products={catalog.products.length}
        services={catalog.services.length}
      />
      <ServicesGrid />
      <BeforeAfterSection />
      <ProductsGrid />
      <TrustSection />
      <ProcessSection />
      <IndustriesGrid />
      <ProjectsGrid />
      <FinalCtaSection />
      <CertificationStrip />
      <Resources />
      <ContactSection />
    </main>
  );
}
