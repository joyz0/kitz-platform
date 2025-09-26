'use client';

import * as request from '@/lib/request';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Tag } from 'antd';
import { useRef } from 'react';
import { ProTableUtils } from '@repo/utils/client';

type LinkItem = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

const columns: ProColumns<LinkItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tooltip: '标题过长会自动收缩',
    hideInForm: true,
  },
  {
    title: 'URL',
    dataIndex: 'url',
    copyable: true,
    ellipsis: true,
    render: (text: any) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
    hideInForm: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    ellipsis: true,
    hideInSearch: true,
    hideInForm: true,
    render: (text: any) => {
      if (!text) {
        return <Tag color="gray">无描述</Tag>;
      }
      return text;
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
    render: (_, record: LinkItem, __, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a key="view" onClick={() => window.open(record.url, '_blank')}>
        访问
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制链接' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>(null);
  return (
    <ProTable<LinkItem>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={ProTableUtils.createRequestFunction(
        (params) => {
          return request.get<any>(
            `${process.env.NEXT_PUBLIC_API_URL}/links`,
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
        persistenceKey: 'pro-table-links-demos',
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
      headerTitle="链接管理"
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