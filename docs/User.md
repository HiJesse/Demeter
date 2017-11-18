用户模块
---

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
	
	用户列表可以分页展示所有的用户信息, 并提供管理用户的功能.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_user_list.png)
	
	分页列表提供根据账号模糊搜索, 修改用户昵称, 重置用户密码和删除用户功能.
	
	1. 模糊搜索
	
		![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_list_search.png)
	
	2. 修改用户昵称

		![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_list_modify_nickname.png)
		
	3. 重置用户密码

		![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_list_reset_password.png)
		
	4. 删除用户

		![](http://od9tun44g.bkt.clouddn.com/demeter/user_manager_list_delete_user.png)
	