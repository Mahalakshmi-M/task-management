import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = Object.values(TaskStatus) as string[]
 
    transform(value: string) {
      if (this.allowedStatuses.indexOf(value.toUpperCase()) < 0) {
        throw new BadRequestException(
          `Status must be in: [${this.allowedStatuses.join(', ')}]`,
        )
      }
   
      return value
    }
}