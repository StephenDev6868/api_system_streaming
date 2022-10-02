import { useState, useEffect, useMemo, useCallback } from 'react';
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
  TextField,
  LinearProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { styled } from '@mui/styles';
// components
import { debounce } from 'lodash';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserMoreMenu } from '../sections/@dashboard/user';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'bcoin', label: 'Số Bcoin', alignRight: false },
  { id: 'isActived', label: 'Kích hoạt', alignRight: false },
  { id: 'isLock', label: 'Trạng thái', alignRight: false },
  { id: 'createdAT', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

const CenterBox = styled('div')({
  paddingTop: '3rem',
  paddingBottom: '3rem',
  width: '100%',
  textAlign: 'center',
  borderBottom: '1px solid rgba(241, 243, 244, 1)',
  position: 'absolute',
});

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/admin/users/list`;

export default function User() {
  const [user, setUser] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .post(`${apiURL}?page=${page}&pageSize=${rowsPerPage}&keyword=${kw || ''}`, null, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setUser(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );

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

  //  ================================

  return (
    <Page title="Quản lý người dùng">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách người dùng
          </Typography>
          <TextField
            id="outlined-basic"
            label="Tìm kiếm"
            variant="outlined"
            onChange={e => {
              executeSearch(e.target.value);
            }}
          />
        </Stack>

        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody sx={{ position: 'relative', height: '7.85rem' }}>
                  {user.length > 0 ? (
                    user.map(e => (
                      <TableRow hover key={e._id} tabIndex={-1}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {e.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{e.email}</TableCell>
                        <TableCell align="left">{e.bcoin}</TableCell>
                        <TableCell align="left">{e.isActivated ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</TableCell>
                        <TableCell align="left">{e.isLock ? 'Tạm khoá' : 'Chưa khoá'}</TableCell>
                        <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu
                            id={e._id}
                            name={e.name}
                            email={e.email}
                            bcoin={e.bcoin}
                            reloadData={reloadData}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <CenterBox>Không có kết quả tìm kiếm nào phù hợp</CenterBox>
                  )}
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
