# Mysql 服务

请在根模块导入

```typescript
import { Module } from '@nestjs/common';
import { MysqlModule } from '@app/mysql';

@Module({
  imports: [MysqlModule],
})
export class AppModule {}
```
