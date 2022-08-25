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
import { UserListHead } from '../sections/@dashboard/user';
import IntroMenu from '../sections/@dashboard/intro/IntroMenu';
import IntroEditForm from '../sections/@dashboard/intro/IntroEditForm';

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
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'order', label: 'Số thứ tự', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/intro`;

export default function IntroPage() {
  const [intros, setIntros] = useState([]);
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
      .get(`${apiURL}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setIntros(response.data.data);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, intros.length - page * rowsPerPage);

  return (
    <Page title="Quản lý intro">
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
          <IntroEditForm
            intro={null}
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
            Danh sách intro
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
                  {intros.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, i) => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">
                        <img src={e.pathImage} alt={e.pathImage} style={{ maxHeight: '100px' }} />
                      </TableCell>
                      <TableCell align="left">{e.title}</TableCell>
                      <TableCell align="left">{e.content}</TableCell>
                      <TableCell align="left">{e.order}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <IntroMenu intro={e} reloadData={reloadData} />
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
              count={intros.length}
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
