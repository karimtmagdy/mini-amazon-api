import type { Request, Response } from "express";
import {
  appSettingsService,
  AppSettingsService,
} from "../services/app-settings.service";
import { catchError } from "../lib/catch.error";

/**
 * Design Pattern: MVC Controller
 * Purpose: Handles HTTP requests/responses and delegates business logic to the service layer.
 * Responsibilities: Request validation, response formatting, and HTTP status code management.
 */
export class AppSettingsController {
  constructor(private appSettingsService: AppSettingsService) {}

  getSettings = catchError(async (_req: Request, res: Response) => {
    const settings = await this.appSettingsService.getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  });

  updateSettings = catchError(async (req: Request, res: Response) => {
    const settings = await this.appSettingsService.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: "Application settings updated successfully",
      data: settings,
    });
  });
}

export const appSettingsController = new AppSettingsController(
  appSettingsService,
);
