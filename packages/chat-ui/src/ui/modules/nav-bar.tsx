import { observer } from 'mobx-react-lite';
import { icons } from '../components/icons';
import { useRouter } from '../../store/root-store';
import { NavEnum } from '../../store/router-store';

const navs = [
  {
    label: '会话',
    code: NavEnum.CONVERSATION,
    icon: 'ri--wechat-2-fill',
  },
  {
    label: '联系人',
    code: NavEnum.CONTACT,
    icon: 'ri--contacts-book-2-fill',
  },
  {
    label: '群聊',
    code: 'group',
    icon: 'ri--wechat-fill',
  },
];

const NavBar: React.FC = observer(() => {
  const router = useRouter();

  return (
    <div className="w-[50px]">
      <ul>
        {navs.map((o) => {
          return (
            <li key={o.code} title={o.label}>
              {icons[o.icon]}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default NavBar;
