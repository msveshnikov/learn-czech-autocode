/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Tooltip
} from '@mui/material';

const steps = [
    'Welcome',
    'Account Setup',
    'Platform Overview',
    'Trading Basics',
    'Risk Management'
];

const tooltips = {
    Welcome: 'Welcome to our FX Trading Platform!',
    'Account Setup': 'Set up your account preferences and funding options.',
    'Platform Overview': 'Explore the main features of our trading platform.',
    'Trading Basics': 'Learn the fundamentals of forex trading.',
    'Risk Management': 'Understand how to manage your trading risks.'
};

const OnboardingTooltip = ({ children, title }) => (
    <Tooltip title={title} arrow placement="top">
        <Box>{children}</Box>
    </Tooltip>
);

const Onboarding = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleDemoAccount = () => {
        // TODO: Implement demo account creation logic
        console.log('Creating demo account...');
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <OnboardingTooltip title={tooltips[label]}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </OnboardingTooltip>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re ready to start
                        trading!
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Step {activeStep + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1
                                ? 'Finish'
                                : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
            <Box sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    onClick={handleDemoAccount}
                    sx={{ mr: 2 }}
                >
                    Try Demo Account
                </Button>
            </Box>
        </Box>
    );
};

export default Onboarding;
