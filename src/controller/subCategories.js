import { InternalServerError, AuthorizationError, NotFoundError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let { id, name } = req.query;
    if (req.params.subCategoryId) id = req.params.subCategoryId;

    const products = read("products");

    const subCategories = read("subCategories").map((subCategory) => {
      subCategory.products = products.filter(
        (product) => product.subCategoryId == subCategory.subCategoryId
      );

      subCategory.products = subCategory.products.map((product) => {
        delete product.subCategoryId;
        return product;
      });

      delete subCategory.categoryId;
      return subCategory;
    });

    let data = subCategories.filter((subCategory) => {
      let bySubCategoryId = id ? subCategory.subCategoryId == id : true;
      let bySubCategoryName = name
        ? subCategory.subCategoryName.toLowerCase().includes(name.toLowerCase())
        : true;

      return bySubCategoryId && bySubCategoryName;
    });

    if (!data.length) return next(new NotFoundError(404, "this category not found"));

    res.status(200).json({
      status: 200,
      data: data,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    const { categoryId, subCategoryName } = req.body;

    const categories = read("categories");
    const subCategories = read("subCategories");
    const products = read("products");

    const checkCategoryId = categories.find((category) => category.categoryId == categoryId);
    if (!checkCategoryId) return next(new AuthorizationError(401, "this category does not exist"));

    const data = subCategories.find(
      (subCategory) =>
        subCategory.subCategoryName.toLowerCase() == subCategoryName.toLowerCase() &&
        subCategory.categoryId == categoryId
    );

    if (data) return next(new AuthorizationError(401, "this sub category name exits"));

    req.body.subCategoryId = subCategories.length ? subCategories.at(-1).subCategoryId + 1 : 1;

    subCategories.push(req.body);
    write("subCategories", subCategories);

    delete req.body.categoryId;

    req.body.products = products.filter(
      (product) => product.subCategoryId == req.body.subCategoryId
    );

    req.body.products = req.body.products.map((product) => {
      delete product.subCategoryId;
      return product;
    });

    res.status(201).json({
      status: 201,
      message: "category created",
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const PUT = (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const { categoryId, subCategoryName } = req.body;

    const categories = read("categories");
    const subCategories = read("subCategories");
    const products = read("products");

    const checkCategoryId = categories.find((category) => category.categoryId == categoryId);
    if (!checkCategoryId) return next(new AuthorizationError(401, "this category does not exist"));

    let subCategory = subCategories.find(
      (subCategory) => subCategoryId == subCategory.subCategoryId
    );

    if (!subCategory) return next(new NotFoundError(404, "category not found"));

    subCategory.categoryId = categoryId || subCategory.categoryId;
    subCategory.subCategoryName = subCategoryName || subCategory.subCategoryName;

    write("subCategories", subCategories);

    subCategory.products = products.filter((product) => subCategoryId == product.subCategoryId);

    subCategory.products = subCategory.products.map((product) => {
      delete product.subCategoryId;
      return product;
    });

    res.status(200).json({
      status: 200,
      message: "sub category updated",
      data: subCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    const subCategories = read("subCategories");
    const products = read("products");

    let subCategoryIndex = subCategories.findIndex(
      (subCategory) => subCategoryId == subCategory.subCategoryId
    );

    if (subCategoryIndex == -1) return next(new NotFoundError(404, "category not found"));

    let [subCategory] = subCategories.splice(subCategoryIndex, 1);

    write("subCategories", subCategories);

    subCategory.products = products.filter((product) => subCategoryId == product.subCategoryId);

    subCategory.products = subCategory.products.map((product) => {
      delete product.subCategoryId;
      return product;
    });

    res.status(200).json({
      status: 200,
      message: "sub category deleted",
      data: subCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, POST, PUT, DELETE };
