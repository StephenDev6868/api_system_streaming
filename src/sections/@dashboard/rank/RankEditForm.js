import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Alert, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

RankEditForm.propTypes = {
  rank: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function RankEditForm(props) {
  const { rank, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const formValidation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    description: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    bcoin: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    book_for_free: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    level: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(1, 'Giá trị tối thiểu là 1'),
  });
  const formik = useFormik({
    initialValues: rank ?? {
      name: '',
      description: '',
      bcoin: '',
      book_for_free: 0,
      level: 1,
      activated: false,
    },
    validationSchema: formValidation,
    onSubmit: (values, formikHelpers) => {
      (rank != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/membership/${rank._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/membership`, values, {
            headers: {
              token: token.token,
            },
          })
      )
        .then(() => {
          closeModal();
          reloadData();
          handleSnackCreateSuccess();
          // if (rank != null) {
          //   return handleSnackUpdateSuccess();
          // }
          // return handleSnackCreateSuccess();
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
            label="Tên hạng"
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
            type="number"
            label="Số Bcoin"
            {...getFieldProps('bcoin')}
            error={Boolean(touched.bcoin && errors.bcoin)}
            helperText={touched.bcoin && errors.bcoin}
          />
          <TextField
            required
            fullWidth
            type="number"
            label="Số sách được mua"
            {...getFieldProps('book_for_free')}
            error={Boolean(touched.book_for_free && errors.book_for_free)}
            helperText={touched.book_for_free && errors.book_for_free}
          />
          <TextField
            required
            fullWidth
            type="number"
            label="Cấp độ"
            {...getFieldProps('level')}
            error={Boolean(touched.level && errors.level)}
            helperText={touched.level && errors.level}
          />
          <FormControlLabel
            control={<Checkbox {...getFieldProps('activated')} checked={values.activated} name="activated" />}
            label="Kích hoạt hạng này"
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
