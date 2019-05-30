/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Transaction from './transaction.model';

// @Param handler:
//   - startDate: YYYY-MM-DD
//   - endDate: YYYY-MM-DD
//   ---
//   Return: list from [startDate; endDate]
export async function getTransactionList(req, res) {
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

    const transactions = await Transaction.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 });
    const total = await Transaction.count(queries);
    return res.status(HTTPStatus.OK).json({ transactions, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailTransaction(req, res) {
  try {
    const transaction = await Transaction
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company })
      .populate('invoice category company createdBy');
    if (!transaction) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createTransaction(req, res) {
  try {
    const transaction = await Transaction.createTransaction(req.body, req.user);
    return res.status(HTTPStatus.CREATED).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, isRemoved: false });
    if (!transaction) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    transaction.isRemoved = true;
    await transaction.save();
    return res.status(HTTPStatus.OK).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
