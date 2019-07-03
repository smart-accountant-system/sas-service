import multer from 'multer';
import path from 'path';

export default multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      console.log('des= ', file);
      done(null, path.join('upload_storage'));
    },
    filename(req, file, done) {
      console.log('filename ', file);
      done(null, 
        `SAS-${
          file.originalname.includes('SAS') ? 
            file.originalname : 
            `${Date.now()}-${file.originalname}`
        }`);
    },
  }),
});

