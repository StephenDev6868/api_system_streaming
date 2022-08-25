import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
// material
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Grid,
  Card,
  Table,
  TableBody,
  Button,
  TableContainer,
  Container,
  Stack,
  Snackbar,
  Modal,
  Box,
  TextField,
  TablePagination,
  CircularProgress,
  Alert,
  TableRow,
  TableCell,
  Typography,
  LinearProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// components
import { debounce } from 'lodash';
import Scrollbar from '../components/Scrollbar';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';

//
// import POSTS from '../_mocks_/blog';
const TABLE_HEAD = [
  { id: 'image', label: 'Ảnh minh họa', alignRight: false },
  { id: 'title', label: 'Tiêu đề', alignRight: false },
  { id: 'description', label: 'Mô tả', alignRight: false },
  { id: 'createdAt', label: 'Ngày tạo', alignRight: false },
  { id: '' },
];
// ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
// const SORT_OPTIONS = [
//   { value: 'latest', label: 'Latest' },
//   { value: 'popular', label: 'Popular' },
//   { value: 'oldest', label: 'Oldest' },
// ];

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/news/admin`;
const CreateURL = `${process.env.REACT_APP_API_HOST}/news`;

// ----------------------------------------------------------------------

export default function Blog() {
  const [news, setNews] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // ============== Snackbar Edit ==============
  const [successDialogOpen, setsuccessDialogOpen] = useState(false);

  const handleCloseCreate = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setsuccessDialogOpen(false);
  };

  const handleSnackCreateSuccess = () => {
    setsuccessDialogOpen(true);
  };

  // ==================================================

  const reloadData = kw => {
    setIsLoadingList(true);
    axios
      .get(`${apiURL}?page=1&pageSize=0&keyword=${kw || ''}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        console.log(response.data.data.records);
        setNews(response.data.data.records);
      })
      .finally(() => setIsLoadingList(false));
  };

  useEffect(() => {
    reloadData();
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const executeSearch = useCallback(
    debounce(nextValue => reloadData(nextValue), 250),
    [],
  );

  // ========= Set VietNamese =======
  const [locale, setLocale] = useState('viVN');

  const theme = useTheme();

  const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

  //  ================================

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, news.length - page * rowsPerPage);

  // =================================

  const NewsFormValidation = Yup.object().shape({
    featureImageId: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    title: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    content: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    description: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formikCreateNews = useFormik({
    initialValues: {
      title: '',
      content: '',
      description: '',
      featureImageId: '',
      // isFeatured: false,
      isActivated: true,
    },
    validationSchema: NewsFormValidation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${CreateURL}`,
          {
            title: values.title,
            content: values.content,
            description: values.description,
            featureImageId: values.featureImageId,
            // isFeatured: values.isFeatured,
            isActivated: values.isActivated,
          },
          {
            headers: {
              token: token.token,
            },
          },
        )
        .then(response => {
          window.location.reload(false);
          handleSnackCreateSuccess();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formikCreateNews;

  const handleUploadImage = event => {
    setIsUploadingImage(true);
    const f = event.target.files[0];
    const fData = new FormData();
    fData.append('file', f, f.name);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/upload`, fData, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        const { fileId, fullUrl } = res.data.data;
        setFieldValue('featureImageId', fullUrl);
        console.log(fullUrl);
      })
      .catch(error => {
        // setErrors({ error: error.response.data.message.join('ccc') });
        console.log(error);
      })
      .finally(() => setIsUploadingImage(false));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={800000}
        onClose={handleCloseCreate}
        message="Thêm mới thành công!"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={formikCreateNews}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Grid container spacing={4}>
                  <Grid item md={4}>
                    <img src={values.featureImageId} alt={values.featureImageId} style={{ maxWidth: '100%' }} />
                  </Grid>
                  <Grid item md={8}>
                    <label htmlFor="upload-img-btn">
                      <input
                        onChange={handleUploadImage}
                        accept="image/*"
                        style={{ display: 'none' }}
                        type="file"
                        id="upload-img-btn"
                      />
                      <Button variant="outlined" component="span">
                        Thêm ảnh minh họa
                      </Button>
                    </label>
                    {isUploadingImage ? <CircularProgress /> : null}
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  autoComplete="title"
                  type="text"
                  label="Tiêu đề"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
                <TextField
                  multiline
                  maxRows={10}
                  fullWidth
                  autoComplete="content"
                  type="text"
                  label="Nội dung"
                  {...getFieldProps('content')}
                  error={Boolean(touched.content && errors.content)}
                  helperText={touched.content && errors.content}
                />
                <TextField
                  multiline
                  maxRows={10}
                  fullWidth
                  autoComplete="description"
                  type="text"
                  label="Mô tả"
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
                {/* <TextField fullWidth type="file" {...getFieldProps('featureImage')} onClick={handleUpload} /> */}
                <FormGroup>
                  {/* <FormControlLabel
                    control={
                      <Checkbox {...getFieldProps('isFeatured')} checked={values.isFeatured} name="isFeatured" />
                    }
                    label="Tin tức nổi bật"
                  /> */}
                  <FormControlLabel
                    control={
                      <Checkbox {...getFieldProps('isActivated')} checked={values.isActivated} name="isActivated" />
                    }
                    label="Hiển thị tin tức"
                  />
                  {/* <FormControlLabel
                    control={<Checkbox defaultChecked onChange={e => handleActive(e)} />}
                    label="Hiển thị tin tức"
                  /> */}
                </FormGroup>
              </Stack>
              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} /> */}
              {errors.error != null && (
                <Alert severity="error">
                  {typeof errors.error === 'string' ? (
                    <p>{errors.error}</p>
                  ) : (
                    errors.error.map((v, i) => <p key={i.toString()}>{v}</p>)
                  )}
                </Alert>
              )}
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Lưu
              </Button>
            </Form>
          </FormikProvider>
        </Box>
      </Modal>
      <Page title="Quản lý sự kiện">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Danh sách sự kiện
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
                Thêm Mới
              </Button>
            </Stack>
          </Stack>

          {/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={news} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}

          <Card>
            {isLoadingList ? <LinearProgress /> : null}
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead headLabel={TABLE_HEAD} />
                  <TableBody>
                    {news.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(post => (
                      <BlogPostCard key={post._id} post={post} reloadData={reloadData} />
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
                sx={{ mt: 3 }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={news.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </ThemeProvider>
          </Card>
        </Container>
      </Page>
    </>
  );
}
