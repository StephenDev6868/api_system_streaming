import { DefaultEditor } from 'react-simple-wysiwyg';
import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import propTypes from 'prop-types';
import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';

ContactForm.propTypes = {
  content: propTypes.object,
  onFormSubmit: propTypes.func,
};

export function ContactForm(props) {
  const [addresses, setAddresses] = useState(props.content ? props.content.addresses : []);

  const formik = useFormik({
    initialValues: props.content ?? {
      phone: '',
      email: '',
      website: '',
      fanpage: '',
      addresses: [],
    },
    onSubmit: values => {
      props.onFormSubmit({ ...values, addresses });
    },
  });

  const { handleSubmit, getFieldProps, touched, errors } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Thông tin liên hệ
        </Typography>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            type="text"
            label="Số điện thoại"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />
          <TextField
            required
            fullWidth
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Website"
            {...getFieldProps('website')}
            error={Boolean(touched.website && errors.website)}
            helperText={touched.website && errors.website}
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Fanpage"
            {...getFieldProps('fanpage')}
            error={Boolean(touched.fanpage && errors.fanpage)}
            helperText={touched.fanpage && errors.fanpage}
          />
          {addresses.map((v, i) => (
            <Card variant="outlined" sx={{ padding: '16px', mt: 2 }} key={i.toString()}>
              <Stack spacing={2}>
                <TextField
                  name={`question-${i}`}
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={v.location}
                  onChange={e => {
                    addresses[i].location = e.target.value;
                    setAddresses([...addresses]);
                  }}
                  label="Địa chỉ"
                />
                <p>{v.src}</p>
                <Button
                  variant="outlined"
                  component="span"
                  onClick={() => {
                    const newAddresses = addresses.filter((v, index) => i !== index);
                    setAddresses([...newAddresses]);
                  }}
                  color="error"
                >
                  Xóa
                </Button>
              </Stack>
            </Card>
          ))}
          <Button
            sx={{ mt: 1, mb: 2 }}
            variant="outlined"
            component="span"
            onClick={() => {
              setAddresses([...addresses, { location: '' }]);
            }}
          >
            Thêm địa chỉ
          </Button>
        </Stack>
        <LoadingButton sx={{ mt: 3 }} fullWidth size="large" type="submit" variant="contained" onClick={() => {}}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
