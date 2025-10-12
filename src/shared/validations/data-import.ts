import { z } from "zod";

/**
 * Base code item schema
 */
const BaseCodeItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  code: z.string().min(1, "Code content is required"),
  language: z.string().min(1, "Language is required"),
  createdAt: z.number().positive("Created timestamp must be positive"),
  updatedAt: z.number().positive("Updated timestamp must be positive"),
});

/**
 * Draft schema validation
 */
export const CodeDraftSchema = BaseCodeItemSchema.extend({
  type: z.literal("draft"),
  title: z.string().optional(),
  description: z.string().optional(),
  autoSaved: z.boolean(),
});

/**
 * Submitted paste schema validation
 */
export const SubmittedPasteSchema = BaseCodeItemSchema.extend({
  type: z.literal("paste"),
  pasteId: z.string().min(1, "Paste ID is required"),
  title: z.string().optional(),
  adminPassword: z.string().min(1, "Admin password is required"),
  url: z.string().min(1, "URL is required"),
  expiresAt: z.number().positive().optional(),
  maxViews: z.number().positive().optional(),
});

/**
 * Export data schema validation
 */
export const ExportDataSchema = z.object({
  version: z.string().min(1, "Version is required"),
  exportDate: z.number().positive("Export date must be a valid timestamp"),
  drafts: z.array(CodeDraftSchema).default([]),
  pastes: z.array(SubmittedPasteSchema).default([]),
});

/**
 * Legacy export format support (optional fields for backward compatibility)
 */
export const LegacyExportDataSchema = z.object({
  version: z.string().optional(),
  exportDate: z.number().optional(),
  exportedAt: z.number().optional(), // Alternative timestamp field
  drafts: z.array(CodeDraftSchema).default([]),
  pastes: z.array(SubmittedPasteSchema).default([]),
});

/**
 * Type exports
 */
export type CodeDraftValidation = z.infer<typeof CodeDraftSchema>;
export type SubmittedPasteValidation = z.infer<typeof SubmittedPasteSchema>;
export type ExportDataValidation = z.infer<typeof ExportDataSchema>;
export type LegacyExportDataValidation = z.infer<typeof LegacyExportDataSchema>;

/**
 * Validate import data with detailed error reporting
 * @param data Unknown data to validate
 * @returns Validation result with parsed data or error details
 */
export function validateImportData(data: unknown): {
  success: boolean;
  data?: ExportDataValidation;
  errors?: string[];
} {
  try {
    // Try modern format first
    const parsed = ExportDataSchema.safeParse(data);

    if (parsed.success) {
      return {
        success: true,
        data: parsed.data,
      };
    }

    // Try legacy format
    const legacyParsed = LegacyExportDataSchema.safeParse(data);

    if (legacyParsed.success) {
      // Convert legacy format to modern format
      const modernData: ExportDataValidation = {
        version: legacyParsed.data.version || "1.0.0",
        exportDate:
          legacyParsed.data.exportDate ||
          legacyParsed.data.exportedAt ||
          Date.now(),
        drafts: legacyParsed.data.drafts,
        pastes: legacyParsed.data.pastes,
      };

      return {
        success: true,
        data: modernData,
      };
    }

    // Collect error messages from both attempts
    const errors: string[] = [];

    if (parsed.error) {
      parsed.error.issues.forEach((issue) => {
        errors.push(`${issue.path.join(".")}: ${issue.message}`);
      });
    }

    return {
      success: false,
      errors: errors.length > 0 ? errors : ["Invalid data format"],
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Unknown validation error occurred",
      ],
    };
  }
}

/**
 * Validate a single draft
 * @param draft Draft data to validate
 * @returns Validation result
 */
export function validateDraft(draft: unknown): {
  success: boolean;
  data?: CodeDraftValidation;
  error?: string;
} {
  try {
    const parsed = CodeDraftSchema.safeParse(draft);

    if (parsed.success) {
      return {
        success: true,
        data: parsed.data,
      };
    }

    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid draft format",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate a single paste
 * @param paste Paste data to validate
 * @returns Validation result
 */
export function validatePaste(paste: unknown): {
  success: boolean;
  data?: SubmittedPasteValidation;
  error?: string;
} {
  try {
    const parsed = SubmittedPasteSchema.safeParse(paste);

    if (parsed.success) {
      return {
        success: true,
        data: parsed.data,
      };
    }

    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid paste format",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sanitize and validate array of drafts
 * @param drafts Array of draft data
 * @returns Array of valid drafts with error report
 */
export function sanitizeDrafts(drafts: unknown[]): {
  valid: CodeDraftValidation[];
  invalid: number;
  errors: string[];
} {
  const valid: CodeDraftValidation[] = [];
  const errors: string[] = [];
  let invalidCount = 0;

  drafts.forEach((draft, index) => {
    const result = validateDraft(draft);
    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalidCount++;
      errors.push(`Draft ${index}: ${result.error || "Invalid format"}`);
    }
  });

  return {
    valid,
    invalid: invalidCount,
    errors,
  };
}

/**
 * Sanitize and validate array of pastes
 * @param pastes Array of paste data
 * @returns Array of valid pastes with error report
 */
export function sanitizePastes(pastes: unknown[]): {
  valid: SubmittedPasteValidation[];
  invalid: number;
  errors: string[];
} {
  const valid: SubmittedPasteValidation[] = [];
  const errors: string[] = [];
  let invalidCount = 0;

  pastes.forEach((paste, index) => {
    const result = validatePaste(paste);
    if (result.success && result.data) {
      valid.push(result.data);
    } else {
      invalidCount++;
      errors.push(`Paste ${index}: ${result.error || "Invalid format"}`);
    }
  });

  return {
    valid,
    invalid: invalidCount,
    errors,
  };
}
