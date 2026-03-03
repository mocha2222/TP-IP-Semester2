import {
  Get,
  Param,
  Controller,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('/')
  createUser(@Body() body: createUserDto) {
    return this.userService.create(body);
  }

  @Patch('/:id')
  updateUser(
    @Body() body: { id: number; email: string; password: string },
  ) {
    return this.userService.update(body.id, body);
  }

  @Delete('/users/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
