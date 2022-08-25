import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { Alert, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import * as Yup from 'yup';

AuthorEditForm.propTypes = {
  author: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function AuthorEditForm(props) {
  const { author, closeModal, reloadData, handleSnackCreateSuccess } = props;
  const AuthorFormValidation = Yup.object().shape({
    name: Yup.string()
      .required('Tên không được để trống')
      .min(2, 'Tên tối thiểu 2 ký tự')
      .max(255, 'Tên tối đa 255 ký tự'),
  });
  const formik = useFormik({
    initialValues: author ?? {
      name: '',
      description: '',
      error: null,
    },
    validationSchema: AuthorFormValidation,
    onSubmit: (values, formikHelpers) => {
      (author != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/author/${author._id}`, values)
        : axios.post(`${process.env.REACT_APP_API_HOST}/author`, values)
      )
        .then(() => {
          closeModal();
          reloadData();
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

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            type="text"
            label="Tên tác giả"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            multiline
            maxRows={10}
            fullWidth
            type="text"
            label="Mô tả"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
          {errors.error != null && <Alert severity="error">{errors.error}</Alert>}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Lưu
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
