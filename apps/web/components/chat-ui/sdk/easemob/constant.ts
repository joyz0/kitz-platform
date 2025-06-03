export const CHAT_TYPE = {
  SINGLE: 'singleChat',
  GROUP: 'groupChat',
};

export const MAX_MESSAGE_LIST_COUNT = 100;

export const CHANGE_MESSAGE_BODAY_TYPE = {
  RECALL: 0,
  DELETE: 1,
  MODIFY: 2,
};

/**
 * 由于联系人事件监听回调操作类型只有以上三种类型，但是在UI上需要区分更多的类型，
 * 因此基于SDK事件类型自行区分不同回调类型 */
export const CONTACT_OPERATION_CUSTOM_TYPE = {
  CONTACT_INVITED: 'contact_invited', // 收到好友邀请
  CONTACT_ADDED: 'contact_added', // 新增联系人
  CONTACT_DELETED: 'contact_deleted', // 删除联系人
  CONTACT_REFUSE: 'contact_refuse', // 好友请求被拒绝
  CONTACT_AGREED: 'contact_agreed', // 好友请求被同意
};

export const ERRORS: Record<number, any> = {
  /* 登陆相关
   */
  0: {
    none: '未知错误！',
  },
  1: {
    'invalid password': '密码错误！',
    'login failed': '登陆失败！',
    'user not found': '该用户不存在！',
  },
  17: {
    duplicate_unique_property_exists: 'id已存在！',
    resource_limited: '注册已达上限请开通企业版！',
    unauthorized: '未开放授权注册！',
    resource_not_found: '账号不存在！',
  },
  28: {
    'appkey or token error': '未登录！',
  },
  101: {
    'file exceeding maximum limit': '文件大小超出限制（默认10M）！',
    none: '文件相关未知错误！',
  },
  217: {
    'the user was kicked by other device': '其他端踢出了该账号！',
  },
  /* 群聊相关 */
  602: {
    'not in group or chatroom': '你已不在该群聊中！',
  },
  605: {
    'The chat room dose not exist.': '此群不存在！',
  },
  /* 消息相关 */
  221: {
    'not contact': '非好友关系,不可发送消息！',
  },
  400: {
    'UserId password error.': '用户密码错误！',
    'Please wait a moment while trying to send.':
      '验证码在有效期内，请勿重复发送！',
    'Image verification code error.':
      '图片验证码错误，请更换验证码或重新输入！',
    'Image code id cannot be empty.': '请填入图片验证码！',
    'Phone number cannot be empty.': '获取图片验证码请填入手机号！',
    'UserId hfp already exists.': '用户已注册！',
    'phone number illegal': '手机号不合法！',
    'Please send SMS to get mobile phone verification code.':
      '请发送短信获取手机验证码！',
    'SMS verification code error.': '验证码错误！',
  },
  603: {
    blocked: '对方已将您加入黑名单！',
    blacklist: '已在该群黑名单当中！无法加入该群。',
    already: '已加入该群！',
  },
  504: {
    'exceed recall time limit': '消息超过可撤回时间！',
  },
  507: {
    muted: '已被禁言！',
  },
  508: {
    moderation: '内容审核不通过！请检查发送内容。',
  },
  // e.type === '603' 被拉黑
  // e.type === '605' 群聊不存在
  // e.type === '602' 不在群聊或聊天室中
  // e.type === '504' 撤回消息时超出撤回时间
  // e.type === '505' 未开通消息撤回
  // e.type === '506' 没有在群聊或聊天室白名单
  // e.type === '501' 消息包含敏感词
  // e.type === '502' 被设置的自定义拦截捕获
  // e.type === '503' 未知错误
};
