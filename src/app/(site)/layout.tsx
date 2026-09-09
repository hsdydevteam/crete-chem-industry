import { publicCatalog } from "@/lib/repository";
import { StoreProvider } from "@/components/store-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/sections";
import { CreteAssistant } from "@/components/assistant";
export const dynamic = "force-dynamic";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const catalog = await publicCatalog();
  return (
    <StoreProvider catalog={catalog}>
      <SiteHeader />
      {children}
      <SiteFooter />
      <CreteAssistant />
    </StoreProvider>
  );
}
