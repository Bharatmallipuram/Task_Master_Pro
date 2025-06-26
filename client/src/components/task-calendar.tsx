import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getPriorityBadgeColor } from "@/lib/utils";
import type { TaskWithProject } from "@shared/schema";
import { format, isSameDay } from "date-fns";

interface TaskCalendarProps {
  tasks: TaskWithProject[];
  onEditTask: (task: TaskWithProject) => void;
}

export default function TaskCalendar({ tasks, onEditTask }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getDateModifiers = () => {
    const modifiers: { [key: string]: Date[] } = {
      hasTasks: [],
      overdue: [],
      highPriority: [],
    };

    tasks.forEach(task => {
      if (!task.dueDate) return;
      const taskDate = new Date(task.dueDate);
      
      modifiers.hasTasks.push(taskDate);
      
      if (taskDate < new Date() && !task.completed) {
        modifiers.overdue.push(taskDate);
      }
      
      if (task.priority === "high") {
        modifiers.highPriority.push(taskDate);
      }
    });

    return modifiers;
  };

  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={getDateModifiers()}
                modifiersStyles={{
                  hasTasks: { backgroundColor: '#e3f2fd', fontWeight: 'bold' },
                  overdue: { backgroundColor: '#ffebee', color: '#d32f2f' },
                  highPriority: { backgroundColor: '#fff3e0', color: '#f57c00' },
                }}
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">No tasks</div>
                  <div className="text-sm">
                    No tasks scheduled for this date
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => onEditTask(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityBadgeColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            {task.project && (
                              <span 
                                className="text-xs px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: task.project.color }}
                              >
                                {task.project.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}