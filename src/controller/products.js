import { InternalServerError, AuthorizationError, NotFoundError } from "../utils/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let { id, model, productName, color, price, categoryId, subCategoryId } = req.query;
    if (req.params.productId) id = req.params.productId;

    const products = read("products");
    const subCategories = read("subCategories");

    let data = [];
    if (categoryId) {
      let filtredsSubategories = subCategories.filter(
        (subCategory) => subCategory.categoryId == categoryId
      );
      filtredsSubategories.forEach((subCategory) => {
        products.forEach((product) => {
          if (product.subCategoryId == subCategory.subCategoryId) data.push(product);
        });
      });

      data = data.filter((item) => item.productId);
    } else {
      data = products.filter((product) => {
        let byProductId = id ? product.productId == id : true;
        let byProductName = productName
          ? product.productName.toLowerCase().includes(productName.toLowerCase())
          : true;
        let byProductModel = model
          ? product.model.toLowerCase().includes(model.toLowerCase())
          : true;
        let byProductColor = color ? product.color == color : true;
        let byProductPrice = price ? product.price == price : true;
        let byProductSubCategoryId = subCategoryId ? product.subCategoryId == subCategoryId : true;

        return (
          byProductId &&
          byProductName &&
          byProductModel &&
          byProductColor &&
          byProductPrice &&
          byProductSubCategoryId
        );
      });
    }
    if (!data.length) return next(new NotFoundError(404, "this product not found"));

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
    const { subCategoryId, productName, price, color, model } = req.body;

    const subCategories = read("subCategories");
    const products = read("products");

    const checkSubCategoryId = subCategories.find(
      (subCategory) => subCategory.subCategoryId == subCategoryId
    );
    if (!checkSubCategoryId)
      return next(new AuthorizationError(401, "this category does not exist"));

    req.body.productId = products.length ? products.at(-1).productId + 1 : 1;

    products.push(req.body);
    write("products", products);

    res.status(201).json({
      status: 201,
      message: "product created",
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const PUT = (req, res, next) => {
  try {
    const { subCategoryId, productName, price, color, model } = req.body;
    const { productId } = req.params;

    const subCategories = read("subCategories");
    const products = read("products");

    let product = products.find((product) => productId == product.productId);

    if (!product) return next(new NotFoundError(404, "product not found"));

    const checkSubCategoryId = subCategories.find(
      (subCategory) => subCategory.subCategoryId == subCategoryId
    );
    if (!checkSubCategoryId)
      return next(new AuthorizationError(401, "this category does not exist"));

    product.subCategoryId = subCategoryId || product.subCategoryId;
    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.color = color || product.color;
    product.model = model || product.model;

    write("products", products);

    res.status(201).json({
      status: 201,
      message: "product updated",
      data: product,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    const { productId } = req.params;

    const products = read("products");

    let productIndex = products.findIndex((product) => productId == product.productId);

    if (productIndex == -1) return next(new NotFoundError(404, "product not found"));

    let [product] = products.splice(productIndex, 1);

    write("products", products);

    res.status(200).json({
      status: 200,
      message: "product deleted",
      data: product,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default { GET, POST, PUT, DELETE };
