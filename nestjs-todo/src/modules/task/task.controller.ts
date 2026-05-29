import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  getTasks() {
    return this.taskService.getTasks();
  }

  @Get('/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }
  @Post('/')
  createTask(@Body() body: any) {
    return this.taskService.createTask(body);
  }
  @Patch('/:id/done')
  markTaskAsDone(@Param('id') id: string) {
    return this.taskService.updateTask(id, {
      completedAt: new Date().toISOString(),
    });
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Param('id') id: string) {
    return this.taskService.updateTask(id, { completedAt: null });
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
