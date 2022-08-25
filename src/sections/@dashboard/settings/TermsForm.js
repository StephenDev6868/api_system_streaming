import { DefaultEditor } from 'react-simple-wysiwyg';
import { useState } from 'react';
import propTypes from 'prop-types';
import { Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

TermsForm.propTypes = {
  content: propTypes.string,
  onFormSubmit: propTypes.func,
};

export function TermsForm(props) {
  const [html, setHtml] = useState(props.content ?? '');

  function onChange(e) {
    setHtml(e.target.value);
  }

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Điều khoản sử dụng
      </Typography>
      <DefaultEditor value={html} onChange={e => onChange(e)} />
      <LoadingButton
        sx={{ mt: 2 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={() => props.onFormSubmit(html)}
      >
        Lưu
      </LoadingButton>
    </>
  );
}
