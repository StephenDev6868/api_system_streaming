import { Form, FormikProvider, useFormik } from 'formik';
import { Stack, TextField, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

AdvisoryEditForm.propTypes = {
  issueType: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function AdvisoryEditForm(props) {
  const { advisory, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const formik = useFormik({
    initialValues: advisory ?? {
      name: '',
    },
    onSubmit: (values, formikHelpers) => {
      closeModal();
    },
  });

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid item md={12}>
            <Stack spacing={3}>
              <TextField fullWidth disabled type="text" label="Họ và tên" {...getFieldProps('name')} />
              <TextField fullWidth disabled type="text" label="Vấn đề" {...getFieldProps('issueType.name')} />
              <TextField fullWidth disabled type="text" label="Ngày hẹn" {...getFieldProps('appointmentDate')} />
              <TextField fullWidth disabled type="text" label="Liên hệ" {...getFieldProps('contact')} />
              <TextField fullWidth disabled type="text" label="Người yêu cầu" {...getFieldProps('requester.name')} />
              <TextField multiline fullWidth disabled type="text" label="Nội dung" {...getFieldProps('content')} />
            </Stack>
          </Grid>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Đóng
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
