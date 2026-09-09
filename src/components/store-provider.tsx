"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { Catalog, Product } from "@/lib/types";
import { api } from "@/lib/client";
import { Modal } from "./ui";
type Item = { id: string; quantity: number };
type Store = {
  catalog: Catalog;
  cart: Item[];
  add: (p: Product) => void;
  openCart: () => void;
  inspect: (service?: string) => void;
  inspection: string;
  notice: string;
};
const Context = createContext<Store | null>(null);
export const useStore = () => useContext(Context)!;
const APPROVED_PRODUCT_PHOTOS: Record<string, string> = {
  membranes:
    "https://lh3.googleusercontent.com/aida/AEtjO1XZc_gRiMwOBl0hqjiKf4uf2FU4W_Jc8mOHvtCYXKjgUN5ogFkE6NJ1TeEc4W9COynVNsGGmSqwSlsb_nNf2vHZclqc5dIfsUiaxVzaqyT-l0YZAhOPROi-NujlUIhB6ARmuVbTJer4fll_yELdNiQ9xmSaLB25-LcCgtsl8JeUdo_nRtD7fRRZkljjiKDTB4Dh_3-mNIY_ZhB_CHv24ieF8xr62MRHzUpq6jP59xXiwaaCEbCfczw-YgCe",
  coatings:
    "https://lh3.googleusercontent.com/aida/AEtjO1WW-4LEpmoJ0RnqMvVlgeU5KiXX7LhAth12jjHzgB9--XomFi08Uxbk9riBxJIcRIcY55xKLg06bziSQXq6sCb6NMbz2GApERL9rMmfit4tXT0m6ec4i9_iSUGMnNoMg4qrQvu801qUdn2ax-1SikMbEcnk5aBYSkMyS02vKy5jliwoDDAJKjta6YHU7sTbuOSGeGzXIGxk4J7t4iV6j-wJHR5nNfwVHBY48uQ0pC0n-6etGyNOBcjhEin5",
  sealants:
    "https://lh3.googleusercontent.com/aida/AEtjO1VYEwJ_u_rKn9Gu2pozi5XnLWe66WnVhI4jDy0jQqqgQj5acYVi06wPaBp3VNmIgAG7ImeDDmtPhlcvWJdEl89e4FzBbY2UZMbq2bpQVzjQyFsXpJG0XeZ6hlIzv4vOeImxZ0RPZtSQnMWjri27uh24xdjk1y4TT07y__TLiD_IHZ_VuBQWH_JBL4vmmDmezmAOL0-M1CXvUgTh9VmihpDRyVVhYNnZkQ2WsZTfFyz6Ytvt1sWpk00dcN8",
  grouts:
    "https://lh3.googleusercontent.com/aida/AEtjO1WrWlwXVzzIWflmpVm8qQmeu6zjgSmBFIpyOFH5f4cOgtoD7gBkR4UePZLHeYRj6cGlEOmJ5FZl1foAR6kjoNxySwgvfiaCm6faqYXqCeVYI_h-t_TnuejvNdFayrpmYZurpUnXTw5Y0Mr7JhmVX-LjDEs8FDvVucxGey4pNMq9DfDJ59X8R3uASbNHQR4H45oblHwlLAOytL0EXGDG5YcrGRTJSA9eLtOIWAs9mKw-PB9ags3Dm4nDyDTa",
  admixtures:
    "https://lh3.googleusercontent.com/aida/AEtjO1UiC8ri1CXrZgNoCH5mfOzvQJHZ7ItBh9pzcpHFpuefewAz9br-3iacxx7cT3xI5asDp9p7EH03ONjbrdSr1J-syUmFLujEq2wtOtUKYs8X8aQn5_b5vjaXFyQHyYWXLEKclXPxmRC4aJ6lWM86CxGQLWRsl-_vKwFwlT3uJkSLz5Vs6dTI8esPtYY3u343AVR-4negphbqOwLvUDgiTQWcXz-DUoJaesM-xBXbe0Lj-UnjJOTTHPScA2T3",
  "repair-solutions":
    "https://lh3.googleusercontent.com/aida/AEtjO1Wk8GNVN4LXqt04uqtKSU_YzeWUv36npBY9ddi-_GPIrGzFlm41HFjmeFlKkiVnBrga_GbJWmeQ1Cuna3OKHnr732nkYjWtf2yt8xKmtoZFsZIt2Y-bsaEooBv4bYBzrc7Sr3d67uMk10DkLZfDjMf7WeGo_2VaOpW_tt9Kd1b9NVoev8whoPJoChUH728BmlSJVFouQcTN6gHegLw8cy2MdaUdRFqAudObv4ZniiL0ISbWOK5plG_aQtAT",
};

export function resolveProductImage(product: Product): string {
  // 1. Uploaded image takes top priority
  if (product.imageUrl && product.imageUrl.trim() !== "") {
    return product.imageUrl;
  }
  // 2. Existing project asset (if not the generic fallback SVG)
  if (
    product.image &&
    product.image.trim() !== "" &&
    !product.image.endsWith(".svg")
  ) {
    return product.image;
  }
  // 3. Approved real product photo from final.html reference
  const key = product.id.toLowerCase();
  if (APPROVED_PRODUCT_PHOTOS[key]) {
    return APPROVED_PRODUCT_PHOTOS[key];
  }
  const catKey = product.category.toLowerCase().replace(/\s+/g, "-");
  if (APPROVED_PRODUCT_PHOTOS[catKey]) {
    return APPROVED_PRODUCT_PHOTOS[catKey];
  }
  return (
    APPROVED_PRODUCT_PHOTOS.membranes || "/assets/products/membranes.svg"
  );
}

export function ProductImage({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const imageSrc = resolveProductImage(product);
  return (
    <Image
      src={imageSrc}
      alt={product.name}
      fill
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
      priority={priority}
      unoptimized={
        imageSrc.startsWith("http") ||
        imageSrc.startsWith("/api/")
      }
      referrerPolicy="no-referrer"
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      onError={(e) => {
        e.currentTarget.src = APPROVED_PRODUCT_PHOTOS.membranes;
        e.currentTarget.srcset = "";
      }}
    />
  );
}
export function StoreProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<Item[]>([]),
    [ready, setReady] = useState(false),
    [open, setOpen] = useState(false),
    [step, setStep] = useState(0),
    [inspection, setInspection] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const requestId = useRef("");
  const [result, setResult] = useState<{
    order: { id: string };
    whatsappUrl: string;
  } | null>(null);
  useEffect(() => {
    try {
      const old = JSON.parse(localStorage.getItem("cretechem-cart-v1") || "[]");
      if (Array.isArray(old))
        setCart(
          old
            .filter(
              (i: Item) =>
                typeof i.id === "string" &&
                Number.isInteger(i.quantity) &&
                i.quantity > 0,
            )
            .map((i: Item) => ({
              id: i.id,
              quantity: Math.min(999, i.quantity),
            })),
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("cretechem-cart-v1", JSON.stringify(cart));
      } catch {}
  }, [cart, ready]);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  function change(id: string, quantity: number) {
    setCart((old) =>
      quantity <= 0
        ? old.filter((i) => i.id !== id)
        : old.map((i) =>
            i.id === id ? { id, quantity: Math.min(999, quantity) } : i,
          ),
    );
    requestId.current = "";
    setResult(null);
  }
  function add(p: Product) {
    setCart((old) => {
      const found = old.find((i) => i.id === p.id);
      return found
        ? old.map((i) =>
            i.id === p.id
              ? { ...i, quantity: Math.min(i.quantity + 1, 999) }
              : i,
          )
        : [...old, { id: p.id, quantity: 1 }];
    });
    requestId.current = "";
    setResult(null);
    setNotice(`${p.name} added to your cart`);
  }
  function inspect(service = "") {
    setInspection(service);
    if (location.pathname !== "/") {
      location.href = `/${service ? `?service=${encodeURIComponent(service)}` : ""}#contact`;
      return;
    }
    window.dispatchEvent(new CustomEvent("crete:inspect", { detail: service }));
    document
      .getElementById("contact")
      ?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    setTimeout(
      () =>
        document
          .getElementById("inspection-name")
          ?.focus({ preventScroll: true }),
      350,
    );
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const r = await api<{ order: { id: string }; whatsappUrl: string }>(
        "orders",
        "POST",
        { requestId: requestId.current, customer, items: cart },
      );
      setResult(r);
      setCart([]);
      setStep(2);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  return (
    <Context.Provider
      value={{
        catalog,
        cart,
        add,
        openCart: () => {
          setStep(result ? 2 : 0);
          setError("");
          setOpen(true);
        },
        inspect,
        inspection,
        notice,
      }}
    >
      {children}
      <div className="toast" role="status" aria-live="polite">
        {notice && (
          <>
            <CheckCircle2 size={18} />
            {notice}
            <button
              onClick={() => {
                setOpen(true);
                setStep(0);
              }}
            >
              View cart
            </button>
          </>
        )}
      </div>
      {open && (
        <Modal
          title={
            step === 2
              ? "Request saved"
              : step === 1
                ? "Your project details"
                : "Your quotation cart"
          }
          onClose={() => setOpen(false)}
          drawer
        >
          {step < 2 && (
            <div className="cart-steps">
              <span className={step === 0 ? "selected" : ""}>
                01 · Review products
              </span>
              <span className={step === 1 ? "selected" : ""}>
                02 · Project details
              </span>
            </div>
          )}
          {step === 0 &&
            (cart.length ? (
              <>
                <p className="muted">
                  {count} requested {count === 1 ? "unit" : "units"} ·{" "}
                  {cart.length} product{" "}
                  {cart.length === 1 ? "family" : "families"}
                </p>
                <div className="cart-items">
                  {cart.map((item) => {
                    const p = catalog.products.find((p) => p.id === item.id);
                    return (
                      <article className="cart-item" key={item.id}>
                        <div className="cart-image">
                          {p ? <ProductImage product={p} /> : <ShoppingBag />}
                        </div>
                        <div className="cart-item-main">
                          <p className="eyebrow">
                            {p?.category || "Unavailable"}
                          </p>
                          <h3>{p?.name || item.id}</h3>
                          <small>
                            {p
                              ? "Pack sizes confirmed with your quote"
                              : "Remove this unavailable item to continue"}
                          </small>
                          <div className="quantity">
                            <button
                              aria-label={`Decrease ${p?.name || item.id}`}
                              onClick={() => change(item.id, item.quantity - 1)}
                            >
                              <Minus size={15} />
                            </button>
                            <input
                              aria-label={`Quantity for ${p?.name || item.id}`}
                              type="number"
                              min="1"
                              max="999"
                              value={item.quantity}
                              onChange={(e) =>
                                change(item.id, Number(e.target.value) || 1)
                              }
                            />
                            <button
                              aria-label={`Increase ${p?.name || item.id}`}
                              onClick={() => change(item.id, item.quantity + 1)}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="icon-button danger"
                          aria-label={`Remove ${p?.name || item.id}`}
                          onClick={() => change(item.id, 0)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </article>
                    );
                  })}
                </div>
                <div className="cart-summary">
                  <div>
                    <strong>Made for your project</strong>
                    <p>
                      No payment required. We confirm specifications,
                      quantities, delivery and pricing with you.
                    </p>
                  </div>
                  <button
                    className="button primary w-full"
                    onClick={() => setStep(1)}
                    disabled={cart.some(
                      (i) => !catalog.products.some((p) => p.id === i.id),
                    )}
                  >
                    Continue to details <ArrowRight size={18} />
                  </button>
                  <button
                    className="text-button w-full"
                    onClick={() => setOpen(false)}
                  >
                    Continue exploring
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={56} />
                <h3>Your next project starts here</h3>
                <p>
                  Explore our product families and add what you need. We’ll help
                  refine the specification.
                </p>
                <a
                  className="button primary"
                  href="/#products"
                  onClick={() => setOpen(false)}
                >
                  Explore products <ArrowRight size={18} />
                </a>
              </div>
            ))}
          {step === 1 && (
            <form onSubmit={submit} className="form-stack">
              <p>
                Your request is saved to our team’s dashboard before you
                continue to WhatsApp.
              </p>
              {(["name", "phone", "address", "notes"] as const).map((k) => (
                <label key={k}>
                  {
                    {
                      name: "Your name",
                      phone: "Phone / WhatsApp",
                      address: "Project address / location",
                      notes: "Requirements or notes (optional)",
                    }[k]
                  }
                  {k === "notes" ? (
                    <textarea
                      value={customer[k]}
                      maxLength={1000}
                      onChange={(e) => {
                        setCustomer({ ...customer, [k]: e.target.value });
                        requestId.current = "";
                      }}
                    />
                  ) : (
                    <input
                      required
                      value={customer[k]}
                      type={k === "phone" ? "tel" : "text"}
                      maxLength={
                        k === "address" ? 600 : k === "phone" ? 25 : 100
                      }
                      autoComplete={
                        k === "name"
                          ? "name"
                          : k === "phone"
                            ? "tel"
                            : "street-address"
                      }
                      onChange={(e) => {
                        setCustomer({ ...customer, [k]: e.target.value });
                        requestId.current = "";
                      }}
                    />
                  )}
                </label>
              ))}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary" disabled={busy}>
                {busy ? "Saving request…" : "Save quotation request"}{" "}
                <ArrowRight size={18} />
              </button>
              <button
                className="text-button"
                type="button"
                onClick={() => setStep(0)}
              >
                Back to products
              </button>
            </form>
          )}
          {step === 2 && result && (
            <div className="success-state">
              <CheckCircle2 size={56} />
              <h3>Your requirements are with our team.</h3>
              <p>
                Reference{" "}
                <strong className="reference">{result.order.id}</strong>
              </p>
              <p>
                Continue to WhatsApp to send the prepared message and discuss
                your quotation.
              </p>
              <a
                className="button whatsapp"
                href={result.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Continue on WhatsApp <ArrowRight size={18} />
              </a>
              <button className="text-button" onClick={() => setOpen(false)}>
                Back to storefront
              </button>
            </div>
          )}
        </Modal>
      )}
    </Context.Provider>
  );
}
