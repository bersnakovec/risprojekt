import React, { useState, useEffect } from 'react';
import api from '../../services/Api';
import FilePreview from '../FilePreview/FilePreview';
import './FileUpload.css';

/**
 * FileUpload component for managing task file attachments
 * Provides file upload, list, and download/delete functionality
 */
const FileUpload = ({ taskId }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);

    // Load existing files when component mounts or taskId changes
    useEffect(() => {
        if (taskId) {
            loadFiles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    /**
     * Load all files for the current task
     */
    const loadFiles = async () => {
        try {
            const response = await api.get(`/tasks/${taskId}/files`);
            setFiles(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading files:', err);
            setError('Failed to load files');
        }
    };

    /**
     * Handle file selection
     */
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setError(null);
        }
    };

    /**
     * Upload the selected file
     */
    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            await api.post(`/tasks/${taskId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Clear selected file and reload file list
            setSelectedFile(null);
            document.getElementById('file-input').value = '';
            await loadFiles();
        } catch (err) {
            console.error('Error uploading file:', err);
            setError(err.response?.data || 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Download a file
     */
    const handleDownload = async (fileId, originalFilename) => {
        try {
            const response = await api.get(`/tasks/${taskId}/files/${fileId}/download`, {
                responseType: 'blob',
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading file:', err);
            setError('Failed to download file');
        }
    };

    /**
     * Delete a file
     */
    const handleDelete = async (fileId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }

        try {
            await api.delete(`/tasks/${taskId}/files/${fileId}`);
            await loadFiles();
            setError(null);
        } catch (err) {
            console.error('Error deleting file:', err);
            setError('Failed to delete file');
        }
    };

    /**
     * Format file size for display
     */
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    /**
     * Check if file is an image
     */
    const isImage = (contentType) => {
        return contentType && contentType.startsWith('image/');
    };

    /**
     * Handle file preview
     */
    const handlePreview = (file) => {
        setPreviewFile(file);
    };

    /**
     * Close file preview
     */
    const handleClosePreview = () => {
        setPreviewFile(null);
    };

    return (
        <div className="file-upload-container">
            <h4>File Attachments</h4>

            {/* Upload Section */}
            <div className="upload-section">
                <div className="file-input-wrapper">
                    <input
                        id="file-input"
                        type="file"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="file-input"
                    />
                    {selectedFile && (
                        <div className="selected-file-info">
                            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </div>
                    )}
                </div>
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="upload-button"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {/* Error Display */}
            {error && <div className="error-message">{error}</div>}

            {/* Files List */}
            <div className="files-list">
                {files.length === 0 ? (
                    <p className="no-files">No files attached yet</p>
                ) : (
                    <ul>
                        {files.map((file) => (
                            <li key={file.id} className="file-item">
                                <div className="file-info">
                                    <span className="file-icon">
                                        {isImage(file.contentType) ? '🖼️' : '📄'}
                                    </span>
                                    <div className="file-details">
                                        <span className="file-name">{file.originalFilename}</span>
                                        <span className="file-meta">
                                            {formatFileSize(file.fileSize)} •
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="file-actions">
                                    <button
                                        onClick={() => handlePreview(file)}
                                        className="preview-button"
                                        title="Preview"
                                    >
                                        👁️
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file.id, file.originalFilename)}
                                        className="download-button"
                                        title="Download"
                                    >
                                        ⬇️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        className="delete-button"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* File Preview Modal */}
            {previewFile && (
                <FilePreview
                    file={previewFile}
                    taskId={taskId}
                    onClose={handleClosePreview}
                />
            )}
        </div>
    );
};

export default FileUpload;
