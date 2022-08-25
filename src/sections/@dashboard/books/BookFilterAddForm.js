import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Alert, Checkbox, FormControlLabel, Stack, TextField, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

BookFilterEditForm.propTypes = {
  closeModal: propTypes.func,
  reloadFilters: propTypes.func,
};

export default function BookFilterEditForm(props) {
  const { closeModal, reloadFilters } = props;
  const validation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    description: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      order: 0,
      isActivate: true,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      axios
        .post(`${process.env.REACT_APP_API_HOST}/filter-product`, values, {
          headers: {
            token: token.token,
          },
        })
        .then(() => {
          closeModal();
          reloadFilters();
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });
  const { errors, values, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid item md={12}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                type="text"
                label="Tên bộ lọc"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                required
                fullWidth
                type="text"
                label="Mô tả"
                {...getFieldProps('description')}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
              />
              <TextField
                required
                fullWidth
                type="text"
                label="Vị trí"
                {...getFieldProps('order')}
                error={Boolean(touched.order && errors.order)}
                helperText={touched.order && errors.order}
              />
              <FormControlLabel
                control={<Checkbox {...getFieldProps('isActivate')} checked={values.isActivate} name="isActivate" />}
                label="Hiển thị"
              />
            </Stack>
          </Grid>
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
