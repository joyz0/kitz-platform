'use client';

import * as request from '@/lib/request';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import { useRef } from 'react';
import { InviteCodeTypeEnum } from '@repo/types';
import { ProTableUtils } from '@repo/utils/client';

type InviteCodeItem = {
  id: string;
  code: string;
  type: string;
  expiresAt: string | null;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

const columns: ProColumns<InviteCodeItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '邀请码',
    dataIndex: 'code',
    copyable: true,
    ellipsis: true,
    tooltip: '标题过长会自动收缩',
    hideInForm: true,
  },
  {
    title: '类型',
    dataIndex: 'type',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: InviteCodeTypeEnum.options.reduce(
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
    title: '过期时间',
    key: 'expires_at',
    dataIndex: 'expiresAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '过期时间',
    dataIndex: 'expiresAt',
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
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '使用时间',
    dataIndex: 'usedAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
    hideInForm: true,
  },
  {
    title: '使用者',
    dataIndex: 'user',
    ellipsis: true,
    hideInSearch: true,
    hideInForm: true,
    render: (text: any, record: InviteCodeItem) => {
      if (!text) {
        return null;
      }
      return text.name || text.email;
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (_, record: InviteCodeItem, __, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a key="view" onClick={() => console.log('查看', record.code)}>
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
    <ProTable<InviteCodeItem>
      rowKey="code"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={ProTableUtils.createRequestFunction(
        (params) => {
          return request.get<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/inviteCodes`,
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
        persistenceKey: 'pro-table-singe-demos',
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
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
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
      headerTitle="邀请码管理"
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
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '2',
              },
              {
                label: '3rd item',
                key: '3',
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
