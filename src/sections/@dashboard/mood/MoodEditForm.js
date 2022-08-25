import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Alert,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import ImageUpload from '../../../components/ImageUpload';

const token = JSON.parse(localStorage.getItem('user'));

MoodEditForm.propTypes = {
  mood: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function MoodEditForm(props) {
  const { mood, closeModal, reloadData, handleSnackCreateSuccess, handleSnackUpdateSuccess } = props;
  const validation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    type: Yup.string().required('Vui lòng chọn loại'),
    iconPath: Yup.string().required('Vui lòng tải lên icon'),
  });
  const formik = useFormik({
    initialValues: mood ?? {
      name: '',
      iconPath: '',
      type: 'MOOD',
      isActivated: false,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (mood != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/mood/${mood._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/mood/create`, values, {
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
    setFieldValue('iconPath', '');
  };

  const { errors, values, touched, setErrors, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {values.iconPath ? (
            <Grid key={new Date().toString()} item md={4}>
              <ImageUpload
                preImage={values.iconPath}
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
              onUploadComplete={url => setFieldValue('iconPath', url)}
              preImage="ignore"
              visible={!values.iconPath}
            />
            {errors.iconPath ? <FormHelperText error>{errors.iconPath}</FormHelperText> : null}
          </Grid>
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
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Loại</InputLabel>
                <Select
                  required
                  disabled={mood != null}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.type}
                  label="Loại"
                  onChange={(e, v) => {
                    setFieldValue('type', e.target.value);
                  }}
                  error={Boolean(touched.type && errors.type)}
                >
                  <MenuItem key="MOOD" value="MOOD">
                    Tâm trạng
                  </MenuItem>
                  <MenuItem key="REASON" value="REASON">
                    Căn nguyên
                  </MenuItem>
                </Select>
                {touched.type && errors.type ? <FormHelperText error>{errors.type}</FormHelperText> : null}
              </FormControl>
              <FormControlLabel
                control={<Checkbox {...getFieldProps('isActivated')} checked={values.isActivated} name="isActivated" />}
                label="Hiện danh mục này"
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
