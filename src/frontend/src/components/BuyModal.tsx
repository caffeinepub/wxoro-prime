import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";

const WaIcon = () => (
  <svg
    role="img"
    aria-label="WhatsApp"
    viewBox="0 0 24 24"
    className="w-5 h-5 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface BuyModalProps {
  product: Product;
  onClose: () => void;
}

export default function BuyModal({ product, onClose }: BuyModalProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [confirmed, setConfirmed] = useState(false);

  const placeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(product.id);
    },
    onSuccess: () => {
      setConfirmed(true);
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      toast.success("Order placed! We'll confirm it shortly.");
    },
    onError: () => {
      toast.error("Failed to place order. Please try again.");
    },
  });

  const waMessage = encodeURIComponent(`I paid for ${product.name}`);
  const waLink = `https://wa.me/919220984532?text=${waMessage}`;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="glass border-primary/20 max-w-md mx-4"
        data-ocid="buy.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl text-foreground">
            {confirmed ? "Order Placed!" : "Complete Payment"}
          </DialogTitle>
        </DialogHeader>

        {!confirmed ? (
          <div className="flex flex-col items-center gap-6">
            <div
              className="w-full rounded-xl p-4 text-center"
              style={{ background: "oklch(0.78 0.17 70 / 0.08)" }}
            >
              <p className="text-foreground font-semibold text-lg">
                {product.name}
              </p>
              <p className="gradient-text font-display font-extrabold text-3xl mt-1">
                ₹{Number(product.price)}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <img
                src="/assets/uploads/IMG-20260217-WA0009-1.jpeg"
                alt="Paytm UPI QR Code"
                className="w-52 h-52 rounded-xl object-cover"
                style={{ border: "2px solid oklch(0.78 0.17 70 / 0.3)" }}
              />
              <p className="text-muted-foreground text-sm font-medium">
                Scan QR to pay via Paytm UPI
              </p>
              <p className="text-xs text-muted-foreground">
                UPI: 9306616532@ptsbi
              </p>
              <p className="text-xs text-muted-foreground">
                Payment के बाद नीचे button दबाएं
              </p>
            </div>

            <Button
              onClick={() => placeMutation.mutate()}
              disabled={placeMutation.isPending}
              className="w-full btn-gold rounded-full font-bold py-3 text-base border-0"
              data-ocid="buy.confirm_button"
            >
              {placeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                "I've Paid"
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground"
              data-ocid="buy.cancel_button"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.78 0.17 70 / 0.15)" }}
            >
              <CheckCircle2
                className="w-10 h-10"
                style={{ color: "oklch(0.78 0.17 70)" }}
              />
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold text-lg mb-2">
                Thank you for your order!
              </p>
              <p className="text-muted-foreground text-sm">
                Your order for{" "}
                <span className="text-foreground font-medium">
                  {product.name}
                </span>{" "}
                has been placed. Download link जल्द ही भेजा जाएगा।
              </p>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full text-center py-3 rounded-full font-bold flex items-center justify-center gap-2"
              data-ocid="buy.primary_button"
            >
              <WaIcon />
              WhatsApp पर Contact करें
            </a>

            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground"
              data-ocid="buy.close_button"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
