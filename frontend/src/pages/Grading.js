/* eslint-disable prettier/prettier */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import FadeInWhenVisible from '../components/Animation/FadeIn';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 'auto',
        maxWidth: 700,
        border: 'black',
    },
    tablewrapper: {
        display: 'flex',
        marginTop: '8rem',
        paddingBottom: '4rem',
        justifyContent: 'center',
        background: 'transparent',
    },
    root: {
        flexGrow: 1,
        display: 'flex',
        marginBottom: '2rem',
    },
    paper: {
        padding: '1rem',
        margin: '2rem 0',
        [theme.breakpoints.up(460)]: {
            paddingInline: 40,
        },
        width: 'auto',
        color: 'black',
    },
    text: {
        padding: theme.spacing(2),
        textAlign: 'left',
        width: 'auto',
        fontSize: '1rem',
        color: 'black',
    },
    heading: {
        fontSize: '1.8rem',
        color: '#fff',
        backgroundColor: '#012970',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '6rem 0rem 2rem 0rem',
        padding: '1rem',
    },
}));

function createData(name, category, points) {
    return { name, category, points };
}

const rows = [
    createData('A*', 'Exceptional', 10),
    createData('A', 'Outstanding', 10),
    createData('A-', 'Excellent', 9),
    createData('B', 'Very Good', 8),
    createData('B-', 'Good', 7),
    createData('C', 'Average', 6),
    createData('C-', 'Below Average', 5),
    createData('D', 'Marginal', 4),
    createData('E', 'Poor', 2),
    createData('F', 'Fail', 0),
    createData('I', 'Incomplete', '-'),
    createData('S', 'Satisfactory in Course', '-'),
    createData('X', 'Thesis Continuation', '-'),
    createData('U', 'Unsatisfactory', '-'),
    createData('W', 'Withdrawn', '-'),
];

const Grading = () => {
    const classes = useStyles();

    return (
        <>
            <div style={{ minHeight: '100vh', width: '100%' }}>
                <Container maxWidth="lg">
                    <FadeInWhenVisible>
                        <TableContainer
                            className={classes.tablewrapper}
                            component={Paper}
                            elevation={0}
                        >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#383838' }}>GRADES</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#383838' }}>DENOTION</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 700, fontSize: '1.2rem', color: '#383838' }}>POINTS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.name}>
                                            <TableCell align="center" component="th" scope="row" style={{ fontWeight: 550, fontSize: '1rem', color: '#848484' }}>
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="center" style={{ fontWeight: 550, fontSize: '1rem', color: '#848484' }}>{row.category}</TableCell>
                                            <TableCell align="center" style={{ fontWeight: 550, fontSize: '1rem', color: '#848484' }}>{row.points}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </FadeInWhenVisible>
                </Container>
            </div>
        </>
    );
};

export default Grading;

