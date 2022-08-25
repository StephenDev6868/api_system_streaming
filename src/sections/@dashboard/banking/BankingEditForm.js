import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Alert, Checkbox, FormControlLabel, FormHelperText, Stack, TextField, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import ImageUpload from '../../../components/ImageUpload';

const token = JSON.parse(localStorage.getItem('user'));

BankingEditForm.propTypes = {
  banking: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function BankingEditForm(props) {
  const { banking, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const validation = Yup.object().shape({
    bank_name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    owner_name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    bank_account: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    icon_url: Yup.string().required('Vui lòng tải lên icon'),
  });
  const formik = useFormik({
    initialValues: banking ?? {
      bank_name: '',
      icon_url: '',
      owner_name: '',
      bank_account: '',
      activate: true,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (banking != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/banking/${banking._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/banking`, values, {
            headers: {
              token: token.token,
            },
          })
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

  const removeImage = () => {
    setFieldValue('icon_url', '');
  };

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {values.icon_url ? (
            <Grid key={new Date().toString()} item md={4}>
              <ImageUpload
                preImage={values.icon_url}
                onUploadComplete={url => {
                  removeImage();
                }}
              />
            </Grid>
          ) : null}
          <Grid item md={4}>
            <ImageUpload
              showSnack={props.showSnack}
              token={token.token}
              onUploadComplete={url => setFieldValue('icon_url', url)}
              preImage="ignore"
              visible={!values.icon_url}
            />
            {errors.icon_url ? <FormHelperText error>{errors.icon_url}</FormHelperText> : null}
          </Grid>
          <Grid item md={12}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                type="text"
                label="Tên ngân hàng"
                {...getFieldProps('bank_name')}
                error={Boolean(touched.bank_name && errors.bank_name)}
                helperText={touched.bank_name && errors.bank_name}
              />
              <TextField
                required
                fullWidth
                type="text"
                label="Chủ tài khoản"
                {...getFieldProps('owner_name')}
                error={Boolean(touched.owner_name && errors.owner_name)}
                helperText={touched.owner_name && errors.owner_name}
              />
              <TextField
                required
                fullWidth
                type="text"
                label="Số tài khoản"
                {...getFieldProps('bank_account')}
                error={Boolean(touched.bank_account && errors.bank_account)}
                helperText={touched.bank_account && errors.bank_account}
              />
              <FormControlLabel
                control={<Checkbox {...getFieldProps('activate')} checked={values.activate} name="activate" />}
                label="Hoạt động"
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
