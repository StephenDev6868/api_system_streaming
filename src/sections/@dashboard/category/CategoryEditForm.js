import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  FormHelperText,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';

const token = JSON.parse(localStorage.getItem('user'));

CategoryEditForm.propTypes = {
  categoryId: propTypes.array,
  category: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
};

export default function CategoryEditForm(props) {
  const { category, categoryId, closeModal, reloadData } = props;
  const validation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    order: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
  });
  const formik = useFormik({
    initialValues: category ?? {
      name: '',
      description: '',
      order: 0,
      parent: null,
      row: null,
      enabled: true,
    },
    validationSchema: validation,
    onSubmit: (values, formikHelpers) => {
      (category != null
        ? axios.post(`${process.env.REACT_APP_API_HOST}/category/admin/update/${category._id}`, values, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/category/admin/create`, values, {
            headers: {
              token: token.token,
            },
          })
      )
        .then(() => {
          closeModal();
          reloadData();
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
            required
            type="text"
            label="Tên"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
          />
          {touched.name && errors.name ? <FormHelperText error>{errors.name}</FormHelperText> : null}
          <TextField
            fullWidth
            type="text"
            label="Mô tả"
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Danh mục cha</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={values.parent}
              label="Danh mục cha"
              onChange={(e, v) => {
                setFieldValue('parent', e.target.value);
              }}
              error={Boolean(touched.parent && errors.parent)}
            >
              {categoryId.map((v, i) =>
                v.parent == null ? (
                  <MenuItem key={v._id} value={v._id}>
                    {v.name}
                  </MenuItem>
                ) : null,
              )}
            </Select>
            {touched.parent && errors.parent ? <FormHelperText error>{errors.parent}</FormHelperText> : null}
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label="Hàng"
            {...getFieldProps('row')}
            error={Boolean(touched.row && errors.row)}
            helperText={touched.row && errors.row}
            onKeyDown={e => {
              if (e.key === '-') {
                e.preventDefault();
              }
            }}
          />
          <TextField
            fullWidth
            type="number"
            required
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
          {touched.order && errors.order ? <FormHelperText error>{errors.order}</FormHelperText> : null}
          <FormControlLabel
            control={<Checkbox {...getFieldProps('enabled')} checked={values.enabled} name="enabled" />}
            label="Hiện danh mục này"
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
