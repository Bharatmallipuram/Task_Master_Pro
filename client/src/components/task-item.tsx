import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { cn, getPriorityColor, getPriorityBadgeColor, formatDate } from "@/lib/utils";
import type { TaskWithProject } from "@shared/schema";

interface TaskItemProps {
  task: TaskWithProject;
  onEdit: (task: TaskWithProject) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();

  const handleToggleComplete = (checked: boolean) => {
    updateTask.mutate(
      { id: task.id, updates: { completed: checked } },
      {
        onSuccess: () => {
          if (checked) {
            toast({
              title: "Task completed!",
              description: "Great job on finishing this task.",
            });
          }
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          toast({
            title: "Task deleted",
            description: "The task has been removed successfully.",
          });
        },
      });
    }
  };

  const priorityLabels = {
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md",
        `priority-${task.priority}`,
        task.completed && "task-completed"
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -1 }}
      animate={task.completed ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-4">
        <div className="drag-handle text-gray-400 hover:text-gray-600">
          <GripVertical className="w-5 h-5" />
        </div>
        
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-gray-900 task-text",
                task.completed && "line-through"
              )}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              <Badge className={getPriorityBadgeColor(task.priority)}>
                {task.completed ? "Completed" : priorityLabels[task.priority as keyof typeof priorityLabels]}
              </Badge>
              
              {task.dueDate && (
                <span className="text-sm text-gray-500">
                  {formatDate(task.dueDate)}
                </span>
              )}
              
              <motion.div 
                className="flex items-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="text-gray-400 hover:text-primary h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-gray-400 hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
