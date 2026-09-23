import { notFound } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { addMember } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSettlements } from "./utils";
import { MemberPill } from '@/components/member-pill';
import { ExpenseRow } from '@/components/expense-row';
import { AddExpenseForm } from '@/components/add-expense-form';
import { toast } from '@/components/ui/toast';
import { AddMemberForm } from '@/components/add-member-form';

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

      <AddMemberForm members={members} groupId={groupId}></AddMemberForm>

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
          <AddExpenseForm groupId={groupId} members={members} />
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