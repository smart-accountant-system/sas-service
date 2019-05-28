import HTTPStatus from 'http-status';
import Category from './category.model';

export async function getCategoryList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const categories = await Category.list({ search, queries })
      .skip(skip)
      .limit(limit);
    const total = await Category.count(queries);
    return res.status(HTTPStatus.OK).json({ categories, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailCategory(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.id, isRemoved: false });
    if (!category) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(category);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createCategory(req, res) {
  try {
    const category = await Category.createCategory(req.body, req.user.company);
    return res.status(HTTPStatus.CREATED).json(category);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.id, isRemoved: false });
    if (!category) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    Object.keys(req.body).forEach(key => {
      category[key] = req.body[key];
    });

    await category.save();

    return res.status(HTTPStatus.OK).json(category);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await Category.findOne({ _id: req.params.id, isRemoved: false });
    if (!category) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    category.isRemoved = true;
    await category.save();
    return res.status(HTTPStatus.OK).json(category);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
