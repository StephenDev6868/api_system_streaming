import { Box, Button, Card, Container, Grid, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import propTypes from 'prop-types';
import Page from '../components/Page';
import AuthorEditForm from '../sections/@dashboard/authors/AuthorEditForm';
import FAQForm from '../sections/@dashboard/settings/FAQForm';
import { ContactForm } from '../sections/@dashboard/settings/ContactForm';
import { CommitmentForm } from '../sections/@dashboard/settings/CommitmentForm';
import { LegalForm } from '../sections/@dashboard/settings/LegalForms';
import { TermsForm } from '../sections/@dashboard/settings/TermsForm';
import { SEOForm } from '../sections/@dashboard/settings/SEOForm';
import { AboutUsForm } from '../sections/@dashboard/settings/AboutUsForm';
import { EmailTemplateForm } from '../sections/@dashboard/settings/EmailTemplateForm';

const token = JSON.parse(localStorage.getItem('user'));

const formBoxStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

Settings.propTypes = {
  showSnack: propTypes.func,
};

export default function Settings(props) {
  const [form, setForm] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [staticContent, setStaticContent] = useState([]);

  useEffect(() => {
    loadStaticContent();
  }, []);

  const loadStaticContent = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/content/list?page=1&pageSize=0`, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        setStaticContent(res.data.data.records);
      })
      .catch(err => console.log(err));
  };

  const saveStaticContent = (data, code) => {
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/content/${code}/update`,
        {
          content: {
            data,
          },
        },
        {
          headers: {
            token: token.token,
          },
        },
      )
      .then(res => {
        console.log(res);
        props.showSnack('success', 'Lưu thành công!');
      })
      .catch(err => {
        console.log(err);
        props.showSnack('error', 'Không thể lưu!');
      })
      .finally(() => setIsEditFormOpen(false));
  };

  const openForm = form => {
    setForm(form);
    setIsEditFormOpen(true);
  };

  const getFormContent = () => {
    let content;

    staticContent.forEach(c => {
      if (c.code === form) content = c.content.data;
    });

    if (form === 'faq') {
      return <FAQForm content={content} onFormSubmit={data => saveStaticContent(data, 'faq')} />;
    }
    if (form === 'terms') {
      return <TermsForm content={content} onFormSubmit={data => saveStaticContent(data, 'terms')} />;
    }
    if (form === 'legal') {
      return <LegalForm content={content} onFormSubmit={data => saveStaticContent(data, 'legal')} />;
    }
    if (form === 'commitment') {
      return <CommitmentForm content={content} onFormSubmit={data => saveStaticContent(data, 'commitment')} />;
    }
    if (form === 'contact') {
      return <ContactForm content={content} onFormSubmit={data => saveStaticContent(data, 'contact')} />;
    }
    if (form === 'seo') {
      return <SEOForm token={token.token} content={content} onFormSubmit={data => saveStaticContent(data, 'seo')} />;
    }
    if (form === 'about') {
      return (
        <AboutUsForm token={token.token} content={content} onFormSubmit={data => saveStaticContent(data, 'about')} />
      );
    }
    if (form === 'email') {
      return (
        <EmailTemplateForm
          token={token.token}
          content={content}
          onFormSubmit={data => saveStaticContent(data, 'email')}
        />
      );
    }

    return <p />;
  };

  return (
    <Page title="Cài đặt">
      <Modal
        open={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={formBoxStyle}>{getFormContent()}</Box>
      </Modal>
      <Container>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Cài đặt</Typography>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>SEO</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('seo')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Liên hệ</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('contact')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Cam kết</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('commitment')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Pháp lý</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('legal')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Câu hỏi thường gặp</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('faq')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Điều khoản sử dụng</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('terms')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Giới thiệu</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('about')}>
            Sửa
          </Button>
        </Box>
        <Box sx={{ pt: 3 }}>
          <p>Mẫu email</p>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => openForm('email')}>
            Sửa
          </Button>
        </Box>
      </Container>
    </Page>
  );
}
