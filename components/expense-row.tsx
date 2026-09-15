"use client";

import { removeExpense } from "@/app/group/[id]/actions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HoldButton } from "@/components/ui/hold-button";
import { X } from "lucide-react";

interface ExpenseData {
  groupId: string;
  currency: string;
  expense: {
    id: string;
    description: string;
    amount: string;
    payer_name: string;
  };
}

export function ExpenseRow({ groupId, currency, expense }: ExpenseData) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    await removeExpense(groupId, expense.id);
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex w-full items-start justify-between border-b pb-2 text-sm">
        <div className="flex min-w-0 flex-col">
          <p className="font-semibold">{expense.description}</p>
          <p className="text-xs text-gray-500">Paid by {expense.payer_name}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <p className="font-semibold">
            {currency} {expense.amount}
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense?</DialogTitle>
            <DialogDescription>Deleting this expense will mean you never get it back!</DialogDescription>
          </DialogHeader>

          <HoldButton
            onAction={handleDelete}
            label={`Hold to Remove ${expense.description}`}
            loadingLabel="Removing..."
          />
        </DialogContent>
      </Dialog>
    </>
  );
}