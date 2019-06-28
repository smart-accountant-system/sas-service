/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Transaction from './transaction.model';
import constants from '../../config/constants';
import Receipt from '../receipt/receipt.model';
import Account from '../account/account.model';

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

    const transactions = await Transaction.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 })
      .populate('fromAccount.id', 'name')
      .populate('toAccount.id', 'name')
      .populate('checkedBy', 'fullname');
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
    // ------------- CHECKING REQ-------------
    const receipt = await Receipt.findOne({ _id: req.body.receipt, isRemoved: false }).populate('payment', '-_id amountMoney');
    if (!receipt || receipt.status == constants.RECEIPT_STATUS.DONE) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    if (req.body.fromAccount.id == req.body.toAccount.id) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    const fromAcc = await Account.findOne({ _id: req.body.fromAccount.id, isRemoved: false });
    if (!fromAcc) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    const toAcc = await Account.findOne({ _id: req.body.toAccount.id, isRemoved: false });
    if (!toAcc) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    if (req.body.fromAccount.type + req.body.toAccount.type !== 1) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    // ---------------------------------------

    const transaction = await Transaction.createTransaction({ ...req.body, amount: receipt.payment.amountMoney }, req.user);

    receipt.status = constants.RECEIPT_STATUS.DONE;
    await receipt.save();

    if (transaction.fromAccount.type == constants.ACCOUNT_TYPE.DEBIT) {
      fromAcc.debit += transaction.amount;
    } else {
      fromAcc.credit += transaction.amount;
    }
    await fromAcc.save();


    if (transaction.toAccount.type == constants.ACCOUNT_TYPE.DEBIT) {
      toAcc.debit += transaction.amount;
    } else {
      toAcc.credit += transaction.amount;
    }
    await toAcc.save();

    transaction
      .populate('fromAccount.id', 'name')
      .populate('toAccount.id', 'name')
      .populate('checkedBy', 'fullname');

    return res.status(HTTPStatus.CREATED).json({ 
      ...transaction.toJSON(), 
      fromAccount: { id: { _id: fromAcc._id, name: fromAcc.name }, type: transaction.fromAccount.type },
      toAccount: { id: { _id: toAcc._id, name: toAcc.name }, type: transaction.toAccount.type },
      checkedBy: { _id: req.user._id, fullname: req.user.fullname } });
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

    const receipt = await Receipt.findById(transaction.receipt);
    receipt.status = constants.RECEIPT_STATUS.NEW;
    await receipt.save();


    const fromAcc = await Account.findById(transaction.fromAccount.id);
    if (transaction.fromAccount.type == constants.ACCOUNT_TYPE.DEBIT) {
      fromAcc.debit -= transaction.amount;
    } else {
      fromAcc.credit -= transaction.amount;
    }
    await fromAcc.save();


    const toAcc = await Account.findById(transaction.toAccount.id);
    if (transaction.toAccount.type == constants.ACCOUNT_TYPE.DEBIT) {
      toAcc.debit += transaction.amount;
    } else {
      toAcc.credit += transaction.amount;
    }
    await toAcc.save();

    transaction.isRemoved = true;
    await transaction.save();
    return res.status(HTTPStatus.OK).json(transaction);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
