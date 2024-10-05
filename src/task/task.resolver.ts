import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { TaskModel } from './task.model';
import { Task } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from './task.dto';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Retrieves all tasks associated with the given user ID.
   *
   * @param userId The ID of the user whose tasks to retrieve.
   *
   * @returns The retrieved tasks.
   *
   * @throws {HttpException} If the user was not found.
   * @throws {HttpException} If the tasks could not be retrieved.
   */
  @Query(() => [TaskModel], { nullable: 'items' })
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Task[]> {
    try {
      const tasks = await this.taskService.getTask(userId);

      if (!tasks) {
        throw new HttpException('Tasks not found', HttpStatus.NOT_FOUND);
      }

      return tasks;
    } catch {
      throw new HttpException(
        'Failed to get tasks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Creates a new task given a valid CreateTaskInput.
   *
   * @param createTaskInput The input data for the task to create.
   *
   * @returns The created task.
   *
   * @throws {HttpException} If the task could not be created.
   */

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    try {
      return this.taskService.createTask(createTaskInput);
    } catch {
      throw new HttpException(
        'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('updateTaskArgs') updateTaskInput: UpdateTaskInput,
  ): Promise<Task> {
    try {
      return await this.taskService.updateTask(updateTaskInput);
    } catch {
      throw new HttpException(
        'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Mutation(() => TaskModel)
  @UseGuards(JwtAuthGuard)
  async deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    try {
      return await this.taskService.deleteTask(id);
    } catch {
      throw new HttpException(
        'Failed to delete task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
