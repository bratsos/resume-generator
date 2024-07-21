// app/components/DeleteExperience.tsx

import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Trash2Icon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface DeleteExperienceProps {
  resumeId: string;
  experienceId: number;
  companyName: string;
}

export function DeleteExperience({
  resumeId,
  experienceId,
  companyName,
}: DeleteExperienceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteFetcher = useFetcher();

  const handleDelete = () => {
    deleteFetcher.submit(
      {},
      {
        method: "DELETE",
        action: `/resume/${resumeId}/work-experience/${experienceId}/delete`,
      }
    );
    setIsOpen(false);
    onDelete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="w-6 h-6">
          <Trash2Icon size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Work Experience</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your work experience at{" "}
            {companyName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
