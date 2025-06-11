import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { auth, handleApiError } from './services/api';
import './qrCodeDisplay.css';

const QRCodeDisplay = () => {
    const navigate = useNavigate();
    const { auth: authContext } = useAuth();
    
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [setupStep, setSetupStep] = useState(1);
    const [verificationStatus, setVerificationStatus] = useState(null);

    useEffect(() => {
        generateQRCode();
    }, []);

    const generateQRCode = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await auth.generateTwoFactorSecret();
            setQrCode(response.qrCodeUrl);
            setSecret(response.secret);
            setSetupStep(1);
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        
        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await auth.verifyTwoFactorSetup({
                secret,
                token: verificationCode
            });

            setVerificationStatus('success');
            setSetupStep(3);
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
            setVerificationStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        navigate('/dashboard');
    };

    const renderStep1 = () => (
        <div className="setup-step">
            <h2>Step 1: Install Authenticator App</h2>
            <p>
                To enable two-factor authentication, you'll need an authenticator app 
                on your mobile device. We recommend:
            </p>
            <ul>
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
            </ul>
            <button 
                onClick={() => setSetupStep(2)} 
                className="btn btn-primary"
            >
                I have an authenticator app
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="setup-step">
            <h2>Step 2: Scan QR Code</h2>
            <p>
                Open your authenticator app and scan this QR code to add your account:
            </p>
            
            <div className="qr-container">
                {qrCode && (
                    <img 
                        src={qrCode} 
                        alt="2FA QR Code" 
                        className="qr-code"
                    />
                )}
            </div>

            <div className="manual-entry">
                <p>Can't scan the QR code? Use this code instead:</p>
                <code className="secret-key">{secret}</code>
            </div>

            <form onSubmit={handleVerification} className="verification-form">
                <div className="form-group">
                    <label htmlFor="verificationCode">
                        Enter the 6-digit code from your authenticator app:
                    </label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        maxLength="6"
                        pattern="\d{6}"
                        required
                        className={`form-control ${verificationStatus ? `verification-${verificationStatus}` : ''}`}
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
            </form>
        </div>
    );

    const renderStep3 = () => (
        <div className="setup-step">
            <h2>Two-Factor Authentication Enabled!</h2>
            <div className="success-message">
                <p>
                    You've successfully set up two-factor authentication for your account.
                    From now on, you'll need to enter a verification code from your
                    authenticator app when signing in.
                </p>
                
                <div className="recovery-codes">
                    <h3>Important: Save Your Recovery Codes</h3>
                    <p>
                        If you lose access to your authenticator app, you can use these
                        codes to sign in. Store them in a safe place.
                    </p>
                    <div className="codes-container">
                        {/* Recovery codes would be provided by the backend */}
                        <code>XXXX-XXXX-XXXX</code>
                        <code>YYYY-YYYY-YYYY</code>
                    </div>
                </div>

                <button 
                    onClick={handleComplete}
                    className="btn btn-primary"
                >
                    Complete Setup
                </button>
            </div>
        </div>
    );

    if (loading && !qrCode) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="qr-code-display">
            <h1>Set Up Two-Factor Authentication</h1>
            
            <div className="setup-progress">
                <div className={`step-indicator ${setupStep >= 1 ? 'active' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step-indicator ${setupStep >= 2 ? 'active' : ''}`}>2</div>
                <div className="step-line"></div>
                <div className={`step-indicator ${setupStep >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            <div className="setup-container">
                {setupStep === 1 && renderStep1()}
                {setupStep === 2 && renderStep2()}
                {setupStep === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default QRCodeDisplay;
