Demeter
---

Demeter是一个CMS系统, 提供用户体系以及App项目相关内容管理. 其中会包括用户模块, 项目模块和归档模块等. 该系统会长期迭代和维护.

| 技术栈 | 描述 |
| --- | ---------- |
| ES6 | 项目代码以ES2015为标准 |
| Rxjs | 构建流式应用 |
| MongoDB | 使用MongoDB作为数据持久化容器 |
| Express | 基于nodejs的Web后端开发框架 |
| JWT | 使用JWT实现前后端分离 |
| React | 构建前端框架 |
| react-router | 控制前端路由 |
| Redux | 管理React的状态流 |
| Redux-observable | 处理异步redux action |
| Webpack | 打包React代码, 并提供dev-server |
| AntD | 使用AntD提供的UI组件 |

### 项目部署和启动

1. 安装并建立一个名为demeter的mongo数据库
2. clone仓库在项目跟目录下执行`npm install`
3. 安装配置pm2 `npm install pm2 -g`
4. 项目根目录下 `npm run deploy`部署项目
5. 浏览器打开[http://localhost:3000/](http://localhost:3000/)站点进入demeter登录页
6. 根目录下 `npm run undeploy`卸载项目.

### 用户模块

提供用户体系. 用户分为管理员和普通用户两个权限, 管理员可以对所有用户信息进行管理. 

| 功能 | 需要登陆 | 需要权限 |
| --- | :---: | :---: |
| 登录 | × | × |
| 修改密码 | × | × |
| 修改昵称 | √ | × |
| 登录后修改密码 | √ | × |
| 创建用户 | √ | √ |
| 重置密码 | √ | √ |
| 删除用户 | √ | √ |
| 模糊查找用户 | √ | √ |
| 查看用户列表 | √ | √ |

* 登录

	提供登录操作, 键入账号密码登录Demeter. 提供输入校验.

	![](http://od9tun44g.bkt.clouddn.com/demeter/login.png)
	
* 修改密码 (未登录)

	在登录页点击修改密码跳转到该页面. 用户如果知道自己的账号密码就可以通过该页面修改密码. 如果忘记密码了则需要联系管理员重置账号密码.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/modify_password.png)
	
* 首页

	登录成功之后进入系统首页, 首页默认展示仪表盘页面. 该页面展示当前系统注册用户数和已经创建的项目数. 页面左侧为模块菜单, 顶部显示用户名, 用户权限以及推出登录按钮. 用户管理模块和项目管理模块只有管理员可以看到并操作.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/dashboard.png)
	
* 个人中心

	个人中心模块提供基本用户信息修改和修改密码功能. 修改基本信息页可以修改用户昵称.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/user_center_modify_general_info.png)
	
	修改密码页面可以对已有密码进行修改.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/user_center_modify_password_login.png)
	
* 用户管理(管理员)

	用户管理模块需要管理员权限才能访问. 提供新建用户, 重置用户密码和用户列表展示. 新建用户时只能输入账号, 用户昵称默认为匿名, 用户权限默认为普通用户
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_create_user.png)
	
	管理员可以根据用户提供的账号重置该用户的密码. 默认密码为`a123456`.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_reset_password.png)
	
	用户列表可以分页展示所有的用户信息, 并提供修改用户行为的路径.

### 项目模块

提供项目管理功能. 新建一个项目时会生成Android 和IOS两个平台对应的子项目, 同时生成两个唯一的App ID作为该项目对应平台的唯一标识, 可以在不同的场景使用, 例如移动端原生接入或者作为脚本参数等. 之后的业务模块都以项目为单位展开.

待开发

| 功能 | 需要权限 |
| --- | :---: |
| 退出项目 | × |
| 查看项目信息 | × |
| 修改项目基本信息 | × |
| 新建项目 | √ |
| 删除项目 | √ |
| 添加项目成员 | √ |
| 删除项目成员 | √ |

### 应用归档模块

待开发

