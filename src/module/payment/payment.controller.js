import HTTPStatus from 'http-status';
import Payment from './payment.model';

// @Param handler:
//   - startDate: YYYY-MM-DD
//   - endDate: YYYY-MM-DD
//   ---
//   Return: list from [startDate; endDate]
export async function getPaymentList(req, res) {
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

    const payments = await Payment.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 });
    const total = await Payment.count(queries);
    return res.status(HTTPStatus.OK).json({ payments, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailPayment(req, res) {
  try {
    const payment = await Payment
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company })
      .populate('invoice category company createdBy');
    if (!payment) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(payment);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createPayment(req, res) {
  try {
    const payment = await Payment.createPayment(req.body, req.user);
    return res.status(HTTPStatus.CREATED).json(payment);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function updatePayment(req, res) {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, isRemoved: false });
    if (!payment) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    Object.keys(req.body).forEach(key => {
      payment[key] = req.body[key];
    });

    await payment.save();

    return res.status(HTTPStatus.OK).json(payment);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deletePayment(req, res) {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, isRemoved: false });
    if (!payment) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    payment.isRemoved = true;
    await payment.save();
    return res.status(HTTPStatus.OK).json(payment);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
