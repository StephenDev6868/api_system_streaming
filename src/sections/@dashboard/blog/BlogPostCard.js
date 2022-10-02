import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// material
import { useFormik, Form, FormikProvider } from 'formik';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { alpha, styled } from '@mui/material/styles';
import * as Yup from 'yup';
import {
  Menu,
  Box,
  Alert,
  Link,
  TextField,
  Snackbar,
  ListItemText,
  Card,
  Grid,
  MenuItem,
  IconButton,
  ListItemIcon,
  Typography,
  CircularProgress,
  Modal,
  Stack,
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// utils

import Iconify from '../../../components/Iconify';

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

// ----------------------------------------------------------------------

const token = JSON.parse(localStorage.getItem('user'));

// const apiURL = process.env.REACT_APP_API_HOST + '/profile/admin/';
// // ----------------------------------------------------------------------
const apiDelete = `${process.env.REACT_APP_API_HOST}/news/delete`;
const updateURL = `${process.env.REACT_APP_API_HOST}/news/update`;

BlogPostCard.propTypes = {
  post: PropTypes.object,
  reloadData: PropTypes.func,
};

export default function BlogPostCard(props) {
  const { post, reloadData } = props;
  const ref = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [OpenUpdate, setOpenUpdate] = useState(false);

  // ============== Snackbar Edit ==============
  const [EditDialogOpen, setEditDialogOpen] = useState(false);

  const handleCloseEdit = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setEditDialogOpen(false);
  };

  const handleSnackEditSuccess = () => {
    setEditDialogOpen(true);
  };

  // ==================================================

  // ============== Snackbar Delete ==============
  const [DelDialogOpen, setDelDialogOpen] = useState(false);

  const handleCloseDel = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setDelDialogOpen(false);
  };

  const handleSnackDelSuccess = () => {
    setDelDialogOpen(true);
  };

  // ==================================================
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleOpenUpdate = () => {
    setIsMenuOpen(false);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setIsMenuOpen(false);
    setOpenUpdate(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const deleteNews = () => {
    axios
      .post(
        `${apiDelete}`,
        { id: post._id, title: post.title, description: post.description, content: post.content },
        {
          headers: {
            token: token.token,
          },
        },
      )
      .then(response => {
        handleCloseDeleteDialog();
        handleSnackDelSuccess();
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        reloadData();
      });
  };

  // =================================
  const NewsFormValidation = Yup.object().shape({
    featureImageId: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    title: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    content: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    description: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
  });
  const formikUpdate = useFormik({
    initialValues: {
      title: post.title,
      content: post.content,
      description: post.description,
      featureImageId: post.featureImageId,
      // isFeatured: post.isFeatured,
      isActivated: post.isActivated,
    },
    validationSchema: NewsFormValidation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${updateURL}`,
          {
            id: post._id,
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
        .then(() => {
          handleCloseUpdate();
          reloadData();
          handleSnackEditSuccess();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values, setFieldValue } = formikUpdate;

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
        open={EditDialogOpen}
        autoHideDuration={4500}
        onClose={handleCloseEdit}
        message="Cập nhật thành công!"

        // action={action}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={DelDialogOpen}
        autoHideDuration={4500}
        onClose={handleCloseDel}
        message="Xoá thành công!"

        // action={action}
      />

      <Dialog
        open={isDeleteDialogOpen}
        keepMounted
        onClose={handleCloseDeleteDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{post.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Bạn có chắc muốn xóa bài viết này?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
          <Button onClick={deleteNews}>Đồng ý</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={OpenUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={formikUpdate}>
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

      <TableRow hover tabIndex={-1}>
        <TableCell align="left" style={{ width: 150 }}>
          <img src={post.featureImageId} alt={post.title} style={{ maxHeight: '100px' }} />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} style={{ width: 300 }}>
            <Typography variant="subtitle2">{post.title}</Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">{post.description.substr(0, 350)}....</TableCell>

        <TableCell align="left" style={{ width: 120 }}>
          {post.createdAt.substr(0, 10)}
        </TableCell>
        <TableCell align="right">
          <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
            <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
          </IconButton>
        </TableCell>
      </TableRow>
      <Menu
        open={isMenuOpen}
        anchorEl={ref.current}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setIsMenuOpen(false);
        }}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenUpdate} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xoá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
