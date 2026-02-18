import { z } from "zod/v4";

/**
 * ============================================================================
 * 🛡️ ZOD V4 COMPREHENSIVE METHODS GUIDE
 * ============================================================================
 * This guide covers the most powerful and modern features of Zod V4,
 * including new top-level functions, enhanced branding, and encoding/decoding.
 */

// 1. BASIC TYPES
// ----------------------------------------------------------------------------
const basics = z.object({
  name: z.string(),
  age: z.number(),
  isActive: z.boolean(),
  bigInt: z.bigint(),
  birthday: z.date(),
  anyValue: z.any(),
  unknownValue: z.unknown(),
  neverValue: z.never(),
  voidValue: z.void(),
  nullValue: z.null(),
  undefinedValue: z.undefined(),
});

// 2. NEW V4 TOP-LEVEL STRING FUNCTIONS
// ----------------------------------------------------------------------------
// In V4, many string refinements are now high-performance top-level functions.
const modernStrings = z.object({
  email: z.email({ message: "Invalid email address" }),
  url: z.url({ message: "Invalid URL" }),
  uuid: z.uuid(),
  nanoid: z.nanoid(),
  cuid: z.cuid(),
  cuid2: z.cuid2(),
  ulid: z.ulid(),
  jwt: z.jwt(),
  ip: z.ipv4(), // or z.ipv6()
  base64: z.base64(),
  emoji: z.emoji(),
});

// 3. BUILT-IN STRING TRANSFORMS (V4)
// ----------------------------------------------------------------------------
// Methods like trim and slugify are now part of the standard chain.
const transformedString = z
  .string()
  .trim()
  .toLowerCase()
  .slugify() // Transforms "Hello World" -> "hello-world"
  .min(3)
  .max(100);

// 4. OBJECT MANIPULATION
// ----------------------------------------------------------------------------
const baseUser = z.object({
  username: z.string(),
  email: z.email(),
});

const extendedUser = baseUser.extend({
  password: z.string().min(8),
  role: z.enum(["admin", "user"]),
});

const partialUser = extendedUser.partial(); // All fields optional
const pickedUser = extendedUser.pick({ username: true }); // Only username
const omittedUser = extendedUser.omit({ password: true }); // Everything except password
const strictUser = extendedUser.strict(); // No extra fields allowed
const caughtUser = extendedUser.catch({
  // Fallback on error
  username: "guest",
  email: "guest@example.com",
  password: "password123",
  role: "user",
});

// 5. ARRAYS, TUPLES, & COLLECTIONS
// ----------------------------------------------------------------------------
const collections = z.object({
  list: z.array(z.string()).min(1).max(10),
  tuple: z.tuple([z.string(), z.number()]),
  set: z.set(z.number()),
  map: z.map(z.string(), z.number()),
  record: z.record(z.string(), z.number()), // e.g., { [key: string]: number }
});

// 6. COERCION (Automatic type casting)
// ----------------------------------------------------------------------------
const searchParams = z.object({
  page: z.coerce.number().default(1),
  isActive: z.coerce.boolean(),
  startDate: z.coerce.date(),
});

// 7. ENHANCED BRANDING (V4)
// ----------------------------------------------------------------------------
// V4 supports branding for both "in" and "out" directions via generics.
const UserId = z.string().brand<"UserId">();
type UserId = z.infer<typeof UserId>;

const InOutBrand = z.string().brand<"Token", "inout">();

// 8. ENCODING & DECODING
// ----------------------------------------------------------------------------
// V4 introduces explicit encode/decode steps.
const encodedSchema = z.string().transform((val) => val.length);
// .encode() can be used to go from output back to input if a transformer is reversible.

// 9. REFINEMENTS & SUPER REFINEMENTS
// ----------------------------------------------------------------------------
const passwordSchema = z
  .string()
  .min(8)
  .superRefine((val, ctx) => {
    if (!/[A-Z]/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain at least one uppercase letter",
      });
    }
  });

const confirmPassword = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

// 10. UNIONS & DISCIMINATED UNIONS
// ----------------------------------------------------------------------------
const shapeUnion = z.union([z.string(), z.number()]);

const apiResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.any() }),
  z.object({
    status: z.literal("error").or(z.literal("fail")),
    message: z.string(),
  }),
]);

// 11. ADVANCED: PIPES & PREPROCESS
// ----------------------------------------------------------------------------
const numPipe = z.string().pipe(z.coerce.number()); // string -> number
const preprocessed = z.preprocess((val) => String(val), z.string());

// 12. JSON SCHEMA INTEGRATION
// ----------------------------------------------------------------------------
// V4 has built-in JSON Schema generation.
const schemaForExport = z.object({ foo: z.string() });
const jsonSchema = schemaForExport.toJSONSchema();

// 13. DATE & TIME (ISO 8601)
// ----------------------------------------------------------------------------
const dateSpecs = z.object({
  justDate: z.iso.date(), // YYYY-MM-DD
  dateTime: z.iso.datetime(), // ISO string
  duration: z.iso.duration(), // P1Y2M...
  time: z.iso.time(), // HH:mm:ss
});

// 14. NEW V4 UTILITIES: EXACT OPTIONAL & PREFAULT
// ----------------------------------------------------------------------------
const advancedUtils = z.object({
  // exactOptional: value must be the type OR missing (not undefined)
  // Standard optional() allows { foo: undefined }
  // exactOptional() only allows { foo: "bar" } or {}
  apiKey: z.string().exactOptional(),

  // prefault: provides a default value to the INPUT BEFORE validation/transformation
  prefilled: z.string().prefault("DEFAULT_INPUT"),
});

// 15. CUSTOM ERROR MAPPING & TREEIFY (V4)
// ----------------------------------------------------------------------------
// In V4, inline messages are simplified to a single `message` parameter.
const customErrorSchema = z.string({
  message: "Invalid or missing string",
});

// V4 recommends treeifyError for better error visualization
// Example: const tree = z.treeifyError(error);

/**
 * PRO TIPS:
 * 1. Use `.spa()` (safeParseAsync) for quick async validation.
 * 2. Use `z.infer<typeof schema>` to extract TypeScript types.
 * 3. Use `.overwrite()` to completely replace the validation logic for a node.
 * 4. Use `.describe()` to add documentation that shows up in IDE tooltips.
 * 5. In V4, `.format()` and `.flatten()` on ZodError are deprecated in favor of `z.treeifyError()`.
 */

export const ZodV4Guide = {
  basics,
  modernStrings,
  transformedString,
  searchParams,
  apiResult,
  dateSpecs,
  advancedUtils,
  UserId,
};
// في pagination.schema.ts
export const paginationSchema2 = z.object({
  page: z.number().int().positive().min(1).default(1).meta({
    description: "Current page number",
    example: 1,
  }),

  limit: z.number().int().positive().min(1).max(100).default(10).meta({
    description: "Items per page",
    example: 10,
    maxAllowed: 100,
  }),

  total: z.number().int().positive().default(0).meta({
    description: "Total number of items",
    computed: true,
  }),
});

// استخدام الـ metadata في API documentation
function generateApiDocs(schema: z.ZodObject<any>) {
  Object.entries(schema.shape).forEach(([key, field]) => {
    const meta = (field as any)._def.meta;
    console.log(`${key}: ${meta?.description}`);
    console.log(`  Example: ${meta?.example}`);
  });
}
// برضو مقولتليش ال loose وفيه حاجات مختلفه تاني انت مغطتش كله وازي اقدر اتعامل مع ال register مفهمتش فيدتها برضو ولا ال meta هل بستفاد منها فيه pagination مثلا ؟
