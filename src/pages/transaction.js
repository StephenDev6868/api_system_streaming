import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import TransactionMenu from '../sections/@dashboard/transaction/TransactionMenu';

const TABLE_HEAD = [
  { id: 'trans_code', label: 'Mã giao dịch', alignRight: false },
  { id: 'type', label: 'Giao dịch', alignRight: false },
  { id: 'product', label: 'Tên sách', alignRight: false },
  { id: 'user', label: 'Người dùng', alignRight: false },
  { id: 'bcoin', label: 'Bcoin', alignRight: false },
  { id: 'note', label: 'Ghi chú', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/transaction/admin/list`;

export default function TransactionPage() {
  const [buyTransactions, setBuyTransactions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  const reloadData = () => {
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setBuyTransactions(response.data.data.records);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  return (
    <Page title="Quản lý lịch sử giao dịch">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách lịch sử giao dịch
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {buyTransactions.map((e, i) => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <Tooltip title={e.trans_code}>
                        <TableCell align="left">
                          {e.trans_code != null ? e.trans_code.substr(0, 10).concat('...') : null}
                        </TableCell>
                      </Tooltip>
                      <TableCell align="left">{e.type}</TableCell>
                      <Tooltip title={e.product != null ? e.product.name : null}>
                        <TableCell align="left">{e.product != null ? e.product.name : null}</TableCell>
                      </Tooltip>
                      <Tooltip title={e.user != null ? e.user.name : null}>
                        <TableCell align="left">{e.user != null ? e.user.name : null}</TableCell>
                      </Tooltip>
                      <TableCell align="left">{e.bcoinStr ? e.bcoinStr : e.bcoin}</TableCell>
                      <Tooltip title={e.note}>
                        <TableCell align="left">{e.note != null ? e.note.substr(0, 60).concat('...') : null}</TableCell>
                      </Tooltip>
                      <TableCell align="left">
                        {e.status === 0 || e.status === null || e.status === undefined ? 'Thành công' : 'Thất bại'}
                      </TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <TransactionMenu transact={e} reloadData={reloadData} />
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
