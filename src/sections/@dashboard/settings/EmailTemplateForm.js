import { DefaultEditor } from 'react-simple-wysiwyg';
import { useState } from 'react';
import propTypes from 'prop-types';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Divider } from '@material-ui/core';
import axios from 'axios';

EmailTemplateForm.propTypes = {
  token: propTypes.string,
  content: propTypes.object,
  onFormSubmit: propTypes.func,
};

export function EmailTemplateForm(props) {
  const [activateContent, setActivateContent] = useState(props.content ? props.content.activateContent : '');
  const [activateSubject, setActivateSubject] = useState(props.content ? props.content.activateSubject : '');
  const [forgotContent, setForgotContent] = useState(props.content ? props.content.forgotContent : '');
  const [forgotSubject, setForgotSubject] = useState(props.content ? props.content.forgotSubject : '');
  const [resendContent, setResendContent] = useState(props.content ? props.content.resendContent : '');
  const [resendSubject, setResendSubject] = useState(props.content ? props.content.resendSubject : '');
  const [testMailAddress, setTestMailAddress] = useState('');

  const sendTestMail = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/auth/test-mail`,
        {
          email: testMailAddress,
        },
        {
          headers: {
            token: props.token,
          },
        },
      )
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Mẫu Email
        </Typography>
        <Alert severity="info">
          Nội dung email phải đi kèm 2 biến:
          <br />
          %name%: Tên người nhận
          <br />
          %otp%: Mã OTP của người nhận
        </Alert>
        <Divider />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Kích hoạt tài khoản
        </Typography>
        <TextField
          name="activateSubject"
          variant="outlined"
          fullWidth
          type="text"
          value={activateSubject}
          onChange={e => {
            setActivateSubject(e.target.value);
          }}
          label="Tiêu đề"
        />
        <Typography variant="h7" sx={{ mb: 0 }}>
          Nội dung email
        </Typography>
        <DefaultEditor value={activateContent} onChange={e => setActivateContent(e.target.value)} />
        <Divider />
        <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
          Quên mật khẩu
        </Typography>
        <TextField
          name="forgotSubject"
          variant="outlined"
          fullWidth
          type="text"
          value={forgotSubject}
          onChange={e => {
            setForgotSubject(e.target.value);
          }}
          label="Tiêu đề"
        />
        <Typography variant="h7" sx={{ mb: 0 }}>
          Nội dung email
        </Typography>
        <DefaultEditor value={forgotContent} onChange={e => setForgotContent(e.target.value)} />
        <Divider />
        <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
          Gửi lại OTP
        </Typography>
        <TextField
          name="resendSubject"
          variant="outlined"
          fullWidth
          type="text"
          value={resendSubject}
          onChange={e => {
            setResendSubject(e.target.value);
          }}
          label="Tiêu đề"
        />
        <Typography variant="h7" sx={{ mb: 0 }}>
          Nội dung email
        </Typography>
        <DefaultEditor value={resendContent} onChange={e => setResendContent(e.target.value)} />
      </Stack>
      <LoadingButton
        sx={{ mt: 2, mb: 2 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={() =>
          props.onFormSubmit({
            activateSubject,
            activateContent,
            forgotSubject,
            forgotContent,
            resendSubject,
            resendContent,
          })
        }
      >
        Lưu
      </LoadingButton>
      <Divider />
      <TextField
        sx={{ mt: 2 }}
        name="title"
        variant="outlined"
        fullWidth
        type="email"
        value={testMailAddress}
        onChange={e => {
          setTestMailAddress(e.target.value);
        }}
        label="Địa chỉ email"
      />
      <LoadingButton
        sx={{ mt: 2 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={() => sendTestMail()}
      >
        Gửi test mail
      </LoadingButton>
    </>
  );
}
