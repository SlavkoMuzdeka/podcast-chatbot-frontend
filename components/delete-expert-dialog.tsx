"use client";

import type { Expert } from "@/utils/models";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteExpertDialogProps {
  dialogText?: string;
  deleteExpertDialog: boolean;
  setDeleteExpertDialog: (open: boolean) => void;
  selectedExpert: Expert;
  isDeletingExpert: boolean;
  handleDeleteExpert: (expertId: string) => void;
}

export function DeleteExpertDialog({
  dialogText,
  deleteExpertDialog,
  setDeleteExpertDialog,
  selectedExpert,
  isDeletingExpert,
  handleDeleteExpert,
}: DeleteExpertDialogProps) {
  return (
    <Dialog open={deleteExpertDialog} onOpenChange={setDeleteExpertDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 bg-transparent rounded-xl"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {dialogText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Expert
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedExpert.name}"? This will
            permanently remove the expert and all associated episodes from your
            knowledge base. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteExpertDialog(false)}
            disabled={isDeletingExpert}
            className="border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteExpert(selectedExpert.id)}
            disabled={isDeletingExpert}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 rounded-xl"
          >
            {isDeletingExpert ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Expert
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
