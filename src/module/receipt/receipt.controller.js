/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Receipt from './receipt.model';
import Payment from '../payment/payment.model';
import Customer from '../customer/customer.model';

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

    const receipts = await Receipt.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 })
      .populate('customer')
      .populate({
        path: 'payment',
        populate: {
          path: 'category',
        },
      });
    const total = await Receipt.count(queries);
    return res.status(HTTPStatus.OK).json({ receipts, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailReceipt(req, res) {
  try {
    const receipt = await Receipt
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company })
      .populate('customer')
      .populate({
        path: 'payment',
        populate: {
          path: 'category',
        },
      });
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
    // ------------- CHECKING REQ-------------
    const payment = await Payment.findOne({ _id: req.body.payment, isRemoved: false });
    if (!payment) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    } else if (payment.receipt) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    const customer = await Customer.findOne({ _id: req.body.customer, isRemoved: false });
    if (!customer) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }
    // ---------------------------------------


    const { _id } = await Receipt.createReceipt(req.body, req.user);
    const receipt = await Receipt.findById(_id).populate('customer')
      .populate({
        path: 'payment',
        populate: {
          path: 'category',
        },
      });

    payment.receipt = _id;
    await payment.save();


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

    const payment = await Payment.findById(receipt.payment);
    payment.receipt = undefined;
    await payment.save();

    return res.status(HTTPStatus.OK).json(receipt);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
