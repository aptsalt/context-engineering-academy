import type { PlaygroundScenario } from "@/lib/playground-data";

export const invoiceExtractorScenario: PlaygroundScenario = {
  id: "invoice-extractor",
  name: "Invoice Data Extractor",
  emphasis: "fewer-retries",
  emphasisLabel: "Fewer Retries",
  meta: {
    title: "Data Extraction Scenario",
    description:
      "An AI extracts structured data from a messy invoice email. This scenario shows how providing a schema and examples eliminates retries caused by format mismatches, missing fields, and type errors.",
    infoCards: [
      { icon: "FileText", label: "Input", value: "Unstructured invoice email" },
      { icon: "Package", label: "Output", value: "JSON with 8 required fields" },
      { icon: "AlertTriangle", label: "Challenge", value: "Ambiguous dates & currencies" },
    ],
  },
  customerMessage:
    "Hey, attached is the invoice from Nakamura Industries for the Q3 server rack install. It was 12 racks at $4,200 each, total $50,400. They sent it Sept 15 and it's due in net-30. PO number is PO-2024-0892. Ship to our Austin DC. Contact is Yuki Tanaka, yuki@nakamura.co.jp.",
  recommendedBuildOrder: [
    "system-prompt",
    "tools",
    "rag",
    "few-shot",
    "history",
    "memory",
  ],
  components: [
    {
      id: "system-prompt",
      name: "System Prompt",
      shortName: "System",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 300,
      description: "Role and strict output schema with field-level validation rules.",
      content: `<system>
You are an invoice data extraction agent. Your job is to parse unstructured invoice communications and output structured JSON.

<output_schema>
{
  "vendor_name": "string — exact legal entity name",
  "invoice_date": "string — ISO 8601 format (YYYY-MM-DD)",
  "due_date": "string — ISO 8601 format (YYYY-MM-DD)",
  "po_number": "string — format: PO-YYYY-NNNN",
  "line_items": [{ "description": "string", "quantity": "number", "unit_price": "number" }],
  "total_amount": "number — must equal sum of (quantity × unit_price)",
  "currency": "string — ISO 4217 code (e.g., USD, EUR, JPY)",
  "ship_to": "string — full delivery address or location name",
  "vendor_contact": { "name": "string", "email": "string" }
}
</output_schema>

<rules>
- ALWAYS output valid JSON matching the schema exactly
- Dates MUST be ISO 8601 — convert "Sept 15" to "2024-09-15"
- Currency defaults to USD unless explicitly stated otherwise
- If a field cannot be determined, use null — never omit or guess
- Validate: total_amount must equal sum of line_items
- PO numbers must match format PO-YYYY-NNNN
</rules>
</system>`,
    },
    {
      id: "tools",
      name: "Tool Definitions",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 250,
      description: "Validation and lookup tools for verifying extracted data.",
      content: `<tools>
[
  {
    "name": "validate_json_schema",
    "description": "Validate extracted JSON against the invoice schema. Returns errors for missing/invalid fields.",
    "parameters": { "data": "object" }
  },
  {
    "name": "lookup_vendor",
    "description": "Look up vendor in the approved vendor database. Returns legal name and payment terms.",
    "parameters": { "vendor_name": "string" }
  },
  {
    "name": "verify_po_number",
    "description": "Check if PO number exists and is open in the procurement system.",
    "parameters": { "po_number": "string" }
  },
  {
    "name": "geocode_address",
    "description": "Resolve a location name or partial address to a full shipping address.",
    "parameters": { "location": "string" }
  }
]
</tools>`,
    },
    {
      id: "few-shot",
      name: "Few-Shot Examples",
      shortName: "Few-Shot",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 360,
      description: "Two worked extraction examples showing correct JSON output from messy input.",
      content: `<examples>
## Example 1: Informal Email → Structured JSON

Input: "Bill from TechParts LLC for 5 SSDs ($120 each) and 10 cables ($15 each). Sent June 3rd, due July 3rd. PO is PO-2024-0445. Ship to Chicago warehouse. Contact: Mike Lee mike@techparts.com"

Output:
{
  "vendor_name": "TechParts LLC",
  "invoice_date": "2024-06-03",
  "due_date": "2024-07-03",
  "po_number": "PO-2024-0445",
  "line_items": [
    { "description": "SSD", "quantity": 5, "unit_price": 120 },
    { "description": "Cable", "quantity": 10, "unit_price": 15 }
  ],
  "total_amount": 750,
  "currency": "USD",
  "ship_to": "Chicago warehouse",
  "vendor_contact": { "name": "Mike Lee", "email": "mike@techparts.com" }
}

## Example 2: Missing Fields Handled

Input: "Invoice from GlobalNet for consulting — 40 hours at $200/hr. Sent last Friday."

Output:
{
  "vendor_name": "GlobalNet",
  "invoice_date": "2024-09-06",
  "due_date": null,
  "po_number": null,
  "line_items": [
    { "description": "Consulting", "quantity": 40, "unit_price": 200 }
  ],
  "total_amount": 8000,
  "currency": "USD",
  "ship_to": null,
  "vendor_contact": null
}
</examples>`,
    },
    {
      id: "history",
      name: "Conversation History",
      shortName: "History",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 200,
      description: "Prior extraction attempts and user corrections.",
      content: `<conversation_history>
[Turn 1]
User: "Process this Nakamura invoice."
Agent: [Initial extraction attempt — had date format as "September 15, 2024" instead of ISO 8601]
User: "Dates need to be in ISO format, remember?"

[Turn 2]
Agent: [Corrected to ISO format, but calculated due_date as 2024-10-15 instead of 2024-10-15]
User: "Also, Nakamura Industries is the vendor — their full legal name is 'Nakamura Industries Co., Ltd.'"

[Current]
User is re-sending the invoice with additional context. Previous corrections should be applied.
</conversation_history>`,
    },
    {
      id: "rag",
      name: "RAG Documents",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 280,
      description: "Vendor database entries and company extraction policies.",
      content: `<retrieved_documents>
[Source 1: Approved Vendor Database — Nakamura Industries]
- Legal Name: Nakamura Industries Co., Ltd.
- Vendor ID: VND-0234
- Default Payment Terms: Net-30
- Currency: USD (for US contracts)
- Primary Contact: Yuki Tanaka (yuki@nakamura.co.jp)
- Category: Data Center Infrastructure

[Source 2: Data Extraction Policy v1.2]
- All dates must use ISO 8601 format
- "Net-30" means due_date = invoice_date + 30 calendar days
- Vendor names must match approved vendor database exactly
- Ship-to locations must reference company site codes when possible
- Austin DC = "Austin Data Center, 4200 E. Ben White Blvd, Austin, TX 78741"

[Source 3: Active PO Registry]
- PO-2024-0892: Open, Nakamura Industries, Budget: $55,000, Category: DC Infrastructure
</retrieved_documents>`,
    },
    {
      id: "memory",
      name: "Memory",
      shortName: "Memory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 170,
      description: "Past extraction errors and learned corrections for this vendor.",
      content: `<memory>
## Extraction Scratchpad
- Vendor identified: Nakamura Industries Co., Ltd. (confirmed legal name)
- Date format correction applied: use ISO 8601
- "Austin DC" maps to full address per extraction policy
- Net-30 from Sept 15 = Oct 15

## Learned Corrections (this vendor)
- Previous extraction: Used "Nakamura Industries" without "Co., Ltd." — user corrected
- Previous extraction: Date format was not ISO 8601 — user corrected
- Nakamura invoices are always in USD for US contracts
- Yuki Tanaka is the consistent contact for all Nakamura invoices

## Error Prevention
- Always use legal entity name from vendor database
- Always calculate due_date explicitly from payment terms
- Validate total = sum of line items before outputting
</memory>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Raw Dump",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "Here's what I extracted:\n\nVendor: Nakamura\nDate: Sept 15\nAmount: $50,400\nItems: server racks\nPO: PO-2024-0892\n\nLet me know if you need anything else.",
      issues: [
        "No structured JSON output — plain text",
        "Date not in ISO 8601 format",
        "Missing required fields (due_date, currency, ship_to, contact)",
        "Vendor name incomplete",
        "No validation of extracted data",
        "Would require manual reformatting — defeats the purpose",
      ],
      strengths: [],
    },
    {
      id: "system-only",
      label: "Right Schema, Wrong Data",
      requiredComponents: ["system-prompt"],
      score: 25,
      agentResponse:
        "```json\n{\n  \"vendor_name\": \"Nakamura Industries\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": null,\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"server rack install\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin DC\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```",
      issues: [
        "Vendor name not the legal entity name (missing 'Co., Ltd.')",
        "due_date is null — should calculate net-30 from invoice_date",
        "ship_to is 'Austin DC' — not resolved to full address",
        "Cannot validate PO number against procurement system",
        "No cross-reference with vendor database",
      ],
      strengths: [
        "Correct JSON schema structure",
        "ISO 8601 date format applied",
        "Line items correctly parsed with math validation",
        "Currency correctly defaulted to USD",
      ],
    },
    {
      id: "system-tools",
      label: "Validated but Incomplete",
      requiredComponents: ["system-prompt", "tools"],
      score: 45,
      agentResponse:
        "[calls validate_json_schema(data)]\n[calls verify_po_number(\"PO-2024-0892\")]\n\n```json\n{\n  \"vendor_name\": \"Nakamura Industries\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": null,\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"server rack install\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin DC\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```\n\nPO verified: PO-2024-0892 is open. Schema validation passed.",
      issues: [
        "Vendor name still not the legal entity name",
        "due_date null — doesn't know net-30 calculation rule",
        "ship_to not resolved to full address",
        "Doesn't know extraction policy for address resolution",
        "Would fail downstream validation on vendor name mismatch",
      ],
      strengths: [
        "Validates output against schema",
        "Verifies PO number exists",
        "Uses tools to catch structural errors",
        "Correct JSON output format",
      ],
    },
    {
      id: "system-tools-rag",
      label: "Policy-Compliant",
      requiredComponents: ["system-prompt", "tools", "rag"],
      score: 65,
      agentResponse:
        "[calls lookup_vendor(\"Nakamura Industries\")]\n[calls verify_po_number(\"PO-2024-0892\")]\n[calls geocode_address(\"Austin DC\")]\n\n```json\n{\n  \"vendor_name\": \"Nakamura Industries Co., Ltd.\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": \"2024-10-15\",\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"Server rack installation\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin Data Center, 4200 E. Ben White Blvd, Austin, TX 78741\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```\n\nValidation: PO open (budget $55,000 — this invoice within budget). Vendor confirmed. Net-30 calculated.",
      issues: [
        "No awareness of prior extraction errors — could repeat them",
        "Doesn't show confidence level or flag ambiguities",
        "First-time extraction pattern — no learned corrections applied",
        "Description could be more specific ('Server rack installation' vs email wording)",
      ],
      strengths: [
        "Legal entity name from vendor database",
        "Due date calculated from net-30 terms",
        "Full address resolved from 'Austin DC'",
        "PO budget validation included",
        "All required fields populated correctly",
      ],
    },
    {
      id: "system-tools-few-shot-rag",
      label: "First-Try Accurate",
      requiredComponents: ["system-prompt", "tools", "few-shot", "rag"],
      score: 80,
      agentResponse:
        "[calls lookup_vendor(\"Nakamura Industries\")]\n[calls verify_po_number(\"PO-2024-0892\")]\n[calls geocode_address(\"Austin DC\")]\n[calls validate_json_schema(data)]\n\n```json\n{\n  \"vendor_name\": \"Nakamura Industries Co., Ltd.\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": \"2024-10-15\",\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"Server rack installation\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin Data Center, 4200 E. Ben White Blvd, Austin, TX 78741\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```\n\nValidation summary:\n- Schema: PASS (all required fields present)\n- Math: PASS (12 × $4,200 = $50,400)\n- PO: VERIFIED (open, within $55K budget)\n- Vendor: MATCHED to approved database\n- Dates: ISO 8601 compliant, net-30 calculated",
      issues: [
        "Doesn't apply learned corrections from prior interactions",
        "Doesn't flag that this vendor was previously corrected",
        "No confidence score on ambiguous fields",
      ],
      strengths: [
        "Output matches example format exactly — first-try accuracy",
        "Complete validation checklist included",
        "All field-level rules applied correctly",
        "Math validation shown explicitly",
        "No retries needed — schema + examples eliminated format issues",
      ],
    },
    {
      id: "all",
      label: "Zero-Retry Extraction",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag", "memory"],
      score: 95,
      agentResponse:
        "Applying learned corrections from previous extractions for this vendor.\n\n[calls lookup_vendor(\"Nakamura Industries\")]\n[calls verify_po_number(\"PO-2024-0892\")]\n[calls geocode_address(\"Austin DC\")]\n[calls validate_json_schema(data)]\n\n```json\n{\n  \"vendor_name\": \"Nakamura Industries Co., Ltd.\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": \"2024-10-15\",\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"Server rack installation\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin Data Center, 4200 E. Ben White Blvd, Austin, TX 78741\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```\n\nPre-submission checks (learned from prior errors):\n- Vendor name: Using legal entity \"Co., Ltd.\" (corrected in previous session)\n- Date format: ISO 8601 (corrected in previous session)\n- Due date: Explicitly calculated net-30 from 2024-09-15 → 2024-10-15\n- Address: Resolved \"Austin DC\" to full address per extraction policy\n- Math: 12 × $4,200 = $50,400 ✓\n- PO: Open, within budget ($50,400 / $55,000) ✓\n\nZero corrections needed — all previous error patterns addressed proactively.",
      issues: ["Could flag that PO budget utilization is at 91.6%"],
      strengths: [
        "Proactively applies learned corrections — no retry needed",
        "Explicitly references prior errors and how they're prevented",
        "Complete validation with error-prevention checklist",
        "Legal entity name correct on first try",
        "ISO 8601 dates correct on first try",
        "Full address resolution on first try",
        "Demonstrates how memory eliminates retries over time",
        "Production-ready output requiring zero human correction",
      ],
    },
    {
      id: "tools-only",
      label: "Validation Bot",
      requiredComponents: ["tools"],
      score: 15,
      agentResponse:
        "[calls validate_json_schema({})]\n[calls verify_po_number(\"PO-2024-0892\")]\n\nPO number verified. I have validation tools available but no instructions on what format to extract data into. Please provide the expected output schema.",
      issues: [
        "Has tools but no schema — cannot extract",
        "Asks for instructions it should already have",
        "PO verified but no data extracted",
        "Cannot produce any useful output",
        "Tools without context = wasted API calls",
      ],
      strengths: ["Can verify PO numbers exist"],
    },
    {
      id: "system-fewshot",
      label: "Good Format, No Validation",
      requiredComponents: ["system-prompt", "few-shot"],
      score: 35,
      agentResponse:
        "```json\n{\n  \"vendor_name\": \"Nakamura Industries\",\n  \"invoice_date\": \"2024-09-15\",\n  \"due_date\": null,\n  \"po_number\": \"PO-2024-0892\",\n  \"line_items\": [\n    { \"description\": \"Server rack installation\", \"quantity\": 12, \"unit_price\": 4200 }\n  ],\n  \"total_amount\": 50400,\n  \"currency\": \"USD\",\n  \"ship_to\": \"Austin DC\",\n  \"vendor_contact\": { \"name\": \"Yuki Tanaka\", \"email\": \"yuki@nakamura.co.jp\" }\n}\n```",
      issues: [
        "Vendor name not the legal entity name",
        "due_date null — doesn't know net-30 policy",
        "ship_to not resolved to full address",
        "No validation against vendor database",
        "No PO verification — could be closed or invalid",
        "Would fail downstream and require a retry",
      ],
      strengths: [
        "Correct JSON schema structure (from examples)",
        "Proper ISO 8601 date format",
        "Math is correct (12 × 4200 = 50400)",
        "Format matches few-shot examples closely",
      ],
    },
  ],
  principles: [
    {
      id: "schema-drives-accuracy",
      title: "Schema Drives First-Try Accuracy",
      description: "Providing an explicit output schema with field types and validation rules eliminates the most common retry reason: format mismatches. The model doesn't have to guess the structure.",
      linkedComponents: ["system-prompt"],
    },
    {
      id: "examples-beat-descriptions",
      title: "Examples Beat Descriptions",
      description: "One worked example showing messy input → clean JSON output teaches the model more than paragraphs of extraction rules. Notice how the output format stabilizes after few-shot examples are enabled.",
      linkedComponents: ["few-shot"],
    },
    {
      id: "memory-eliminates-retries",
      title: "Memory Eliminates Repeat Errors",
      description: "Without memory, the same extraction errors recur every session. With memory, the agent applies learned corrections proactively — turning 3 retries into 0.",
      linkedComponents: ["memory", "history"],
    },
    {
      id: "validation-closes-loop",
      title: "Validation Closes the Loop",
      description: "Tools that validate output against the schema create a closed feedback loop. The agent can self-correct before returning results, catching errors the model would otherwise miss.",
      linkedComponents: ["tools", "rag"],
    },
  ],
};
