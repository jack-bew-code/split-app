'use server'

import { revalidatePath } from 'next/cache';
import { neon } from '@neondatabase/serverless';

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function addMember(groupId: string, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name || !groupId) return;

  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO members (group_id, name)
    VALUES (${groupId}, ${name})
  `;

  revalidatePath(`/group/${groupId}`);
}

export async function addExpense(groupId: string, formData: FormData) {
  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const payerId = formData.get('payerId') as string;

  if (!description || isNaN(amount) || !payerId || !groupId) return;

  const sql = getDb();

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

  await sql`
    INSERT INTO expenses (group_id, description, amount, payer_id)
    VALUES (${groupId}, ${description}, ${amount}, ${payerId})
  `;

  revalidatePath(`/group/${groupId}`);
}

export async function removeMember(group_id: string, member_id: string){
    if(!group_id || !member_id) return;

    const sql = getDb();

    //deletes the member and remove all expenses paid from this member 
    await sql`
        DELETE FROM members 
        WHERE id = ${member_id} AND group_id = ${group_id}
    `;

    revalidatePath(`/group/${group_id}`)
}

export async function removeExpense(group_id: string, expense_id: string){
    if(!group_id || !expense_id) return;

    const sql = getDb();

    await sql`
    DELETE FROM expenses
    WHERE id = ${expense_id} AND group_id = ${group_id}
    `;

    revalidatePath(`/group/${group_id}`)
}