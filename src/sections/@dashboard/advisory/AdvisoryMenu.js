import { useRef, useState } from 'react';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Box,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// component
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import AdvisoryEditForm from './AdvisoryEditForm';

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

// ----------------------------------------------------------------------
AdvisoryMenu.propTypes = {
  advisory: propTypes.object,
  reloadData: propTypes.func,
};

const token = JSON.parse(localStorage.getItem('user'));

export default function AdvisoryMenu(props) {
  const { advisory, reloadData } = props;
  const { values } = { token_device: [] };
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleOpenEditDialog = () => {
    setIsDialogOpen(true);
    setIsMenuOpen(false);
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

  const handleOpenConfirmDialog = () => {
    setIsMenuOpen(false);
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsMenuOpen(false);
    setIsConfirmDialogOpen(false);
  };

  // ============== Snackbar Confirm ==============
  const [successConfirmDialogOpen, setSuccessConfirmDialogOpen] = useState(false);

  const handleConfirmClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessConfirmDialogOpen(false);
  };

  const handleSnackConfirmSuccess = () => {
    setSuccessConfirmDialogOpen(true);
  };

  const [errorConfirmDialogOpen, setErrorConfirmDialogOpen] = useState(false);

  const handleErrorConfirmClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorConfirmDialogOpen(false);
  };

  const handleSnackConfirmError = () => {
    setErrorConfirmDialogOpen(true);
  };

  // ============== Snackbar Delete ==============
  const [successDialogOpen, setsuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setsuccessDialogOpen(false);
  };

  const handleSnackEditSuccess = () => {
    setsuccessDialogOpen(true);
  };

  const handleConfirm = () => {
    axios
      .post(`${process.env.REACT_APP_API_HOST}/advisory/confirm-request/${advisory._id}`, values, {
        headers: {
          token: token.token,
        },
      })
      .then(() => {
        handleCloseConfirmDialog();
        reloadData();
        handleSnackConfirmSuccess();
      })
      .catch(error => {
        handleCloseConfirmDialog();
        handleSnackConfirmError();
        setErrorMessage(error.response.data.message);
        console.log(error.response.data.message);
        reloadData();
      })
      .finally(() => {});
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_HOST}/advisory/${advisory._id}`, {
        headers: {
          token: token.token,
        },
      })
      .then(() => {
        handleCloseDeleteDialog();
        reloadData();
        handleSnackEditSuccess();
      })
      .catch(error => {
        console.log(error.response.data.message);
        reloadData();
      })
      .finally(() => {});
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={8000}
        onClose={handleClose}
        message="Xoá thành công!"
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successConfirmDialogOpen}
        autoHideDuration={8000}
        onClose={handleConfirmClose}
        message="Xác nhận thành công!"
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={errorConfirmDialogOpen}
        autoHideDuration={8000}
        onClose={handleErrorConfirmClose}
        message={errorMessage}
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
          <DialogTitle>{advisory.name}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc muốn xóa lịch tư vấn này?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button onClick={handleDelete}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isConfirmDialogOpen}
          keepMounted
          onClose={handleCloseConfirmDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            {advisory.name} - {advisory.appointmentDateStr}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">Xác nhận lịch tư vấn này?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>Không</Button>
            <Button onClick={handleConfirm}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Modal
        open={isDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>
          <AdvisoryEditForm {...props} closeModal={handleCloseEditDialog} />
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
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenConfirmDialog}>
          <ListItemIcon>
            <Iconify icon="eva:checkmark-circle-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xác nhận" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={handleOpenEditDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:alert-circle-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Thông tin" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
