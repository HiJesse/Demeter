项目部署
---

1. `nodejs`版本为`7.2.1`
2. 根据`/config/Config.js`中的MySQL配置, 创建相应的数据库名称, 地址, 账号和密码.
3. clone仓库, 在项目跟目录下执行`npm install`
4. 安装配置pm2 `npm install pm2 -g`
5. 项目根目录下 `npm run deploy`部署项目
6. 浏览器打开[http://localhost:3000/](http://localhost:3000/)站点进入demeter登录页
7. 根目录下 `npm run undeploy`卸载项目.