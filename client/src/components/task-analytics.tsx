import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import type { TaskWithProject } from "@shared/schema";
import { format, isToday, isThisWeek, isPast } from "date-fns";

interface TaskAnalyticsProps {
  tasks: TaskWithProject[];
}

export default function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overdueTasks = tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate)) && !t.completed).length;
  const todayTasks = tasks.filter(t => t.dueDate && isToday(new Date(t.dueDate))).length;
  const weekTasks = tasks.filter(t => t.dueDate && isThisWeek(new Date(t.dueDate))).length;

  // Priority distribution
  const priorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "high").length, color: "#ef4444" },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length, color: "#f59e0b" },
    { name: "Low", value: tasks.filter(t => t.priority === "low").length, color: "#10b981" },
  ];

  // Project distribution
  const projectData = tasks.reduce((acc, task) => {
    const projectName = task.project?.name || "No Project";
    const existing = acc.find(p => p.name === projectName);
    if (existing) {
      existing.total++;
      if (task.completed) existing.completed++;
    } else {
      acc.push({
        name: projectName,
        total: 1,
        completed: task.completed ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ name: string; total: number; completed: number }>);

  // Weekly completion trend (mock data for demo)
  const weeklyData = [
    { week: "Week 1", completed: 12, created: 15 },
    { week: "Week 2", completed: 18, created: 20 },
    { week: "Week 3", completed: 15, created: 18 },
    { week: "Week 4", completed: 22, created: 25 },
  ];

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statsCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Due Today",
      value: todayTasks,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "This Week",
      value: weekTasks,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="px-6 pb-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{completedTasks} of {totalTasks} tasks</span>
            </div>
            <Progress value={completionRate} className="w-full h-3" />
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</span>
              <p className="text-sm text-gray-600">Tasks Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectData.map((project, index) => {
                const progress = project.total > 0 ? (project.completed / project.total) * 100 : 0;
                return (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{project.name}</span>
                      <Badge variant="outline">
                        {project.completed}/{project.total}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Completion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="created" fill="#3b82f6" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}