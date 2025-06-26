import React, { useState } from "react";
import { motion, Reorder } from "framer-motion";
import TaskItem from "./task-item";
import { useReorderTasks } from "@/hooks/use-tasks";
import type { TaskWithProject } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  tasks: TaskWithProject[];
  isLoading: boolean;
  onEditTask: (task: TaskWithProject) => void;
}

export default function TaskList({ tasks, isLoading, onEditTask }: TaskListProps) {
  const [orderedTasks, setOrderedTasks] = useState(tasks);
  const reorderTasks = useReorderTasks();

  // Update ordered tasks when tasks prop changes
  React.useEffect(() => {
    setOrderedTasks(tasks);
  }, [tasks]);

  const handleReorder = (newOrder: TaskWithProject[]) => {
    setOrderedTasks(newOrder);
    const taskIds = newOrder.map(task => task.id);
    reorderTasks.mutate(taskIds);
  };

  if (isLoading) {
    return (
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-6 pb-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No tasks found</div>
          <div className="text-gray-500 text-sm">
            Create your first task or adjust your filters
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <Reorder.Group
        axis="y"
        values={orderedTasks}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {orderedTasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <TaskItem task={task} onEdit={onEditTask} />
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
