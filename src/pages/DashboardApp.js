// material
import { Box, Grid, Container, Typography, Card } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
// components
import GaugeChart from 'react-gauge-chart';
import Page from '../components/Page';
import {
  TotalUsers,
  ActiveUsers,
  BooksMonthly,
  BooksPaper,
  Ebooks,
  RevenueMonthly,
  RevenueCOD,
  RevenueOnl,
  OrderMonthly,
  OrderDeliveri,
  OrderReturn,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
const token = JSON.parse(localStorage.getItem('user'));

const apiURL = `${process.env.REACT_APP_API_HOST}/admin/statistic`;
const apisystemURL = `${process.env.REACT_APP_API_HOST}/admin/statistic/system`;
export default function DashboardApp() {
  const [userActive, setuserActive] = useState([]);
  const [totalBooks, settotalBooks] = useState([]);
  const [totalRevenue, settotalRevenue] = useState([]);
  const [totalOrder, settotalOrder] = useState([]);
  const [systemInfo, setSystemInfo] = useState({ cpu: 0, mem: 0 });

  useEffect(() => {
    axios
      .get(`${apiURL}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setuserActive(response.data.data.users);
        settotalBooks(response.data.data.books.monthly);
        settotalRevenue(response.data.data.revenue.monthly);
        settotalOrder(response.data.data.orders.monthly);
      });
    loadSystemData();
  }, []);

  const loadSystemData = () => {
    axios
      .get(`${apisystemURL}`, {
        headers: {
          token: token.token,
        },
      })
      .then(response => {
        setSystemInfo(response.data.data.data);
        console.log(typeof (response.data.data.data.cpu / 100));
      })
      .catch(err => console.log(err));
    setTimeout(() => loadSystemData(), 15000);
  };

  return (
    <Page title="Dashboard | Admin">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Xin chào, Chào mừng bạn trở lại</Typography>
        </Box>
        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Hệ thống</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <GaugeChart
                id="gauge-cpu"
                nrOfLevels={20}
                percent={(systemInfo?.cpu ?? 0) / 100}
                textColor="#000000"
                animate={false}
              />
              <p style={{ textAlign: 'center' }}>CPU</p>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <GaugeChart
                id="gauge-mem"
                nrOfLevels={20}
                percent={(systemInfo?.mem?.freeMemMb ?? 0) / (systemInfo?.mem?.totalMemMb ?? 1)}
                textColor="#000000"
                animate={false}
              />
              <p style={{ textAlign: 'center' }}>
                RAM ({systemInfo?.mem?.freeMemMb} MB / {systemInfo?.mem?.totalMemMb} MB)
              </p>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <GaugeChart
                id="gauge-disk"
                nrOfLevels={20}
                percent={(systemInfo?.disk?.usedPercentage ?? 0) / 100}
                textColor="#000000"
                animate={false}
              />
              <p style={{ textAlign: 'center' }}>
                Ổ cứng ({systemInfo?.disk?.usedGb} GB / {systemInfo?.disk?.totalGb} GB)
              </p>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Người dùng</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <TotalUsers userActive={userActive} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <ActiveUsers userActive={userActive} />
          </Grid>
        </Grid>
        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Sách</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <BooksMonthly totalBooks={totalBooks} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <BooksPaper totalBooks={totalBooks} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={6}>
            <Ebooks totalBooks={totalBooks} />
          </Grid>
        </Grid>

        <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Doanh thu</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <RevenueMonthly totalRevenue={totalRevenue} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <RevenueCOD totalRevenue={totalRevenue} />
          </Grid> */}

          <Grid item xs={12} md={6} lg={6}>
            <RevenueOnl totalRevenue={totalRevenue} />
          </Grid>
        </Grid>
        {/* <Box sx={{ pb: 2, pt: 3 }}>
          <Typography variant="h5">Đơn hàng</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <OrderMonthly totalOrder={totalOrder} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <OrderDeliveri totalOrder={totalOrder} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <OrderReturn totalOrder={totalOrder} />
          </Grid>
        </Grid> */}
      </Container>
    </Page>
  );
}
