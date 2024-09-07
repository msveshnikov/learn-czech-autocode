/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Popper,
    Fade,
    Paper,
    ClickAwayListener
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPopper = styled(Popper)(({ theme }) => ({
    zIndex: theme.zIndex.tooltip,
    '& .MuiPaper-root': {
        maxWidth: 300,
        padding: theme.spacing(2)
    }
}));

const UIOverview = ({ steps, onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (steps.length > 0) {
            const targetElement = document.querySelector(
                steps[activeStep].target
            );
            if (targetElement) {
                setAnchorEl(targetElement);
            }
        }
    }, [activeStep, steps]);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const handleClickAway = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            onComplete();
        }
    };

    if (steps.length === 0) {
        return null;
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <StyledPopper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <Typography variant="h6" gutterBottom>
                                Обзор интерфейса
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {steps[activeStep].content}
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button onClick={handleSkip} color="secondary">
                                    Пропустить
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    color="primary"
                                >
                                    {activeStep === steps.length - 1
                                        ? 'Завершить'
                                        : 'Далее'}
                                </Button>
                            </Box>
                        </Paper>
                    </Fade>
                )}
            </StyledPopper>
        </ClickAwayListener>
    );
};

export default UIOverview;
