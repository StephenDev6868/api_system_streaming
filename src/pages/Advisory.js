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
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';
import AdvisoryMenu from '../sections/@dashboard/advisory/AdvisoryMenu';
import SettingForm from '../sections/@dashboard/advisory/SettingForm';

const formBoxStyle = {
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
  { id: 'name', label: 'Họ và tên', alignRight: false },
  { id: 'issueType', label: 'Vấn đề', alignRight: false },
  { id: 'appointmentDateStr', label: 'Ngày hẹn', alignRight: false },
  { id: 'contact', label: 'Liên hệ', alignRight: false },
  { id: 'content', label: 'Nội dung', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
  { id: 'note', label: 'Ghi chú', alignRight: false },
  { id: 'requester', label: 'Người tạo', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/advisory`;

export default function AdvisoryPage() {
  const [form, setForm] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [settings, setSettings] = useState({});
  const [advisories, setAdvisories] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    reloadData();
    loadSetting();
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
        setAdvisories(response.data.data.records);
      });
  };

  const loadSetting = () => {
    axios
      .get(`${apiURL}/settings`, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        setSettings(res.data.data);
      })
      .catch(err => console.log(err));
  };

  const saveSettings = data => {
    axios
      .put(
        `${apiURL}/settings/${settings._id}`,
        {
          bcoin: data.bcoin,
        },
        {
          headers: {
            token: token.token,
          },
        },
      )
      .then(res => {
        loadSetting();
      })
      .catch(err => {})
      .finally(() => setIsEditFormOpen(false));
  };

  const openForm = form => {
    setForm(form);
    setIsEditFormOpen(true);
  };

  const getFormContent = () => {
    if (form === 'setting') {
      return <SettingForm setting={settings} onFormSubmit={data => saveSettings(data)} />;
    }
    return <p />;
  };

  // ================Pagination================

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
    <Page title="Quản lý lịch tư vấn">
      <Modal
        open={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={formBoxStyle}>{getFormContent()}</Box>
      </Modal>
      <Container>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Cấu hình bcoin tư vấn</Typography>
        </Box>
        <Box sx={{ pt: 3 }}>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('setting')}>
            Sửa
          </Button>
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách lịch tư vấn
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {advisories.map((e, i) => (
                    <TableRow hover key={e._id} tabIndex={-1}>
                      <TableCell align="left">{e.name}</TableCell>
                      <TableCell align="left">{e.issueType != null ? e.issueType.name : null}</TableCell>
                      <TableCell align="left">{e.appointmentDateStr}</TableCell>
                      <TableCell align="left">{e.contact}</TableCell>
                      <TableCell align="left">{e.content}</TableCell>
                      <TableCell align="left">{e.status}</TableCell>
                      <TableCell align="left">{e.note}</TableCell>
                      <TableCell align="left">{e.requester != null ? e.requester.name : null}</TableCell>
                      <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
                      <TableCell align="right">
                        <AdvisoryMenu advisory={e} reloadData={reloadData} />
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
