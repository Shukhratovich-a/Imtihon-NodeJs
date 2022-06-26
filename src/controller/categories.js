import { InternalServerError, AuthorizationError, NotFoundError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let { id, name } = req.query;
    if (req.params.categoryId) id = req.params.categoryId;

    const subCategories = read("subCategories");

    const categories = read("categories").map((category) => {
      category.subCategories = subCategories.filter(
        (subCategory) => category.categoryId == subCategory.categoryId
      );

      category.subCategories = category.subCategories.map((subCategory) => {
        delete subCategory.categoryId;
        return subCategory;
      });

      return category;
    });

    let data = categories.filter((category) => {
      let byCategoryId = id ? category.categoryId == id : true;
      let byCategoryName = name
        ? category.categoryName.toLowerCase().includes(name.toLowerCase())
        : true;

      return byCategoryId && byCategoryName;
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
    const { categoryName } = req.body;

    const categories = read("categories");
    const subCategories = read("subCategories");

    const data = categories.find(
      (category) => category.categoryName.toLowerCase() == categoryName.toLowerCase()
    );

    if (data) return next(new AuthorizationError(401, "this category name exits"));

    req.body.categoryId = categories.length ? categories.at(-1).categoryId + 1 : 1;

    categories.push(req.body);
    write("categories", categories);

    req.body.subCategories = subCategories.filter(
      (subCategory) => subCategory.categoryId == req.body.categoryId
    );

    req.body.subCategories = req.body.subCategories.map((subCategory) => {
      delete subCategory.categoryId;
      return subCategory;
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
    const { categoryId } = req.params;

    const categories = read("categories");
    const subCategories = read("subCategories");

    let category = categories.find((category) => categoryId == category.categoryId);

    if (!category) return next(new NotFoundError(404, "category not found"));

    category.categoryName = req.body.categoryName || category.categoryName;

    write("categories", categories);

    req.body.categoryId = category.categoryId;
    req.body.subCategories = subCategories.filter(
      (subCategory) => subCategory.categoryId == category.categoryId
    );

    req.body.subCategories = req.body.subCategories.map((subCategory) => {
      delete subCategory.categoryId;
      return subCategory;
    });

    res.status(200).json({
      status: 200,
      message: "category updated",
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const categories = read("categories");
    const subCategories = read("subCategories");

    let categoryIndex = categories.findIndex((category) => categoryId == category.categoryId);

    if (categoryIndex == -1) return next(new NotFoundError(404, "category not found"));

    let [category] = categories.splice(categoryIndex, 1);

    write("categories", categories);

    category.subCategories = subCategories.filter(
      (subCategory) => subCategory.categoryId == category.categoryId
    );

    category.subCategories = category.subCategories.map((subCategory) => {
      delete subCategory.categoryId;
      return subCategory;
    });

    res.status(200).json({
      status: 200,
      message: "category deleted",
      data: category,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, POST, PUT, DELETE };
