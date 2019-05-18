import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, path.join('upload_storage'));
    },
    filename(req, file, done) {
      done(null, 
        `NEMTHC-${
          file.originalname.includes('NEMTHC_AVATAR') ? 
            file.originalname : 
            `${Date.now()}-${file.originalname}`
        }`);
    },
  }),
});

