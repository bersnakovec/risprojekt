import React, { useState, useEffect } from 'react';
import './FilePreview.css';

const FilePreview = ({ file, taskId, onClose }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = file ? `http://localhost:8080/api/tasks/${taskId}/files/${file.id}/preview` : '';
  const token = localStorage.getItem('token');

  // Fetch file with authentication token
  useEffect(() => {
    if (file && (isImage(file.contentType) || isPDF(file.contentType) || isText(file.contentType))) {
      setLoading(true);
      fetch(previewUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setFileUrl(url);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading file:', error);
          setLoading(false);
        });

      // Cleanup: revoke object URL when component unmounts
      return () => {
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.id]);

  if (!file) return null;

  const isImage = (contentType) => {
    return contentType && contentType.startsWith('image/');
  };

  const isPDF = (contentType) => {
    return contentType === 'application/pdf';
  };

  const isText = (contentType) => {
    return contentType && (
      contentType.startsWith('text/') ||
      contentType === 'application/json' ||
      contentType === 'application/xml'
    );
  };

  const isWord = (contentType) => {
    return contentType && (
      contentType === 'application/msword' ||
      contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  };

  const renderPreview = () => {
    if (isImage(file.contentType)) {
      if (loading) {
        return <div className="preview-loading">Loading image...</div>;
      }
      return (
        <img
          src={fileUrl}
          alt={file.originalFilename}
          className="preview-image"
        />
      );
    }

    if (isPDF(file.contentType)) {
      if (loading) {
        return <div className="preview-loading">Loading PDF...</div>;
      }
      return (
        <iframe
          src={`${fileUrl}#toolbar=1`}
          title={file.originalFilename}
          className="preview-iframe"
        />
      );
    }

    if (isText(file.contentType)) {
      if (loading) {
        return <div className="preview-loading">Loading file...</div>;
      }
      return (
        <iframe
          src={fileUrl}
          title={file.originalFilename}
          className="preview-iframe"
        />
      );
    }

    if (isWord(file.contentType)) {
      return (
        <div className="preview-unsupported">
          <p>Preview not available for Word documents</p>
          <p>Please download the file to view it</p>
          <a
            href={`http://localhost:8080/api/tasks/${taskId}/files/${file.id}/download`}
            className="download-link"
          >
            Download {file.originalFilename}
          </a>
        </div>
      );
    }

    return (
      <div className="preview-unsupported">
        <p>Preview not available for this file type</p>
        <p>File type: {file.contentType}</p>
        <a
          href={`http://localhost:8080/api/tasks/${taskId}/files/${file.id}/download`}
          className="download-link"
        >
          Download {file.originalFilename}
        </a>
      </div>
    );
  };

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h3>{file.originalFilename}</h3>
          <button className="preview-close-button" onClick={onClose}>×</button>
        </div>
        <div className="preview-modal-body">
          {renderPreview()}
        </div>
        <div className="preview-modal-footer">
          <span className="file-info">
            {file.contentType} • {formatFileSize(file.fileSize)}
          </span>
          <a
            href={`http://localhost:8080/api/tasks/${taskId}/files/${file.id}/download`}
            className="download-button"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default FilePreview;
