import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import propTypes from 'prop-types';
import { Typography, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

SettingForm.propTypes = {
  setting: propTypes.object,
};

export default function SettingForm(props) {
  const { setting } = props;
  const validation = Yup.object().shape({
    bcoin: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
  });
  const formik = useFormik({
    initialValues: setting ?? {
      bcoin: 5,
    },
    validationSchema: validation,
    onSubmit: values => {
      props.onFormSubmit({ ...values });
    },
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cấu hình chi phí bcoin
        </Typography>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            type="number"
            label="Chi phí"
            {...getFieldProps('bcoin')}
            error={Boolean(touched.bcoin && errors.bcoin)}
            helperText={touched.bcoin && errors.bcoin}
            onKeyDown={e => {
              if (e.key === '-') {
                e.preventDefault();
              }
            }}
          />
        </Stack>
        <LoadingButton sx={{ mt: 3 }} fullWidth size="large" type="submit" variant="contained" onClick={() => {}}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
