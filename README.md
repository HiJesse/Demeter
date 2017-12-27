Demeter
---

Demeter是一个CMS系统, 提供用户体系以及App项目相关内容管理. 其中会包括用户模块, 项目模块和归档模块等. 该系统会长期迭代和维护.

| 技术栈 | 描述 |
| --- | ---------- |
| ES6 | 项目代码以ES2015为标准 |
| Rxjs | 构建流式应用 |
| MySQL | 使用MySQL作为数据持久化容器 |
| Express | 基于nodejs的Web后端开发框架 |
| JWT | 使用JWT实现前后端分离 |
| React | 构建前端框架 |
| react-router | 控制前端路由 |
| Redux | 管理React的状态流 |
| Redux-observable | 处理异步redux action |
| Webpack | 打包React代码, 并提供dev-server |
| AntD | 使用AntD提供的UI组件 |
| log4js | 管理并记录日志 |

### 项目部署和启动

1. `nodejs`版本为`7.2.1`
2. 根据`/config/Config.js`中的MySQL配置, 创建相应的数据库名称, 地址, 账号和密码.
3. clone仓库, 在项目跟目录下执行`npm install`
4. 安装配置pm2 `npm install pm2 -g`
5. 项目根目录下 `npm run deploy`部署项目
6. 浏览器打开[http://localhost:3000/](http://localhost:3000/)站点进入demeter登录页
7. 根目录下 `npm run undeploy`卸载项目.

### WIKI

1. [用户模块](https://github.com/HiJesse/Demeter/wiki/用户模块)
2. [项目模块](https://github.com/HiJesse/Demeter/wiki/项目模块)

### 相关文档

* [在redux-observable中替换fetch请求网络数据](http://blog.csdn.net/l2show/article/details/77444082)

