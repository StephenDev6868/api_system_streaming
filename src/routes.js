import { Routes, Route, Navigate } from 'react-router-dom';
// layouts
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';
import DashboardLayout from './layouts/dashboard';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import BooksPage from './pages/Books';
import AuthorPage from './pages/Author';
import RatePage from './pages/Evaluate';
import TransactPage from './pages/transaction';
import Rank from './pages/Ranking';
import Appellation from './pages/Appellation';
import Category from './pages/Category';
import Mood from './pages/Mood';
import Apophthgan from './pages/Apophthgan';
import Banking from './pages/Banking';
import BookFilter from './pages/BookFilter';
import Intro from './pages/Intro';
import Settings from './pages/Settings';
import IssueTypePage from './pages/IssueType';
import Advisory from './pages/Advisory';
import Affiliate from './pages/Affiliate';
import FeedbackPage from './pages/FeedBack';

// ----------------------------------------------------------------------

function getToken() {
  const tokenString = localStorage.getItem('user');
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
}

function Router() {
  const token = getToken();
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [snackContent, setSnackContent] = useState('');
  const [snackType, setSnackType] = useState('info');

  const showSnack = (variant, message) => {
    console.log(variant, message);
    setSnackType(variant);
    setSnackContent(message);
    setIsSnackBarOpen(true);
  };

  if (!token) {
    return <Login />;
  }

  const decode = JSON.parse(atob(token.split('.')[1]));
  // console.log(decode);
  if (decode.exp * 1000 < new Date().getTime()) {
    console.log('Time Expired');
    return <Login />;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackBarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackBarOpen(false)}
      >
        <Alert severity={snackType} sx={{ width: '100%' }}>
          {snackContent}
        </Alert>
      </Snackbar>
      <Routes>
        <Route index element={<Navigate to="/dashboard/app" replace />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route path="app" element={<DashboardApp />} />
          <Route path="intro" element={<Intro />} />
          <Route path="user" element={<User />} />
          <Route path="books" element={<BooksPage showSnack={showSnack} />} />
          <Route path="authors" element={<AuthorPage />} />
          <Route path="rates" element={<RatePage />} />
          <Route path="transact" element={<TransactPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="issue-type" element={<IssueTypePage />} />
          <Route path="advisory" element={<Advisory />} />
          <Route path="news" element={<Blog />} />
          <Route path="ranking" element={<Rank />} />
          <Route path="appellation" element={<Appellation />} />
          <Route path="category" element={<Category />} />
          <Route path="mood" element={<Mood />} />
          <Route path="apophthgan" element={<Apophthgan />} />
          <Route path="banking" element={<Banking />} />
          <Route path="filter" element={<BookFilter />} />
          <Route path="affiliate" element={<Affiliate />} />
          <Route path="settings" element={<Settings showSnack={showSnack} />} />
        </Route>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default Router;
