/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../api/axios';
import styles from '../styles/pages/Categories.module.css';
import Loading from '../components/Loading';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FadeUpWhenVisible from '../components/Animation/FadeUp';
import FadeInWhenVisible from '../components/Animation/FadeIn';
import { Container } from '@material-ui/core';

const Categories = () => {
    const [loading, setLoding] = useState(true);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        instance
            .get('projects/categories/')
            .then((res) => {
                setCategories(res.data);
            })
            .then(() => setLoding(false))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div style={{ minHeight: '100vh', width: '100%' }}>
            {loading ? (
                <Loading />
            ) : (
                <Container maxWidth="lg">
                    <FadeInWhenVisible>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            spacing={5}
                            style={{ width: '100%', margin: '8rem auto 0 auto' }}
                        >
                            {categories.map((category) => {
                                return (
                                    <Grid key={category.category} item xs={12} sm={6} md={6} lg={6}>
                                        <FadeUpWhenVisible>
                                            <Accordion style={{ width: '100%' }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id={category.category}
                                                >
                                                    <div className={styles.category}>
                                                        {category.category}
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails
                                                    style={{
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <FadeInWhenVisible>
                                                        <div
                                                            className={styles.description}
                                                            dangerouslySetInnerHTML={{
                                                                __html: category.description,
                                                            }}
                                                        />
                                                    </FadeInWhenVisible>
                                                </AccordionDetails>
                                            </Accordion>
                                        </FadeUpWhenVisible>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </FadeInWhenVisible>
                </Container>
            )}
        </div>
    );
};

export default Categories;
