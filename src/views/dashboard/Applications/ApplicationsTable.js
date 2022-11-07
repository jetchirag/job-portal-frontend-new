import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import React from 'react'

import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridCsvExportOptions } from '@mui/x-data-grid';
import { Button, Chip, Box, Grid, MenuItem, TextField, InputLabel, FormHelperText, FormControl, Select, Typography, Avatar, LinearProgress } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { jobTypeOptions, statusOptions, statusColor } from './constants';


// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const ApplicationsTable = ({ isLoading }) => {
    const URL = 'http://localhost:3000/applications';
    const URLFaculties = 'http://localhost:3000/applications/faculties';

    const [loading, setLoading] = useState(false);
    const [facultiesData, setFacultiesData] = useState([]);

    const [facultiesSelect, setFacultiesSelect] = useState(['']);
    const [schoolSelect, setSchoolSelect] = useState(['']);
    const [departmentSelect, setDepartmentSelect] = useState(['']);

    const [applicantList, setApplicantList] = useState([]);
    const [stats, setStats] = useState([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchName, setSearchName] = useState("");
    const [filters, setFilters] = useState({
        jobType: '',
        faculty: '',
        school: '',
        department: '',
        status: '',
    });

    const FetchingData = useCallback(async () => {


        console.log(encodeURIComponent(filters.department));

        setLoading(true);
        try {
            await fetch(URL +
                "?jobType=" + encodeURIComponent(filters.jobType) +
                "&faculty=" + encodeURIComponent(filters.faculty) +
                "&school=" + encodeURIComponent(filters.school) +
                "&department=" + encodeURIComponent(filters.department) +
                "&status=" + encodeURIComponent(filters.status) +
                "&startDate="  +
                "&endDate=" +
                "&searchName=" 
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error Connecting to the database");
                    }
                    return res.json();
                })
                .then((val) => {

                    // Loop over the results and create a new array of objects
                    const newApplicantList = val.results.map((item) => {
                        return {
                            id: item.id,
                            _id: item._id,
                            status: item.status,
                            avatar: item.photo,
                            name: item.applicant.firstName + " " + item.applicant.lastName,
                            email: item.applicant.email,
                            phone: item.applicant.mobile,
                            dob: item.applicant.dob,
                            jobType: item.jobType,
                            faculty: item.faculty,
                            school: item.school,
                            department: item.department,
                            status: item.status,
                            date: item.date,
                            resume: item.resume,
                            createdDate: item.createdDate,
                        }
                    });

                    console.log(newApplicantList);

                    setApplicantList(newApplicantList);
                    setStats(val.stats);
                });
        } catch (err) {
            console.error(err.message);
        }
        setLoading(false);
    }, [filters, dateRange, searchName]);

    const FetchingFacultyData = useCallback(async () => {
        setLoading(true);
        try {
            await fetch(URLFaculties)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Error Connecting to the database");
                    }
                    return res.json();
                })
                .then((val) => {
                    console.log(val);
                    setFacultiesData(val);
                    
                    const newFacultiesSelect = ['Any'];
                    for (var key of Object.keys(val)) {
                        newFacultiesSelect.push(key);
                    }
                    setFacultiesSelect(newFacultiesSelect);
                });
        } catch (err) {
            console.error(err.message);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        console.log(dateRange);
        FetchingData();
    }, [FetchingData]);

    useEffect(() => {
        FetchingFacultyData()
    }, []);

    const handleFilterChange = (propertyName, event: SelectChangeEvent<typeof filters>) => {
        setFilters({ ...filters, [propertyName]: event.target.value });
        console.log({"Filters": filters});
    };

    const handleFacultyChange= (event: SelectChangeEvent<typeof filters>) => {
        if (event.target.value === 'Any') {
            setFilters({ ...filters, faculty: '', school: '', department: '' });
        }
        else {
            setFilters({ ...filters, faculty: event.target.value });
            const newSchoolSelect = [''];
            for (var key of Object.keys(facultiesData[event.target.value])) {
                newSchoolSelect.push(key);
            }
            setSchoolSelect(newSchoolSelect);
        }
    };

    const handleSchoolChange = (event: SelectChangeEvent<typeof filters>) => {
        setFilters({ ...filters, school: event.target.value });
        console.log(event.target.value);
        const newDepartmentSelect = [''];
        console.log(facultiesData[filters.faculty][event.target.value]);
        for (var key of Object.keys(facultiesData[filters.faculty][event.target.value])) {
            newDepartmentSelect.push(facultiesData[filters.faculty][event.target.value][key]);
        }
        setDepartmentSelect(newDepartmentSelect);
    };

    const handleDepartmentChange = (event: SelectChangeEvent<typeof filters>) => {
        setFilters({ ...filters, department: event.target.value });
    };


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: "avatar",
            headerName: "Applicant",
            width: 90,
            renderCell: (params) => {
                return (
                    <><Avatar src={params.value} /></>
                );
            }
        },
        { field: 'name', headerName: 'Name', width: 200, },
        { field: 'createdDate', headerName: 'Date Applied', width: 200, },
        { field: 'faculty', headerName: 'Faculty', width: 200, hide: true},
        { field: 'school', headerName: 'School', width: 200, hide: true },
        { field: 'department', headerName: 'Department', width: 200, hide: true },
        { field: 'status', headerName: 'Status', width: 160, renderCell: (params) => {
            return (
            <Chip label={params.value} sx={{ bgcolor: statusColor[params.value], color: '#fff' }}/>
            );
        }},
        {
            field: 'resume', headerName: 'Resume', width: 120, renderCell: (params) => {
                return (
                <Button variant="contained" color="primary" size="small" href={params.value} target="_blank">Download</Button>
                );
            }
        },
        {
            field: '_id', headerName: 'Actions', width: 120, renderCell: (params) => {
                return (
                    <Button variant="contained" color="primary" size="small" href={"/dashboard/application/" + params.value} target="_blank">View Details</Button>
                );
            }
        },
    ];



    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ m: 1, minWidth: 350 }}>
                        <InputLabel>Faculty</InputLabel>
                        <Select default={''} value={filters.faculty} label="Faculty" onChange={e => handleFacultyChange(e)}>
                            {facultiesSelect?.map(option => {
                                return (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {/* <FormHelperText>Read only</FormHelperText> */}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ m: 1, minWidth: 350 }}>
                        <InputLabel>School</InputLabel>
                        <Select default={""} value={filters.school} label="School" onChange={e => handleSchoolChange(e)}>
                            {schoolSelect?.map(option => {
                                return (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ m: 1, minWidth: 350 }}>
                        <InputLabel>Department</InputLabel>
                        <Select value={filters.department} default={""} label="Faculty" onChange={e => handleDepartmentChange(e)}>
                            {departmentSelect?.map(option => {
                                return (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing} mb={4}>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ m: 1, minWidth: 350 }}>
                        <InputLabel>Job Type</InputLabel>
                        <Select default={''} value={filters.jobType} label="Job Type" onChange={e => handleFilterChange('jobType', e)}>
                            {jobTypeOptions?.map(option => {
                                return (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label ?? option.value}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {/* <FormHelperText>Read only</FormHelperText> */}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ m: 1, minWidth: 350 }}>
                        <InputLabel>Status</InputLabel>
                        <Select default={''} value={filters.status} label="Status" onChange={e => handleFilterChange('status', e)}>
                            {statusOptions?.map(option => {
                                return (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label ?? option.value}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        {/* <FormHelperText>Read only</FormHelperText> */}
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>


                    <div style={{ height: 800, width: '100%' }}>
                        <DataGrid
                            rows={applicantList}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            density="comfortable"
                            loading={loading}
                            components={{ Toolbar: GridToolbar, LoadingOverlay: LinearProgress }}
                            componentsProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    csvOptions:
                                        { fileName: "Applications" }
                                }
                            }}
                        />
                    </div>

                </Grid>
            </Grid>
        </MainCard>
    );
};

ApplicationsTable.propTypes = {
    isLoading: PropTypes.bool
};

export default ApplicationsTable;
