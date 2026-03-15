import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type Order, OrderStatus, type Product } from "../backend.d";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  driveLink: string;
  category: string;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  driveLink: "",
  category: "LUTs",
};

export default function AdminPanel() {
  const { actor, isFetching } = useActor();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });

  if (!isAdmin) return null;

  return <AdminContent />;
}

function AdminContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [editId, setEditId] = useState<bigint | null>(null);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActiveProducts();
    },
    enabled: !!actor,
  });

  const { data: allOrders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOrders();
    },
    enabled: !!actor,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error();
      if (editId !== null) {
        await actor.editProduct(
          editId,
          form.name,
          form.description,
          BigInt(form.price || "0"),
          form.driveLink,
          form.category,
          true,
        );
      } else {
        await actor.addProduct(
          form.name,
          form.description,
          BigInt(form.price || "0"),
          form.driveLink,
          form.category,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setForm(EMPTY_FORM);
      setEditId(null);
      toast.success(editId !== null ? "Product updated!" : "Product added!");
    },
    onError: () => toast.error("Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error();
      await actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const confirmMutation = useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error();
      await actor.confirmOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
      toast.success("Order confirmed!");
    },
    onError: () => toast.error("Failed to confirm"),
  });

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      driveLink: p.driveLink,
      category: p.category,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <section
      className="py-20 px-4"
      style={{ borderTop: "1px solid oklch(0.78 0.17 70 / 0.1)" }}
      data-ocid="admin.panel"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: "oklch(0.78 0.17 70)" }}
          >
            — Admin —
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
            Admin Panel
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add/Edit Product form */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-5">
              {editId !== null ? "Edit Product" : "Add Product"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-muted-foreground text-xs mb-1.5 block">
                  Name
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Product name"
                  className="bg-input border-border text-foreground"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs mb-1.5 block">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Product description"
                  className="bg-input border-border text-foreground resize-none"
                  rows={3}
                  data-ocid="admin.textarea"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">
                    Price (₹)
                  </Label>
                  <Input
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: e.target.value }))
                    }
                    placeholder="499"
                    type="number"
                    className="bg-input border-border text-foreground"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1.5 block">
                    Category
                  </Label>
                  <Input
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    placeholder="LUTs"
                    className="bg-input border-border text-foreground"
                    data-ocid="admin.input"
                  />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs mb-1.5 block">
                  Google Drive Link
                </Label>
                <Input
                  value={form.driveLink}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, driveLink: e.target.value }))
                  }
                  placeholder="https://drive.google.com/..."
                  className="bg-input border-border text-foreground"
                  data-ocid="admin.input"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => addMutation.mutate()}
                  disabled={addMutation.isPending || !form.name}
                  className="flex-1 btn-gold rounded-full font-bold border-0"
                  data-ocid="admin.submit_button"
                >
                  {addMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editId !== null ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </>
                  )}
                </Button>
                {editId !== null && (
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    className="border-border text-muted-foreground"
                    data-ocid="admin.cancel_button"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Products list */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-5">
              Products
            </h3>
            {productsLoading ? (
              <div
                className="flex justify-center py-8"
                data-ocid="admin.loading_state"
              >
                <Loader2
                  className="animate-spin"
                  style={{ color: "oklch(0.78 0.17 70)" }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                {products?.map((p, i) => (
                  <div
                    key={p.id.toString()}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl"
                    style={{ background: "oklch(0.09 0.008 270 / 0.8)" }}
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-semibold truncate">
                        {p.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        ₹{Number(p.price)} · {p.category}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors"
                        style={{ color: "oklch(0.78 0.17 70)" }}
                        data-ocid={`admin.edit_button.${i + 1}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors text-destructive"
                        data-ocid={`admin.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders to confirm */}
        <div className="glass-card rounded-2xl p-6 mt-8">
          <h3 className="font-display font-bold text-lg text-foreground mb-5">
            Pending Orders
          </h3>
          {ordersLoading ? (
            <div
              className="flex justify-center py-8"
              data-ocid="admin.loading_state"
            >
              <Loader2
                className="animate-spin"
                style={{ color: "oklch(0.78 0.17 70)" }}
              />
            </div>
          ) : (
            <div>
              {(!allOrders ||
                allOrders.filter((o) => o.status === OrderStatus.pending)
                  .length === 0) && (
                <p
                  className="text-muted-foreground text-sm text-center py-6"
                  data-ocid="admin.empty_state"
                >
                  No pending orders 🎉
                </p>
              )}
              <div className="flex flex-col gap-3" data-ocid="admin.list">
                {allOrders
                  ?.filter((o) => o.status === OrderStatus.pending)
                  .map((order, i) => (
                    <div
                      key={order.orderId.toString()}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl"
                      style={{ background: "oklch(0.09 0.008 270 / 0.8)" }}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <div>
                        <p className="text-foreground text-sm font-semibold">
                          Order #{order.orderId.toString()}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Product #{order.productId.toString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => confirmMutation.mutate(order.orderId)}
                        disabled={confirmMutation.isPending}
                        className="btn-gold rounded-full text-xs font-bold border-0"
                        data-ocid={`admin.confirm_button.${i + 1}`}
                      >
                        {confirmMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Confirm"
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
