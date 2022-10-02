import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Alert, Stack, TextField, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

AppellationEditForm.propTypes = {
  appellation: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function AppellationEditForm(props) {
  const { appellation, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const validation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    description: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    bookRequired: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    giftPerBook: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    bcoinOfLevel: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
  });
  const formik = useFormik({
    initialValues: appellation ?? {
      name: '',
      description: '',
      bookRequired: 0,
      giftPerBook: 0,
      bcoinOfLevel: 0,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (appellation != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/appellation/${appellation._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/appellation`, values, {
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

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

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
                label="Tên"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField required fullWidth type="text" label="Mô tả" {...getFieldProps('description')} />
              <TextField
                required
                fullWidth
                type="number"
                label="Số sách"
                {...getFieldProps('bookRequired')}
                error={Boolean(touched.bookRequired && errors.bookRequired)}
                helperText={touched.bookRequired && errors.bookRequired}
                onKeyDown={e => {
                  if (e.key === '-') {
                    e.preventDefault();
                  }
                }}
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Bcoin/sách"
                {...getFieldProps('giftPerBook')}
                error={Boolean(touched.giftPerBook && errors.giftPerBook)}
                helperText={touched.giftPerBook && errors.giftPerBook}
                InputProps={{
                  endAdornment: 'bcoin',
                }}
                onKeyDown={e => {
                  if (e.key === '-') {
                    e.preventDefault();
                  }
                }}
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Bcoin lên level"
                {...getFieldProps('bcoinOfLevel')}
                error={Boolean(touched.bcoinOfLevel && errors.bcoinOfLevel)}
                helperText={touched.bcoinOfLevel && errors.bcoinOfLevel}
                InputProps={{
                  endAdornment: 'bcoin',
                }}
                onKeyDown={e => {
                  if (e.key === '-') {
                    e.preventDefault();
                  }
                }}
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
