import HTTPStatus from 'http-status';
import Customer from './customer.model';

export async function getCustomerList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const queries = (!search) ? { isRemoved: false, company: req.user.company } : 
      { $text: { $search: search }, isRemoved: false, company: req.user.company };
    const customers = await Customer.list({ search, queries })
      .skip(skip)
      .limit(limit);
    const total = await Customer.count(queries);
    return res.status(HTTPStatus.OK).json({ customers, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailCustomer(req, res) {
  try {
    const customer = await Customer
      .findOne({ _id: req.params.id, isRemoved: false, company: req.user.company })
      .populate('createdBy company');
    if (!customer) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(customer);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createCustomer(req, res) {
  try {
    const customer = await Customer.createCustomer(req.body, req.user);
    return res.status(HTTPStatus.CREATED).json(customer);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function updateCustomer(req, res) {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, isRemoved: false });
    if (!customer) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    Object.keys(req.body).forEach(key => {
      customer[key] = req.body[key];
    });

    await customer.save();

    return res.status(HTTPStatus.OK).json(customer);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteCustomer(req, res) {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, isRemoved: false });
    if (!customer) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    customer.isRemoved = true;
    await customer.save();
    return res.status(HTTPStatus.OK).json(customer);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
