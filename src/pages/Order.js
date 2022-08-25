import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  MenuItem,
  Box,
  InputLabel,
  TableRow,
  FormControl,
  LinearProgress,
  Select,
  TableBody,
  TextField,
  TableCell,
  Container,
  Button,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { styled } from '@mui/styles';
// components
import DateFnsUtils from '@date-io/date-fns';
import { vi } from 'date-fns/locale';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên sách', alignRight: false },
  { id: 'type', label: 'Loại', alignRight: false },
  { id: 'orderType', label: 'Hình thức mua hàng', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: 'amount', label: 'Số lượng', alignRight: false },
  { id: 'totalPrice', label: 'Tổng tiền', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
];
const BoxSearch = styled('div')({
  display: 'flex',
  alignItems: 'center',
});
// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/order/admin`;

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [status, setStatus] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    reloadData();
  }, [status, startDate, endDate]);

  const reloadData = () => {
    setIsLoadingList(true);
    const params = {
      page: 1,
      pageSize: 0,
    };
    if (status) {
      params.status = status;
    }
    if (startDate) {
      params.dateFrom = startDate;
    }
    if (endDate) {
      params.dateTo = endDate;
    }
    axios
      .get(`${apiURL}`, {
        params,
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        console.log(response.data.data.records);
        setOrders(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleData = () => {
  //   setStatus(null);
  //   setStartDate(null);
  //   setEndDate(null);
  //   reloadData();
  // };

  const DateFormat = val => {
    const date = new Date(val).toISOString();
    console.log(date);
    return date;
  };

  const statuss = ['DANG_XY_LY', 'DANG_GIAO', 'HOAN_THANH', 'THAT_BAI', 'DA_HUY'];

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, orders.length - page * rowsPerPage);

  return (
    <Page title="Quản lý đơn hàng">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách đơn hàng
          </Typography>
          <BoxSearch>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel htmlFor="grouped-select">Trạng thái</InputLabel>
              <Select
                onChange={e => {
                  setStatus(e.target.value);
                }}
                id="grouped-select"
                label="Trạng thái"
              >
                <MenuItem value="">
                  <em>Trạng thái</em>
                </MenuItem>
                {statuss.map(st => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ maxWidth: '180px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi} utils={DateFnsUtils}>
                <DatePicker
                  label="Từ ngày"
                  disableFuture
                  value={value}
                  clearable
                  clearText="Xoá"
                  onChange={newValue => {
                    setValue(newValue);
                    if (newValue) {
                      setStartDate(DateFormat(newValue));
                    } else {
                      setStartDate(null);
                    }
                  }}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ mr: '.5rem' }}>&nbsp;</Box>

            <Box sx={{ maxWidth: '180px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi} utils={DateFnsUtils}>
                <DatePicker
                  label="Đến ngày"
                  disableFuture
                  value={value2}
                  clearable
                  clearText="Xoá"
                  onChange={newValue => {
                    setValue2(newValue);
                    if (newValue) {
                      setEndDate(DateFormat(newValue));
                    } else {
                      setEndDate(null);
                    }
                  }}
                  renderInput={params => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Box>
            {/* <Box sx={{ width: 'auto', ml: '1rem', height: 'auto' }} onClick={handleData}>
              <Button variant="outlined" sx={{ minHeight: '3.65em', width: '111px' }}>
                Tất cả
              </Button>
            </Box> */}
          </BoxSearch>
        </Stack>

        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">
                        {' '}
                        <div className="orderName">
                          {e.products.map(order => (
                            <Stack direction="row" alignItems="center" spacing={2} key={order._id}>
                              <Typography variant="subtitle2" noWrap>
                                {order.name}
                              </Typography>
                            </Stack>
                          ))}
                        </div>
                      </TableCell>
                      {/* <WrapperOrder>
                    
                      </WrapperOrder> */}
                      <TableCell align="left">
                        <div className="orderType">
                          {e.products.map(order => (
                            <div key={order._id}>{order.type}</div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell align="left">{e.orderType}</TableCell>
                      <TableCell align="left">{e.status}</TableCell>
                      <TableCell align="left">
                        <div className="orderAmount">
                          {e.products.map(order => (
                            <div key={order._id}>{order.amount}</div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="left">{e.totalPriceProduct}</TableCell>
                      {/* <TableCell align="left">{e.accepted ? 'Đã duyệt' : 'Chưa duyệt'}</TableCell> */}
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <ThemeProvider theme={themeWithLocale}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </Card>
      </Container>
    </Page>
  );
}
