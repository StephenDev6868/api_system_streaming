import { useState, useEffect, useMemo, useCallback } from 'react';
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
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { debounce } from 'lodash';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { styled } from '@mui/styles';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'images', label: 'Ảnh minh hoạ', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/feed-back`;

export default function OrderPage() {
  const [feedback, setFeedback] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = kw => {
    setIsLoadingList(true);

    axios
      .get(`${apiURL}?page=1&pageSize=0&name=${kw || ''}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        console.log(response.data.data.records);
        setFeedback(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, feedback.length - page * rowsPerPage);

  return (
    <Page title="Quản lý tư vấn">
      {/* <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách góp ý
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
                <TableBody>
                  {feedback.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {e.user.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left" style={{ width: 250 }}>
                        <div>
                          {e.images.slice(0, 1).map(fb => (
                            <Box>
                              <img src={fb} alt="" style={{ maxHeight: '100px' }} />
                            </Box>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="left">{e.content}</TableCell>
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
              count={feedback.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </Card>
      </Container> */}
    </Page>
  );
}
