项目模块
---

提供项目管理功能. 新建一个项目时会生成Android 和IOS两个平台对应的子项目, 同时生成两个唯一的App ID作为该项目对应平台的唯一标识, 可以在不同的场景使用, 例如移动端原生接入或者作为脚本参数等. 之后的业务模块都以项目为单位展开. 该模块提供以下管理功能.

| 功能 | 需要权限 |
| --- | :---: |
| 退出项目 | × |
| 查看项目信息 | × |
| 修改项目基本信息 | × |
| 新建项目 | √ |
| 删除项目 | √ |
| 添加项目成员 | √ |
| 删除项目成员 | √ |

* 创建项目

	管理员可以创建一个新项目, 输入项目名称, 项目简介并上传项目Logo.

	![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_create_project.png)
	
* 项目列表 (管理员)

	所有建立成功的项目都会在项目列表中展示. 列表分页展示所有的项目信息, 并提供根据项目名称模糊查询; 平台ID查询; 项目信息显示; 项目信息更新; 成员管理以及项目删除的功能.

	![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_project_list.png)
	
	1. 模糊搜索

		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_list_search.png)
		
	2. AppID查询

		选中某个项目的特定平台Logo上时会展示该项目所选平台的AppID. AppID为项目+平台的唯一标识. 

		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_list_platform_id.png)
		
	3. 更新项目信息

		提供修改项目Logo和项目简介的入口.
		
		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_list_update_info.png)
		
	4. 成员管理

		将用户模块和项目模块结合起来, 用户和项目呈多对多的关系. 在项目管理模块中提供项目成员的添加和删除.
		
		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_add_member.png)
		
		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_delete_member.png)
		
	5. 删除项目

		管理员有权限将已有的项目删除, 在删除之前会将所有的用户先移除该项目.
		
		![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_delete_project.png)

* 项目列表 (普通用户)

	普通用户可以查询到自己所加入的项目列表. 在项目信息展示方面跟管理员所查询到的项目列表保持一直. 但是在功能上普通用户只保留了退出项目的选项.
	
	![](http://od9tun44g.bkt.clouddn.com/demeter/project_manager_joined_project.png)
