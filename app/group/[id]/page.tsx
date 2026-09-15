import { notFound } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { addMember, addExpense } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateSettlements } from "./utils";
import { MemberPill } from '@/components/member-pill';
import { ExpenseRow } from '@/components/expense-row';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GroupDashboard({ params }: PageProps) {
  const { id: groupId } = await params;
  const sql = neon(process.env.DATABASE_URL!);

  // 1. Fetch Group Details
  const groups = await sql`SELECT * FROM groups WHERE id = ${groupId}`;
  if (!groups.length) notFound();
  const group = groups[0];

  // 2. Fetch Members
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  const members = await sql`SELECT * FROM members WHERE group_id = ${groupId} ORDER BY created_at ASC` as { id: string; name: string }[];

  // 3. Fetch Expenses with Payer Names
  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      payer_id UUID REFERENCES members(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  const expenses = await sql`
    SELECT e.*, m.name as payer_name 
    FROM expenses e 
    JOIN members m ON e.payer_id = m.id 
    WHERE e.group_id = ${groupId} 
    ORDER BY e.created_at DESC
  ` as { id: string; description: string; amount: string; payer_name: string }[];

  const totalSpent = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

  const settlements = calculateSettlements(members, expenses);

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto space-y-6">
      {/* Group Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{group.name}</CardTitle>
          <p className="text-sm text-gray-500">
            Total Spent: <span className="font-semibold text-gray-400">{group.currency} {totalSpent.toFixed(2)}</span>
          </p>
        </CardHeader>
      </Card>

      {/* Add Member Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Group Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={addMember.bind(null, groupId)} className="flex gap-2">
            <Input name="name" placeholder="Add member name..." required />
            <Button type="submit">Add</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
                <MemberPill key={m.id} member={m} groupId={groupId}></MemberPill>
            ))}
            {members.length === 0 && (
                <p className="text-xs text-gray-400">No members added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Settlement Plan</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                {settlements.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-grey-50 border border-emerald-200 p-3 rounded-md text-sm">
                    <span>
                        <strong className="text-emerald-600">{s.from}</strong> owes <strong className="text-emerald-600">{s.to}</strong>
                    </span>
                    <span className="font-bold text-emerald-700">
                        {group.currency} {s.amount.toFixed(2)}
                    </span>
                    </div>
                ))}
                {settlements.length === 0 && (
                    <p className="text-xs text-gray-400">Everyone is settled up or no expenses added yet.</p>
                )}
                </div>
            </CardContent>
        </Card>

      {/* Add Expense Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">Add at least one member above before adding expenses.</p>
          ) : (
            <form action={addExpense.bind(null, groupId)} className="space-y-3">
              <Input name="description" placeholder="What was paid for? (e.g. Dinner)" required />
              <div className="flex gap-2">
                <Input name="amount" type="number" step="0.01" placeholder="Amount" required />
                <Select name="payerId" required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Paid by" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Save Expense</Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Expense History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expenses.map((exp) => (
            <ExpenseRow
            key={exp.id}
            groupId={groupId}
            currency={group.currency}
            expense={exp}
            ></ExpenseRow>
            
            //   <div key={exp.id} className="flex justify-between items-start border-b pb-2 text-sm">
            //     <div className="flex flex-col flex-1">
            //       <div className="flex w-full items-center">
            //         <p className="font-semibold">{exp.description}</p>
            //         <p className="font-semibold ml-auto">{exp.amount} {group.currency}</p>
            //       </div>
            //       <p className="text-xs text-gray-500">Paid by {exp.payer_name}</p>
            //     </div>
            //   </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-xs text-gray-400">No expenses recorded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}