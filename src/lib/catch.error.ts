import type { NextFunction, Request, Response } from "express";

export function catchError(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
