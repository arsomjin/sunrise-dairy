import { Avatar, List } from 'antd';

export const notif_data = [
  {
    title: 'Notification Title 1',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team',
  },
  {
    title: 'Notification Title 2',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team',
  },
  {
    title: 'Notification Title 3',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team',
  },
  {
    title: 'Notification Title 4',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team',
  },
];

export const getNotificationContent = (data) => (
  <div style={{ width: 512, maxHeight: 720 }} className="overflow-y-auto">
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item actions={[<a key="list-loadmore-more">more</a>]}>
          <List.Item.Meta
            avatar={<Avatar src="https://i.pravatar.cc/100" />}
            title={<a href="https://ant.design">{item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </div>
);
