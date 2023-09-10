# 本地部署基础环境

> 当没有现成的基础服务时,可以使用该部署文件迅速在本地部署基础服务

## 快速上手

复制 `.env.example` 文件内容到当前当前目录下的 `.env` 文件内

按需修改 `.env` 与 `docker-compose.yml` 等文件

当前目录下执行 `docker compose up -d` 启动基础服务

当前目录下执行 `docker compose stop` 停止所有服务

当前目录下执行 `docker compose rm` 删除所有服务
