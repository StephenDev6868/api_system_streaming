import { FormikProvider, useFormik, Form } from 'formik';
import propTypes from 'prop-types';
import { Box, Button, Card, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

FAQForm.propTypes = {
  content: propTypes.array,
  onFormSubmit: propTypes.func,
};

export default function FAQForm(props) {
  const [faqs, setFaqs] = useState(props.content ?? []);

  return (
    <>
      <Typography variant="h5">Câu hỏi thường gặp</Typography>
      {faqs.map((v, i) => (
        <Card variant="outlined" sx={{ padding: '16px', mt: 2 }} key={i.toString()}>
          <Stack spacing={2}>
            <TextField
              name={`question-${i}`}
              variant="outlined"
              fullWidth
              type="text"
              value={v.q}
              onChange={e => {
                faqs[i].q = e.target.value;
                setFaqs([...faqs]);
              }}
              label="Câu hỏi"
            />
            <TextField
              name={`answer-${i}`}
              variant="outlined"
              fullWidth
              type="text"
              value={v.a}
              onChange={e => {
                faqs[i].a = e.target.value;
                setFaqs([...faqs]);
              }}
              label="Trả lời"
            />
            <p>{v.src}</p>
            <Button
              variant="outlined"
              component="span"
              onClick={() => {
                const newFaqs = faqs.filter((v, index) => i !== index);
                setFaqs([...newFaqs]);
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
          setFaqs([...faqs, { q: '', a: '' }]);
        }}
      >
        Thêm câu hỏi
      </Button>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => props.onFormSubmit(faqs)}>
        Lưu
      </LoadingButton>
    </>
  );
}
