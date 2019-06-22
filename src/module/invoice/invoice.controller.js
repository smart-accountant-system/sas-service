/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Invoice from './invoice.model';

// @Param handler:
//   - startDate: YYYY-MM-DD
//   - endDate: YYYY-MM-DD
//   ---
//   Return: list from [startDate; endDate]
export async function getInvoiceList(req, res) {
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

    const invoices = await Invoice.find(queries).skip(skip).limit(limit).sort({ createdAt: 1 })
      .populate('createdBy', '-_id username fullname');
    const total = await Invoice.count(queries);
    return res.status(HTTPStatus.OK).json({ invoices, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailInvoice(req, res) {
  try {
    const invoice = await Invoice
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company })
      .populate('createdBy', '-_id username fullname');
    if (!invoice) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(invoice);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createInvoice(req, res) {
  try {
    const invoice = await Invoice.createInvoice(req.body, req.user);
    return res.status(HTTPStatus.CREATED).json(invoice);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteInvoice(req, res) {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, isRemoved: false });
    if (!invoice) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    invoice.isRemoved = true;
    await invoice.save();
    return res.status(HTTPStatus.OK).json(invoice);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
