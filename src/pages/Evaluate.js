import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TableCell,
  Container,
  Typography,
  TableContainer,
  LinearProgress,
  TablePagination,
  TextField,
  Box,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import DateFnsUtils from '@date-io/date-fns';
import { vi } from 'date-fns/locale';
import { styled } from '@mui/styles';
import Page from '../components/Page';

import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import RatesMoreMenu from '../sections/@dashboard/rates/RateMoreMenu';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Sách', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'numberStar', label: 'Số sao', alignRight: false },
  { id: 'Accepted', label: 'Kiểm duyệt', alignRight: false },
  { id: 'user', label: 'Người tạo', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

const BoxSearch = styled('div')({
  display: 'flex',
  alignItems: 'center',
});
// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/rate/admin`;

export default function RatePage() {
  const [rates, setRates] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [star, setStar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    reloadData();
  }, [star, startDate, endDate, page, rowsPerPage]);

  const reloadData = () => {
    setIsLoadingList(true);
    const params = {};
    if (star) {
      params.numberStar = star;
    }
    if (startDate) {
      params.dateFrom = startDate;
    }
    if (endDate) {
      params.dateTo = endDate;
    }
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}&keyword=%20`, {
        params,
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setRates(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const DateFormat = val => {
    const date = new Date(val).toISOString();
    return date;
  };

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  return (
    <Page title="Quản lý đánh giá">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách đánh giá
          </Typography>
          <BoxSearch>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel htmlFor="grouped-select">Lọc theo sao</InputLabel>
              <Select
                onChange={e => {
                  setStar(e.target.value);
                }}
                id="grouped-select"
                label="Lọc theo sao"
              >
                <MenuItem value="">
                  <em>Lọc theo sao</em>
                </MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
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
          </BoxSearch>
        </Stack>

        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {rates.map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {e.product != null ? e.product.name : ''}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{e.content}</TableCell>
                      <TableCell align="left">{e.numberStar}</TableCell>
                      <TableCell align="left">{e.accepted ? 'Đã duyệt' : 'Chưa duyệt'}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {e.user != null ? e.user.name : ''}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <RatesMoreMenu rates={e} reloadData={reloadData} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <ThemeProvider theme={themeWithLocale}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalRecords}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </Card>
      </Container>
    </Page>
  );
}
