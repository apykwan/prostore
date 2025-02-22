'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel 
} from '@/components/ui/alert-dialog';

import { useToast } from '@/hooks/use-toast';

type DeleteDialogProps = {
  id: string; 
  action: (id: string) => Promise<{ success: boolean; message: string; }>;  
};

export default function DeleteDialog({ id,  action }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleDeleteClick() {
    startTransition(async() => {
      const res = await action(id);

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message
        });
      }
    });

    
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="ml-2">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" size="sm" disabled={isPending} onClick={handleDeleteClick}>
              { isPending ? 'Deleting...' : 'Delete' }
            </Button>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}