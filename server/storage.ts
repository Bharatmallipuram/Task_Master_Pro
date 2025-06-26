import { 
  tasks, 
  projects, 
  type Task, 
  type Project, 
  type InsertTask, 
  type InsertProject, 
  type UpdateTask,
  type TaskWithProject 
} from "@shared/schema";

export interface IStorage {
  // Tasks
  getTasks(): Promise<TaskWithProject[]>;
  getTask(id: number): Promise<TaskWithProject | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  reorderTasks(taskIds: number[]): Promise<void>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private projects: Map<number, Project>;
  private currentTaskId: number;
  private currentProjectId: number;

  constructor() {
    this.tasks = new Map();
    this.projects = new Map();
    this.currentTaskId = 1;
    this.currentProjectId = 1;
    
    // Initialize with some default projects
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultProjects = [
      { name: "Website Redesign", color: "#3B82F6" },
      { name: "Mobile App", color: "#10B981" },
      { name: "Marketing Campaign", color: "#8B5CF6" },
    ];

    defaultProjects.forEach(project => {
      const id = this.currentProjectId++;
      const newProject: Project = { ...project, id };
      this.projects.set(id, newProject);
    });
  }

  async getTasks(): Promise<TaskWithProject[]> {
    const tasksArray = Array.from(this.tasks.values());
    
    return tasksArray
      .map(task => ({
        ...task,
        project: task.projectId ? this.projects.get(task.projectId) : undefined
      }))
      .sort((a, b) => a.order - b.order);
  }

  async getTask(id: number): Promise<TaskWithProject | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    return {
      ...task,
      project: task.projectId ? this.projects.get(task.projectId) : undefined
    };
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const maxOrder = Math.max(0, ...Array.from(this.tasks.values()).map(t => t.order));
    
    const task: Task = { 
      id,
      title: insertTask.title,
      description: insertTask.description ?? null,
      priority: insertTask.priority ?? "medium",
      status: insertTask.status ?? "active",
      projectId: insertTask.projectId ?? null,
      dueDate: insertTask.dueDate ?? null,
      completed: insertTask.completed ?? false,
      order: insertTask.order ?? maxOrder + 1,
      createdAt: new Date(),
    };
    
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask: Task = { ...existingTask, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async reorderTasks(taskIds: number[]): Promise<void> {
    taskIds.forEach((taskId, index) => {
      const task = this.tasks.get(taskId);
      if (task) {
        this.tasks.set(taskId, { ...task, order: index });
      }
    });
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      id,
      name: insertProject.name,
      color: insertProject.color || "#3B82F6"
    };
    this.projects.set(id, project);
    return project;
  }
}

export const storage = new MemStorage();
