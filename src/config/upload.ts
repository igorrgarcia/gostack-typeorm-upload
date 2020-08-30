import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'tmp'));
  },
  filename: (request, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export default storage;
