import { appSettingsRepo, type AppSettingsRepository } from "../repo/app.repo";
import type { AppSettingsDto } from "../contract/app.dto";

/**
 * Design Pattern: Service Layer
 * Purpose: Business logic layer that orchestrates operations between controllers and repositories.
 * Responsibilities: Handles complex business rules, data transformation, and coordinates multiple repositories if needed.
 */
export class AppSettingsService {
  constructor(private appSettingsRepo: AppSettingsRepository) {}
  async getSettings(): Promise<AppSettingsDto> {
    return await this.appSettingsRepo.getSettings();
  }
  async updateSettings(data: Partial<AppSettingsDto>): Promise<AppSettingsDto> {
    return await this.appSettingsRepo.updateSettings(data);
  }
}

export const appSettingsService = new AppSettingsService(appSettingsRepo);
