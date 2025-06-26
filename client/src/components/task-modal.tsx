import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateTask, useUpdateTask, useProjects } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { insertTaskSchema } from "@shared/schema";
import type { TaskWithProject } from "@shared/schema";
import { z } from "zod";

const taskFormSchema = insertTaskSchema.extend({
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskWithProject | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { data: projects = [] } = useProjects();
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      projectId: undefined,
      dueDate: "",
      completed: false,
      status: "active",
      order: 0,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        projectId: task.projectId || undefined,
        dueDate: task.dueDate || "",
        completed: task.completed,
        status: task.status,
        order: task.order,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        priority: "medium",
        projectId: undefined,
        dueDate: "",
        completed: false,
        status: "active",
        order: 0,
      });
    }
  }, [task, form]);

  const onSubmit = (data: TaskFormData) => {
    const submitData = {
      ...data,
      projectId: data.projectId || null,
      dueDate: data.dueDate || null,
    };

    if (task) {
      updateTask.mutate(
        { id: task.id, updates: submitData },
        {
          onSuccess: () => {
            toast({
              title: "Task updated",
              description: "Your task has been updated successfully.",
            });
            onClose();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to update task. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createTask.mutate(submitData, {
        onSuccess: () => {
          toast({
            title: "Task created",
            description: "Your new task has been added successfully.",
          });
          onClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create task. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add task description..." 
                      rows={3}
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} 
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createTask.isPending || updateTask.isPending}
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
