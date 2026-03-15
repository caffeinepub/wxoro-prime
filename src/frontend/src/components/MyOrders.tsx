import { Badge } from "@/components/ui/badge";
import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Download, Loader2 } from "lucide-react";
import { type Order, OrderStatus } from "../backend.d";

export default function MyOrders() {
  const { actor, isFetching } = useActor();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor && !isFetching,
  });

  return (
    <section className="py-20 px-4" data-ocid="orders.section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.78 0.17 70)" }}
          >
            — Account —
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            My Orders
          </h2>
        </div>

        {isLoading && (
          <div
            className="flex justify-center py-12"
            data-ocid="orders.loading_state"
          >
            <Loader2
              className="animate-spin"
              style={{ color: "oklch(0.78 0.17 70)", width: 32, height: 32 }}
            />
          </div>
        )}

        {!isLoading && (!orders || orders.length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="orders.empty_state"
          >
            <div className="text-4xl mb-4">📦</div>
            <p className="text-foreground font-semibold text-lg mb-2">
              No orders yet
            </p>
            <p className="text-muted-foreground text-sm">
              Purchase a product to see it here
            </p>
          </div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="flex flex-col gap-4" data-ocid="orders.list">
            {orders.map((order, i) => (
              <OrderRow
                key={order.orderId.toString()}
                order={order}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const { actor } = useActor();
  const isConfirmed = order.status === OrderStatus.confirmed;

  const { data: product } = useQuery({
    queryKey: ["product", order.productId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(order.productId);
    },
    enabled: !!actor,
  });

  const date = new Date(Number(order.timestamp / 1000000n));

  return (
    <div
      className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
      data-ocid={`orders.item.${index}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {isConfirmed ? (
            <CheckCircle2
              className="w-4 h-4"
              style={{ color: "oklch(0.78 0.17 70)" }}
            />
          ) : (
            <Clock className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="font-semibold text-foreground">
            {product?.name ?? `Order #${order.orderId.toString()}`}
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          className={`rounded-full text-xs font-semibold border-0 ${
            isConfirmed ? "text-foreground" : "text-muted-foreground"
          }`}
          style={{
            background: isConfirmed
              ? "oklch(0.78 0.17 70 / 0.15)"
              : "oklch(0.55 0.01 270 / 0.4)",
            color: isConfirmed ? "oklch(0.78 0.17 70)" : undefined,
          }}
        >
          {isConfirmed ? "Confirmed" : "Pending"}
        </Badge>

        {isConfirmed && product?.driveLink && (
          <a
            href={product.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            data-ocid={`orders.primary_button.${index}`}
          >
            <Download className="w-3 h-3" /> Download
          </a>
        )}
      </div>
    </div>
  );
}
