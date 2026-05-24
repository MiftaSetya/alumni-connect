import React from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertOptions {
  title: string;
  description?: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

export const Swal = {
  fire: (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      document.body.appendChild(container);
      const root = createRoot(container);

      const cleanup = (value: boolean) => {
        const overlay = document.getElementById("swal-overlay");
        const modal = document.getElementById("swal-modal");
        if (overlay && modal) {
          overlay.classList.remove("opacity-100");
          overlay.classList.add("opacity-0");
          modal.classList.remove("scale-100", "opacity-100");
          modal.classList.add("scale-95", "opacity-0");
        }

        setTimeout(() => {
          root.unmount();
          container.remove();
          resolve(value);
        }, 200);
      };

      root.render(<SwalModal options={options} onClose={cleanup} />);
    });
  },

  success: (title: string, description?: string) => {
    return Swal.fire({ title, description, type: "success", confirmText: "Selesai" });
  },

  error: (title: string, description?: string) => {
    return Swal.fire({ title, description, type: "error", confirmText: "Tutup" });
  },

  warning: (title: string, description?: string) => {
    return Swal.fire({ title, description, type: "warning", confirmText: "Ya" });
  },

  info: (title: string, description?: string) => {
    return Swal.fire({ title, description, type: "info", confirmText: "Mengerti" });
  },

  confirm: (title: string, description: string, type: AlertType = "warning"): Promise<boolean> => {
    return Swal.fire({
      title,
      description,
      type,
      showCancelButton: true,
      confirmText: "Ya, Lanjutkan",
      cancelText: "Batal",
    });
  }
};

const SwalModal = ({ options, onClose }: { options: AlertOptions; onClose: (val: boolean) => void }) => {
  const {
    title,
    description,
    type = "info",
    confirmText = "OK",
    cancelText = "Batal",
    showCancelButton = false,
  } = options;

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />;
      case "error":
        return <XCircle className="h-12 w-12 text-rose-500 animate-pulse" />;
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-amber-500 animate-pulse" />;
      case "info":
      default:
        return <Info className="h-12 w-12 text-blue-500 animate-pulse" />;
    }
  };

  return (
    <div
      id="swal-overlay"
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-200 ease-out opacity-0",
        isOpen && "opacity-100"
      )}
      onClick={() => {
        if (showCancelButton) onClose(false);
      }}
    >
      <div
        id="swal-modal"
        className={cn(
          "w-full max-w-sm bg-card border shadow-xl rounded-2xl p-6 flex flex-col items-center text-center transform transition-all duration-200 ease-out relative overflow-hidden scale-95 opacity-0",
          isOpen && "scale-100 opacity-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1.5",
            type === "success" && "bg-emerald-500",
            type === "error" && "bg-rose-500",
            type === "warning" && "bg-amber-500",
            type === "info" && "bg-blue-500"
          )}
        />

        <div className="mb-4 mt-2">{getIcon()}</div>

        <h3 className="text-lg font-bold text-foreground font-display mb-1">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{description}</p>}

        <div className={cn("flex w-full gap-2.5 mt-2", showCancelButton ? "justify-between" : "justify-center")}>
          {showCancelButton && (
            <button
              onClick={() => onClose(false)}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border hover:bg-muted text-muted-foreground transition-all active:scale-[0.98]"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => onClose(true)}
            className={cn(
              "px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all active:scale-[0.98]",
              showCancelButton ? "flex-1" : "min-w-[120px]",
              type === "success" && "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10",
              type === "error" && "bg-rose-500 hover:bg-rose-600 shadow-rose-500/10",
              type === "warning" && "bg-amber-500 hover:bg-amber-600 shadow-amber-500/10",
              type === "info" && "bg-blue-500 hover:bg-blue-600 shadow-blue-500/10"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
