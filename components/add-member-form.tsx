"use client"

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { addMember } from "@/app/group/[id]/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MemberPill } from "./member-pill";
import { toast } from "./ui/toast";

type Member = {
    id: string;
    name: string;
  };


export function AddMemberForm({members, groupId}: { members: Member[]; groupId: string }){
    return(
        <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form action={addMember.bind(null, groupId)} className="flex gap-2">
                <Input name="name" placeholder="Add member name..." required />
                <Button type="submit" onClick={() => toast.add({description: "New member has been added!", type : "success"})}>Add</Button>
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
    );
}