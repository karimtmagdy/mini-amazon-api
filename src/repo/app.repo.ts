import { AppSettings } from "../models/app.model";
import type { AppSettingsDto } from "../contract/app.dto";

/**
 * Design Pattern: Repository Pattern
 * Purpose: Abstracts data access logic and provides a collection-like interface for domain objects.
 * Responsibilities: Handles all database operations (CRUD) and shields the service layer from data access details.
 */
export class AppSettingsRepository {
  async getSettings(): Promise<AppSettingsDto> {
    let settings = await AppSettings.findOne({ id: "app-settings" });
    if (!settings) {
      settings = await AppSettings.create({ id: "app-settings" });
    }
    return settings.toObject() as AppSettingsDto;
  }
  async updateSettings(data: Partial<AppSettingsDto>): Promise<AppSettingsDto> {
    const settings = await AppSettings.findOneAndUpdate(
      { id: "app-settings" },
      { $set: data },
      { new: true, upsert: true, runValidators: true },
    );
    return settings.toObject() as AppSettingsDto;
  }
}

export const appSettingsRepo = new AppSettingsRepository();
