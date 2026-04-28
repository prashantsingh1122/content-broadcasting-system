const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'), false);
  }
};

// Multer S3 storage configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    
    // REMOVED ACL - bucket uses bucket policy instead
    contentType: multerS3.AUTO_CONTENT_TYPE,
    
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        uploadedBy: req.user ? req.user.id : 'anonymous'
      });
    },
    
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const filename = `uploads/${uniqueSuffix}${ext}`;
      cb(null, filename);
    }
  }),
  
  fileFilter: fileFilter,
  
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;