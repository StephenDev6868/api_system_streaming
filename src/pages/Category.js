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
  Button,
  Snackbar,
  Modal,
  Box,
  Container,
  Typography,
  Collapse,
  TableHead,
  TableContainer,
  IconButton,
  TablePagination,
  TextField,
  LinearProgress,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { debounce } from 'lodash';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import CategoryMoreMenu from '../sections/@dashboard/category/CategoryMenu';
import CategoryEditForm from '../sections/@dashboard/category/CategoryEditForm';

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

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'books', label: 'Số sách', alignRight: false },
  { id: 'childs', label: 'Danh mục con', alignRight: false },
  { id: 'row', label: 'Hàng', alignRight: false },
  { id: 'order', label: 'Vị trí', alignRight: false },
  { id: 'enabled', label: 'Hiển thị', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/category/admin/list`;

export default function OrderPage() {
  const [category, setCategory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [openArrow, setOpenArrow] = useState(-1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}?page=${page}&pageSize=${rowsPerPage}&keyword=${kw || ''}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setCategory(response.data.data.records);
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
  // ============== Snackbar create ==============
  const [CreateDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCloseCreate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCreateDialogOpen(false);
  };

  const handleSnackCreateSuccess = () => {
    setCreateDialogOpen(true);
  };

  // ============== Snackbar create ==============
  const [UpdateDialogOpen, setUpdateDialogOpen] = useState(false);

  const handleCloseUpdate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setUpdateDialogOpen(false);
  };

  const handleSnackUpdateSuccess = () => {
    setUpdateDialogOpen(true);
  };
  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );

  return (
    <Page title="Quản lý danh mục">
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={CreateDialogOpen}
        autoHideDuration={5000}
        onClose={handleCloseCreate}
        message="Thêm mới thành công!"
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={UpdateDialogOpen}
        autoHideDuration={5000}
        onClose={handleCloseUpdate}
        message="Cập nhật thành công!"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>
          <CategoryEditForm
            category={null}
            categoryId={category}
            handleSnackCreateSuccess={handleSnackCreateSuccess}
            handleSnackUpdateSuccess={handleSnackUpdateSuccess}
            closeModal={handleClose}
            reloadData={reloadData}
          />
        </Box>
      </Modal>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách danh mục
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
            <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
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
                  {category.map((e, i) =>
                    e.parent == null ? (
                      <>
                        <TableRow hover key={e._id} tabIndex={-1}>
                          <TableCell align="left">{e.name}</TableCell>
                          <TableCell align="left">{e.description.substr(0, 30)}</TableCell>
                          <TableCell align="left">{e.books}</TableCell>
                          <TableCell align="left">
                            {e.childs.length > 0 ? (
                              <>
                                Có
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => setOpenArrow(openArrow === i ? -1 : i)}
                                >
                                  {openArrow === i ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                              </>
                            ) : (
                              'Không'
                            )}
                          </TableCell>
                          <TableCell align="left">{e.row}</TableCell>
                          <TableCell align="left">{e.order}</TableCell>
                          <TableCell align="left">{e.enabled ? 'Có' : 'Không'}</TableCell>
                          <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                          <TableCell align="right">
                            <CategoryMoreMenu category={e} categoryId={category} reloadData={reloadData} />
                          </TableCell>
                        </TableRow>

                        {e.childs.length > 0 ? (
                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                              <Collapse in={openArrow === i} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                  <Typography variant="h6" gutterBottom component="div">
                                    Các danh mục con
                                  </Typography>
                                  <Table size="small" aria-label="purchases">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Tên</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Mô tả</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Số sách</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Vị trí</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Hiển thị</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Ngày tạo</TableCell>
                                        <TableCell />
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {e.childs.map(v => (
                                        <TableRow key={v._id}>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>{v.name}</TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.description.substr(0, 30)}
                                          </TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.booksNumber}
                                          </TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>{v.order}</TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.enabled ? 'Có' : 'Không'}
                                          </TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.createdAt.substr(0, 10)}
                                          </TableCell>
                                          <TableCell align="left">
                                            <CategoryMoreMenu
                                              category={v}
                                              categoryId={category}
                                              reloadData={reloadData}
                                              handleSnackCreateSuccess={handleSnackCreateSuccess}
                                              handleSnackUpdateSuccess={handleSnackUpdateSuccess}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </>
                    ) : null,
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
