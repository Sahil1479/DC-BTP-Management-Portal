/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Button from 'react-bootstrap/Button';
import styles from '../../styles/components/Students/ApplicationWithdraw.module.css';

const ApplicationWithdraw = ({ data }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <button
                className={styles.withdrawButton}
                onClick={() => handleClickOpen()}
            >
                Withdraw Request
            </button>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={() => handleClose()}
                scroll="paper"
                aria-labelledby={data.id}
                aria-describedby="scroll-dialog-description"
            >
                <DialogContent dividers="true">
                    <div className={styles.header}>
                        Are you sure you want to withdraw your application?
                    </div>
                    <div className={styles.projectActions}>
                        <button
                            className={styles.submitButton}
                            variant="primary"
                            type="submit"
                        // onClick={() => handleApplicationWithdrawl()}
                        >
                            Submit
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApplicationWithdraw;
