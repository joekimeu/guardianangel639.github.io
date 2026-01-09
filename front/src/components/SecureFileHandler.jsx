import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { handleApiError } from '../services/api';

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
};

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SecureFileHandler = ({ 
    onUploadSuccess, 
    onUploadError,
    allowedTypes = Object.keys(ALLOWED_FILE_TYPES),
    maxFileSize = MAX_FILE_SIZE,
    multiple = false,
    className = ''
}) => {
    const { auth } = useAuth();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        // Check file size
        if (file.size > maxFileSize) {
            throw new Error(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            throw new Error('File type not allowed');
        }

        // Additional security checks
        if (file.name.includes('..') || file.name.includes('/')) {
            throw new Error('Invalid file name');
        }

        return true;
    };

    const sanitizeFileName = (fileName) => {
        // Remove any path components
        const name = fileName.split(/[/\\]/).pop();
        
        // Remove special characters
        return name.replace(/[^a-zA-Z0-9._-]/g, '_');
    };

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files);
        setError(null);
        setProgress(0);

        try {
            // Validate each file
            files.forEach(validateFile);

            // Process files
            setUploading(true);
            const uploadedFiles = [];

            for (const file of files) {
                const sanitizedName = sanitizeFileName(file.name);
                const formData = new FormData();
                formData.append('file', file, sanitizedName);
                formData.append('userId', auth.user.id);
                formData.append('fileType', file.type);

                try {
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${auth.token}`
                        },
                        body: formData,
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setProgress(percentCompleted);
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Upload failed: ${response.statusText}`);
                    }

                    const result = await response.json();
                    uploadedFiles.push(result);
                } catch (err) {
                    const errorDetails = handleApiError(err);
                    throw new Error(`Error uploading ${sanitizedName}: ${errorDetails.message}`);
                }
            }

            onUploadSuccess?.(uploadedFiles);
            fileInputRef.current.value = ''; // Reset input
        } catch (err) {
            setError(err.message);
            onUploadError?.(err);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(`/api/download/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            // Get the blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
            onUploadError?.(err);
        }
    };

    const getAcceptedFileTypes = () => {
        return allowedTypes.map(type => 
            ALLOWED_FILE_TYPES[type]?.join(',')
        ).filter(Boolean).join(',');
    };

    return (
        <div className={`secure-file-handler ${className}`}>
            <div className="upload-container">
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept={getAcceptedFileTypes()}
                    multiple={multiple}
                    disabled={uploading}
                    className="file-input"
                />

                <div className="upload-info">
                    <p className="file-requirements">
                        Accepted file types: {Object.values(ALLOWED_FILE_TYPES).flat().join(', ')}
                        <br />
                        Maximum file size: {maxFileSize / 1024 / 1024}MB
                    </p>
                </div>

                {uploading && (
                    <div className="upload-progress">
                        <div 
                            className="progress-bar"
                            style={{ width: `${progress}%` }}
                        />
                        <span className="progress-text">{progress}%</span>
                    </div>
                )}

                {error && (
                    <div className="upload-error">
                        {error}
                    </div>
                )}
            </div>

            <style jsx>{`
                .secure-file-handler {
                    padding: 1rem;
                    border: 2px dashed #ccc;
                    border-radius: 4px;
                    text-align: center;
                }

                .upload-container {
                    position: relative;
                }

                .file-input {
                    width: 100%;
                    padding: 1rem;
                    cursor: pointer;
                }

                .file-requirements {
                    font-size: 0.875rem;
                    color: #666;
                    margin: 0.5rem 0;
                }

                .upload-progress {
                    margin-top: 1rem;
                    background: #f0f0f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 4px;
                    background: #007bff;
                    transition: width 0.3s ease;
                }

                .progress-text {
                    font-size: 0.875rem;
                    color: #666;
                }

                .upload-error {
                    margin-top: 1rem;
                    padding: 0.5rem;
                    color: #dc3545;
                    background: #f8d7da;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default SecureFileHandler;
