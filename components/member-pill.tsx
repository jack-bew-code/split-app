"use client"

import { useState } from "react";
import { X } from "lucide-react";
import { removeMember } from "@/app/group/[id]/actions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoldButton } from "@/components/ui/hold-button";

export function MemberPill({ member, groupId }: { member: { id: string, name: string }, groupId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await removeMember(groupId, member.id);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs pl-3 pr-2 py-1.5 rounded-full font-medium cursor-default">
        <span>{member.name}</span>
        <button 
          type="button"
          onClick={() => setIsOpen(true)}
          className="hover:text-red-400 opacity-70 hover:opacity-100 transition-opacity p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xs text-center border-border/50">
          <DialogHeader>
            <DialogTitle className="text-center">Remove {member.name}?</DialogTitle>
            <DialogDescription className="text-center text-xs">
              NOTE: This will also delete any expenses they paid for.
            </DialogDescription>
          </DialogHeader>
          
          <HoldButton 
            onAction={handleDelete} 
            label={`Hold to Remove ${member.name}`} 
            loadingLabel="Removing..." 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}