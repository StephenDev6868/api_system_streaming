import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
  Box,
  Stack,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  Snackbar,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// component
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import axios from 'axios';
import propTypes from 'prop-types';
import Iconify from '../../../components/Iconify';
import RateEditForm from './RateEditForm';

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

RatesMoreMenu.propTypes = {
  rates: propTypes.object,
  reloadData: propTypes.func,
};

export default function RatesMoreMenu(props) {
  const { rates, reloadData } = props;
  const ref = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
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

  const handleOpenAcceptDialog = () => {
    setIsMenuOpen(false);
    setIsAcceptDialogOpen(true);
  };

  const handleCloseAcceptDialog = () => {
    setIsMenuOpen(false);
    setIsAcceptDialogOpen(false);
  };

  // ============== Snackbar Delete ==============
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
  // ============== Snackbar Accept ==============
  const [AcceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const handleCloseAccept = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAcceptDialogOpen(false);
  };

  const handleSnackAcceptSuccess = () => {
    setAcceptDialogOpen(true);
  };

  // ============== Snackbar Edit ==============
  const [EditDialogOpen, setEditDialogOpen] = useState(false);

  const handleCloseEdit = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setEditDialogOpen(false);
  };

  const handleSnackUpdateSuccess = () => {
    setEditDialogOpen(true);
  };

  // ==================================================

  const handleAccepted = () => {
    axios
      .put(`${process.env.REACT_APP_API_HOST}/rate/admin-accept/${rates._id}`)
      .then(() => {
        handleCloseAcceptDialog();
        handleSnackAcceptSuccess();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        reloadData();
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_HOST}/rate/admin/${rates._id}`)
      .then(() => {
        handleCloseDeleteDialog();
        handleSnackEditSuccess();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        reloadData();
      });
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
        message="Sửa thành công!"

        // action={action}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={successDialogOpen}
        autoHideDuration={4500}
        onClose={handleClose}
        message="Xoá thành công!"

        // action={action}
      />

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={AcceptDialogOpen}
        autoHideDuration={4500}
        onClose={handleCloseAccept}
        message="Kiểm duyệt thành công!"

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
          <DialogTitle>{rates.content}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc muốn xóa đánh giá này?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Không</Button>
            <Button onClick={handleDelete}>Đồng ý</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={isAcceptDialogOpen}
          keepMounted
          onClose={handleCloseAcceptDialog}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{rates.content}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc muốn duyệt đánh giá này?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAcceptDialogOpen(false)}>Không</Button>
            <Button onClick={handleAccepted}>Đồng ý</Button>
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
          <RateEditForm closeModal={handleCloseEditDialog} hadlenCloseEdit={handleSnackUpdateSuccess} {...props} />
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
        <MenuItem onClick={handleOpenAcceptDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="healthicons:i-documents-accepted" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Duyệt" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={handleOpenEditDialog} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}
