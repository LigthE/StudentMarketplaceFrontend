import type { Request, Response, NextFunction } from "express";
import * as productService from "../services/productService";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
};