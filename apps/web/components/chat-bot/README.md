使用 React 写一个 ChatBot 组件：

1. 默认是一个悬浮 box，固定在页面右下角，点击后打开聊天窗，类似微信聊天一样，历史消息包含头像，昵称，日期，消息内容。我发的消息头像居右，机器人发的消息头像居左。消息时间不应该放在消息体内，而应该独立居中占一行，且时间间隔过近的消息体无需重复显示时间（通常间隔 5 分钟）；
2. 发送消息后请求/api/chat 接口（模拟 5 秒后返回），此时聊天机器人自动回复一条临时消息“正在思考中”，需要通过样式凸显这条临时信息，当接口返回结果后替换这条临时消息；
3. 使用 tailwindcss，整体交互和样式酷炫一点，增加一些过渡动画让操作更丝滑；
4. 将聊天信息存储到浏览器的 IndexedDB 中，页面刷新后依然能获取之前的聊天记录，且如果消息历史超过 10 条则通过加载更多按钮分页加载出来；
5. 当点击加载更多按钮时避免报错 Uncaught (in promise) DOMException: Failed to execute 'continue' on 'IDBCursor': The cursor is being iterated or has iterated past its end；
6. 发送消息后要让发送按钮处于 loading 状态，直到/api/chat 接口返回；
7. 输入框改成支持多行输入；
8. 每次打开聊天框自动滚动到最新消息，但是点击加载更多按钮时保持原位。
