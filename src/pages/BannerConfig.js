import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  TableContainer,
  TablePagination,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import BannerMoreMenu from '../sections/@dashboard/banner/BannerMenu';
import BannerEditForm from '../sections/@dashboard/banner/BannerEditForm';

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
  { id: 'imageUrl', label: 'Ảnh minh hoạ', alignRight: false },
  { id: 'link', label: 'Liên kết', alignRight: false },
  { id: 'enabled', label: 'Hiển thị', alignRight: false },
  { id: 'createdAt', label: 'Ngày thêm', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/banner/admin`;

export default function OrderPage() {
  const [banner, setBanner] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = () => {
    axios
      .get(`${apiURL}?page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setBanner(response.data.data.records);
      });
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, banner.length - page * rowsPerPage);

  return (
    <Page title="Banner">
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={CreateDialogOpen}
        autoHideDuration={5000}
        onClose={handleCloseCreate}
        message="Thêm mới thành công!"

        // action={action}
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

        // action={action}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>
          <BannerEditForm
            banner={null}
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
            Danh sách banner
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm mới
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {banner.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(e => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">
                        <img src={e.imageUrl} alt="" style={{ maxHeight: '125px', maxWidth: '300px' }} />
                      </TableCell>
                      <TableCell align="left">{e.link}</TableCell>
                      <TableCell align="left">{e.enabled ? 'Có' : 'Không'}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <BannerMoreMenu banner={e} reloadData={reloadData} />
                      </TableCell>
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
              count={banner.length}
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
