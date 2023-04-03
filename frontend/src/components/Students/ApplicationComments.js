/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import instance from '../../api/axios';
import styles from '../../styles/components/Students/ApplicationComments.module.css';
import FadeUpWhenVisible from '../Animation/FadeUp';
import Form from 'react-bootstrap/Form';

const ApplicationComments = ({ data }) => {
    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    const resetComment = () => {
        setComment('');
    };

    const validateComment = () => {
        if (comment === '') {
            return true;
        }
        return false;
    };

    const handleSubmit = () => {
        var form = new FormData();
        form.append('comment', comment);
        instance
            .post(`/projects/applications_comments/${data.id}`, form)
            .then((res) => {
                if (res.status === 200) {
                    window.alert('Comment posted successfully');
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    window.alert('Invalid Form');
                }
            });
    };

    const sortComments = (data) => {
        return (
            data.sort((x, y) => {
                return new Date(x.timestamp) > new Date(y.timestamp) ? 1 : -1
            })
        ).reverse()
    };

    useEffect(() => {
        instance
            .get(`/projects/applications_comments/${data.id}`)
            .then((res) => {
                console.log(sortComments(res.data));
                setCommentsList(sortComments(res.data));
            })
            .catch((error) => console.log(error));
    }, []);

    return (
        <FadeUpWhenVisible>
            <div className={styles.commentsContent}>
                {commentsList && commentsList.length > 0 ? (
                    <>
                        {commentsList.map((commentContent) => {
                            return (
                                <div>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.commentUser}>{commentContent.user.full_name}</span>
                                        <span className={styles.commentTimestamp}>{new Date(commentContent.timestamp).toLocaleString()}</span>
                                    </div>
                                    <span className={styles.comment}>{commentContent.comment}</span>
                                </div>
                            );
                        })}
                    </>
                ) : null}
            </div>
            {data.is_withdrawn ? null :
                <Form>
                    <Form.Group className="mb-3" controlId="Comment Section">
                        <Form.Control
                            as="textarea"
                            value={comment}
                            className={styles.commentTextArea}
                            rows={3}
                            onChange={(event) => handleComment(event)}
                        />
                    </Form.Group>
                    <div className={styles.projectActions}>
                        <button
                            variant="primary"
                            type="button"
                            onClick={() => resetComment()}
                        >
                            Clear
                        </button>
                        <button
                            className={styles.submitButton}
                            variant="primary"
                            type="submit"
                            disabled={validateComment()}
                            onClick={() => handleSubmit()}
                        >
                            Submit
                        </button>
                    </div>
                </Form>
            }
        </FadeUpWhenVisible>
    );
};

export default ApplicationComments;
