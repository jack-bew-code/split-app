"use client";

import { useMemo, useState } from "react";

import { addExpense } from "@/app/group/[id]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Member = {
  id: string;
  name: string;
};

type AddExpenseFormProps = {
  groupId: string;
  members: Member[];
};

export function AddExpenseForm({ groupId, members }: AddExpenseFormProps) {
  const [payerId, setPayerId] = useState<string>("");

  const selectedMemberName = useMemo(() => {
    return members.find((member) => member.id === payerId)?.name ?? "Paid by";
  }, [members, payerId]);

  if (members.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Add at least one member above before adding expenses.
      </p>
    );
  }

  return (
    <form action={addExpense.bind(null, groupId)} className="space-y-3">
      <Input name="description" placeholder="What was paid for? (e.g. Dinner)" required />
      <div className="flex gap-2">
        <Input name="amount" type="number" step="0.01" placeholder="Amount" required />
        <Select name="payerId" value={payerId} onValueChange={(value) => setPayerId(value ?? "")} required>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Paid by">{selectedMemberName}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Save Expense
      </Button>
    </form>
  );
}