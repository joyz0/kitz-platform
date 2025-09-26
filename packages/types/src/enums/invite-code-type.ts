import { z } from 'zod';

export const InviteCodeTypeEnum = z.enum(['REGISTER']);

export type InviteCodeType = z.infer<typeof InviteCodeTypeEnum>;

// 用于前端显示的标签映射
export const InviteCodeTypeLabels: Record<InviteCodeType, string> = {
  REGISTER: '注册码'
};

// 获取选项列表的辅助函数
export const getInviteCodeTypeOptions = () => {
  return InviteCodeTypeEnum.options.map(value => ({
    value,
    label: InviteCodeTypeLabels[value]
  }));
};