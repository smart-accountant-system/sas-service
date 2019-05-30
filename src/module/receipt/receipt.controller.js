/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Receipt from './receipt.model';

// @Param handler:
//   - startDate: YYYY-MM-DD
//   - endDate: YYYY-MM-DD
//   ---
//   Return: list from [startDate; endDate]
export async function getReceiptList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
  if (endDate) {
    endDate.setDate(new Date(req.query.endDate).getDate() + 1);
  }
  try {
    const queries = (startDate && endDate) ? { isRemoved: false, company: req.user.company, createdAt: { $gte: startDate, $lt: endDate } } :
      (startDate) ? { isRemoved: false, company: req.user.company, createdAt: { $gte: startDate } } :
        (endDate) ? { isRemoved: false, company: req.user.company, createdAt: { $lt: endDate } } :
          { isRemoved: false, company: req.user.company };

    const receipts = await Receipt.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 });
    const total = await Receipt.count(queries);
    return res.status(HTTPStatus.OK).json({ receipts, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailReceipt(req, res) {
  try {
    const receipt = await Receipt
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company });
    if (!receipt) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(receipt);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createReceipt(req, res) {
  try {
    const receipt = await Receipt.createReceipt(req.body, req.user);
    return res.status(HTTPStatus.CREATED).json(receipt);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
export async function deleteReceipt(req, res) {
  try {
    const receipt = await Receipt.findOne({ _id: req.params.id, isRemoved: false });
    if (!receipt) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    receipt.isRemoved = true;
    await receipt.save();
    return res.status(HTTPStatus.OK).json(receipt);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
