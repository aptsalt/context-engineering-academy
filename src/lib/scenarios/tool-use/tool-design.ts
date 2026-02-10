import type { PlaygroundScenario } from "@/lib/playground-data";

export const toolDesignScenario: PlaygroundScenario = {
  id: "tool-design",
  name: "Tool Design Principles",
  emphasis: "fewer-retries",
  emphasisLabel: "Fewer Retries",
  inputLabel: "Engineer",
  meta: {
    title: "Tool Design Scenario",
    description:
      "A file management agent must execute a complex multi-step operation. Each tool design principle you enable improves the model's ability to select the correct tool and call it with valid arguments. Watch tool call accuracy climb from random guessing to precise execution.",
    infoCards: [
      { icon: "Code", label: "Agent Type", value: "File management agent" },
      { icon: "Package", label: "Tools Available", value: "8 file operations" },
      { icon: "AlertTriangle", label: "Challenge", value: "Multi-step file ops with rename" },
    ],
  },
  customerMessage:
    "Move all .pdf files from /downloads to /documents/reports and rename them with today's date prefix.",
  recommendedBuildOrder: [
    "clear-names",
    "zod-schemas",
    "descriptions",
    "error-responses",
    "input-validation",
    "usage-examples",
  ],
  components: [
    {
      id: "clear-names",
      name: "Clear Tool Names",
      shortName: "Names",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 180,
      description: "Unambiguous, verb-noun tool names that signal intent clearly.",
      content: `<tool_naming_conventions>
## Tool Names — Verb + Noun Pattern

Each tool name follows the verb_noun pattern to eliminate ambiguity:

- list_directory — List files and folders in a directory
- move_file — Move a file from one path to another
- copy_file — Copy a file to a new location
- rename_file — Rename a file without changing its location
- delete_file — Permanently delete a file
- create_directory — Create a new directory (including parents)
- read_file_metadata — Get file size, type, modified date
- search_files — Find files matching a glob pattern

## Why This Matters
Bad names cause wrong tool selection:
- "handle" — handle what? move? delete? rename?
- "process" — too vague, model guesses
- "file_op" — which operation?
- "manage" — meaningless without context
</tool_naming_conventions>`,
    },
    {
      id: "zod-schemas",
      name: "Zod Schemas",
      shortName: "Schemas",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 320,
      description: "Typed parameter schemas with constraints that prevent invalid tool calls.",
      content: `<tool_schemas>
## Zod Schemas for File Operations

\`\`\`typescript
const MoveFileSchema = z.object({
  source_path: z.string()
    .min(1)
    .describe("Absolute path to the file to move"),
  destination_path: z.string()
    .min(1)
    .describe("Absolute path for the new file location"),
  overwrite: z.boolean()
    .default(false)
    .describe("Whether to overwrite if destination exists"),
});

const SearchFilesSchema = z.object({
  directory: z.string()
    .min(1)
    .describe("Directory to search in"),
  pattern: z.string()
    .describe("Glob pattern, e.g. '*.pdf' or '**/*.ts'"),
  recursive: z.boolean()
    .default(true)
    .describe("Search subdirectories"),
});

const RenameFileSchema = z.object({
  file_path: z.string()
    .min(1)
    .describe("Absolute path to the file to rename"),
  new_name: z.string()
    .min(1)
    .regex(/^[^/\\\\]+$/, "Name only, no path separators")
    .describe("New filename without directory path"),
});

const CreateDirectorySchema = z.object({
  path: z.string()
    .min(1)
    .describe("Absolute path of directory to create"),
  recursive: z.boolean()
    .default(true)
    .describe("Create parent directories if they don't exist"),
});
\`\`\`
</tool_schemas>`,
    },
    {
      id: "descriptions",
      name: "Detailed Descriptions",
      shortName: "Descriptions",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 290,
      description: "Rich tool descriptions explaining when to use each tool and what it returns.",
      content: `<tool_descriptions>
## move_file
Move a file from one location to another. The source file is removed after
a successful copy to the destination. Use this when you need to relocate a
file — not for renaming (use rename_file instead). Returns the new file path
on success.

When to use: Relocating files between directories.
When NOT to use: Renaming a file in the same directory (use rename_file).
Returns: { success: boolean, new_path: string, bytes_moved: number }

## rename_file
Rename a file within its current directory. Does not move the file to a
different location. Use move_file if you need to change directories AND
rename simultaneously.

When to use: Changing a filename without moving it.
When NOT to use: Moving to a different directory (use move_file).
Returns: { success: boolean, old_name: string, new_name: string }

## search_files
Search for files matching a glob pattern within a directory. Returns an
array of matching file paths. Use this before move/delete operations to
discover which files to act on.

When to use: Finding files before batch operations.
Returns: { files: string[], count: number, directory: string }

## create_directory
Create a new directory, optionally creating parent directories. Use this
before move_file if the destination directory might not exist.

When to use: Ensuring destination paths exist before file moves.
Returns: { success: boolean, path: string, created: boolean }
</tool_descriptions>`,
    },
    {
      id: "error-responses",
      name: "Error Responses",
      shortName: "Errors",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 240,
      description: "Structured error responses with error codes and recovery suggestions.",
      content: `<error_handling>
## Structured Error Responses

Every tool returns errors in a consistent format:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "File not found at /downloads/report.pdf",
    "suggestion": "Use search_files to verify the file exists first"
  }
}
\`\`\`

## Error Codes and Recovery Actions

| Code | Meaning | Recovery |
|------|---------|----------|
| FILE_NOT_FOUND | Source file doesn't exist | search_files to find correct path |
| DIR_NOT_FOUND | Directory doesn't exist | create_directory first |
| ALREADY_EXISTS | Destination file exists | Set overwrite: true or rename first |
| PERMISSION_DENIED | No write access | Check permissions with read_file_metadata |
| INVALID_PATH | Path contains invalid characters | Sanitize path, check for special chars |
| DISK_FULL | Not enough space | Check available space, clean up first |

## Error Recovery Pattern
1. Parse the error code
2. Execute the suggested recovery action
3. Retry the original operation
4. If retry fails, report with full context
</error_handling>`,
    },
    {
      id: "input-validation",
      name: "Input Validation",
      shortName: "Validation",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 200,
      description: "Pre-call validation rules that catch bad inputs before execution.",
      content: `<input_validation>
## Pre-Call Validation Rules

Before calling any file operation tool, validate:

### Path Validation
- Paths must be absolute (start with / on Unix, drive letter on Windows)
- No path traversal (reject paths containing "..")
- No null bytes or control characters
- Maximum path length: 4096 characters
- Normalize slashes: convert \\ to / on Unix

### Filename Validation
- No forward slashes or backslashes in filenames
- No reserved characters: < > : " | ? *
- Cannot be "." or ".."
- Maximum filename length: 255 characters
- Preserve file extension when renaming

### Batch Operation Validation
- Verify source files exist before starting batch operations
- Check destination directory exists or create it
- Validate no circular references (moving dir into itself)
- Confirm sufficient disk space for copy operations
- Set a maximum batch size (default: 1000 files)

### Date Prefix Format
When adding date prefixes to filenames:
- Format: YYYY-MM-DD_original-name.ext
- Example: 2024-12-15_quarterly-report.pdf
- Preserve the original extension
</input_validation>`,
    },
    {
      id: "usage-examples",
      name: "Usage Examples",
      shortName: "Examples",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 350,
      description: "Worked examples showing multi-step tool orchestration for complex tasks.",
      content: `<usage_examples>
## Example 1: Move and Rename Files (Batch)

Task: "Move all .csv files from /data/raw to /data/processed with a date prefix"

Step 1 — Find the files:
\`\`\`json
search_files({ "directory": "/data/raw", "pattern": "*.csv" })
→ { "files": ["/data/raw/sales.csv", "/data/raw/users.csv"], "count": 2 }
\`\`\`

Step 2 — Ensure destination exists:
\`\`\`json
create_directory({ "path": "/data/processed", "recursive": true })
→ { "success": true, "path": "/data/processed", "created": true }
\`\`\`

Step 3 — Move each file:
\`\`\`json
move_file({ "source_path": "/data/raw/sales.csv", "destination_path": "/data/processed/sales.csv" })
→ { "success": true, "new_path": "/data/processed/sales.csv" }
\`\`\`

Step 4 — Rename with date prefix:
\`\`\`json
rename_file({ "file_path": "/data/processed/sales.csv", "new_name": "2024-12-15_sales.csv" })
→ { "success": true, "old_name": "sales.csv", "new_name": "2024-12-15_sales.csv" }
\`\`\`

## Example 2: Error Recovery

\`\`\`json
move_file({ "source_path": "/tmp/report.pdf", "destination_path": "/archive/2024/report.pdf" })
→ { "success": false, "error": { "code": "DIR_NOT_FOUND", "suggestion": "create_directory first" } }

create_directory({ "path": "/archive/2024", "recursive": true })
→ { "success": true }

move_file({ "source_path": "/tmp/report.pdf", "destination_path": "/archive/2024/report.pdf" })
→ { "success": true }
\`\`\`
</usage_examples>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Guessing Blind",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I'll try to move your PDF files.\n\nfile_operation({ action: \"move\", files: \"*.pdf\", from: \"downloads\", to: \"documents/reports\" })\n\nError: Unknown function 'file_operation'. I'm not sure what tools are available. Can you tell me what commands I can use?",
      issues: [
        "Invents a non-existent tool name",
        "Uses relative paths instead of absolute",
        "Tries to do everything in one call",
        "No awareness of available tools",
        "Cannot recover from errors",
      ],
      strengths: [],
    },
    {
      id: "names-only",
      label: "Right Tool, Wrong Call",
      requiredComponents: ["clear-names"],
      score: 20,
      agentResponse:
        "I'll move your PDF files to the reports folder.\n\nmove_file({ file: \"/downloads/*.pdf\", destination: \"/documents/reports\" })\n\nHmm, that didn't seem to work. Let me try:\n\nsearch_files({ dir: \"/downloads\", type: \"pdf\" })\n\nI'm selecting the right tools but I'm not sure about the exact parameter names or formats.",
      issues: [
        "Correct tool names but wrong parameter names",
        "Tries glob pattern in move_file (only handles single files)",
        "Wrong parameter names (file vs source_path, dir vs directory)",
        "No plan for the rename step",
        "No error recovery strategy",
      ],
      strengths: [
        "Selects correct tools by name (search_files, move_file)",
        "Understands the task requires search then move",
      ],
    },
    {
      id: "names-schemas",
      label: "Valid Calls, No Strategy",
      requiredComponents: ["clear-names", "zod-schemas"],
      score: 35,
      agentResponse:
        "Let me find the PDF files first.\n\nsearch_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\", \"recursive\": false })\n\nFound 3 files. Now moving them:\n\nmove_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/report.pdf\", \"overwrite\": false })\n\nError: DIR_NOT_FOUND. I'm not sure how to handle this error. Should I try a different path?",
      issues: [
        "Doesn't know to create the destination directory first",
        "Cannot interpret error codes without error response docs",
        "Forgets the rename step entirely",
        "No understanding of when to use rename_file vs move_file",
        "Stops on first error instead of recovering",
      ],
      strengths: [
        "Valid parameter names and types from schemas",
        "Correct search pattern syntax",
        "Proper use of absolute paths",
        "Understands sequential tool calls",
      ],
    },
    {
      id: "names-schemas-descriptions",
      label: "Correct Strategy",
      requiredComponents: ["clear-names", "zod-schemas", "descriptions"],
      score: 50,
      agentResponse:
        "I'll handle this in steps.\n\nStep 1 — Find PDFs:\nsearch_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\" })\n-> Found: report.pdf, invoice.pdf, slides.pdf\n\nStep 2 — Ensure destination exists:\ncreate_directory({ \"path\": \"/documents/reports\", \"recursive\": true })\n\nStep 3 — Move each file:\nmove_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/report.pdf\" })\nmove_file({ \"source_path\": \"/downloads/invoice.pdf\", \"destination_path\": \"/documents/reports/invoice.pdf\" })\nmove_file({ \"source_path\": \"/downloads/slides.pdf\", \"destination_path\": \"/documents/reports/slides.pdf\" })\n\nStep 4 — Rename with date prefix:\nrename_file({ \"file_path\": \"/documents/reports/report.pdf\", \"new_name\": \"2024-12-15_report.pdf\" })\n\nI know I need to rename each file, but I'm not sure about the exact date format to use.",
      issues: [
        "Unsure about date prefix format",
        "No error handling — what if a move fails mid-batch?",
        "Doesn't validate inputs before calling",
        "No confirmation or progress reporting",
      ],
      strengths: [
        "Correct 4-step strategy (search, create dir, move, rename)",
        "Uses create_directory before move_file (from descriptions)",
        "Distinguishes move_file from rename_file correctly",
        "Processes files individually, not as batch glob",
      ],
    },
    {
      id: "names-schemas-descriptions-errors",
      label: "Resilient Execution",
      requiredComponents: ["clear-names", "zod-schemas", "descriptions", "error-responses"],
      score: 65,
      agentResponse:
        "I'll move and rename your PDFs with proper error handling.\n\nStep 1 — Find PDFs:\nsearch_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\" })\n-> { \"files\": [\"/downloads/report.pdf\", \"/downloads/invoice.pdf\", \"/downloads/slides.pdf\"], \"count\": 3 }\n\nStep 2 — Create destination:\ncreate_directory({ \"path\": \"/documents/reports\", \"recursive\": true })\n-> { \"success\": true, \"created\": true }\n\nStep 3 — Move files (with error recovery):\nmove_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/report.pdf\" })\n-> { \"success\": true }\n\nmove_file({ \"source_path\": \"/downloads/invoice.pdf\", \"destination_path\": \"/documents/reports/invoice.pdf\" })\n-> { \"success\": false, \"error\": { \"code\": \"ALREADY_EXISTS\" } }\nRecovery: Retrying with overwrite flag...\nmove_file({ \"source_path\": \"/downloads/invoice.pdf\", \"destination_path\": \"/documents/reports/invoice.pdf\", \"overwrite\": true })\n-> { \"success\": true }\n\nStep 4 — Rename with date prefix:\nrename_file({ \"file_path\": \"/documents/reports/report.pdf\", \"new_name\": \"2024-12-15_report.pdf\" })\n\nAll 3 files processed. 1 required retry (ALREADY_EXISTS on invoice.pdf).",
      issues: [
        "Date format not validated against the standard format",
        "No pre-call input validation",
        "Doesn't verify files exist before starting batch",
        "Missing progress reporting for large batches",
      ],
      strengths: [
        "Recovers from ALREADY_EXISTS error using error codes",
        "Uses structured error response to choose recovery action",
        "Reports which files needed retries",
        "Follows the error recovery pattern (parse, recover, retry)",
        "Clear step-by-step execution plan",
      ],
    },
    {
      id: "names-schemas-descriptions-errors-validation",
      label: "Validated Pipeline",
      requiredComponents: ["clear-names", "zod-schemas", "descriptions", "error-responses", "input-validation"],
      score: 80,
      agentResponse:
        "Moving all .pdf files from /downloads to /documents/reports with today's date prefix.\n\nPre-flight validation:\n- Source directory: /downloads (absolute path, valid)\n- Destination: /documents/reports (absolute path, valid)\n- Date prefix format: 2024-12-15_ (YYYY-MM-DD)\n- No path traversal detected\n\nStep 1 — Discover files:\nsearch_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\", \"recursive\": false })\n-> 3 files found (under 1000 file batch limit)\n\nStep 2 — Prepare destination:\ncreate_directory({ \"path\": \"/documents/reports\", \"recursive\": true })\n-> Created successfully\n\nStep 3 — Move and rename each file:\n\nFile 1/3: report.pdf\n- Validating: filename has no reserved characters\n- move_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/report.pdf\" }) -> success\n- rename_file({ \"file_path\": \"/documents/reports/report.pdf\", \"new_name\": \"2024-12-15_report.pdf\" }) -> success\n\nFile 2/3: invoice.pdf -> success (move + rename)\nFile 3/3: slides.pdf -> success (move + rename)\n\nResult: 3/3 files moved and renamed. Original extensions preserved.",
      issues: [
        "No worked example to reference for orchestration pattern",
        "Could be more concise with progress reporting",
      ],
      strengths: [
        "Pre-flight validation catches issues before execution",
        "Validates date prefix format (YYYY-MM-DD)",
        "Checks batch size against maximum",
        "Validates filenames for reserved characters",
        "Preserves file extensions during rename",
        "Absolute paths throughout",
        "Reports progress with file counts",
      ],
    },
    {
      id: "all",
      label: "Precise Execution",
      requiredComponents: ["clear-names", "zod-schemas", "descriptions", "error-responses", "input-validation", "usage-examples"],
      score: 95,
      agentResponse:
        "Moving all .pdf files from /downloads to /documents/reports with today's date prefix.\n\nPre-flight checks:\n- Paths validated (absolute, no traversal)\n- Date prefix: 2024-12-15_ (YYYY-MM-DD format)\n- Batch operation mode\n\nStep 1 — search_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\", \"recursive\": false })\n-> { \"files\": [\"/downloads/report.pdf\", \"/downloads/invoice.pdf\", \"/downloads/slides.pdf\"], \"count\": 3 }\n\nStep 2 — create_directory({ \"path\": \"/documents/reports\", \"recursive\": true })\n-> { \"success\": true, \"path\": \"/documents/reports\", \"created\": true }\n\nStep 3 — Move and rename (3 files):\n\n[1/3] report.pdf\nmove_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/report.pdf\" }) -> success\nrename_file({ \"file_path\": \"/documents/reports/report.pdf\", \"new_name\": \"2024-12-15_report.pdf\" }) -> success\n\n[2/3] invoice.pdf\nmove_file(...) -> { \"error\": { \"code\": \"ALREADY_EXISTS\" } }\nRecovery: set overwrite: true, retry -> success\nrename_file(..., \"new_name\": \"2024-12-15_invoice.pdf\") -> success\n\n[3/3] slides.pdf\nmove_file(...) -> success\nrename_file(..., \"new_name\": \"2024-12-15_slides.pdf\") -> success\n\nComplete: 3/3 files processed. 1 retry (ALREADY_EXISTS). All files at /documents/reports/ with 2024-12-15_ prefix.",
      issues: ["Could offer to verify results with a final list_directory call"],
      strengths: [
        "Follows the exact pattern from usage examples",
        "4-step orchestration: search, create dir, move, rename",
        "Pre-flight validation before any tool calls",
        "Error recovery using structured error codes",
        "Correct date prefix format from validation rules",
        "Progress tracking (1/3, 2/3, 3/3)",
        "Summary with retry count",
        "Every tool call uses valid schema parameters",
      ],
    },
    {
      id: "schemas-only",
      label: "Typed but Lost",
      requiredComponents: ["zod-schemas"],
      score: 15,
      agentResponse:
        "I'll move the files.\n\nsearch_files({ \"directory\": \"/downloads\", \"pattern\": \"*.pdf\", \"recursive\": true })\n\nFound files. Now I need to move them, but I'm not sure if I should use move_file or rename_file for this operation. Let me try:\n\nmove_file({ \"source_path\": \"/downloads/report.pdf\", \"destination_path\": \"/documents/reports/2024-12-15_report.pdf\", \"overwrite\": false })\n\nError: DIR_NOT_FOUND. I don't know how to proceed from here.",
      issues: [
        "Cannot distinguish when to use move_file vs rename_file",
        "Tries to rename during move (skips rename_file step)",
        "Doesn't know to create directory first",
        "Cannot recover from errors — no error code knowledge",
        "No execution strategy or plan",
      ],
      strengths: [
        "Parameter names and types are correct",
        "Uses proper Zod-validated field names",
      ],
    },
  ],
  principles: [
    {
      id: "names-are-api",
      title: "Names Are Your API",
      description: "Clear verb_noun tool names eliminate 40% of tool selection errors. The model matches intent to name before reading descriptions. Bad names force the model to guess, and it often guesses wrong.",
      linkedComponents: ["clear-names", "descriptions"],
    },
    {
      id: "schemas-prevent-retries",
      title: "Schemas Prevent Retries",
      description: "Zod schemas with .describe() annotations tell the model exactly what each parameter expects. Without them, the model invents parameter names, uses wrong types, and triggers validation errors that waste tokens on retries.",
      linkedComponents: ["zod-schemas", "input-validation"],
    },
    {
      id: "examples-beat-instructions",
      title: "Examples Beat Instructions",
      description: "A single worked example of multi-step tool orchestration is worth more than paragraphs of instructions. The model learns the pattern (search, prepare, execute, verify) and replicates it reliably.",
      linkedComponents: ["usage-examples", "descriptions"],
    },
    {
      id: "errors-enable-recovery",
      title: "Errors Enable Recovery",
      description: "Structured error responses with codes and recovery suggestions let the agent self-heal. Without them, the agent stops on first failure. With them, it retries intelligently and completes the task.",
      linkedComponents: ["error-responses", "input-validation"],
    },
  ],
};
