const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedDocMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'imageEvidence' || file.fieldname === 'photo') {
    if (allowedImageMimes.includes(file.mimetype) || ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid image file type. Only JPG, PNG, and WebP are allowed.'));
  }

  if (file.fieldname === 'documentEvidence' || file.fieldname === 'document') {
    if (allowedDocMimes.includes(file.mimetype) || ['.pdf', '.doc', '.docx'].includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid document file type. Only PDF, DOC, and DOCX are allowed.'));
  }

  // Fallback check
  if (allowedExts.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error(`File type ${ext} is not supported.`));
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
  },
  fileFilter: fileFilter,
});

// Middleware for uploading problem evidence
const problemUploadMiddleware = (req, res, next) => {
  const uploadFields = upload.fields([
    { name: 'imageEvidence', maxCount: 1 },
    { name: 'documentEvidence', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]);

  uploadFields(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum allowed size is 10 MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.',
      });
    }
    next();
  });
};

module.exports = {
  upload,
  problemUploadMiddleware,
};
