项目部署
---

1. 安装并建立一个名为demeter的mongo数据库
2. clone仓库在项目跟目录下执行`npm install`
3. 安装配置pm2 `npm install pm2 -g`
4. 项目根目录下 `npm run deploy`部署项目
5. 浏览器打开[http://localhost:3000/](http://localhost:3000/)站点进入demeter登录页
6. 根目录下 `npm run undeploy`卸载项目.