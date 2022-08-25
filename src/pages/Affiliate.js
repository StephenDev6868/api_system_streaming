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
} from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import * as locales from '@mui/material/locale';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Page from '../components/Page';
import { AffiliateForm } from '../sections/@dashboard/affiliate/AffiliateForm';
import { UserListHead } from '../sections/@dashboard/user';
import Scrollbar from '../components/Scrollbar';

const token = JSON.parse(localStorage.getItem('user'));

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
  { id: 'name', label: 'Người dùng', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'childs', label: 'Danh mục con', alignRight: false },
  { id: 'referralId', label: 'Mã giới thiệu', alignRight: false },
  { id: 'bcoin', label: 'Bcoin', alignRight: false },
  { id: 'createdAt', label: 'Ngày thêm', alignRight: false },
];

Settings.propTypes = {
  showSnack: propTypes.func,
};

export default function Settings(props) {
  const [form, setForm] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [affiliate, setAffiliate] = useState({});
  const [affiliateGroups, setAffiliateGroups] = useState([]);
  const [openArrow, setOpenArrow] = useState(-1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    reloadAffiliateGroup();
    loadAffiliate();
  }, [page, rowsPerPage]);

  const reloadAffiliateGroup = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/auth/affiliate-group?page=${page}&pageSize=${rowsPerPage}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        console.log(response.data.data);
        setTotalRecords(response.data.data.total);
        setAffiliateGroups(response.data.data.records);
      });
  };

  const loadAffiliate = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/content/affiliate/get`, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        setAffiliate(res.data.data);
      })
      .catch(err => console.log(err));
  };

  const saveAffiliate = data => {
    axios
      .put(
        `${process.env.REACT_APP_API_HOST}/content/affiliate/${affiliate._id}`,
        {
          affiliate_percent: data.affiliate_percent,
          affiliate_percent1: data.affiliate_percent1,
          affiliate_percent2: data.affiliate_percent2,
          affiliate_percent3: data.affiliate_percent3,
          affiliate_percent4: data.affiliate_percent4,
          affiliate_percent5: data.affiliate_percent5,
        },
        {
          headers: {
            token: token.token,
          },
        },
      )
      .then(res => {
        console.log(res);
        loadAffiliate();
        props.showSnack('success', 'Lưu thành công!');
      })
      .catch(err => {
        console.log(err);
        props.showSnack('error', 'Không thể lưu!');
      })
      .finally(() => setIsEditFormOpen(false));
  };

  const openForm = form => {
    setForm(form);
    setIsEditFormOpen(true);
  };

  const getFormContent = () => {
    if (form === 'affiliate') {
      return <AffiliateForm affiliate={affiliate} onFormSubmit={data => saveAffiliate(data)} />;
    }
    return <p />;
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
    <Page title="Cài đặt">
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
          <Typography variant="h4">Cấu hình tiếp thị liên kết</Typography>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Affiliate</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('affiliate')}>
            Sửa
          </Button>
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh sách nhóm affiliate
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {affiliateGroups.map((e, i) =>
                    e.parent == null ? (
                      <>
                        <TableRow hover key={e._id} tabIndex={-1}>
                          <TableCell align="left">{e.name}</TableCell>
                          <TableCell align="left">{e.email}</TableCell>
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
                          <TableCell align="left">{e.referralId}</TableCell>
                          <TableCell align="left">{e.bcoin}</TableCell>
                          <TableCell align="left">{e.createdAt.substr(0, 10)}</TableCell>
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
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Email</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Mã giới thiệu</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Bcoin</TableCell>
                                        <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>Ngày thêm</TableCell>
                                        <TableCell />
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {e.childs.map(v => (
                                        <TableRow key={v._id}>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>{v.name}</TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>{v.email}</TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.referralId}
                                          </TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>{v.bcoin}</TableCell>
                                          <TableCell style={{ paddingRight: 0, paddingLeft: 0 }}>
                                            {v.createdAt.substr(0, 10)}
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
