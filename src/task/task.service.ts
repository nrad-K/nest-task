import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * Retrieves all tasks for a given user id.
   *
   * @param userId The user id to get tasks for.
   * @returns An array of tasks for the given user id.
   */
  async getTask(userId: number): Promise<Task[]> {
    return await this.prismaService.task.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * Creates a new task for a given user.
   *
   * @param createTaskInput The input data for the task to create.
   * @returns The created task.
   */
  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    const { name, dueDate, description, userId } = createTaskInput;

    return await this.prismaService.task.create({
      data: {
        name,
        dueDate,
        description,
        userId,
      },
    });
  }

  /**
   * Updates a task with the given id.
   *
   * @param updateTaskInput The input data for the task to update.
   * @returns The updated task.
   */
  async updateTask(updateTaskInput: UpdateTaskInput): Promise<Task> {
    const { id, name, dueDate, description, status } = updateTaskInput;
    return await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        name,
        dueDate,
        description,
        status,
      },
    });
  }

  /**
   * Deletes a task with the given id.
   *
   * @param id The id of the task to delete.
   * @returns The deleted task.
   */
  async deleteTask(id: number): Promise<Task> {
    return await this.prismaService.task.delete({
      where: {
        id,
      },
    });
  }
}
