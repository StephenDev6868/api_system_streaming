import { DefaultEditor } from 'react-simple-wysiwyg';
import { useState } from 'react';
import propTypes from 'prop-types';
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageUpload from '../../../components/ImageUpload';

AboutUsForm.propTypes = {
  token: propTypes.string,
  content: propTypes.object,
  onFormSubmit: propTypes.func,
};

export function AboutUsForm(props) {
  const [html, setHtml] = useState(props.content ? props.content.content : '');
  const [imageUrl, setImageUrl] = useState(props.content ? props.content.imageUrl : '');
  const [title, setTitle] = useState(props.content ? props.content.title : '');

  function onChange(e) {
    setHtml(e.target.value);
  }

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Giới thiệu
        </Typography>
        <ImageUpload
          token={props.token}
          preImage={imageUrl}
          onUploadComplete={url => {
            setImageUrl(url);
          }}
        />
        <TextField
          name="title"
          variant="outlined"
          fullWidth
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          label="Tiêu đề"
        />
        <DefaultEditor value={html} onChange={e => onChange(e)} />
      </Stack>
      <LoadingButton
        sx={{ mt: 2 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={() =>
          props.onFormSubmit({
            imageUrl,
            title,
            content: html,
          })
        }
      >
        Lưu
      </LoadingButton>
    </>
  );
}
