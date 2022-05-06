import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { stat } from 'fs';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        @Body('status', TaskStatusValidationPipe)
        status: TaskStatus,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    /*@Get()
      getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
          console.log(Object.keys(filterDto).length);
          if(Object.keys(filterDto).length) {
              return this.tasksService.getTaskWithFilter(filterDto);
          }else {
              return this.tasksService.getAllTasks();
          }        
      }
  
      @Get('/:id')
      getTaskById(@Param('id') id: string): Task {
          return this.tasksService.getTaskById(id);        
      }
  
      @Post()
      @UsePipes(ValidationPipe)
      createTask(@Body() createTaskDto: CreateTaskDto): Task {
          return this.tasksService.createTask(createTaskDto);
      }
  
      @Delete('/:id')
      deleteTask(@Param('id') id: string): void {
          return this.tasksService.deleteTask(id);
      }
  
      @Patch('/:id/status')
      updateTaskStatus(@Param('id') id: string, 
      @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {
          return this.tasksService.updateTaskStatus(id, status);
      }*/
}
