import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { Alert, Checkbox, FormControlLabel, FormHelperText, Stack, TextField, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import ImageUpload from '../../../components/ImageUpload';

const token = JSON.parse(localStorage.getItem('user'));

IntroEditForm.propTypes = {
  intro: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function IntroEditForm(props) {
  const { intro, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const validation = Yup.object().shape({
    title: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    content: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(500, 'Vui lòng nhập ít hơn 500 ký tự'),
    order: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    pathImage: Yup.string().required('Vui lòng tải lên icon'),
  });
  const formik = useFormik({
    initialValues: intro ?? {
      title: '',
      pathImage: '',
      content: '',
      order: 1,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (intro != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/intro/${intro._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/intro/create`, values, {
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
    setFieldValue('pathImage', '');
  };

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {values.pathImage ? (
            <Grid key={new Date().toString()} item md={4}>
              <ImageUpload
                preImage={values.pathImage}
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
              onUploadComplete={url => setFieldValue('pathImage', url)}
              preImage="ignore"
              visible={!values.pathImage}
            />
            {errors.pathImage ? <FormHelperText error>{errors.pathImage}</FormHelperText> : null}
          </Grid>
          <Grid item md={12}>
            <Stack spacing={3}>
              <TextField
                required
                fullWidth
                type="text"
                label="Tiêu đề"
                {...getFieldProps('title')}
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
              <TextField
                required
                multiline
                fullWidth
                type="text"
                label="Nội dung"
                {...getFieldProps('content')}
                error={Boolean(touched.content && errors.content)}
                helperText={touched.content && errors.content}
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Vị trí"
                {...getFieldProps('order')}
                error={Boolean(touched.order && errors.order)}
                helperText={touched.order && errors.order}
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
