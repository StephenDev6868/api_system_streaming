import { useRef, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  TextField,
  Stack,
  Button,
  ListItemText,
  Snackbar,
  Modal,
  Alert,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

// component
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';

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

const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/profile/admin/`;
const apiRechargeURL = `${process.env.REACT_APP_API_HOST}/banking/recharge/`;
const apiDeductBcoinURL = `${process.env.REACT_APP_API_HOST}/auth/deduct-bcoin/`;
// ----------------------------------------------------------------------
const apiDelete = `${process.env.REACT_APP_API_HOST}/admin/users/`;

UserMoreMenu.propTypes = {
  reloadData: propTypes.func,
};
export default function UserMoreMenu(props) {
  const { reloadData } = props;
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [isDeductDialogOpen, setIsDeductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDelDialogOpen, setIsDelDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);

  // ============== Snackbar Recharge ==============
  const [successRechargeDialogOpen, setSuccessRechargeDialogOpen] = useState(false);

  const handleRechargeClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessRechargeDialogOpen(false);
  };

  const handleSnackRechargeSuccess = () => {
    setSuccessRechargeDialogOpen(true);
  };

  // ============== Snackbar Deduct Bcoin ==============
  const [successDeductDialogOpen, setSuccessDeductDialogOpen] = useState(false);

  const handleDeductClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessDeductDialogOpen(false);
  };

  const handleSnackDeductSuccess = () => {
    setSuccessDeductDialogOpen(true);
  };

  // ============== Snackbar Edit ==============
  const [successDialogOpen, setsuccessDialogOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setsuccessDialogOpen(false);
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };

  // ==================================================
  // ============== Snackbar Lock ==============
  const [LockDialogOpen, setLockDialogOpen] = useState(false);

  const handleCloseLock = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setLockDialogOpen(false);
  };

  const handleSnackLockSuccess = () => {
    setLockDialogOpen(true);
  };

  // ==================================================
  // ============== Snackbar Unlock ==============
  const [UnlockDialogOpen, setUnlockDialogOpen] = useState(false);

  const handleCloseUnlock = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setUnlockDialogOpen(false);
  };

  const handleSnackUnlockSuccess = () => {
    setUnlockDialogOpen(true);
  };

  // ============== Snackbar Edit ==============
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

  const handleOpenRechargeDialog = () => {
    setIsMenuOpen(false);
    setIsRechargeDialogOpen(true);
  };
  const handleCloseRechargeDialog = () => {
    setIsMenuOpen(false);
    setIsRechargeDialogOpen(false);
  };

  const handleOpenDeductDialog = () => {
    setIsMenuOpen(false);
    setIsDeductDialogOpen(true);
  };
  const handleCloseDeductDialog = () => {
    setIsMenuOpen(false);
    setIsDeductDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(false);
  };

  const handleOpenLockDialog = () => {
    setIsMenuOpen(false);
    setIsLockDialogOpen(true);
  };

  const handleCloseLockDialog = () => {
    setIsMenuOpen(false);
    setIsLockDialogOpen(false);
  };

  const handleOpenDelDialog = () => {
    setIsMenuOpen(false);
    setIsDelDialogOpen(true);
  };

  const handleCloseDelDialog = () => {
    setIsMenuOpen(false);
    setIsDelDialogOpen(false);
  };
  // =======================   Recharge   =================================

  const IdUser = props.id;
  const rechargeFormValidation = Yup.object().shape({
    amount: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(1000, 'Giá trị tối thiểu là 1.000'),
  });
  const rechargeFormik = useFormik({
    initialValues: {
      amount: 0,
    },
    validationSchema: rechargeFormValidation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${apiRechargeURL}`,
          {
            uid: IdUser,
            amount: values.amount,
          },
          {
            headers: {
              token: token.token,
            },
          },
        )
        .then(() => {
          handleCloseRechargeDialog();
          reloadData();
          handleSnackRechargeSuccess();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });
  const rechargeErrors = rechargeFormik.errors;
  const rechargeTouched = rechargeFormik.touched;
  const rechargeHandleSubmit = rechargeFormik.handleSubmit;
  const rechargeGetFieldProps = rechargeFormik.getFieldProps;

  // =======================   Recharge   =================================

  const deductBcoinFormValidation = Yup.object().shape({
    bcoin: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(1, 'Giá trị tối thiểu là 1 bcoin'),
    reason: Yup.string()
      .required('Lý do không được để trống')
      .min(6, 'Lý do tối thiểu 6 ký tự')
      .max(200, 'Lý do tối đa 200 ký tự'),
  });
  const deductBcoinFormik = useFormik({
    initialValues: {
      bcoin: 1,
      reason: '',
    },
    validationSchema: deductBcoinFormValidation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${apiDeductBcoinURL}`,
          {
            uid: IdUser,
            bcoin: values.bcoin,
            reason: values.reason,
          },
          {
            headers: {
              token: token.token,
            },
          },
        )
        .then(() => {
          handleCloseDeductDialog();
          reloadData();
          handleSnackDeductSuccess();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });
  const deductErrors = deductBcoinFormik.errors;
  const deductTouched = deductBcoinFormik.touched;
  const deductHandleSubmit = deductBcoinFormik.handleSubmit;
  const deductGetFieldProps = deductBcoinFormik.getFieldProps;

  // =======================   Edit User  =================================
  const userFormValidation = Yup.object().shape({
    name: Yup.string()
      .required('Tên không được để trống')
      .min(6, 'Tên tối thiểu 6 ký tự')
      .max(60, 'Tên tối đa 60 ký tự'),
    email: Yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
  });
  const formik = useFormik({
    initialValues: {
      name: props.name,
      email: props.email,
    },
    validationSchema: userFormValidation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(
          `${apiURL}${IdUser}`,
          {
            name: values.name,
            email: values.email,
          },
          {
            headers: {
              token: token.token,
            },
          },
        )
        .then(() => {
          handleCloseEditDialog();
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

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

  const deleteUser = () => {
    axios
      .post(`${apiDelete}${IdUser}/lock`, null, {
        headers: {
          token: token.token,
        },
      })
      .then(() => {
        handleCloseDeleteDialog();
        handleSnackLockSuccess();
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        reloadData();
      });
  };

  const UnlockUser = () => {
    axios
      .post(`${apiDelete}${IdUser}/unlock`, null, {
        headers: {
          token: token.token,
        },
      })
      .then(() => {
        handleCloseLockDialog();
        handleSnackUnlockSuccess();
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        reloadData();
      });
  };

  const DelUser = () => {
    axios
      .post(`${apiDelete}${IdUser}/delete`, null, {
        headers: {
          token: token.token,
        },
      })
      .then(() => {
        handleCloseDelDialog();
        handleSnackDelSuccess();
      })
      .catch(error => {
        console.error('There was an error!', error);
      })
      .finally(() => {
        reloadData();
      });
  };

  const noLock = () => {
    setIsDeleteDialogOpen(false);
    // window.location.reload(true);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successRechargeDialogOpen}
        autoHideDuration={4500}
        onClose={handleRechargeClose}
        message="Nạp bcoin thành công!"
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDeductDialogOpen}
        autoHideDuration={4500}
        onClose={handleDeductClose}
        message="Trừ bcoin thành công!"
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={4500}
        onClose={handleClose}
        message="Sửa thành công!"

        // action={action}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={LockDialogOpen}
        autoHideDuration={4500}
        onClose={handleCloseLock}
        message="Tạm khoá thành công!"

        // action={action}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={UnlockDialogOpen}
        autoHideDuration={4500}
        onClose={handleCloseUnlock}
        message="Mở khoá thành công!"

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

      <IconButton ref={ref} onClick={() => setIsMenuOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
      <div>
        <Dialog
          open={isDeleteDialogOpen}
          keepMounted
          onClose={handleCloseDeleteDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{props.name}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc chắn muốn tạm khóa người dùng này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={noLock}>Không</Button>
            <Button onClick={deleteUser}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={isLockDialogOpen}
          keepMounted
          onClose={handleCloseLockDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{props.name}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc muốn mở khoá người dùng này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsLockDialogOpen(false)}>Không</Button>
            <Button onClick={UnlockUser}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={isDelDialogOpen}
          keepMounted
          onClose={handleCloseDelDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{props.name}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc muốn xoá người dùng này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDelDialogOpen(false)}>Không</Button>
            <Button onClick={DelUser}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Modal
        open={isRechargeDialogOpen}
        onClose={handleCloseRechargeDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={rechargeFormik}>
            <Form autoComplete="off" noValidate onSubmit={rechargeHandleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  autoComplete="Số tiền"
                  type="number"
                  label="Số tiền"
                  {...rechargeGetFieldProps('amount')}
                  error={Boolean(rechargeTouched.amount && rechargeErrors.amount)}
                  helperText={rechargeTouched.amount && rechargeErrors.amount}
                />
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
              {rechargeErrors.error != null && (
                <Alert severity="error">
                  {typeof rechargeErrors.error === 'string' ? (
                    <p>{rechargeErrors.error}</p>
                  ) : (
                    rechargeErrors.error.map((v, i) => <p key={i.toString()}>{v}</p>)
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
      <Modal
        open={isDeductDialogOpen}
        onClose={handleCloseDeductDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={deductBcoinFormik}>
            <Form autoComplete="off" noValidate onSubmit={deductHandleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  autoComplete="Số bcoin"
                  type="number"
                  label="Số bcoin"
                  InputProps={{
                    endAdornment: 'bcoin',
                  }}
                  {...deductGetFieldProps('bcoin')}
                  error={Boolean(deductTouched.bcoin && deductTouched.bcoin)}
                  helperText={deductErrors.bcoin && deductErrors.bcoin}
                />
                <TextField
                  multiline
                  required
                  maxRows={10}
                  fullWidth
                  autoComplete="reason"
                  type="text"
                  label="Lý do"
                  {...getFieldProps('reason')}
                  error={Boolean(deductTouched.reason && deductErrors.reason)}
                  helperText={deductTouched.reason && deductErrors.reason}
                />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
              {deductErrors.error != null && (
                <Alert severity="error">
                  {typeof deductErrors.error === 'string' ? (
                    <p>{deductErrors.error}</p>
                  ) : (
                    deductErrors.error.map((v, i) => <p key={i.toString()}>{v}</p>)
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
      <Modal
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  autoComplete="name"
                  type="text"
                  label="Tên"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  autoComplete="email"
                  type="email"
                  label="Email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
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
      <Menu
        open={isMenuOpen}
        anchorEl={ref.current}
        onClose={() => {
          setIsDialogOpen(false);
          setIsMenuOpen(false);
        }}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="ant-design:lock-filled" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Tạm khoá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={handleOpenLockDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="ant-design:unlock-outlined" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Mở khoá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={handleOpenEditDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenRechargeDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:swap-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Nạp bcoin" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenDeductDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:minus-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Trừ bcoin" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem onClick={handleOpenDelDialog} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="ep:delete" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xoá" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
