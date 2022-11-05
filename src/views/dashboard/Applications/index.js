import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import ApplicationsTable from './ApplicationsTable';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState('33');

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item md={12}>
                <ApplicationsTable isLoading={isLoading} />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
