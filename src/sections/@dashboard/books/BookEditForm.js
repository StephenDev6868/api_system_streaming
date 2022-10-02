import { Form, FormikProvider, useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Autocomplete,
  Modal,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import propTypes from 'prop-types';
import { useState } from 'react';
import ImageUpload from '../../../components/ImageUpload';
import Iconify from '../../../components/Iconify';
import AuthorAddForm from './AuthorAddForm';
import CategoryAddForm from './CategoryAddForm';
import BookFilterAddForm from './BookFilterAddForm';

const token = JSON.parse(localStorage.getItem('user'));

BookEditForm.propTypes = {
  authors: propTypes.array,
  filters: propTypes.array,
  categories: propTypes.array,
  reasons: propTypes.array,
  moods: propTypes.array,
  book: propTypes.object,
  closeModal: propTypes.func,
  reloadData: propTypes.func,
  reloadAuthors: propTypes.func,
  reloadCategories: propTypes.func,
  reloadFilters: propTypes.func,
  showSnack: propTypes.func,
};

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

export default function BookEditForm(props) {
  const {
    authors,
    filters,
    categories,
    moods,
    reasons,
    book,
    closeModal,
    reloadData,
    reloadAuthors,
    reloadCategories,
    reloadFilters,
  } = props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingPDFFiles, setIsUploadingPDFFiles] = useState(false);
  const BookFormValidation = Yup.object().shape({
    name: Yup.string()
      .required('Vui lòng nhập đầy đủ thông tin trường')
      .min(2, 'Vui lòng nhập tối thiểu 2 ký tự')
      .max(200, 'Vui lòng nhập ít hơn 200 ký tự'),
    category: Yup.string().required('Vui lòng chọn danh mục'),
    authorId: Yup.string().required('Vui lòng chọn tác giả'),
    publishingYear: Yup.number().max(new Date().getFullYear(), 'Năm phát hành phải nhỏ hơn hoặc bằng năm hiện tại'),
    price: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    prePrice: Yup.number().min(0, 'Vui lòng nhập giá trị lớn hơn 0'),
    numberOfPage: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    description: Yup.string().required('Vui lòng nhập đầy đủ thông tin trường'),
    amount: Yup.number().required('Vui lòng nhập đầy đủ thông tin trường').min(0, 'Giá trị tối thiểu là 0'),
    images: Yup.array().min(1, 'Vui lòng tải lên tối thiểu 1 ảnh minh họa'),
    file: Yup.array().min(1, 'Vui lòng tải lên tối thiểu 1 tệp pdf'),
  });
  const formik = useFormik({
    initialValues: book
      ? { ...book, authorId: book.author._id }
      : {
          name: '',
          category: '',
          authorId: '',
          mood: '',
          reasion: '',
          translator: '',
          publishingYear: '',
          type: 'PAPER_BOOK',
          image: '',
          price: 0,
          prePrice: 0,
          numberOfPage: 0,
          language: '',
          images: [],
          voice: [],
          file: [],
          filter: [],
          video: {},
          description: '',
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          amount: 1,
          available: false,
          error: '',
        },
    validationSchema: BookFormValidation,
    onSubmit: (values, formikHelpers) => {
      const data = { ...values, author: values.authorId };
      (book != null
        ? axios.put(`${process.env.REACT_APP_API_HOST}/product/${book._id}`, data, {
            headers: {
              token: token.token,
            },
          })
        : axios.post(`${process.env.REACT_APP_API_HOST}/product`, data, {
            headers: {
              token: token.token,
            },
          })
      )
        .then(() => {
          closeModal();
          reloadData();
          props.showSnack('success', 'Thành công!');
        })
        .catch(error => {
          formikHelpers.setErrors({ error: error.response.data.message });
        })
        .finally(() => {
          formikHelpers.setSubmitting(false);
        });
    },
  });

  const { errors, values, touched, isSubmitting, handleSubmit, validateForm, getFieldProps, setFieldValue } = formik;

  const handleUploadAudio = (event, index) => {
    setIsUploadingAudio(true);
    const f = event.target.files[0];
    const fData = new FormData();
    fData.append('file', f, f.name);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/upload/audio`, fData, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        const { filename, duration } = res.data.data;
        const audios = values.voice;
        audios[index].src = filename;
        audios[index].duration = duration;
        setFieldValue('voice', audios);
        props.showSnack('success', 'Tải lên thành công!');
      })
      .catch(error => {
        props.showSnack('error', 'Lỗi khi tải lên!');
      })
      .finally(() => setIsUploadingAudio(false));
  };

  const handleUploadPDF = (event, index) => {
    setIsUploadingPDFFiles(true);
    const f = event.target.files[0];
    const fData = new FormData();
    fData.append('file', f, f.name);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/upload/pdf`, fData, {
        headers: {
          token: token.token,
        },
      })
      .then(res => {
        const { filename, key } = res.data.data;
        const pdfFiles = values.file;
        pdfFiles[index].src = filename;
        pdfFiles[index].key = key;
        setFieldValue('file', pdfFiles);
        props.showSnack('success', 'Tải lên thành công!');
      })
      .catch(error => {
        props.showSnack('error', 'Lỗi khi tải lên!');
      })
      .finally(() => setIsUploadingPDFFiles(false));
  };

  const deleteAudioFile = index => {
    const newAudios = values.voice.filter((v, i) => i !== index);
    setFieldValue('voice', newAudios);
  };

  const addAudioFile = () => {
    let max = 0;
    values.voice.forEach((a, i, x) => {
      if (a.index > max) {
        max = a.index;
      }
    });
    setFieldValue('voice', [...values.voice, { name: '', description: '', index: max + 1 }]);
  };

  const updateAudioFileInfo = (pos, name, description, index) => {
    const audios = values.voice;
    if (name != null) audios[pos].name = name;
    if (description != null) audios[pos].description = description;
    if (index != null) audios[pos].index = index;
    setFieldValue('voice', audios);
  };

  const addPDFFile = () => {
    setFieldValue('file', [...values.file, { name: '' }]);
  };

  const deletePDFFile = index => {
    const newPDFFiles = values.file.filter((v, i) => i !== index);
    setFieldValue('file', [...newPDFFiles]);
  };

  const updatePDFFileInfo = (pos, name) => {
    const pdfFiles = values.file;
    if (name != null) pdfFiles[pos].name = name;
    setFieldValue('file', [...pdfFiles]);
  };

  const removeImage = i => {
    const newImages = values.images.filter((img, ind) => {
      console.log('test', ind, i);
      return ind !== i;
    });
    setFieldValue('images', newImages);
  };

  const getOpObj = option => {
    if (!option._id) option = categories.find(op => op._id === option);
    return option;
  };

  const getAuthor = option => {
    if (!option._id) option = authors.find(op => op._id === option);
    return option;
  };

  const getFilter = option => {
    if (option !== undefined && !option._id) option = filters.find(op => op._id === option);
    return option;
  };

  const setFilterValue = value => {
    const vs = [];
    value.forEach(v => {
      if (typeof v === 'object') vs.push(v._id);
      else vs.push(v);
    });
    setFieldValue('filter', vs);
  };
  const getFormContent = () => {
    if (form === 'author') return <AuthorAddForm reloadAuthors={reloadAuthors} closeModal={handleCloseDialog} />;
    if (form === 'category')
      return (
        <CategoryAddForm reloadCategories={reloadCategories} categories={categories} closeModal={handleCloseDialog} />
      );
    if (form === 'filter') return <BookFilterAddForm reloadFilters={reloadFilters} closeModal={handleCloseDialog} />;
  };
  const handleOpenDialog = f => {
    setForm(f);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ overflow: 'scroll', marginTop: '20px' }}
      >
        <Box sx={style}>{getFormContent()}</Box>
      </Modal>
      <FormikProvider value={formik}>
        <Form
          autoComplete="off"
          noValidate
          onSubmit={async e => {
            e.preventDefault();
            if (Object.keys(await validateForm(values)).length !== 0) {
              props.showSnack('error', 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại!');
            }
            handleSubmit(e);
          }}
        >
          <Stack spacing={3}>
            <Grid container spacing={5}>
              {values.images.map((v, i) => (
                <Grid key={i.toString() + new Date().toString()} item md={4}>
                  <ImageUpload
                    preImage={v}
                    onUploadComplete={url => {
                      removeImage(i);
                    }}
                  />
                </Grid>
              ))}
              <Grid item md={4}>
                <ImageUpload
                  showSnack={props.showSnack}
                  token={token.token}
                  onUploadComplete={url => setFieldValue('images', [...values.images, url])}
                  preImage="ignore"
                  visible={values.images.length < 4}
                />
                {errors.images ? <FormHelperText error>{errors.images}</FormHelperText> : null}
              </Grid>

              <Grid item md={12}>
                <Stack spacing={3}>
                  <TextField
                    required
                    fullWidth
                    type="text"
                    label="Tên sách"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControl fullWidth required>
                      <Autocomplete
                        required
                        id="combo-box-author"
                        options={authors}
                        getOptionLabel={option => (getAuthor(option) ? getAuthor(option).name : '')}
                        onChange={(e, v) => {
                          setFieldValue('authorId', getAuthor(v)._id);
                        }}
                        value={values.authorId}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            label="Tác giả"
                            error={Boolean(touched.authorId && errors.authorId)}
                          />
                        )}
                      />
                      {touched.authorId && errors.authorId ? (
                        <FormHelperText error>{errors.authorId}</FormHelperText>
                      ) : null}
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog('author')}
                      startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                      Thêm
                    </Button>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControl fullWidth required>
                      <Autocomplete
                        required
                        id="combo-box-category"
                        options={categories}
                        getOptionLabel={option => (getOpObj(option) ? getOpObj(option).name : '')}
                        onChange={(e, v) => {
                          setFieldValue('category', getOpObj(v)._id);
                        }}
                        value={values.category}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            label="Danh mục"
                            error={Boolean(touched.category && errors.category)}
                          />
                        )}
                      />
                      {touched.category && errors.category ? (
                        <FormHelperText error>{errors.category}</FormHelperText>
                      ) : null}
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog('category')}
                      startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                      Thêm
                    </Button>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <FormControl fullWidth>
                      <Autocomplete
                        multiple
                        id="combo-box-category"
                        options={filters}
                        getOptionLabel={option => (getFilter(option) ? getFilter(option).name : '')}
                        onChange={(_, newValue) => setFilterValue(newValue)}
                        isOptionEqualToValue={(option, value) => option._id === value}
                        value={values.filter}
                        renderInput={params => <TextField {...params} label="Bộ lọc" />}
                      />
                    </FormControl>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog('filter')}
                      startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                      Thêm
                    </Button>
                  </Stack>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Tâm trạng</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.mood}
                      label="Tâm trạng"
                      onChange={(e, v) => {
                        setFieldValue('mood', e.target.value);
                      }}
                      error={Boolean(touched.mood && errors.mood)}
                    >
                      {moods.map((v, i) => (
                        <MenuItem key={v._id} value={v._id}>
                          {v.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.mood && errors.mood ? <FormHelperText error>{errors.mood}</FormHelperText> : null}
                  </FormControl>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Căn nguyên</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.reason}
                      label="Căn nguyên"
                      onChange={(e, v) => {
                        setFieldValue('reason', e.target.value);
                      }}
                      error={Boolean(touched.reason && errors.reason)}
                    >
                      {reasons.map((v, i) => (
                        <MenuItem key={v._id} value={v._id}>
                          {v.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.reason && errors.reason ? <FormHelperText error>{errors.reason}</FormHelperText> : null}
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              type="number"
              label="Năm phát hành"
              {...getFieldProps('publishingYear')}
              error={Boolean(touched.publishingYear && errors.publishingYear)}
              helperText={touched.publishingYear && errors.publishingYear}
              onKeyDown={e => {
                if (e.key === '-') {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              fullWidth
              type="number"
              label="Giá Bcoin"
              {...getFieldProps('prePrice')}
              error={Boolean(touched.prePrice && errors.prePrice)}
              helperText={touched.prePrice && errors.prePrice}
              InputProps={{
                endAdornment: 'bcoin',
              }}
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
              label="Giá Bcoin mới"
              {...getFieldProps('price')}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
              InputProps={{
                endAdornment: 'bcoin',
              }}
              onKeyDown={e => {
                if (e.key === '-') {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              required
              fullWidth
              type="text"
              label="Số trang"
              {...getFieldProps('numberOfPage')}
              error={Boolean(touched.numberOfPage && errors.numberOfPage)}
              helperText={touched.numberOfPage && errors.numberOfPage}
              onKeyDown={e => {
                if (e.key === '-') {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              required
              fullWidth
              type="text"
              label="Mô tả"
              {...getFieldProps('description')}
              error={Boolean(touched.description && errors.description)}
              helperText={touched.description && errors.description}
            />
            <h4>File audios</h4>
            {values.voice.map((v, i) => (
              <Card variant="outlined" sx={{ padding: '8px' }} key={i.toString()}>
                <Stack spacing={2}>
                  <TextField
                    name={`audio-name-${i}`}
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={v.name}
                    onChange={e => updateAudioFileInfo(i, e.target.value, null, null)}
                    label="Tên"
                  />
                  <TextField
                    name={`audio-description-${i}`}
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={v.description}
                    onChange={e => updateAudioFileInfo(i, null, e.target.value, null)}
                    label="Mô tả"
                  />
                  <TextField
                    name={`audio-index-${i}`}
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={v.index}
                    onChange={e => updateAudioFileInfo(i, null, null, e.target.value)}
                    label="Vị trí"
                  />
                  <p>
                    {v.src} {v.duration}
                  </p>
                  <Stack direction="row" spacing={2}>
                    <label htmlFor={`upload-audio-btn-${i}`}>
                      <input
                        accept="audio/*"
                        onChange={e => handleUploadAudio(e, i)}
                        style={{ display: 'none' }}
                        type="file"
                        id={`upload-audio-btn-${i}`}
                      />
                      <Button variant="outlined" component="span">
                        Chọn file
                      </Button>

                      {isUploadingAudio ? <CircularProgress /> : null}
                    </label>
                    <Box>
                      <Button variant="outlined" component="span" onClick={() => deleteAudioFile(i)} color="error">
                        Xóa
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            ))}
            <Button variant="outlined" component="span" onClick={addAudioFile}>
              Thêm file audio
            </Button>

            <h4>File PDF</h4>
            {values.file.map((v, i) => (
              <Card variant="outlined" sx={{ padding: '8px' }} key={i.toString()}>
                <Stack spacing={2}>
                  <TextField
                    name={`pdf-name-${i}`}
                    variant="outlined"
                    fullWidth
                    type="text"
                    value={v.name}
                    onChange={e => updatePDFFileInfo(i, e.target.value)}
                    label="Tên"
                  />
                  <p>{v.src}</p>
                  <Stack direction="row" spacing={2}>
                    <label htmlFor={`upload-pdf-btn-${i}`}>
                      <input
                        accept="application/pdf"
                        onChange={e => handleUploadPDF(e, i)}
                        style={{ display: 'none' }}
                        type="file"
                        id={`upload-pdf-btn-${i}`}
                      />
                      <Button variant="outlined" component="span">
                        Chọn file
                      </Button>
                      {isUploadingPDFFiles ? <CircularProgress /> : null}
                    </label>
                    <Box>
                      <Button variant="outlined" component="span" onClick={() => deletePDFFile(i)} color="error">
                        Xóa
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            ))}
            {errors.file ? <FormHelperText error>{errors.file}</FormHelperText> : null}
            <Button variant="outlined" component="span" onClick={addPDFFile}>
              Thêm file PDF
            </Button>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('available')} checked={values.available} name="available" />}
              label="Hiện sách này"
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
    </>
  );
}
