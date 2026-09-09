'use server'

import { redirect } from 'next/navigation';
import { neon } from '@neondatabase/serverless';

export async function createGroup(formData: FormData) {
  const name = formData.get('name') as string;
  const currency = formData.get('currency') as string;

  if (!name) return;

  // Initialize the Neon serverless connection
  const sql = neon(process.env.DATABASE_URL!);

  // Ensure the table exists (bypassing the need for manual migrations)
  await sql`
    CREATE TABLE IF NOT EXISTS groups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      currency TEXT DEFAULT 'USD',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Insert the new group and return its generated ID
  const result = await sql`
    INSERT INTO groups (name, currency)
    VALUES (${name}, ${currency || 'USD'})
    RETURNING id
  `;

  const groupId = result[0].id;
  
  redirect(`/group/${groupId}`);
}