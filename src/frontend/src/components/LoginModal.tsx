import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, isLoggingIn, loginStatus } = useInternetIdentity();

  if (loginStatus === "success") {
    onClose();
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="glass border-primary/20 max-w-sm mx-4"
        data-ocid="login.dialog"
      >
        <DialogHeader>
          <div className="text-center">
            <div className="font-display font-extrabold text-2xl gradient-text mb-1">
              WXORO Prime
            </div>
            <DialogTitle className="text-foreground font-semibold text-lg">
              Sign in to continue
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
              style={{ background: "oklch(0.78 0.17 70 / 0.12)" }}
            >
              🔐
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in with Internet Identity to purchase products and track your
              orders.
            </p>
          </div>

          <Button
            onClick={() => login()}
            disabled={isLoggingIn}
            className="w-full btn-gold rounded-full font-bold py-3 text-base border-0"
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground w-full"
            data-ocid="login.cancel_button"
          >
            Maybe Later
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Powered by Internet Identity — secure, passwordless login
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
