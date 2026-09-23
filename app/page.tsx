import { createGroup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { group } from "console";
import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";

export default async function HomePage() {

  async function createNewGroup(formData: FormData){
    "use server"
    formData.get("groupName");

    const groupName = formData.get("groupName") as string;
    if (!groupName) return;

    const sql = neon(process.env.DATABASE_URL!);

    //adding new group to the database
    const result = await sql`
    INSERT INTO groups (name)
    VALUES (${groupName}) 
    RETURNING id
`;
    const newId = result[0].id;
    redirect(`/group/${newId}`);
  }

  return (
    <main className="max-w-md mx-auto p-4 mt-20 space-y-8">
      
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Split Simple
        </h1>
        <p className="text-muted-foreground text-lg">
          A frictionless expense splitter.
        </p>
      </div>

      {/* Create Group Card */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Start a New Group</CardTitle>
          <CardDescription>
            Create a shared space to manage expenses for a trip, event, or anything.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wire up your server action here! */}
          <form className="flex gap-3" action={createNewGroup}>
            <Input 
              name="groupName" 
              placeholder="e.g. Trip to Paris" 
              required 
              className="flex-1"
            />
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      <div className="bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 rounded-xl p-5 text-sm text-amber-900 dark:text-amber-200 shadow-sm">
        <div className="flex items-center gap-2 font-semibold mb-2 text-base">
          <span>⚠️</span> No login required
        </div>
        <p className="mb-3 leading-relaxed">
          This app doesnt use accounts. Once you create a group, 
          <strong className="font-bold"> you should bookmark the URL</strong> to access it again.
        </p>
        {/* <p className="opacity-90">
          If you lose your link, you will need to contact me to recover it!
        </p> */}
      </div>

    </main>
  );
}