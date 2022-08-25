import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
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
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import ApophthganMenu from '../sections/@dashboard/apophthgan/ApophthganMenu';
import ApophthganEditForm from '../sections/@dashboard/apophthgan/ApophthganEditForm';

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
  { id: 'pathImage', label: 'Ảnh', alignRight: false },
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'reason', label: 'Căn nguyên', alignRight: false },
  { id: 'mood', label: 'Tâm trạng', alignRight: false },
  { id: 'isActivate', label: 'Hiển thị', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/apophthgan/admin`;

export default function ApophthganPage() {
  const [apophthgans, setApophthgans] = useState([]);
  const [moods, setMoods] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    reloadData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    reloadMoods();
    reloadReasons();
  }, []);

  const reloadData = kw => {
    axios
      .get(`${apiURL}?title=${kw || ''}&page=${page}&pageSize=${rowsPerPage}&reason=&mood=`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setTotalRecords(response.data.data.total);
        setApophthgans(response.data.data.records);
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

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );

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

  return (
    <Page title="Quản lý danh sách danh ngôn">
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
          <ApophthganEditForm
            apophthgan={null}
            moods={moods}
            reasons={reasons}
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
            Danh sách Danh ngôn
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
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {apophthgans.map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">
                        <img src={e.pathImage} alt={e.pathImage} style={{ maxHeight: '100px' }} />
                      </TableCell>
                      <TableCell align="left">{e.title}</TableCell>
                      <TableCell align="left">{e.reason.name}</TableCell>
                      <TableCell align="left">{e.mood.name}</TableCell>
                      <TableCell align="left">{e.isActivate ? 'Có' : 'Không'}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <ApophthganMenu moods={moods} reasons={reasons} apophthgan={e} reloadData={reloadData} />
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
