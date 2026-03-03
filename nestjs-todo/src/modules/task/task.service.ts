import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  private nextId = 1;
  private tasks: Array<{
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    completedAt: string | null;
    userId?: number;
  }> = [
    {
      id: 1,
      name: 'Sample task',
      description: 'Edit or toggle this task',
      createdAt: new Date().toISOString(),
      completedAt: null,
      userId: 1,
    },
  ];

  constructor() {
    this.nextId = this.tasks.length + 1;
  }

  getTasks() {
    return this.tasks;
  }

  getTask(id: string) {
    const taskId = Number(id);
    return this.tasks.find((task) => task.id === taskId);
  }
  createTask(body: any) {
    const task = {
      id: this.nextId++,
      name: body?.name ?? 'Untitled task',
      description: body?.description ?? null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      userId: body?.userId ?? 1,
    };
    this.tasks.push(task);
    return task;
  }
  updateTask(id: string, body: any) {
    const taskId = Number(id);
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) {
      return null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'name')) {
      task.name = body.name ?? task.name;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
      task.description = body.description ?? task.description;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'completedAt')) {
      task.completedAt = body.completedAt;
    }
    return task;
  }
  deleteTask(id: string) {
    const taskId = Number(id);
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return { message: before === this.tasks.length ? 'not_found' : 'success' };
  }
}
