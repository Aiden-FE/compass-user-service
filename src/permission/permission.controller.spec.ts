import { Test, TestingModule } from '@nestjs/testing';
import { MysqlModule } from '@app/mysql';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

describe('PermissionController', () => {
  let controller: PermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MysqlModule],
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile();

    controller = module.get<PermissionController>(PermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
