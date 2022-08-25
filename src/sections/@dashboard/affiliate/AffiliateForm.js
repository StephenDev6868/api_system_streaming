import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import propTypes from 'prop-types';
import { Typography, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

AffiliateForm.propTypes = {
  affiliate: propTypes.object,
  reloadData: propTypes.func,
};

export function AffiliateForm(props) {
  const { affiliate } = props;
  const validation = Yup.object().shape({
    affiliate_percent: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
    affiliate_percent1: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
    affiliate_percent2: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
    affiliate_percent3: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
    affiliate_percent4: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
    affiliate_percent5: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(5, 'Giá trị tối thiểu là 5'),
  });
  const formik = useFormik({
    initialValues: affiliate ?? {
      affiliate_percent: 5,
      affiliate_percent1: 5,
      affiliate_percent2: 5,
      affiliate_percent3: 5,
      affiliate_percent4: 5,
      affiliate_percent5: 5,
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
          Cấu hình hoa hồng
        </Typography>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            type="number"
            label="Phần trăm - cấp 1"
            {...getFieldProps('affiliate_percent')}
            error={Boolean(touched.affiliate_percent && errors.affiliate_percent)}
            helperText={touched.affiliate_percent && errors.affiliate_percent}
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
            label="Phần trăm - cấp 2"
            {...getFieldProps('affiliate_percent1')}
            error={Boolean(touched.affiliate_percent1 && errors.affiliate_percent1)}
            helperText={touched.affiliate_percent1 && errors.affiliate_percent1}
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
            label="Phần trăm - cấp 3"
            {...getFieldProps('affiliate_percent2')}
            error={Boolean(touched.affiliate_percent2 && errors.affiliate_percent2)}
            helperText={touched.affiliate_percent2 && errors.affiliate_percent2}
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
            label="Phần trăm - cấp 4"
            {...getFieldProps('affiliate_percent3')}
            error={Boolean(touched.affiliate_percent3 && errors.affiliate_percent3)}
            helperText={touched.affiliate_percent3 && errors.affiliate_percent3}
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
            label="Phần trăm - cấp 5"
            {...getFieldProps('affiliate_percent4')}
            error={Boolean(touched.affiliate_percent4 && errors.affiliate_percent4)}
            helperText={touched.affiliate_percent4 && errors.affiliate_percent4}
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
            label="Phần trăm - cấp 6 trở lên"
            {...getFieldProps('affiliate_percent5')}
            error={Boolean(touched.affiliate_percent5 && errors.affiliate_percent5)}
            helperText={touched.affiliate_percent5 && errors.affiliate_percent5}
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
