import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import { Alert, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

RateEditForm.propTypes = {
  rates: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
  hadlenCloseEdit: propTypes.func,
};

export default function RateEditForm(props) {
  const { rates, closeModal, reloadData, hadlenCloseEdit } = props;

  const formik = useFormik({
    initialValues: rates ?? {
      content: '',
      numberStar: '',
      error: null,
    },
    onSubmit: (values, formikHelpers) => {
      axios
        .put(`${process.env.REACT_APP_API_HOST}/rate/admin/${rates._id}`, values)
        .then(res => {
          closeModal();
          reloadData();
          hadlenCloseEdit();
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
            fullWidth
            type="text"
            label="Nội dung"
            {...getFieldProps('content')}
            error={Boolean(touched.content && errors.content)}
            helperText={touched.content && errors.name}
          />
          <TextField
            fullWidth
            type="text"
            label="Số sao"
            {...getFieldProps('numberStar')}
            error={Boolean(touched.numberStar && errors.numberStar)}
            helperText={touched.numberStar && errors.numberStar}
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
