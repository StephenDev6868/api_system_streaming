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
import AppellationMenu from '../sections/@dashboard/appellation/AppellationMenu';
import AppellationEditForm from '../sections/@dashboard/appellation/AppellationEditForm';

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
  { id: 'bookRequired', label: 'Số lượng sách', alignRight: false },
  { id: 'giftPerBook', label: 'Bcoin được tặng/sách', alignRight: false },
  { id: 'bcoinOfLevel', label: 'Bcoin được tặng khi lên level', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/appellation`;

export default function AppellationPage() {
  const [appellations, setAppellations] = useState([]);
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
      .get(`${apiURL}?keyword=%20&page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        console.log(response.data.data.records);
        setAppellations(response.data.data.records);
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, appellations.length - page * rowsPerPage);

  return (
    <Page title="Quản lý danh sách chức danh">
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
          <AppellationEditForm
            appellation={null}
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
            Danh sách Chức danh
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
                  {appellations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((e, i) => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">{e.name}</TableCell>
                      <TableCell align="left">{e.description}</TableCell>
                      <TableCell align="left">{e.bookRequired}</TableCell>
                      <TableCell align="left">{e.giftPerBook}</TableCell>
                      <TableCell align="left">{e.bcoinOfLevel}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <AppellationMenu appellation={e} reloadData={reloadData} />
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
              count={appellations.length}
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
