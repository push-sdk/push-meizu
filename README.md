# push-meizu

> 魅族推送Node服务

根据魅族提供的推送服务实现的 Node 版SDK。支持魅族通知栏推送功能，欢迎大家使用。

[华为推送](https://www.npmjs.com/package/push-huawei)

[小米推送](https://www.npmjs.com/package/push-xiaomi)

## 安装
```
npm install push-meizu --save-dev
```

## 实例
```javascript
const Meizu = require('push-meizu');
const meizu = new Meizu({
  appId: 'appId',
  appSecret: 'appSecret'
});

meizu.push({
  title: '标题',
  content: '内容',
  list: ['pushId'], 
	messageJson: {}, // 具体如下
	sleep: 0, // 请求间隔时间/毫秒
  success(res){}, // 成功回调
	error(err){}, // 失败回调
	finish(){} // 所有请求完成回调
});
```

## 参数(messageJson)
```js
const messageJson = {
	noticeBarInfo: {
		noticeBarType: 0, // 通知栏样式(0, "标准"),(2, "安卓原生")【int 非必填，值为0】
		title: '', // 推送标题, 【string 必填，字数限制1~32字符】,
		content: 推送内容, 【string 必填，字数限制1~100字符】
	},
	noticeExpandInfo: {
		noticeExpandType: 0, // 展开方式 (0, "标准"),(1, "文本")【int 非必填，值为0、1】
		noticeExpandContent: '', // 展开内容, 【string noticeExpandType为文本时，必填】
	},
	clickTypeInfo: {
		clickType: 0, // 点击动作 (0,"打开应用"),(1,"打开应用页面"),(2,"打开URI页面"),(3, "应用客户端自定义")【int 非必填,默认为0】
		url: '', // URI页面地址, 【string clickType为打开URI页面时，必填】
		parameters: '', // 参数 【JSON格式】【非必填】,
		activity: '', // 应用页面地址 【string clickType为打开应用页面时，格式 pkg.activity eg: com.meizu.upspushdemo.TestActivity 必填】
		customAttribute: '', // 应用客户端自定义【string clickType为应用客户端自定义时，必填， 输入长度为1000字节以内】
	},
	pushTimeInfo: {
		offLine: 1, // 是否进离线消息(0 否 1 是[validTime]) 【int 非必填，默认值为1】
		validTime: 24 // 有效时长 (1到72 小时内的正整数) 【int offLine值为1时，必填，默认24
	},
	advanceInfo: {
		suspend: 1, // 是否通知栏悬浮窗显示 (1 显示 0 不显示) 【int 非必填，默认1】
		clearNoticeBar: 1, // 是否可清除通知栏 (1 可以 0 不可以) 【int 非必填，默认1】
		fixDisplay: 0, // 是否定时展示 (1 是 0 否) 【int 非必填，默认0】
		fixStartDisplayTime: '', // 定时展示开始时间(yyyy-MM-dd HH:mm:ss) 【str 非必填】
		fixEndDisplayTime: '', // 定时展示结束时间(yyyy-MM-dd HH:mm:ss) 【str 非必填】
		notificationType: {
			vibrate: 1, // 震动 (0关闭 1 开启) , 【int 非必填，默认1】
			lights: 1, // 闪光 (0关闭 1 开启), 【int 非必填，默认1】
			sound: 1, // 声音 (0关闭 1 开启), 【int 非必填，默认1】	
		},
		notifyKey: '' // 非必填 默认空 分组合并推送的key,凡是带有此key的通知栏消息只会显示最后到达的一条。由数字([0-9]), 大小写字母([a-zA-Z]), 下划线(_)和中划线(-)组成,长度不大于8个字符
	},
	extra: {
		callback: 'http://flyme.callback', // String(必填字段), 第三方接收回执的Http接口, 最大长度128字节
		'callback.param': 'param', // String(可选字段), 第三方自定义回执参数, 最大长度64字节
		'callback.type': 3 // int(可选字段), 回执类型(1-送达回执, 与点击回执), 默认3
	}

};
```


[魅族官方文档](http://open.res.flyme.cn/fileserver/upload/file/201803/be1f71eac562497f92b42c750196a062.pdf)