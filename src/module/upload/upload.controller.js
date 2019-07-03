import path from 'path';
import HTTPStatus from 'http-status';
import sharp from 'sharp';
import fs from 'fs';

import Upload from './upload.model';

export async function getFile(req, res) {
  try {
    let filename = req.params.filename;
    if (filename.includes('THUMB-')) {
      filename = filename.replace('THUMB-', '');
    }
    
    const file = await Upload.findOne({ filename, isRemoved: false });
    if (!file) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).sendFile(req.params.filename, { root: path.join('upload_storage') });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getListFile(req, res) {
  try {
    const limit = parseInt(req.query.limit, 0) || 50;
    const skip = parseInt(req.query.skip, 0) || 0;
    const uploads = await Upload.find({ isRemoved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Upload.count({ isRemoved: false });
    return res.status(HTTPStatus.OK).json({ uploads, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

// export async function generateThumbnail(req, res) {
//   try {
//     const uploads = await Upload.find({ isRemoved: false });
//     const promises = [];
//     uploads.forEach(item => {
//       if (item.mimetype.includes('image') && fs.existsSync(item.path)) {
//         const thumbPath = `${path.join('upload_storage')}/THUMB-${item.filename}`;
//         const promise = new Promise((resolve, reject) => {
//           sharp(item.path)
//             .resize({ width: 500 })
//             .toBuffer()
//             .then(data => { resolve({ thumbPath, data }); })
//             .catch(error => reject(error));
//         });
//         promises.push(promise);
//       }
//     });
//     const results = await Promise.all(promises);
//     results.forEach((item) => fs.writeFileSync(item.thumbPath, item.data));
//     return res.sendStatus(HTTPStatus.OK);
//   } catch (e) {
//     console.log(e);
//     return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
//   }
// }

export async function upload(req, res) {
  try {
    if (!req.file) {
      throw new Error('File not found!');
    }
    if (req.file.mimetype.includes('image')) {
      const thumbPath = `${path.join('upload_storage')}/THUMB-${req.file.filename}`;
      sharp(req.file.path)
        .resize({ width: 500 })
        .toBuffer()
        .then(data => {
          fs.writeFileSync(thumbPath, data);
        });
        

      const uploaded = await Upload.create({
        ...req.file,
        thumbName: `THUMB-${req.file.filename}`,
        user: req.user._id,
      });
      return res.status(HTTPStatus.OK).json(uploaded);
    }
    throw new Error('Not image!');
  } catch (e) {
    console.error(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
export async function deleteFile(req, res) {
  try {
    const file = await Upload.findOne({ _id: req.params.id, isRemoved: false });
    if (!file) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    if (req.user.role && file.user.toString() !== req.user._id.toString()) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    file.isRemoved = true;
    return res.status(HTTPStatus.OK).json(await file.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
