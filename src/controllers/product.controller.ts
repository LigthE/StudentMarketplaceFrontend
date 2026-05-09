import type { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService";

type Params = {
  id: string;
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
