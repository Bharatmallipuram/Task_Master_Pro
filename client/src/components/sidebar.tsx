import { cn } from "@/lib/utils";
import type { TaskWithProject } from "@shared/schema";
import { 
  LayoutDashboard, 
  Clock, 
  Star, 
  CheckCircle,
  ClipboardList
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  tasks: TaskWithProject[];
}

export default function Sidebar({ activeView, onViewChange, tasks }: SidebarProps) {
  const allCount = tasks.length;
  const todayCount = tasks.filter(task => 
    task.dueDate === new Date().toISOString().split('T')[0]
  ).length;
  const importantCount = tasks.filter(task => task.priority === "high").length;
  const completedCount = tasks.filter(task => task.completed).length;

  const menuItems = [
    {
      id: "all",
      label: "All Tasks",
      icon: LayoutDashboard,
      count: allCount,
    },
    {
      id: "today",
      label: "Today",
      icon: Clock,
      count: todayCount,
    },
    {
      id: "important",
      label: "Important",
      icon: Star,
      count: importantCount,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle,
      count: completedCount,
    },
  ];

  const projects = [
    { id: "1", name: "Website Redesign", color: "#3B82F6" },
    { id: "2", name: "Mobile App", color: "#10B981" },
    { id: "3", name: "Marketing Campaign", color: "#8B5CF6" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {item.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Projects
          </h3>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors w-full text-left">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
