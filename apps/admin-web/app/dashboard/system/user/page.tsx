'use client';

import * as request from '@/lib/request';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import { useRef } from 'react';
import { UserRoleEnum } from '@repo/types';
import { ProTableUtils } from '@repo/utils/client';

type UserItem = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

const columns: ProColumns<UserItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    hideInForm: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    copyable: true,
    ellipsis: true,
    hideInForm: true,
  },
  {
    title: '角色',
    dataIndex: 'role',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: UserRoleEnum.options.reduce(
      (result: any, item: string) => {
        result[item] = {
          text: item,
        };
        return result;
      },
      {},
    ),
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '头像',
    dataIndex: 'image',
    valueType: 'image',
    hideInSearch: true,
    hideInForm: true,
    width: 80,
  },
  {
    title: '邮箱验证时间',
    dataIndex: 'emailVerified',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'dateRange',
    hideInTable: true,
    hideInForm: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_, record: UserItem, __, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a key="view" onClick={() => console.log('查看', record.email)}>
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>(null);
  return (
    <ProTable<UserItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={ProTableUtils.createRequestFunction(
        (params) => {
          return request.get<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/users`,
            params,
          );
        },
        {
          defaultPageSize: 10,
          defaultSortBy: 'createdAt',
          defaultSortOrder: 'descend',
        },
      )}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-user-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        onChange: (page, pageSize) => console.log('分页变化:', page, pageSize),
      }}
      dateFormatter="string"
      headerTitle="用户管理"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '导出',
                key: '1',
              },
              {
                label: '批量删除',
                key: '2',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};
