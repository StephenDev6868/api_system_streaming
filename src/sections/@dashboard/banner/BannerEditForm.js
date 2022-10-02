import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';

const token = JSON.parse(localStorage.getItem('user'));

BannerEditForm.propTypes = {
  banner: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BannerEditForm(props) {
  const { banner, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const formik = useFormik({
    initialValues: banner ?? {
      imageUrl: '',
      link: '',
      enabled: true,
    },
    onSubmit: (values, formikHelpers) => {
      (banner != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/banner/{bid}?bid=${banner._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/banner`, values, {
            headers: {
              token: token.token,
            },
          })
      )
        .then(() => {
          closeModal();
          reloadData();
          handleSnackCreateSuccess();
          //   if (banner != null) {
          //     handleSnackUpdateSuccess();
          //   }
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

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
        setFieldValue('imageUrl', fullUrl);
        console.log(fileId);
      })
      .catch(error => {
        // setErrors({ error: error.response.data.message.join('ccc') });
        console.log(error);
      })
      .finally(() => setIsUploadingImage(false));
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid container spacing={4}>
            <Grid item md={4}>
              <img src={values.imageUrl} alt={values.imageUrl} style={{ maxWidth: '100%' }} />
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
            type="text"
            label="Liên kết"
            {...getFieldProps('link')}
            error={Boolean(touched.link && errors.link)}
            helperText={touched.link && errors.link}
          />

          <FormControlLabel
            control={<Checkbox {...getFieldProps('enabled')} checked={values.enabled} name="enabled" />}
            label="Hiện banner này"
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
