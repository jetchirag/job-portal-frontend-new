import { useEffect, useState, useCallback } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import StatsCard from './StatsCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalApplicationLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const URL = 'http://localhost:3000/applications/stats';

    const [stats, setStats] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [monthlyData, setMonthlyData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState('33');

    const FetchingDashboardData = useCallback(async () => {
        try {
            await fetch(URL)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error Connecting to the database");
                    }

                    return res.json();
                })
                .then((val) => {
                    setStats(val.stats);

                    // create array of count grouped by jobType
                    var monthlyCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                    // loop through array val.stats.monthly
                    val.stats.monthly.forEach((element) => {
                        monthlyCount[element._id - 1] = element.count;
                    });
                    
                    console.log(monthlyCount);
                    setMonthlyData(monthlyCount);

                });
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        FetchingDashboardData();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <StatsCard data={stats.total} isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard data={stats} isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item md={12}>
                <TotalGrowthBarChart monthlyData={monthlyData}  data={stats}  isLoading={isLoading} />
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart monthlyData={monthlyData}  data={stats}  isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default Dashboard;
