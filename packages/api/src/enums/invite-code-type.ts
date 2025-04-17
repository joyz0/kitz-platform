import { type EnumClass, createEnum } from './enum-factory';

export const InviteCodeTypeEnum = createEnum({
  values: ['REGISTER'] as const,
  labels: {
    REGISTER: '注册码'
  }
});

export type InviteCodeTypeEnum = typeof InviteCodeTypeEnum extends EnumClass<infer T> ? T : never;
