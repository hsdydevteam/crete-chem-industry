"use client";
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ClipboardList,
  MessageSquare,
  Layers,
  ImageIcon,
  Tag,
  Megaphone,
  Award,
  Settings,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpRight,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
  RefreshCw,
  Phone,
  Copy,
  Check,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Clock,
  MapPin,
  Mail,
  Building2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type {
  Catalog,
  CollectionName,
  Product,
  Service,
  Banner,
  BeforeAfterCase,
  Order,
  Inquiry,
} from "@/lib/types";
import { statuses } from "@/lib/types";
import { api } from "@/lib/client";
import { Brand } from "./site-header";
import { Modal } from "./ui";

export type Tab =
  | "overview"
  | "products"
  | "inventory"
  | "orders"
  | "inquiries"
  | "services"
  | "cases"
  | "promotions"
  | "banners"
  | "certifications"
  | "media"
  | "settings";

type RecordItem = Product | Service | Banner | BeforeAfterCase;

type OrderResult = {
  orders: Order[];
  stats: { total: number; newOrders: number; completed: number };
  nextOffset: number | null;
};

const names: Record<CollectionName, string> = {
  products: "Product",
  services: "Service",
  banners: "Banner",
  cases: "Before & after case",
};

const titleOf = (x: RecordItem) => ("name" in x ? x.name : x.title);

function fresh(kind: CollectionName): RecordItem {
  const base = { id: "", active: true };
  if (kind === "products")
    return {
      ...base,
      name: "",
      category: "",
      image: "",
      imageUrl: "",
      label: "",
      description: "",
      benefits: [],
      applications: [],
      serviceIds: [],
      featured: false,
    };
  if (kind === "services")
    return {
      ...base,
      title: "",
      description: "",
      icon: "roof",
      tags: [],
      recommendedProductIds: [],
    };
  if (kind === "banners")
    return { ...base, title: "", description: "", link: "#contact" };
  return {
    ...base,
    title: "",
    description: "",
    beforeImage: "",
    afterImage: "",
    illustrative: true,
  };
}

export function AdminLogin({ initialError = "" }: { initialError?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("admin/login", "POST", { password });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-top">
        <Brand />
        <a href="/" className="button secondary">
          Return to storefront <ArrowUpRight size={16} />
        </a>
      </header>
      <main id="main" className="login-main">
        <div className="login-card">
          <div>
            <span className="eyebrow">CRETE-CHEM Pakistan</span>
            <h1>Staff Sign-in</h1>
            <p>
              Administrative access is protected. Sign in with your authorized
              CRETE-CHEM master passphrase to manage products, engineering
              services, cases, and customer quotations.
            </p>
          </div>
          <form onSubmit={submit} className="form-stack">
            <label>
              Passphrase
              <div className="password-input">
                <input
                  required
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator passphrase"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  aria-label={show ? "Hide passphrase" : "Show passphrase"}
                  onClick={() => setShow((s) => !s)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary" disabled={busy}>
              {busy ? "Authenticating…" : "Unlock Administration"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api<{ url: string }>("admin/upload", "POST", fd);
      onChange(res.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="image-field">
      <span className="eyebrow">{label}</span>
      <div className="image-upload-row">
        {value && (
          <div className="image-preview">
            <Image
              src={value}
              alt="Asset preview"
              fill
              sizes="90px"
              unoptimized
            />
          </div>
        )}
        <label className="upload-button">
          <Upload size={18} />
          <span>{busy ? "Uploading…" : "Upload photo"}</span>
          <small>PNG, JPG, WebP up to 8MB</small>
          <input
            type="file"
            accept="image/*"
            onChange={upload}
            disabled={busy}
          />
        </label>
      </div>
      <label>
        Or use an image URL / static path
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/products/sika-top-seal-107.png"
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Editor({
  kind,
  item,
  isNew,
  catalog,
  onClose,
  onSave,
}: {
  kind: CollectionName;
  item: RecordItem;
  isNew: boolean;
  catalog: Catalog;
  onClose: () => void;
  onSave: () => void;
}) {
  const [draft, setDraft] = useState<RecordItem>(item);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function patch(key: string, value: unknown) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(`admin/${kind}`, isNew ? "POST" : "PUT", draft);
      onSave();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function arrays(title: string, field: "benefits" | "applications" | "tags", list: string[]) {
    return (
      <label>
        {title}
        <textarea
          rows={3}
          value={list.join("\n")}
          onChange={(e) =>
            patch(
              field,
              e.target.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            )
          }
          placeholder="One item per line"
        />
      </label>
    );
  }

  return (
    <Modal
      title={`${isNew ? "Add" : "Edit"} ${names[kind].toLowerCase()}`}
      onClose={() => !busy && onClose()}
    >
      <form onSubmit={submit} className="form-stack">
        <label>
          {kind === "products" ? "Product name" : "Title"}
          <input
            required
            value={"name" in draft ? draft.name : draft.title}
            onChange={(e) =>
              patch(
                "name" in draft ? "name" : "title",
                e.target.value,
              )
            }
          />
        </label>
        <label>
          Description
          <textarea
            required
            rows={3}
            value={draft.description}
            onChange={(e) => patch("description", e.target.value)}
          />
        </label>
        {kind === "products" &&
          (() => {
            const p = draft as Product;
            const labelPresets = [
              "",
              "New",
              "Featured",
              "Recommended",
              "Summer Sale",
              "Winter Offer",
              "Winter Sale",
              "Azadi Sale",
              "Custom",
            ];
            const isCustom = !labelPresets.slice(0, -1).includes(p.label || "");
            return (
              <>
                <label>
                  Category
                  <input
                    required
                    value={p.category}
                    onChange={(e) => patch("category", e.target.value)}
                    placeholder="Basement Waterproofing, Roof Insulation, etc."
                  />
                </label>
                <ImageField
                  label="Product photo"
                  value={p.imageUrl || p.image}
                  onChange={(value) => {
                    patch("imageUrl", value);
                    patch("image", value);
                  }}
                />
                <label>
                  Promotional badge / label
                  <select
                    value={isCustom ? "Custom" : p.label || ""}
                    onChange={(e) => {
                      if (e.target.value === "Custom") {
                        if (!isCustom) patch("label", "Special Offer");
                      } else {
                        patch("label", e.target.value);
                      }
                    }}
                  >
                    <option value="">None (Standard SKU)</option>
                    <option value="New">New Arrival</option>
                    <option value="Featured">Featured</option>
                    <option value="Recommended">Recommended</option>
                    <option value="Summer Sale">Summer Sale</option>
                    <option value="Winter Offer">Winter Offer</option>
                    <option value="Winter Sale">Winter Sale</option>
                    <option value="Azadi Sale">Azadi Sale</option>
                    <option value="Custom">Custom Label…</option>
                  </select>
                </label>
                {isCustom && (
                  <label>
                    Custom badge text
                    <input
                      value={p.label || ""}
                      onChange={(e) => patch("label", e.target.value)}
                      placeholder="e.g. Monsoon Ready, Best Seller, Special Offer"
                    />
                  </label>
                )}
                {arrays("Key features / benefits (one per line)", "benefits", p.benefits)}
                {arrays("Recommended applications (one per line)", "applications", p.applications)}
                <fieldset>
                  <legend>Associated services</legend>
                  <div className="checkbox-grid">
                    {catalog.services.map((s) => (
                      <label className="checkbox" key={s.id}>
                        <input
                          type="checkbox"
                          checked={p.serviceIds.includes(s.id)}
                          onChange={(e) =>
                            patch(
                              "serviceIds",
                              e.target.checked
                                ? [...p.serviceIds, s.id]
                                : p.serviceIds.filter((id) => id !== s.id),
                            )
                          }
                        />
                        {s.title}
                      </label>
                    ))}
                  </div>
                  <small>Services where this chemical system is specified.</small>
                </fieldset>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={(e) => patch("featured", e.target.checked)}
                  />
                  Featured product on storefront hero / showcase
                </label>
              </>
            );
          })()}
        {kind === "services" &&
          (() => {
            const s = draft as Service;
            return (
              <>
                <label>
                  Service Icon
                  <select
                    value={s.icon}
                    onChange={(e) => patch("icon", e.target.value)}
                  >
                    {[
                      "roof",
                      "tank",
                      "bath",
                      "basement",
                      "wall",
                      "heat",
                      "shield",
                    ].map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </label>
                {arrays(
                  "Problem keywords / tags (one per line)",
                  "tags",
                  s.tags,
                )}
                <fieldset>
                  <legend>Recommended products (up to 3)</legend>
                  <div className="checkbox-grid">
                    {catalog.products.map((p) => (
                      <label className="checkbox" key={p.id}>
                        <input
                          type="checkbox"
                          checked={s.recommendedProductIds.includes(p.id)}
                          disabled={
                            !s.recommendedProductIds.includes(p.id) &&
                            s.recommendedProductIds.length >= 3
                          }
                          onChange={(e) =>
                            patch(
                              "recommendedProductIds",
                              e.target.checked
                                ? [...s.recommendedProductIds, p.id]
                                : s.recommendedProductIds.filter(
                                    (id) => id !== p.id,
                                  ),
                            )
                          }
                        />
                        {p.name}
                        {!p.active ? " (inactive)" : ""}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            );
          })()}
        {kind === "banners" && (
          <label>
            Action link
            <input
              required
              value={(draft as Banner).link}
              onChange={(e) => patch("link", e.target.value)}
              placeholder="#contact or https://…"
            />
          </label>
        )}
        {kind === "cases" && (
          <>
            <ImageField
              label="Before treatment photo"
              value={(draft as BeforeAfterCase).beforeImage}
              onChange={(value) => patch("beforeImage", value)}
            />
            <ImageField
              label="After treatment photo"
              value={(draft as BeforeAfterCase).afterImage}
              onChange={(value) => patch("afterImage", value)}
            />
            <label className="checkbox">
              <input
                type="checkbox"
                checked={(draft as BeforeAfterCase).illustrative}
                onChange={(e) => patch("illustrative", e.target.checked)}
              />
              Illustrative engineering case study
            </label>
          </>
        )}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(e) => patch("active", e.target.checked)}
          />
          Active — visible on the live storefront
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="editor-actions">
          <button
            type="button"
            className="button secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button className="button primary" disabled={busy}>
            {busy ? "Saving…" : isNew ? "Create item" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AdminDashboard({ initial }: { initial: Catalog }) {
  const router = useRouter();
  const [catalog, setCatalog] = useState(initial);
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [edit, setEdit] = useState<{
    kind: CollectionName;
    item: RecordItem;
    isNew: boolean;
  } | null>(null);

  const [remove, setRemove] = useState<{
    kind: CollectionName;
    item: RecordItem;
  } | null>(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderResult>({
    orders: [],
    stats: { total: 0, newOrders: 0, completed: 0 },
    nextOffset: null,
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryOffset, setInquiryOffset] = useState<number | null>(null);
  const [activity, setActivity] = useState<{ title: string; createdAt: number }[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    setError("");
    try {
      const [c, o, i, a] = await Promise.all([
        api<Catalog>("admin/catalog"),
        api<OrderResult>("admin/orders"),
        api<{ inquiries: Inquiry[]; nextOffset: number | null }>("admin/inquiries"),
        api<{ activity: { title: string; createdAt: number }[] }>("admin/activity"),
      ]);
      setCatalog(c);
      setOrders(o);
      setInquiries(i.inquiries);
      setInquiryOffset(i.nextOffset);
      setActivity(a.activity);
      setLoaded(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    setSearch("");
    setFilter("All");
    setCategory("All");
    setMobileMenuOpen(false);
  }, [tab]);

  async function saved(customMsg?: string) {
    await refresh();
    setNotice(
      customMsg ||
        "Changes saved successfully. The storefront will reflect updates immediately.",
    );
  }

  async function logout() {
    setBusy(true);
    try {
      await api("admin/logout", "POST", {});
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem() {
    if (!remove) return;
    setBusy(true);
    setError("");
    try {
      await api(`admin/${remove.kind}/${remove.item.id}`, "DELETE", {});
      setRemove(null);
      await saved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function status(
    kind: "orders" | "inquiries",
    id: string,
    value: string,
  ) {
    setBusy(true);
    setError("");
    try {
      await api(`admin/${kind}/${id}`, "PATCH", { status: value });
      if (kind === "orders")
        setOrders((o) => ({
          ...o,
          orders: o.orders.map((x) =>
            x.id === id ? { ...x, status: value } : x,
          ),
        }));
      else
        setInquiries((o) =>
          o.map((x) => (x.id === id ? { ...x, status: value } : x)),
        );
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleProductStock(p: Product) {
    setBusy(true);
    setError("");
    try {
      const updated = { ...p, active: !p.active };
      await api("admin/products", "PUT", updated);
      await saved(
        `Product "${p.name}" marked as ${updated.active ? "In Stock (Active)" : "Out of Stock (Inactive)"}.`,
      );
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  }

  // All 12 tabs navigation
  const navigation: { id: Tab; label: string; icon: typeof Package; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package, count: catalog.products.length },
    { id: "inventory", label: "Inventory", icon: Boxes },
    {
      id: "orders",
      label: "Orders",
      icon: ClipboardList,
      count: loaded ? orders.stats.newOrders : undefined,
    },
    {
      id: "inquiries",
      label: "Inspections",
      icon: MessageSquare,
      count: inquiries.filter((x) => x.status === "New").length || undefined,
    },
    { id: "services", label: "Services", icon: Layers, count: catalog.services.length },
    { id: "cases", label: "Projects & Cases", icon: ImageIcon, count: catalog.cases.length },
    { id: "promotions", label: "Promotions", icon: Tag },
    { id: "banners", label: "Top Banners", icon: Megaphone, count: catalog.banners.length },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "media", label: "Media Library", icon: ImageIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const collection: CollectionName | null =
    tab === "products" || tab === "services" || tab === "banners" || tab === "cases"
      ? tab
      : null;

  const inventory = collection
    ? catalog[collection].filter(
        (item) =>
          titleOf(item).toLowerCase().includes(search.toLowerCase()) &&
          (filter === "All" ||
            (filter === "Active"
              ? item.active
              : filter === "Inactive"
                ? !item.active
                : "featured" in item && item.featured)) &&
          (category === "All" ||
            ("category" in item && item.category === category)),
      )
    : [];

  // Media assets collector
  const mediaAssets = [
    ...new Set(
      [
        ...catalog.products.map((p) => p.imageUrl || p.image),
        ...catalog.cases.flatMap((c) => [c.beforeImage, c.afterImage]),
      ].filter(Boolean),
    ),
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar with sticky positioning and scrollable nav list */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Brand />
        <span className="eyebrow">CRETE-CHEM Administration</span>
        <nav aria-label="Admin navigation">
          {navigation.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={tab === id ? "active" : ""}
            >
              <Icon size={18} />
              <span>{label}</span>
              {typeof count === "number" && count > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: tab === id ? "#00A8FF" : "#1B5A86",
                    color: "#FFFFFF",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            Visit storefront <ArrowUpRight size={16} />
          </a>
          <button onClick={logout} disabled={busy}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main id="main" className="admin-main">
        {/* Mobile Header Bar for <= 900px screens */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "#031429",
            border: "1px solid #1B5A86",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
          className="admin-mobile-header"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                background: "transparent",
                border: "1px solid #1B5A86",
                borderRadius: "6px",
                padding: "6px",
                color: "#00D9FF",
                cursor: "pointer",
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontWeight: 700, fontSize: "14px", color: "#FFFFFF" }}>
              {navigation.find((n) => n.id === tab)?.label}
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "12px", color: "#00D9FF" }}
          >
            Storefront <ArrowUpRight size={14} style={{ display: "inline" }} />
          </a>
        </div>

        {/* Heading & Top Actions */}
        <header className="admin-heading">
          <div>
            <p className="eyebrow">Administrative Suite</p>
            <h1>{navigation.find((n) => n.id === tab)?.label}</h1>
            <p>
              {tab === "overview" &&
                "Real-time overview of products, engineering services, customer requests, and system health."}
              {tab === "products" &&
                "Catalog management: Add, edit, feature, and configure chemical product specifications."}
              {tab === "inventory" &&
                "Stock control: Monitor SKU availability and toggle active storefront inventory instantly."}
              {tab === "orders" &&
                "Customer quotation and order pipeline with direct WhatsApp communication."}
              {tab === "inquiries" &&
                "Technical site inspection requests, structural assessment schedules, and client contacts."}
              {tab === "services" &&
                "Engineering treatment services, problem keyword taxonomy, and chemical pairing."}
              {tab === "cases" &&
                "Before and after case studies showcasing authenticated project transformations."}
              {tab === "promotions" &&
                "Promotional campaigns, seasonal discounts (Summer, Winter, Azadi), and product badges."}
              {tab === "banners" &&
                "Promotional storefront announcement banners and call-to-action notices."}
              {tab === "certifications" &&
                "Verified ISO 9001, Sika Applicator, and ASTM engineering standards accreditations."}
              {tab === "media" &&
                "Asset repository: Centralized media library with upload tool and one-click URL copy."}
              {tab === "settings" &&
                "Corporate information, emergency lines, regional centers, and system security credentials."}
            </p>
          </div>

          <div className="admin-heading-actions">
            {collection && (
              <button
                className="button primary"
                onClick={() =>
                  setEdit({
                    kind: collection,
                    item: fresh(collection),
                    isNew: true,
                  })
                }
              >
                <Plus size={18} />
                Add {names[collection].toLowerCase()}
              </button>
            )}
            <button className="button secondary" onClick={refresh} disabled={busy}>
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="error" role="alert">
            {error}
            {error.includes("sign in") && (
              <button className="text-button" onClick={() => router.refresh()}>
                Sign in again
              </button>
            )}
          </div>
        )}

        {notice && (
          <div className="success-notice" role="status">
            <CheckCircle2 size={18} />
            <span>{notice}</span>
            <button className="text-button" onClick={() => setNotice("")}>
              Dismiss
            </button>
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="stats-grid">
              <article className="stat-card">
                <p>
                  <span>Total Products</span>
                  <Package size={16} style={{ color: "#00D9FF" }} />
                </p>
                <strong>{catalog.products.length}</strong>
                <small>{catalog.products.filter((p) => p.active).length} active SKUs</small>
              </article>
              <article className="stat-card">
                <p>
                  <span>New Quotations</span>
                  <ClipboardList size={16} style={{ color: "#8AEFB2" }} />
                </p>
                <strong>{loaded ? orders.stats.newOrders : "—"}</strong>
                <small>{loaded ? `${orders.stats.total} total orders` : "Loading…"}</small>
              </article>
              <article className="stat-card">
                <p>
                  <span>Site Inspections</span>
                  <MessageSquare size={16} style={{ color: "#FDBA74" }} />
                </p>
                <strong>{inquiries.filter((x) => x.status === "New").length}</strong>
                <small>{inquiries.length} total logged inquiries</small>
              </article>
              <article className="stat-card">
                <p>
                  <span>Active Services</span>
                  <Layers size={16} style={{ color: "#00D9FF" }} />
                </p>
                <strong>{catalog.services.filter((s) => s.active).length}</strong>
                <small>{catalog.cases.length} before/after projects</small>
              </article>
            </div>

            <div className="admin-overview-grid">
              <section className="admin-panel">
                <h2>Quick actions</h2>
                <div className="quick-actions">
                  <button
                    onClick={() =>
                      setEdit({
                        kind: "products",
                        item: fresh("products"),
                        isNew: true,
                      })
                    }
                  >
                    <Plus size={18} /> Add new product
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setEdit({
                        kind: "services",
                        item: fresh("services"),
                        isNew: true,
                      })
                    }
                  >
                    <Plus size={18} /> Add new service
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setEdit({
                        kind: "cases",
                        item: fresh("cases"),
                        isNew: true,
                      })
                    }
                  >
                    <Plus size={18} /> Add project case
                    <ArrowUpRight size={14} />
                  </button>
                  <button
                    onClick={() =>
                      setEdit({
                        kind: "banners",
                        item: fresh("banners"),
                        isNew: true,
                      })
                    }
                  >
                    <Plus size={18} /> Create top banner
                    <ArrowUpRight size={14} />
                  </button>
                  <button onClick={() => setTab("inventory")}>
                    <Boxes size={18} /> Manage Inventory
                    <ArrowUpRight size={14} />
                  </button>
                  <button onClick={() => setTab("orders")}>
                    <ClipboardList size={18} /> Review Orders
                    <ArrowUpRight size={14} />
                  </button>
                  <button onClick={() => setTab("inquiries")}>
                    <MessageSquare size={18} /> Inspection Requests
                    <ArrowUpRight size={14} />
                  </button>
                  <button onClick={() => setTab("promotions")}>
                    <Tag size={18} /> Promotions & Badges
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </section>

              <section className="admin-panel">
                <h2>Recent Administrative Activity</h2>
                {activity.length ? (
                  <ol className="activity-list">
                    {activity.map((a, i) => (
                      <li key={`${a.createdAt}-${i}`}>
                        <span>{a.title}</span>
                        <small>{new Date(a.createdAt).toLocaleString()}</small>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="muted">Content changes and uploads will appear here.</p>
                )}
              </section>
            </div>
          </>
        )}

        {/* TAB: PRODUCTS */}
        {tab === "products" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by title, category, or keyword…"
                  aria-label="Search products"
                />
              </label>
              <select
                aria-label="Filter status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All", "Active", "Inactive", "Featured"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                aria-label="Filter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["All", ...new Set(catalog.products.map((p) => p.category))].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
              <span>{inventory.length} items found</span>
            </div>

            {inventory.length ? (
              <div className="inventory-list">
                {inventory.map((item) => (
                  <article className="inventory-row" key={item.id}>
                    {"image" in item && (
                      <div className="inventory-image">
                        <Image
                          src={item.imageUrl || item.image || "/products/sika-top-seal-107.png"}
                          alt={titleOf(item)}
                          fill
                          sizes="80px"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="inventory-info">
                      <h3>{titleOf(item)}</h3>
                      <p>{"category" in item ? item.category : item.description}</p>
                      <div className="inventory-tags">
                        <span
                          className={
                            item.active ? "status active-status" : "status inactive-status"
                          }
                        >
                          {item.active ? "In Stock (Active)" : "Out of Stock"}
                        </span>
                        {"label" in item && item.label && (
                          <span className="status label-status">{item.label}</span>
                        )}
                        {"featured" in item && item.featured && (
                          <span className="status featured-status">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="row-actions">
                      <button
                        className="button secondary"
                        onClick={() =>
                          setEdit({ kind: "products", item, isNew: false })
                        }
                      >
                        <Pencil size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="icon-button danger"
                        aria-label={`Delete ${titleOf(item)}`}
                        onClick={() => setRemove({ kind: "products", item })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Package size={44} />
                <h3>No matching products</h3>
                <p>Try adjusting your search criteria or add a new product.</p>
                <button
                  className="text-button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                    setCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB: INVENTORY */}
        {tab === "inventory" && (
          <>
            <div className="stats-grid" style={{ marginBottom: "20px" }}>
              <article className="stat-card">
                <p><span>Total SKUs</span><Boxes size={16} style={{ color: "#00D9FF" }} /></p>
                <strong>{catalog.products.length}</strong>
                <small>Chemical compounds & systems</small>
              </article>
              <article className="stat-card">
                <p><span>In Stock (Active)</span><CheckCircle2 size={16} style={{ color: "#8AEFB2" }} /></p>
                <strong>{catalog.products.filter((p) => p.active).length}</strong>
                <small>Ready for order dispatch</small>
              </article>
              <article className="stat-card">
                <p><span>Out of Stock</span><ToggleLeft size={16} style={{ color: "#FCA5A5" }} /></p>
                <strong>{catalog.products.filter((p) => !p.active).length}</strong>
                <small>Storefront hidden / restock</small>
              </article>
              <article className="stat-card">
                <p><span>Featured SKUs</span><Tag size={16} style={{ color: "#DDD6FE" }} /></p>
                <strong>{catalog.products.filter((p) => p.featured).length}</strong>
                <small>Prime catalog showcase</small>
              </article>
            </div>

            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter inventory by name, category, or SKU…"
                  aria-label="Filter inventory"
                />
              </label>
              <select
                aria-label="Inventory stock filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Inventory</option>
                <option value="Active">In Stock Only</option>
                <option value="Inactive">Out of Stock Only</option>
                <option value="Featured">Featured Only</option>
              </select>
            </div>

            <div className="inventory-list">
              {catalog.products
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) &&
                    (filter === "All" ||
                      (filter === "Active"
                        ? p.active
                        : filter === "Inactive"
                          ? !p.active
                          : p.featured)),
                )
                .map((p) => (
                  <article className="inventory-row" key={p.id}>
                    <div className="inventory-image">
                      <Image
                        src={p.imageUrl || p.image || "/products/sika-top-seal-107.png"}
                        alt={p.name}
                        fill
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                    <div className="inventory-info">
                      <h3>{p.name}</h3>
                      <p>{p.category} · {p.description}</p>
                      <div className="inventory-tags">
                        <span
                          className={
                            p.active ? "status active-status" : "status inactive-status"
                          }
                        >
                          {p.active ? "In Stock" : "Out of Stock"}
                        </span>
                        {p.label && <span className="status label-status">{p.label}</span>}
                        {p.featured && <span className="status featured-status">Featured</span>}
                      </div>
                    </div>
                    <div className="row-actions">
                      <button
                        className={`button ${p.active ? "secondary" : "primary"}`}
                        onClick={() => toggleProductStock(p)}
                        disabled={busy}
                        title={p.active ? "Mark as Out of Stock" : "Mark as In Stock"}
                        style={{ fontSize: "12px" }}
                      >
                        {p.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        <span>{p.active ? "Stock Available" : "Make Available"}</span>
                      </button>
                      <button
                        className="button secondary"
                        onClick={() =>
                          setEdit({ kind: "products", item: p, isNew: false })
                        }
                      >
                        <Pencil size={15} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </>
        )}

        {/* TAB: ORDERS */}
        {tab === "orders" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  aria-label="Search orders"
                  placeholder="Search orders by customer, phone, reference, or address…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <select
                aria-label="Order status filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All", ...statuses].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {!loaded && !error && <p>Loading quotation requests…</p>}

            <div className="request-grid">
              {orders.orders
                .filter(
                  (x) =>
                    (filter === "All" || x.status === filter) &&
                    JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
                )
                .map((x) => (
                  <article className="request-card" key={x.id}>
                    <div className="request-heading">
                      <span className="eyebrow">Quotation & Purchase Request</span>
                      <select
                        aria-label={`Status of ${x.id}`}
                        value={x.status}
                        disabled={busy}
                        onChange={(e) => status("orders", x.id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <small className="reference">{x.id}</small>
                    <h3>{x.customer.name}</h3>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                      <a className="text-link" href={`tel:${x.customer.phone}`}>
                        <Phone size={14} /> {x.customer.phone}
                      </a>
                      <a
                        className="whatsapp-action-btn"
                        href={`https://wa.me/${x.customer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${x.customer.name}, regarding your CRETE-CHEM quotation request (${x.id}):`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp Client
                      </a>
                    </div>
                    <p style={{ color: "#EAF5FF" }}>
                      <strong>Delivery Site:</strong> {x.customer.address}
                    </p>
                    <ul className="request-items">
                      {x.items.map((i) => (
                        <li key={i.id}>
                          <span>{i.name}</span>
                          <strong>× {i.quantity}</strong>
                        </li>
                      ))}
                    </ul>
                    {x.customer.notes && (
                      <p className="request-notes">{x.customer.notes}</p>
                    )}
                    <small className="muted">
                      Received {new Date(x.createdAt).toLocaleString()}
                    </small>
                  </article>
                ))}
            </div>

            {loaded &&
              orders.orders.filter(
                (x) =>
                  (filter === "All" || x.status === filter) &&
                  JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
              ).length === 0 && (
                <div className="empty-state">
                  <ClipboardList size={44} />
                  <h3>No matching quotation orders</h3>
                  <p>Customer checkout orders will appear here.</p>
                </div>
              )}

            {orders.nextOffset !== null && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const r = await api<OrderResult>(
                      `admin/orders?offset=${orders.nextOffset}`,
                    );
                    setOrders((o) => ({
                      ...r,
                      orders: [...o.orders, ...r.orders],
                    }));
                  } catch (err) {
                    setError((err as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Load more orders
              </button>
            )}
          </>
        )}

        {/* TAB: INQUIRIES (SITE INSPECTIONS) */}
        {tab === "inquiries" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  aria-label="Search inspection requests"
                  placeholder="Search inspections by name, phone, location, or issue…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <select
                aria-label="Inspection status filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All", ...statuses].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {!loaded && !error && <p>Loading inspection requests…</p>}

            <div className="request-grid">
              {inquiries
                .filter(
                  (x) =>
                    (filter === "All" || x.status === filter) &&
                    JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
                )
                .map((x) => (
                  <article className="request-card" key={x.id}>
                    <div className="request-heading">
                      <span className="eyebrow">Technical Inspection</span>
                      <select
                        aria-label={`Status of ${x.id}`}
                        value={x.status}
                        disabled={busy}
                        onChange={(e) => status("inquiries", x.id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <small className="reference">{x.id}</small>
                    <h3>{x.name}</h3>
                    <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                      <a className="text-link" href={`tel:${x.phone}`}>
                        <Phone size={14} /> {x.phone}
                      </a>
                      <a
                        className="whatsapp-action-btn"
                        href={`https://wa.me/${x.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${x.name}, regarding your CRETE-CHEM site inspection request (${x.id}):`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp Client
                      </a>
                    </div>
                    <p style={{ color: "#EAF5FF" }}>
                      <strong>Site Location:</strong> {x.location}
                    </p>
                    <p>
                      <strong>
                        {catalog.services.find((s) => s.id === x.serviceId)?.title ||
                          "Technical Assessment"}
                      </strong>{" "}
                      · {x.projectType}
                    </p>
                    <p className="request-notes">{x.description}</p>
                    <small className="muted">
                      Received {new Date(x.createdAt).toLocaleString()}
                    </small>
                  </article>
                ))}
            </div>

            {loaded &&
              inquiries.filter(
                (x) =>
                  (filter === "All" || x.status === filter) &&
                  JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
              ).length === 0 && (
                <div className="empty-state">
                  <MessageSquare size={44} />
                  <h3>No matching site inspection requests</h3>
                  <p>Inquiries booked through the website or assistant will appear here.</p>
                </div>
              )}

            {inquiryOffset !== null && (
              <button
                className="button secondary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const r = await api<{
                      inquiries: Inquiry[];
                      nextOffset: number | null;
                    }>(`admin/inquiries?offset=${inquiryOffset}`);
                    setInquiries((i) => [...i, ...r.inquiries]);
                    setInquiryOffset(r.nextOffset);
                  } catch (err) {
                    setError((err as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Load more inquiries
              </button>
            )}
          </>
        )}

        {/* TAB: SERVICES */}
        {tab === "services" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search engineering services…"
                  aria-label="Search services"
                />
              </label>
              <select
                aria-label="Filter service status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {["All", "Active", "Inactive"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <span>{inventory.length} services</span>
            </div>

            <div className="inventory-list">
              {inventory.map((item) => (
                <article className="inventory-row" key={item.id}>
                  <div className="inventory-info">
                    <h3>{titleOf(item)}</h3>
                    <p>{item.description}</p>
                    <div className="inventory-tags">
                      <span
                        className={
                          item.active ? "status active-status" : "status inactive-status"
                        }
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                      {"tags" in item &&
                        (item as Service).tags.map((t) => (
                          <span className="status" key={t}>
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="row-actions">
                    <button
                      className="button secondary"
                      onClick={() =>
                        setEdit({ kind: "services", item, isNew: false })
                      }
                    >
                      <Pencil size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="icon-button danger"
                      aria-label={`Delete ${titleOf(item)}`}
                      onClick={() => setRemove({ kind: "services", item })}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* TAB: CASES (PROJECTS & CASES) */}
        {tab === "cases" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search case studies and completed engineering projects…"
                  aria-label="Search cases"
                />
              </label>
              <span>{inventory.length} projects</span>
            </div>

            <div className="inventory-list">
              {inventory.map((item) => {
                const c = item as BeforeAfterCase;
                return (
                  <article className="inventory-row" key={c.id}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div className="inventory-image">
                        <Image
                          src={c.beforeImage}
                          alt={`${c.title} Before`}
                          fill
                          sizes="80px"
                          unoptimized
                        />
                      </div>
                      <div className="inventory-image">
                        <Image
                          src={c.afterImage}
                          alt={`${c.title} After`}
                          fill
                          sizes="80px"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="inventory-info">
                      <h3>{c.title}</h3>
                      <p>{c.description}</p>
                      <div className="inventory-tags">
                        <span
                          className={
                            c.active ? "status active-status" : "status inactive-status"
                          }
                        >
                          {c.active ? "Active" : "Inactive"}
                        </span>
                        {c.illustrative && (
                          <span className="status">Illustrative Study</span>
                        )}
                      </div>
                    </div>
                    <div className="row-actions">
                      <button
                        className="button secondary"
                        onClick={() =>
                          setEdit({ kind: "cases", item: c, isNew: false })
                        }
                      >
                        <Pencil size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="icon-button danger"
                        aria-label={`Delete ${c.title}`}
                        onClick={() => setRemove({ kind: "cases", item: c })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* TAB: PROMOTIONS */}
        {tab === "promotions" && (
          <>
            <div className="promo-grid" style={{ marginBottom: "30px" }}>
              <article className="promo-card">
                <h3><Tag size={18} style={{ color: "#00D9FF" }} /> Summer Sale Campaign</h3>
                <p>
                  Targeted thermal insulation, roof heat-proofing, and elastomeric solar reflective coatings.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <span className="status label-status">Badge: Summer Sale</span>
                  <span className="status">
                    {catalog.products.filter((p) => p.label === "Summer Sale").length} products tagged
                  </span>
                </div>
              </article>

              <article className="promo-card">
                <h3><Tag size={18} style={{ color: "#00D9FF" }} /> Winter Moisture Offer</h3>
                <p>
                  Cold-weather waterproofing systems, expansion joint sealants, and subterranean basement seepage control.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <span className="status label-status">Badge: Winter Offer</span>
                  <span className="status">
                    {catalog.products.filter((p) => p.label === "Winter Offer" || p.label === "Winter Sale").length} products tagged
                  </span>
                </div>
              </article>

              <article className="promo-card">
                <h3><Tag size={18} style={{ color: "#00D9FF" }} /> Azadi Special Discount</h3>
                <p>
                  National celebratory discount tier on high-build industrial floor coatings and complete structure bundles.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <span className="status label-status">Badge: Azadi Sale</span>
                  <span className="status">
                    {catalog.products.filter((p) => p.label === "Azadi Sale").length} products tagged
                  </span>
                </div>
              </article>

              <article className="promo-card">
                <h3><Award size={18} style={{ color: "#00D9FF" }} /> Recommended & Featured</h3>
                <p>
                  Flagship Sika and CRETE-CHEM commercial waterproofing systems highlighted across hero and product catalogs.
                </p>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <span className="status featured-status">
                    {catalog.products.filter((p) => p.featured).length} Featured SKUs
                  </span>
                  <span className="status">
                    {catalog.products.filter((p) => p.label === "Recommended").length} Recommended
                  </span>
                </div>
              </article>
            </div>

            <div className="admin-panel">
              <h2>All Products with Active Badges & Promotions</h2>
              <div className="inventory-list" style={{ marginTop: "16px" }}>
                {catalog.products
                  .filter((p) => p.label || p.featured)
                  .map((p) => (
                    <article className="inventory-row" key={p.id}>
                      <div className="inventory-image">
                        <Image
                          src={p.imageUrl || p.image || "/products/sika-top-seal-107.png"}
                          alt={p.name}
                          fill
                          sizes="80px"
                          unoptimized
                        />
                      </div>
                      <div className="inventory-info">
                        <h3>{p.name}</h3>
                        <p>{p.category}</p>
                        <div className="inventory-tags">
                          {p.label && <span className="status label-status">{p.label}</span>}
                          {p.featured && <span className="status featured-status">Featured</span>}
                          <span className={p.active ? "status active-status" : "status"}>
                            {p.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="row-actions">
                        <button
                          className="button secondary"
                          onClick={() => setEdit({ kind: "products", item: p, isNew: false })}
                        >
                          <Pencil size={15} />
                          <span>Change Badge</span>
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* TAB: BANNERS */}
        {tab === "banners" && (
          <>
            <div className="admin-toolbar">
              <label className="search-field">
                <Search size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search top promotional banners…"
                  aria-label="Search banners"
                />
              </label>
              <span>{inventory.length} banners</span>
            </div>

            <div className="inventory-list">
              {inventory.map((item) => {
                const b = item as Banner;
                return (
                  <article className="inventory-row" key={b.id}>
                    <div className="inventory-info">
                      <h3>{b.title}</h3>
                      <p>{b.description}</p>
                      <div className="inventory-tags">
                        <span
                          className={
                            b.active ? "status active-status" : "status inactive-status"
                          }
                        >
                          {b.active ? "Active on Storefront" : "Inactive"}
                        </span>
                        <span className="status">Link: {b.link}</span>
                      </div>
                    </div>
                    <div className="row-actions">
                      <button
                        className="button secondary"
                        onClick={() =>
                          setEdit({ kind: "banners", item: b, isNew: false })
                        }
                      >
                        <Pencil size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="icon-button danger"
                        aria-label={`Delete ${b.title}`}
                        onClick={() => setRemove({ kind: "banners", item: b })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* TAB: CERTIFICATIONS */}
        {tab === "certifications" && (
          <div className="cert-grid">
            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Tier-1 Certification</span>
                  <h3>Sika Authorized Applicator</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                Accredited specialized contractor authorization for liquid-applied polyurethane membranes, cementitious polymer slurries, and structural injection grouts.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> Certified Applicator License #PK-CC-2024</li>
                <li><ShieldCheck size={16} /> Factory-Trained Chemical Specialists</li>
                <li><ShieldCheck size={16} /> Authorized Product Warranty Provider</li>
              </ul>
            </article>

            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Quality Standard</span>
                  <h3>ISO 9001:2015 Registered</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                International Organization for Standardization compliance across application procedures, technical substrate preparation, and quality audits.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> Quality Management System Standardized</li>
                <li><ShieldCheck size={16} /> Documented Pre-Pour & Post-Pour Audits</li>
                <li><ShieldCheck size={16} /> Systematic Defect Prevention Controls</li>
              </ul>
            </article>

            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Chemical Testing Standard</span>
                  <h3>ASTM C836 / ASTM C881</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                Standard test specification for high solids content, cold liquid-applied elastomeric waterproofing membrane and epoxy resin bonding systems.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> Crack Bridging Compliance (&gt;1.5mm)</li>
                <li><ShieldCheck size={16} /> Hydrostatic Resistance Exceeding 5 Bar</li>
                <li><ShieldCheck size={16} /> Tensile Elongation &gt;300%</li>
              </ul>
            </article>

            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Occupational Safety</span>
                  <h3>OSHA Safety Standards</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                Rigorous onsite safety implementation for roof harnesses, high-elevation fall arrest systems, hazardous vapor respirators, and confined space protocols.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> 100% PPE Site Enforcement</li>
                <li><ShieldCheck size={16} /> Confined Space Gas Testing Protocols</li>
                <li><ShieldCheck size={16} /> High Elevation Fall Arrest Systems</li>
              </ul>
            </article>

            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Health & Environment</span>
                  <h3>Eco-Friendly Non-Toxic Certification</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                Certified for potable water applications: Overhead and underground concrete drinking water tanks treated with food-grade non-leaching formulations.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> Potable Drinking Water Safe (BS 6920 / NSF 61)</li>
                <li><ShieldCheck size={16} /> Zero VOC (Volatile Organic Compounds)</li>
                <li><ShieldCheck size={16} /> Heavy Metal & Solvent Free</li>
              </ul>
            </article>

            <article className="cert-card">
              <div className="cert-card-header">
                <div>
                  <span className="eyebrow">Corporate Registration</span>
                  <h3>SECP & PEC Enlisted Contractor</h3>
                </div>
                <Award size={28} style={{ color: "#00D9FF" }} />
              </div>
              <p>
                Officially incorporated with the Securities and Exchange Commission of Pakistan and registered with the Pakistan Engineering Council.
              </p>
              <ul className="cert-spec-list">
                <li><ShieldCheck size={16} /> PEC Specialty Code C-06 & BC-01</li>
                <li><ShieldCheck size={16} /> Federal Tax Registered (NTN Verified)</li>
                <li><ShieldCheck size={16} /> Corporate Engineering Contracting</li>
              </ul>
            </article>
          </div>
        )}

        {/* TAB: MEDIA LIBRARY */}
        {tab === "media" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="admin-panel">
              <h2>Upload New Asset</h2>
              <ImageField
                label="Direct Media Upload"
                value=""
                onChange={(url) => {
                  saved(`Media file uploaded successfully: ${url}`);
                }}
              />
            </div>

            <div className="admin-panel">
              <h2>Storefront Media Assets ({mediaAssets.length} items)</h2>
              <div className="media-grid">
                {mediaAssets.map((url) => (
                  <article className="media-card" key={url}>
                    <div className="media-preview-box">
                      <Image
                        src={url}
                        alt="Asset preview"
                        fill
                        sizes="240px"
                        unoptimized
                      />
                    </div>
                    <div className="media-card-body">
                      <p>{url}</p>
                      <div className="media-card-actions">
                        <button
                          className="button secondary"
                          style={{ fontSize: "11px", padding: "6px 10px" }}
                          onClick={() => copyToClipboard(url)}
                        >
                          {copiedUrl === url ? (
                            <>
                              <Check size={14} style={{ color: "#8AEFB2" }} /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy URL
                            </>
                          )}
                        </button>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#00D9FF", display: "flex", alignItems: "center" }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {tab === "settings" && (
          <div className="settings-grid">
            <article className="settings-card">
              <h3><Building2 size={20} style={{ color: "#00D9FF" }} /> Corporate Directory</h3>
              <div className="settings-list">
                <div className="settings-item">
                  <label>Official Company Name</label>
                  <span>CRETE-CHEM Engineering & Chemical Solutions</span>
                </div>
                <div className="settings-item">
                  <label>Official WhatsApp Channel</label>
                  <a href="https://wa.me/923008548956" target="_blank" rel="noreferrer">
                    +92 300 8548956
                  </a>
                </div>
                <div className="settings-item">
                  <label>Office Telephone Lines</label>
                  <span>+92 51-2808395 / +92 51-2808409</span>
                </div>
                <div className="settings-item">
                  <label>Direct Inquiries Email</label>
                  <a href="mailto:cretechem@gmail.com">cretechem@gmail.com</a>
                </div>
                <div className="settings-item">
                  <label>Head Office Location</label>
                  <span>Islamabad, Federal Capital Territory, Pakistan</span>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <h3><Clock size={20} style={{ color: "#00D9FF" }} /> Operational Hours & Centers</h3>
              <div className="settings-list">
                <div className="settings-item">
                  <label>Business Operating Hours</label>
                  <span>Monday – Saturday: 9:00 AM – 7:00 PM</span>
                </div>
                <div className="settings-item">
                  <label>Emergency Leakage Hotline</label>
                  <span>24/7 Rapid Structural Response Active</span>
                </div>
                <div className="settings-item">
                  <label>Regional Service Coverage</label>
                  <span>Islamabad, Rawalpindi, Lahore, Peshawar, Faisalabad, Multan, Karachi</span>
                </div>
                <div className="settings-item">
                  <label>Warranty Terms</label>
                  <span>Up to 10-Year Water-Tight Guarantee with Certificate</span>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <h3><ShieldCheck size={20} style={{ color: "#00D9FF" }} /> Security & Access Credentials</h3>
              <div className="settings-list">
                <div className="settings-item">
                  <label>Authentication Architecture</label>
                  <span>Encrypted HTTP-only Session Cookie (SameSite=Lax)</span>
                </div>
                <div className="settings-item">
                  <label>Passphrase Hash Standard</label>
                  <span>PBKDF2 SHA-512 (600,000 Iterations + 16-byte Salt)</span>
                </div>
                <div className="settings-item">
                  <label>Rate Limiting Protocol</label>
                  <span>Active IP sliding-window protection on login & API endpoints</span>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <h3><Boxes size={20} style={{ color: "#00D9FF" }} /> Database & Environment</h3>
              <div className="settings-list">
                <div className="settings-item">
                  <label>Primary Database Engine</label>
                  <span>MongoDB Atlas / WiredTiger Document Store</span>
                </div>
                <div className="settings-item">
                  <label>Collections Seeded</label>
                  <span>products, services, banners, cases, orders, inquiries, activity, admins</span>
                </div>
                <div className="settings-item">
                  <label>System Status</label>
                  <span style={{ color: "#8AEFB2", fontWeight: 700 }}>
                    ● Production Online & Operational
                  </span>
                </div>
              </div>
            </article>
          </div>
        )}
      </main>

      {/* Item Editor Modal */}
      {edit && (
        <Editor
          {...edit}
          catalog={catalog}
          onClose={() => setEdit(null)}
          onSave={saved}
        />
      )}

      {/* Delete Item Confirmation Modal */}
      {remove && (
        <Modal
          title={`Delete ${titleOf(remove.item)}?`}
          onClose={() => !busy && setRemove(null)}
        >
          <p>
            This action removes the item from the live storefront. Existing customer order
            history and quotations remain safely archived.
          </p>
          {error && <p className="error">{error}</p>}
          <div className="editor-actions">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setRemove(null)}
            >
              Keep item
            </button>
            <button
              className="button destructive"
              disabled={busy}
              onClick={deleteItem}
            >
              {busy ? "Deleting…" : "Delete item"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
