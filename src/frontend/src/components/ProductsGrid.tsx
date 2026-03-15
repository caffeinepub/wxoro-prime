import { Badge } from "@/components/ui/badge";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "../backend.d";

const SEED_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Cinematic LUT Pack",
    description:
      "40 premium cinematic LUTs for Hollywood-grade color grading. Perfect for vlogs, films, and reels.",
    price: 499n,
    category: "LUTs",
    driveLink: "",
    isActive: true,
  },
  {
    id: 2n,
    name: "Wedding Preset Bundle",
    description:
      "25 elegant Lightroom presets crafted for wedding photography. Warm tones, soft light.",
    price: 399n,
    category: "Presets",
    driveLink: "",
    isActive: true,
  },
  {
    id: 3n,
    name: "Urban Street Moody Pack",
    description:
      "Dark, moody color grading for street and portrait photography. 30 Lightroom + Capture One presets.",
    price: 299n,
    category: "Presets",
    driveLink: "",
    isActive: true,
  },
  {
    id: 4n,
    name: "Reels Motion Templates",
    description:
      "20 dynamic After Effects templates for Instagram Reels with smooth transitions.",
    price: 599n,
    category: "Templates",
    driveLink: "",
    isActive: true,
  },
  {
    id: 5n,
    name: "Travel Film LUT Bundle",
    description:
      "35 LUTs inspired by travel cinematographers. Works in Premiere, DaVinci & FCPX.",
    price: 449n,
    category: "LUTs",
    driveLink: "",
    isActive: true,
  },
  {
    id: 6n,
    name: "Vintage Film Grain Pack",
    description:
      "Authentic film grain overlays + 15 vintage presets for a nostalgic, analog look.",
    price: 199n,
    category: "Overlays",
    driveLink: "",
    isActive: true,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  LUTs: "oklch(0.78 0.17 70)",
  Presets: "oklch(0.72 0.19 50)",
  Templates: "oklch(0.68 0.18 280)",
  Overlays: "oklch(0.65 0.16 160)",
  default: "oklch(0.60 0.10 270)",
};

interface ProductsGridProps {
  onBuyClick: (product: Product) => void;
  isLoggedIn: boolean;
}

export default function ProductsGrid({ onBuyClick }: ProductsGridProps) {
  const { actor, isFetching } = useActor();
  const [loaded, setLoaded] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActiveProducts();
    },
    enabled: !!actor && !isFetching,
  });

  const displayProducts =
    products && products.length > 0 ? products : SEED_PRODUCTS;

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  return (
    <section id="products" className="py-24 px-4" data-ocid="products.section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.78 0.17 70)" }}
          >
            — Our Collection —
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">
            Premium Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Hand-crafted editing materials for creators who demand excellence
          </p>
        </div>

        {isLoading && (
          <div
            className="flex justify-center py-20"
            data-ocid="products.loading_state"
          >
            <Loader2
              className="animate-spin"
              style={{ color: "oklch(0.78 0.17 70)", width: 40, height: 40 }}
            />
          </div>
        )}

        {!isLoading && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${
              loaded ? "products-loaded" : ""
            }`}
            data-ocid="products.list"
          >
            {displayProducts.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i + 1}
                onBuyClick={onBuyClick}
                categoryColor={
                  CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS.default
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
  onBuyClick,
  categoryColor,
}: {
  product: Product;
  index: number;
  onBuyClick: (p: Product) => void;
  categoryColor: string;
}) {
  const iconMap: Record<string, string> = {
    LUTs: "🎨",
    Presets: "✨",
    Templates: "🎬",
  };
  const icon = iconMap[product.category] ?? "🖼️";

  return (
    <div
      className="product-card glass-card rounded-2xl p-6 flex flex-col gap-4 group cursor-default"
      data-ocid={`products.item.${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{
            background: categoryColor.replace(")", " / 0.15)"),
            color: categoryColor,
          }}
        >
          {icon}
        </div>
        <Badge
          className="text-xs font-semibold rounded-full px-3 py-0.5 border-0"
          style={{
            background: categoryColor.replace(")", " / 0.15)"),
            color: categoryColor,
          }}
        >
          {product.category}
        </Badge>
      </div>

      <div className="flex-1">
        <h3 className="font-display font-bold text-lg text-foreground mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs font-medium mb-0.5">
            Price
          </span>
          <span
            className="font-display font-extrabold text-2xl leading-none"
            style={{ color: "oklch(0.78 0.17 70)" }}
          >
            ₹{Number(product.price)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onBuyClick(product)}
          className="btn-gold px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide shadow-lg hover:scale-105 hover:shadow-amber-500/40 transition-all duration-200 flex-shrink-0"
          style={{
            minWidth: "100px",
          }}
          data-ocid={`products.primary_button.${index}`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
