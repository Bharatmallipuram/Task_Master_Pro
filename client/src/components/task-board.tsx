import React from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskItem from "./task-item";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { TaskWithProject } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TaskBoardProps {
  tasks: TaskWithProject[];
  isLoading: boolean;
  onEditTask: (task: TaskWithProject) => void;
}

const statusColumns = [
  { id: "active", title: "To Do", color: "bg-blue-50 border-blue-200" },
  { id: "in-progress", title: "In Progress", color: "bg-yellow-50 border-yellow-200" },
  { id: "completed", title: "Completed", color: "bg-green-50 border-green-200" },
];

export default function TaskBoard({ tasks, isLoading, onEditTask }: TaskBoardProps) {
  const updateTask = useUpdateTask();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const taskId = parseInt(draggableId);
    
    // If dropped in a different column, update the task status
    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId === "completed" ? "completed" : destination.droppableId;
      const completed = destination.droppableId === "completed";
      
      updateTask.mutate({
        id: taskId,
        updates: { status: newStatus, completed }
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => {
      if (status === "completed") return task.completed;
      if (status === "in-progress") return task.status === "in-progress" && !task.completed;
      return task.status === "active" && !task.completed;
    });
  };

  if (isLoading) {
    return (
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 min-h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {statusColumns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            
            return (
              <div key={column.id} className={cn("rounded-lg border-2 border-dashed p-4", column.color)}>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  {column.title}
                  <span className="text-sm bg-white px-2 py-1 rounded-full text-gray-600">
                    {columnTasks.length}
                  </span>
                </h3>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "min-h-96 transition-colors",
                        snapshot.isDraggingOver && "bg-white/50 rounded-lg"
                      )}
                    >
                      <div className="space-y-3">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "transition-transform",
                                  snapshot.isDragging && "rotate-2 scale-105"
                                )}
                              >
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  layout
                                >
                                  <TaskItem task={task} onEdit={onEditTask} />
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                      
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <div className="text-lg mb-2">No tasks</div>
                          <div className="text-sm">
                            Drag tasks here or create new ones
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}