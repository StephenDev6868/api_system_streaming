import { DefaultEditor } from 'react-simple-wysiwyg';
import { useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import propTypes from 'prop-types';
import { Button, Card, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as Yup from 'yup';
import { values } from 'lodash';
import ImageUpload from '../../../components/ImageUpload';

SEOForm.propTypes = {
  content: propTypes.object,
  onFormSubmit: propTypes.func,
  token: propTypes.string,
};

export function SEOForm(props) {
  const formik = useFormik({
    initialValues: props.content ?? {
      title: '',
      favicon: '',
      canonical: '',
      meta_description: '',
      og_image: '',
      logo: '',
      header: '',
      footer: '',
    },
    onSubmit: values => {
      props.onFormSubmit(values);
    },
  });

  const { handleSubmit, getFieldProps, touched, errors, values, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cài đặt SEO
        </Typography>
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
          <Typography variant="p">Favicon</Typography>
          <ImageUpload
            preImage={values.favicon}
            onUploadComplete={url => setFieldValue('favicon', url)}
            token={props.token}
          />

          <Typography variant="p">Logo</Typography>
          <ImageUpload
            preImage={values.logo}
            onUploadComplete={url => setFieldValue('logo', url)}
            token={props.token}
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Đường dẫn canonical"
            {...getFieldProps('canonical')}
            error={Boolean(touched.canonical && errors.canonical)}
            helperText={touched.canonical && errors.canonical}
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Thẻ meta description"
            {...getFieldProps('meta_description')}
            error={Boolean(touched.meta_description && errors.meta_description)}
            helperText={touched.meta_description && errors.meta_description}
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Thẻ OG image"
            {...getFieldProps('og_image')}
            error={Boolean(touched.og_image && errors.og_image)}
            helperText={touched.og_image && errors.og_image}
          />
          <Typography variant="p">Header</Typography>
          <DefaultEditor
            id="seo-header"
            value={values.header}
            onChange={e => setFieldValue('header', e.target.value)}
          />
          <Typography variant="p">Footer</Typography>
          <DefaultEditor
            id="seo-footer"
            value={values.footer}
            onChange={e => setFieldValue('footer', e.target.value)}
          />
        </Stack>
        <LoadingButton sx={{ mt: 3 }} fullWidth size="large" type="submit" variant="contained" onClick={() => {}}>
          Lưu
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
