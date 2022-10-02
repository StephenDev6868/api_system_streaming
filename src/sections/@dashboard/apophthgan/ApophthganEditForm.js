import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Alert,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import ImageUpload from '../../../components/ImageUpload';

const token = JSON.parse(localStorage.getItem('user'));

ApophthganEditForm.propTypes = {
  apophthgan: propTypes.object,
  moods: propTypes.array,
  reasons: propTypes.array,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function ApophthganEditForm(props) {
  const { apophthgan, moods, reasons, closeModal, reloadData, handleSnackCreateSuccess } = props;
  const validation = Yup.object().shape({
    title: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    reason: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    mood: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    pathImage: Yup.string().required('Vui lòng tải lên ảnh mô tả'),
  });
  const formik = useFormik({
    initialValues: {
      ...apophthgan,
      mood: apophthgan ? apophthgan.mood._id : '',
      reason: apophthgan ? apophthgan.reason._id : '',
      isActivate: apophthgan ? apophthgan.isActivate : true
    } ?? {
      title: '',
      pathImage: '',
      reason: '',
      mood: '',
      isActivate: true,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (apophthgan != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/apophthgan/admin/${apophthgan._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/apophthgan/admin/create`, values, {
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
              />
              {touched.title && errors.title ? <FormHelperText error>{errors.title}</FormHelperText> : null}
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Tâm trạng</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.mood}
                  label="Tâm trạng"
                  onChange={(e, v) => {
                    setFieldValue('mood', e.target.value);
                  }}
                  error={Boolean(touched.mood && errors.mood)}
                >
                  {moods.map((v, i) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.mood && errors.mood ? <FormHelperText error>{errors.mood}</FormHelperText> : null}
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Căn nguyên</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.reason}
                  label="Căn nguyên"
                  onChange={(e, v) => {
                    setFieldValue('reason', e.target.value);
                  }}
                  error={Boolean(touched.reason && errors.reason)}
                >
                  {reasons.map((v, i) => (
                    <MenuItem key={v._id} value={v._id}>
                      {v.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.reason && errors.reason ? <FormHelperText error>{errors.reason}</FormHelperText> : null}
              </FormControl>
              <FormControlLabel
                control={<Checkbox {...getFieldProps('isActivate')} checked={values.isActivate} name="isActivate" />}
                label="Hiện danh ngôn này"
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
