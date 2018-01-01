项目部署
---

1. `nodejs`版本为`7.2.1`.
2. 根据`/config/Config.js`中的MySQL配置, 创建相应的数据库名称, 地址, 账号和密码.
3. clone仓库, 在项目跟目录下执行`npm install`.
4. 在项目根目录下执行`npm run packBundle`生成bundle.
5. 安装配置pm2 `npm install pm2 -g`.
6. 项目根目录下 `npm run deploy`部署项目.
7. 浏览器打开`/config/Config.js`中配置的地址, 进入demeter登录页.
8. 使用初始管理员账号密码`admin/a123456`登录.
9. 根目录下 `npm run undeploy`卸载项目.