import type { PlaygroundScenario } from "@/lib/playground-data";

export const dataPipelineScenario: PlaygroundScenario = {
  id: "data-pipeline",
  name: "Data Processing Pipeline",
  emphasis: "fewer-retries",
  emphasisLabel: "Fewer Retries",
  inputLabel: "Engineer",
  meta: {
    title: "Multi-Agent Data Pipeline",
    description:
      "Orchestrate a team of agents to build a resilient ETL data processing pipeline — extract, transform, validate, and load. Each orchestration component you enable reduces failures, improves data quality, and enables parallel processing.",
    infoCards: [
      { icon: "Package", label: "Data Source", value: "Multi-format API + CSV" },
      { icon: "Code", label: "Pipeline", value: "ETL with 4 stages" },
      { icon: "AlertTriangle", label: "Challenge", value: "Dirty data + failures" },
    ],
  },
  customerMessage:
    "Build a data pipeline that ingests customer records from 3 sources (REST API, CSV uploads, webhook events), normalizes the data, validates it against our schema, and loads it into our data warehouse. Handle failures gracefully — we process 50k records daily.",
  recommendedBuildOrder: [
    "pipeline-orchestrator",
    "extract-agent",
    "transform-agent",
    "validation-agent",
    "error-handler",
    "checkpoint-state",
  ],
  components: [
    {
      id: "pipeline-orchestrator",
      name: "Pipeline Orchestrator",
      shortName: "Orch",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 350,
      description: "The central coordinator that manages pipeline stages, agent dispatch, and execution flow.",
      content: `<pipeline_orchestrator>
## Role
Central coordinator for the ETL pipeline. Manages stage execution, agent dispatch, and flow control.

## Pipeline Stages
1. EXTRACT: Pull raw data from 3 sources in parallel
2. TRANSFORM: Normalize, deduplicate, enrich
3. VALIDATE: Schema validation, business rule checks
4. LOAD: Insert into data warehouse with conflict resolution

## Execution Model
- Stages execute sequentially (extract -> transform -> validate -> load)
- Within each stage, agents can process batches in parallel
- Batch size: 1,000 records per agent invocation
- Max concurrency: 5 parallel agent instances per stage

## Dispatch Rules
- Split incoming data into batches of 1,000 records
- Assign each batch to an agent instance with source metadata
- Track batch progress: pending -> processing -> complete | failed
- If a batch fails after retries, quarantine and continue pipeline

## Pipeline Configuration
{
  "sources": ["rest_api", "csv_upload", "webhook"],
  "daily_volume": 50000,
  "batch_size": 1000,
  "max_retries": 3,
  "timeout_per_batch": 30000,
  "parallelism": 5,
  "warehouse": "PostgreSQL (via Prisma)"
}

## Health Metrics
- Records processed / failed / quarantined
- Processing time per stage
- Error rate per source
- Pipeline completion percentage
</pipeline_orchestrator>`,
    },
    {
      id: "extract-agent",
      name: "Extract Agent",
      shortName: "Extract",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 310,
      description: "Handles data extraction from REST APIs, CSV files, and webhook payloads.",
      content: `<extract_agent>
## Role
Data extraction specialist. Pulls raw data from heterogeneous sources and produces normalized extraction output.

## Source Handlers

### REST API (Source: CRM)
- Endpoint: GET /api/v2/customers?page={n}&limit=100
- Auth: Bearer token (rotated daily)
- Pagination: Cursor-based, follow "next" link
- Rate limit: 100 req/min — implement exponential backoff
- Output: JSON array of customer records

### CSV Upload (Source: Marketing)
- Location: s3://data-lake/uploads/customers_*.csv
- Encoding: UTF-8 (detect and convert if not)
- Headers: First row, map to canonical field names
- Delimiter: Auto-detect (comma, tab, pipe)
- Output: Parsed records as JSON array

### Webhook Events (Source: Billing)
- Queue: SQS queue "billing-customer-events"
- Format: CloudEvents v1.0
- Event types: customer.created, customer.updated, customer.deleted
- Idempotency: Deduplicate by event_id
- Output: Normalized event records

## Extraction Output Format
{
  "source": "rest_api | csv_upload | webhook",
  "batch_id": "uuid",
  "records": [...],
  "record_count": 1000,
  "extraction_timestamp": "ISO-8601",
  "source_metadata": { "page": 5, "file": "customers_2024Q4.csv" }
}

## Error Handling
- API timeout: Retry with backoff, log partial results
- Malformed CSV: Skip row, log line number and content
- Missing webhook fields: Extract what's available, flag as incomplete
</extract_agent>`,
    },
    {
      id: "transform-agent",
      name: "Transform Agent",
      shortName: "Transform",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 320,
      description: "Normalizes, deduplicates, and enriches extracted data across all sources.",
      content: `<transform_agent>
## Role
Data transformation specialist. Normalizes heterogeneous source data into a canonical schema.

## Transformation Rules

### Field Mapping
| Source Field | Canonical Field | Transform |
|-------------|----------------|-----------|
| name / full_name / customer_name | fullName | Trim, title case |
| email / email_address / contact_email | email | Lowercase, trim |
| phone / tel / phone_number | phone | E.164 format (+1XXXXXXXXXX) |
| created / created_at / signup_date | createdAt | ISO-8601 UTC |
| address / addr / mailing_address | address | Structured { street, city, state, zip, country } |

### Deduplication
- Primary key: email (case-insensitive)
- On duplicate: Merge records, prefer most recent source timestamp
- Conflict resolution: REST API > Webhook > CSV (freshness priority)
- Track merge count for quality metrics

### Enrichment
- Derive country from phone number prefix
- Normalize state abbreviations (e.g., "California" -> "CA")
- Parse full address string into structured components
- Generate deterministic UUID from email for idempotent loads

### Data Cleaning
- Strip HTML tags from all string fields
- Remove control characters and zero-width spaces
- Truncate fields exceeding max length (log truncation)
- Convert empty strings to null

## Output Format
{
  "batch_id": "uuid",
  "transformed_records": [...],
  "transform_stats": {
    "input_count": 1000,
    "output_count": 985,
    "duplicates_merged": 12,
    "fields_enriched": 45,
    "fields_cleaned": 23
  }
}
</transform_agent>`,
    },
    {
      id: "validation-agent",
      name: "Validation Agent",
      shortName: "Validate",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 300,
      description: "Validates transformed data against schema rules and business constraints.",
      content: `<validation_agent>
## Role
Data quality enforcer. Validates every record against schema and business rules before loading.

## Schema Validation (Zod)
CustomerRecord = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  createdAt: z.string().datetime(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zip: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().length(2)
  }).nullable(),
  source: z.enum(["rest_api", "csv_upload", "webhook"]),
  mergeCount: z.number().int().min(0)
})

## Business Rules
1. Email domain must not be in blocklist (disposable email providers)
2. Phone number must match country code for stated address country
3. createdAt must not be in the future
4. createdAt must not be older than 10 years
5. No more than 5 records with same phone number (fraud signal)
6. Address zip must be valid for stated state (US records)

## Validation Output
{
  "batch_id": "uuid",
  "valid_records": [...],
  "invalid_records": [
    {
      "record": {...},
      "errors": [
        { "field": "phone", "rule": "business_rule_2", "message": "Phone +44... does not match country US" }
      ]
    }
  ],
  "validation_stats": {
    "total": 985,
    "valid": 961,
    "invalid": 24,
    "error_breakdown": { "schema": 8, "business_rule": 16 }
  }
}

## Severity Levels
- BLOCK: Record cannot be loaded (schema failure, fraud signal)
- WARN: Record loaded with flag (minor inconsistency)
- INFO: Logged for monitoring (unusual but acceptable)
</validation_agent>`,
    },
    {
      id: "error-handler",
      name: "Error Handler",
      shortName: "Errors",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 280,
      description: "Manages failures across all pipeline stages with retries, dead-letter queues, and alerting.",
      content: `<error_handler>
## Error Categories

### Transient Errors (auto-retry)
- API rate limit exceeded (429)
- Network timeout
- Database connection dropped
- Temporary file system full
Strategy: Exponential backoff, max 3 retries, jitter to prevent thundering herd

### Data Errors (quarantine)
- Schema validation failure
- Business rule violation
- Malformed source data
Strategy: Send to dead-letter queue, continue processing batch, alert if > 5% error rate

### System Errors (escalate)
- Source permanently unavailable
- Authentication failure (expired credentials)
- Data warehouse disk full
- Agent crash or timeout
Strategy: Pause pipeline, alert on-call engineer, save checkpoint for resume

## Dead Letter Queue
- Records that fail validation after transform retry
- Stored with: original record, error details, source metadata, timestamp
- Retention: 30 days
- Review process: Weekly manual review, auto-purge after 30 days

## Alerting Rules
| Condition | Severity | Action |
|-----------|----------|--------|
| Error rate > 5% per batch | Warning | Slack notification |
| Error rate > 15% per batch | Critical | Page on-call engineer |
| Pipeline stalled > 5 min | Critical | Auto-restart from checkpoint |
| Source unavailable > 3 retries | High | Skip source, alert team |
| DLQ depth > 1000 records | Warning | Flag for review |

## Recovery Procedures
- Partial batch failure: Reprocess only failed records
- Full batch failure: Reprocess entire batch with fresh agent
- Stage failure: Resume from last checkpoint
- Pipeline failure: Full restart from last successful stage
</error_handler>`,
    },
    {
      id: "checkpoint-state",
      name: "Checkpoint State",
      shortName: "Checkpoint",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 270,
      description: "Saves pipeline progress at each stage so failures don't require full re-processing.",
      content: `<checkpoint_state>
## Checkpoint Strategy
Save state after each stage completion for every batch.

## Checkpoint Format
{
  "pipeline_run_id": "uuid",
  "timestamp": "ISO-8601",
  "stage": "extract | transform | validate | load",
  "batch_id": "uuid",
  "status": "complete | failed | in_progress",
  "records_processed": 985,
  "records_failed": 15,
  "artifacts": {
    "input_location": "s3://pipeline/runs/{id}/extract/{batch_id}.json",
    "output_location": "s3://pipeline/runs/{id}/transform/{batch_id}.json"
  },
  "error_summary": null,
  "duration_ms": 4200
}

## Storage
- Primary: PostgreSQL checkpoint table
- Backup: S3 JSON files (for disaster recovery)
- Retention: 90 days (configurable)

## Resume Logic
1. On pipeline restart, query latest checkpoint per batch
2. For each batch:
   - If "complete" at stage N: start at stage N+1
   - If "failed" at stage N: retry stage N with error context
   - If "in_progress": treat as failed (timeout assumed)
3. Never re-execute a completed stage unless explicitly invalidated

## Idempotency
- Each batch + stage combination has a unique checkpoint
- Re-running a completed batch produces identical output (deterministic transforms)
- Load stage uses UPSERT to prevent duplicate inserts
- Checkpoint writes are atomic (transaction per batch)

## Pipeline Dashboard Data
Checkpoints feed the monitoring dashboard:
- Real-time progress: batches completed / total
- Stage timing: average duration per stage
- Error trends: error rate over time by source
- Throughput: records/second by stage
</checkpoint_state>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Monolithic Script",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Here's a script that processes the data:\n\n```typescript\nasync function processData() {\n  // Fetch from API\n  const apiData = await fetch('/api/customers').then(r => r.json());\n  // Read CSV\n  const csvData = parseCSV(readFile('customers.csv'));\n  // Get webhooks\n  const webhookData = getQueueMessages();\n  \n  const allData = [...apiData, ...csvData, ...webhookData];\n  \n  for (const record of allData) {\n    // Some normalization\n    record.email = record.email?.toLowerCase();\n    // Insert into DB\n    await db.insert('customers', record);\n  }\n  \n  console.log(`Processed ${allData.length} records`);\n}\n```\n\nThis should handle the basic flow. You'll want to add error handling and maybe some validation. It processes records one at a time so it might be slow for 50k records.",
      issues: [
        "Single monolithic function doing everything",
        "No error handling — one failure kills the pipeline",
        "Sequential processing — 50k records would take hours",
        "No validation before database insert",
        "No deduplication — duplicates silently inserted",
        "No field normalization beyond email lowercase",
        "No checkpointing — crash means start over",
      ],
      strengths: [],
    },
    {
      id: "orchestrator-only",
      label: "Coordinator Without Workers",
      requiredComponents: ["pipeline-orchestrator"],
      score: 15,
      agentResponse:
        "**Pipeline Orchestrator initialized.**\n\nConfiguration loaded:\n- 3 sources, 50k records/day, batch size 1000\n- 4 stages: Extract -> Transform -> Validate -> Load\n- Max concurrency: 5\n\nDispatching batches...\n\nBatch 1: Attempting extract from REST API...\n[No extract agent configured — orchestrator attempting extraction directly]\n\nThe orchestrator pulled raw JSON from the API but doesn't know how to handle CSV format or webhook events. Attempting to normalize data inline... field mapping is inconsistent. Inserting raw records into warehouse.\n\nResult: 12,000 records loaded from API only. CSV and webhook sources skipped. No validation performed. Unknown number of duplicates. Pipeline technically \"completed\" but data quality is unknown.",
      issues: [
        "Orchestrator forced to do extraction without specialized agent",
        "2 of 3 sources completely skipped",
        "No transformation or field normalization",
        "No validation — bad data in warehouse",
        "No error handling beyond basic logging",
        "No checkpointing — would restart from zero",
      ],
      strengths: [
        "Pipeline structure is defined",
        "Batching and concurrency configured",
        "Basic progress tracking exists",
      ],
    },
    {
      id: "orchestrator-extract",
      label: "Extract-Only Pipeline",
      requiredComponents: ["pipeline-orchestrator", "extract-agent"],
      score: 30,
      agentResponse:
        "**Pipeline Orchestrator:** Dispatching extraction across 3 sources.\n\n**Extract Agent (REST API):** Paginating through CRM API. Rate limiting respected. 18,000 records extracted across 180 API calls.\n\n**Extract Agent (CSV):** Parsed customers_2024Q4.csv. Auto-detected comma delimiter, UTF-8 encoding. 22,000 records extracted.\n\n**Extract Agent (Webhook):** Drained SQS queue. 10,500 events processed, 200 duplicates removed by event_id.\n\n**Orchestrator:** All 3 sources extracted. Total: 50,500 raw records in 51 batches.\n\nNow attempting to load raw extracted data directly into warehouse...\n\nProblems encountered:\n- Field names differ across sources (name vs full_name vs customer_name)\n- Phone numbers in 5 different formats\n- 2,300 duplicate emails across sources\n- 847 records with invalid data inserted anyway\n\nPipeline complete but data warehouse now contains inconsistent, unvalidated data.",
      issues: [
        "No transformation — raw data with inconsistent fields loaded",
        "No validation — invalid records in warehouse",
        "Cross-source duplicates not handled",
        "No error handling for load failures",
        "No checkpointing — extraction would re-run on failure",
      ],
      strengths: [
        "All 3 sources successfully extracted",
        "Source-specific handling (pagination, encoding, dedup)",
        "Rate limiting respected for API source",
        "Parallel extraction across sources",
      ],
    },
    {
      id: "orchestrator-extract-transform",
      label: "Normalized but Unvalidated",
      requiredComponents: ["pipeline-orchestrator", "extract-agent", "transform-agent"],
      score: 45,
      agentResponse:
        "**Pipeline:** Extract -> Transform -> Load (validation and error handling skipped)\n\n**Extract Stage:** 50,500 records from 3 sources. (same as before)\n\n**Transform Agent:**\n- Field mapping applied: 15 source fields -> 8 canonical fields\n- Phone normalization: 50,500 -> E.164 format (4,200 required format conversion)\n- Deduplication: 50,500 -> 47,800 unique records (2,700 duplicates merged)\n- Address parsing: 38,000 records enriched with structured addresses\n- Data cleaning: 890 HTML tags stripped, 45 control characters removed\n\nTransform stats: 47,800 clean records ready.\n\n**Load:** Inserting normalized records into warehouse...\nInserted 47,800 records. 312 failed on database constraints (null required fields, invalid enums).\n\nPipeline complete. Data is normalized and deduplicated, but 312 records failed silently during load and we don't know why without validation. Some records may have valid structure but invalid business data (future dates, blocked email domains).",
      issues: [
        "No validation — business rule violations go undetected",
        "312 load failures with no structured error handling",
        "Failed records lost — no dead letter queue",
        "No checkpointing — full re-run on crash",
        "Fraud signals (duplicate phones) not detected",
      ],
      strengths: [
        "Field mapping normalizes all 3 source formats",
        "Cross-source deduplication working",
        "Phone normalization to E.164 standard",
        "Address enrichment and parsing functional",
        "Transform stats provide visibility",
      ],
    },
    {
      id: "orchestrator-extract-transform-validate",
      label: "Validated Pipeline",
      requiredComponents: ["pipeline-orchestrator", "extract-agent", "transform-agent", "validation-agent"],
      score: 60,
      agentResponse:
        "**Pipeline:** Extract -> Transform -> Validate -> Load\n\n**Extract:** 50,500 records from 3 sources.\n**Transform:** 47,800 normalized records (2,700 dupes merged).\n\n**Validation Agent:**\nSchema validation:\n- 47,100 records pass schema (98.5%)\n- 700 records fail: 380 invalid phone, 180 missing required fields, 140 invalid email format\n\nBusiness rules:\n- 520 additional flags: 200 future dates, 180 disposable emails, 85 phone/country mismatch, 55 fraud signal (>5 same phone)\n\nValidation result: 46,580 valid, 1,220 invalid (2.6% error rate)\n\n**Load:** 46,580 records inserted successfully.\n\n**Problem:** The 1,220 invalid records are just logged to console. If the pipeline crashes during load, we start from scratch. No retry logic — the 380 invalid phone numbers might have been fixable with a different normalization approach, but they're just rejected.",
      issues: [
        "Invalid records discarded instead of quarantined",
        "No retry for potentially fixable errors",
        "No checkpointing — crash requires full re-run",
        "Console logging instead of structured error handling",
        "No alerting on error rate thresholds",
      ],
      strengths: [
        "Schema validation catches structural issues",
        "Business rules catch semantic issues",
        "Fraud signals detected (duplicate phones)",
        "Clear validation stats with error breakdown",
        "Only clean data reaches the warehouse",
      ],
    },
    {
      id: "all-minus-checkpoint",
      label: "Resilient but Fragile on Restart",
      requiredComponents: ["pipeline-orchestrator", "extract-agent", "transform-agent", "validation-agent", "error-handler"],
      score: 75,
      agentResponse:
        "**Pipeline:** Full ETL with error handling.\n\n**Extract:** 50,500 records. API rate limit hit once — backoff successful, no data loss.\n\n**Transform:** 47,800 normalized records.\n- 12 malformed CSV rows quarantined to dead letter queue\n- Transform retry fixed 45 phone numbers that initially failed E.164 parsing\n\n**Validate:** \n- First pass: 46,580 valid, 1,220 invalid\n- Auto-retry with relaxed phone parsing: 380 additional records recovered\n- Final: 46,960 valid, 840 invalid (1.8% error rate)\n- 840 invalid records sent to dead letter queue with full error context\n\n**Load:** 46,960 records loaded. 3 transient DB failures — all recovered on retry.\n\n**Error Summary:**\n- Transient errors: 4 (all recovered)\n- Data errors: 840 (quarantined for review)\n- System errors: 0\n- Alert: None triggered (error rate 1.8% < 5% threshold)\n\n**Risk:** Pipeline completed successfully, but if it had crashed at the validate stage, we'd need to re-extract 50k records from all sources and re-transform everything. At 50k records/day, that's an expensive restart.",
      issues: [
        "No checkpointing — crash means full re-run of all stages",
        "Re-extraction wastes API rate limit quota",
        "No resume capability for partial failures",
        "Cannot track which batches completed vs failed",
      ],
      strengths: [
        "Transient errors recovered automatically",
        "Dead letter queue captures invalid records with context",
        "Transform retry recovered 380 records that would have been lost",
        "Error rate alerting configured with appropriate thresholds",
        "Error breakdown by category enables targeted fixes",
        "Pipeline resilient during execution, just not across restarts",
      ],
    },
    {
      id: "all",
      label: "Resilient Parallel Pipeline",
      requiredComponents: ["pipeline-orchestrator", "extract-agent", "transform-agent", "validation-agent", "error-handler", "checkpoint-state"],
      score: 95,
      agentResponse:
        "**Pipeline Run: run_2024_q4_001**\n\n**Extract Stage (5 parallel agents):**\n- REST API: 18,000 records in 12 batches [all checkpointed]\n- CSV: 22,000 records in 22 batches [all checkpointed]\n- Webhooks: 10,500 records in 11 batches [all checkpointed]\n- 1 API timeout on batch 7 — auto-retry succeeded, checkpoint updated\n- Stage time: 45s (parallel) vs ~4min (sequential)\n\n**Transform Stage (5 parallel agents):**\n- 45 batches processed in parallel\n- 2,700 duplicates merged across sources\n- 45 phone numbers recovered on retry\n- All batch checkpoints saved\n- Stage time: 30s\n\n**Validate Stage:**\n- 46,960 valid records (98.2%)\n- 840 invalid -> dead letter queue with error context\n- 380 recovered via relaxed parsing retry\n- Stage time: 20s\n\n**Load Stage:**\n- 46,960 records upserted (zero duplicates via deterministic UUIDs)\n- 3 transient failures — all recovered\n- Stage time: 25s\n\n**Pipeline Summary:**\n| Metric | Value |\n|--------|-------|\n| Total records | 50,500 |\n| Successfully loaded | 46,960 (93%) |\n| Quarantined | 840 (1.7%) |\n| Duplicates merged | 2,700 |\n| Errors recovered | 428 |\n| Total time | 2m 00s |\n| Checkpoints saved | 180 |\n\n**Resilience test:** Simulated crash at transform batch 23. Pipeline resumed from checkpoint — only 22 remaining batches re-processed. Zero data loss, 55% time savings vs full restart.\n\n**Dashboard:** Real-time metrics flowing from checkpoint data. Error trends, throughput graphs, and stage timing all available.",
      issues: [
        "Could add data lineage tracking for audit compliance",
      ],
      strengths: [
        "Full parallel processing across all stages (4x faster than sequential)",
        "180 checkpoints enable resume from any failure point",
        "Crash recovery re-processes only incomplete batches",
        "Dead letter queue with full context for 840 invalid records",
        "428 errors auto-recovered (retry + relaxed parsing)",
        "Deterministic UUIDs prevent duplicate loads on re-run",
        "Real-time dashboard from checkpoint data",
        "Error rate 1.7% — well below alerting threshold",
      ],
    },
    {
      id: "extract-transform-only",
      label: "Half Pipeline, No Safety Net",
      requiredComponents: ["extract-agent", "transform-agent"],
      score: 25,
      agentResponse:
        "**Extract Agent:** Pulling from all 3 sources...\n- REST API: 18,000 records (paginated correctly)\n- CSV: 22,000 records (parsed with auto-detection)\n- Webhooks: 10,500 records (deduplicated by event_id)\n\n**Transform Agent:** Normalizing...\n- Field mapping complete across all sources\n- 2,700 duplicates merged\n- Phone numbers normalized to E.164\n- Addresses parsed and structured\n\n**Result:** 47,800 clean, normalized records ready. But...\n\nNo orchestrator to coordinate batch processing — running single-threaded.\nNo validation — loading normalized but unchecked data.\nNo error handling — 3 API timeouts caused data loss (estimated 300 records).\nNo checkpointing — the 25 minutes of extraction work would be lost on crash.\n\nInserting directly into warehouse with raw INSERT (no upsert) — duplicates will occur if run again.",
      issues: [
        "No orchestrator — single-threaded, no batch coordination",
        "No validation — unverified data in warehouse",
        "No error handling — 300 records lost to timeouts",
        "No checkpointing — full restart on any failure",
        "Raw INSERT causes duplicates on re-run",
        "No fraud detection or business rule checks",
      ],
      strengths: [
        "All 3 sources extracted successfully",
        "Field normalization working correctly",
        "Cross-source deduplication functional",
        "Transform stats provide some visibility",
      ],
    },
  ],
  principles: [
    {
      id: "checkpoint-everything",
      title: "Checkpoint Everything",
      description:
        "In a pipeline processing 50k records, a crash at 90% without checkpoints means re-processing 100% of the data. Checkpointing after each stage and batch reduces restart cost from O(n) to O(batch_size).",
      linkedComponents: ["checkpoint-state", "pipeline-orchestrator"],
    },
    {
      id: "quarantine-dont-discard",
      title: "Quarantine, Don't Discard",
      description:
        "Invalid records are valuable signals. Dead letter queues with full error context turn data quality issues into actionable fixes instead of silent data loss.",
      linkedComponents: ["error-handler", "validation-agent"],
    },
    {
      id: "specialize-pipeline-stages",
      title: "Specialize Pipeline Stages",
      description:
        "Each stage (extract, transform, validate, load) has distinct concerns. Specialized agents handle source-specific quirks, normalization rules, and validation logic without cross-contamination.",
      linkedComponents: ["extract-agent", "transform-agent", "validation-agent"],
    },
    {
      id: "parallel-where-possible",
      title: "Parallelize Where Possible",
      description:
        "The orchestrator enables parallel batch processing within stages. Extracting from 3 sources simultaneously and processing 5 batches in parallel reduced pipeline time from 8 minutes to 2 minutes.",
      linkedComponents: ["pipeline-orchestrator", "extract-agent", "checkpoint-state"],
    },
  ],
};
