import { useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import TaskList from "@/components/task-list";
import TaskBoard from "@/components/task-board";
import TaskModal from "@/components/task-modal";
import ProgressBar from "@/components/progress-bar";
import { useTasks } from "@/hooks/use-tasks";

export default function Dashboard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [activeView, setActiveView] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const { data: tasks = [], isLoading } = useTasks();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && task.completed) ||
                         (statusFilter === "active" && !task.completed);
    const matchesProject = projectFilter === "all" || task.projectId?.toString() === projectFilter;
    const matchesView = activeView === "all" ||
                       (activeView === "today" && task.dueDate === new Date().toISOString().split('T')[0]) ||
                       (activeView === "important" && task.priority === "high") ||
                       (activeView === "completed" && task.completed);

    return matchesSearch && matchesPriority && matchesStatus && matchesProject && matchesView;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        tasks={tasks}
      />
      
      <div className="flex-1 ml-64">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTask={handleCreateTask}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <ProgressBar
          completed={completedTasks}
          total={totalTasks}
        />
        
        {viewMode === "list" ? (
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
          />
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
          />
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}
