import { useEffect, useState, useMemo, useCallback } from 'react';
// material
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import axios from 'axios';
import { debounce } from 'lodash';
import propTypes from 'prop-types';
import Page from '../components/Page';
//
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import Iconify from '../components/Iconify';
import BookMenu from '../sections/@dashboard/books/BookMenu';
import BookEditForm from '../sections/@dashboard/books/BookEditForm';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'image', label: 'Ảnh minh họa', alignRight: false },
  { id: 'name', label: 'Tên sách', alignRight: false },
  { id: 'author', label: 'Tác giả', alignRight: false },
  { id: 'price', label: 'Giá Bcoin', alignRight: false },
  { id: 'voice', label: 'Audio', alignRight: false },
  { id: 'file', label: 'PDF', alignRight: false },
  { id: 'year', label: 'Năm phát hành', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/product/admin`;

BooksPage.propTypes = {
  showSnack: propTypes.func,
};

export default function BooksPage(props) {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filters, setFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moods, setMoods] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    reloadAuthors();
    reloadFilters();
    reloadCategories();
    reloadMoods();
    reloadReasons();
  }, []);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}&name=${kw || ''}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setBooks(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  const reloadFilters = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/filter-product`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setFilters(response.data.data);
      });
  };

  const reloadAuthors = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/author?page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setAuthors(response.data.data.records);
      });
  };

  const reloadCategories = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/category/admin/combobox?page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setCategories(response.data.data.records);
      });
  };

  const reloadMoods = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/mood/list?name=%20&type=MOOD&page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setMoods(response.data.data.records);
      });
  };

  const reloadReasons = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/mood/list?name=%20&type=REASON&page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setReasons(response.data.data.records);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const [open, setOpen] = useState(false);
  const handleOpenFormDialog = () => {
    setOpen(true);
  };
  const handleCloseFormDialog = () => {
    setOpen(false);
  };

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );
  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);
  return (
    <Page title="Quản lý sách">
      <Modal
        open={open}
        onClose={handleCloseFormDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>
          <BookEditForm
            showSnack={props.showSnack}
            authors={authors}
            filters={filters}
            categories={categories}
            moods={moods}
            reasons={reasons}
            book={null}
            reloadData={reloadData}
            reloadAuthors={reloadAuthors}
            reloadCategories={reloadCategories}
            reloadFilters={reloadFilters}
            closeModal={handleCloseFormDialog}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách sách
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Tìm kiếm"
              variant="outlined"
              onChange={e => {
                executeSearch(e.target.value);
              }}
            />
            <Button variant="contained" onClick={handleOpenFormDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
              Thêm mới
            </Button>
          </Stack>
        </Stack>

        <Card>
          {isLoadingList ? <LinearProgress /> : null}
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {books.map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">
                        <img src={e.images[0]} alt={e.name} style={{ maxHeight: '100px' }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="subtitle2" noWrap>
                            {e.name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="left">{e.author.name}</TableCell>
                      <TableCell align="left">{e.price}</TableCell>
                      <TableCell align="left">{e.voice.length}</TableCell>
                      <TableCell align="left">{e.file.length}</TableCell>
                      <TableCell align="left">{e.publishingYear}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <BookMenu
                          showSnack={props.showSnack}
                          bookId={e._id}
                          reloadData={reloadData}
                          authors={authors}
                          filters={filters}
                          categories={categories}
                          moods={moods}
                          reasons={reasons}
                        />
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
