// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = name => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Quản lý intro',
    path: '/dashboard/intro',
    icon: getIcon('codicon:note'),
  },
  {
    title: 'Quản lý người dùng',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Quản lý sách',
    path: '/dashboard/books',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Quản lý danh mục',
    path: '/dashboard/category',
    icon: getIcon('ic:outline-category'),
  },
  {
    title: 'Quản lý bộ lọc',
    path: '/dashboard/filter',
    icon: getIcon('codicon:filter'),
  },
  {
    title: 'Quản lý tâm trạng/căn nguyên',
    path: '/dashboard/mood',
    icon: getIcon('eva:smiling-face-outline'),
  },
  {
    title: 'Quản lý tác giả',
    path: '/dashboard/authors',
    icon: getIcon('eva:person-fill'),
  },
  {
    title: 'Quản lý danh ngôn',
    path: '/dashboard/apophthgan',
    icon: getIcon('eva:book-outline'),
  },
  {
    title: 'Quản lý đánh giá',
    path: '/dashboard/rates',
    icon: getIcon('ic:round-rate-review'),
  },
  {
    title: 'Quản lý giao dịch',
    path: '/dashboard/transact',
    icon: getIcon('ant-design:transaction-outlined'),
  },
  {
    title: 'Quản lý vấn đề',
    path: '/dashboard/issue-type',
    icon: getIcon('codicon:rocket'),
  },
  {
    title: 'Quản lý tư vấn',
    path: '/dashboard/advisory',
    icon: getIcon('codicon:feedback'),
  },
  {
    title: 'Hạng thành viên',
    path: '/dashboard/ranking',
    icon: getIcon('icon-park-outline:ranking'),
  },
  {
    title: 'Quản lý chức danh',
    path: '/dashboard/appellation',
    icon: getIcon('codicon:organization'),
  },
  {
    title: 'Quản lý ngân hàng',
    path: '/dashboard/banking',
    icon: getIcon('codicon:credit-card'),
  },
  {
    title: 'Quản lý sự kiện',
    path: '/dashboard/news',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'Tiếp thị liên kết',
    path: '/dashboard/affiliate',
    icon: getIcon('eva:flip-2-outline'),
  },
  {
    title: 'Cài đặt',
    path: '/dashboard/settings',
    icon: getIcon('eva:settings-2-outline'),
  },

  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill')
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill')
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill')
  // }
];

export default sidebarConfig;
