归档模块
---

根据项目和对应的平台提供归档管理, 可以归档文件(也可以作为内部测试包分发). 提供按条件分页查询归档列表, 文档上传(Web端上传/脚本上传)和文档下载功能. 

| 功能 | 说明 |
| --- | :---: |
| 新建归档 | 提供两种方式新建归档: Web/脚本 |
| 归档列表 | 按项目\|平台\|文档说明分页查找归档列表 |
| 删除归档 | 删除归档需要管理员权限 |
| 下载归档 | 提供Web直接下载和扫描二维码下载 |

1. 新建归档

	* 脚本归档

		脚本位置在`/cli/external/UploadArchive.js`, 在脚本同级目录下运行`npm install`安装脚本所需依赖. 脚本运行需要四个参数, 如下表所示.

		| 参数 | 说明 | 示例 |
		| --- | :---: | --- |
		| --host | 域名 | http://192.168.0.101:9000 |
		| --key | AppID, 在项目信息处获得 | 556b675ae3d4eac71351aa62d2878048|
		| --archive | 要归档的文件 | ../../README.md |
		| --archiveDes | 文档描述 | v3.9.5 alpha |

		使用效果如下图所示.

		![](http://od9tun44g.bkt.clouddn.com/demeter/archive_cli_example.png)

	* Web归档	

		在归档管理tab选择新建归档可以直接上传文档. 只支持单一文件上传, 选择要上传的项目和平台后填写文档说明即可上传.

		![](http://od9tun44g.bkt.clouddn.com/demeter/archive_web_upload.png)
	
	
2. 归档列表

	用户可以根据项目|平台|文档说明模糊分页查询归档列表, 如果想要看到其他项目的归档需要管理员将该用户加入到对应的项目中. 只有管理员可以删除文档.

	![](http://od9tun44g.bkt.clouddn.com/demeter/archive_list.png)
	
3. 下载归档

	点击归档列表中某一个归档的下载后, 会展示出下载方式. 可以直接点击下载地址进行下载, 为了方便测试下载app测试包也提供了扫描下载的方式.

	![](http://od9tun44g.bkt.clouddn.com/demeter/archive_download.png)