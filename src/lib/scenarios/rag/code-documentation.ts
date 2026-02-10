import type { PlaygroundScenario } from "@/lib/playground-data";

export const codeDocumentationScenario: PlaygroundScenario = {
  id: "code-documentation",
  name: "Code Documentation RAG",
  emphasis: "full-pipeline",
  emphasisLabel: "Code-Aware RAG",
  meta: {
    title: "Code RAG Scenario",
    description:
      "A RAG system over a large codebase answers developer questions about APIs, patterns, and usage. Standard text chunking fails on code — you need AST-aware indexing, semantic search tuned for code, and rich context from usage examples and dependency graphs. Toggle components to see the difference.",
    infoCards: [
      { icon: "Code", label: "Codebase", value: "Payment SDK — 42K lines TypeScript" },
      { icon: "User", label: "Developer", value: "New team member onboarding" },
      { icon: "Search", label: "Query", value: "How to process refunds with retries" },
    ],
  },
  customerMessage:
    "How do I process a refund using the PaymentSDK? I need to handle retries and partial refunds. Show me the correct pattern.",
  inputLabel: "Developer",
  recommendedBuildOrder: [
    "code-chunking",
    "ast-indexing",
    "semantic-search",
    "usage-examples",
    "api-docs",
    "dependency-graph",
  ],
  components: [
    {
      id: "code-chunking",
      name: "Code Chunking",
      shortName: "Chunking",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 180,
      description: "Splits code files into meaningful chunks at function/class boundaries rather than arbitrary line counts.",
      content: `<code_chunking>
## Chunking Strategy
- Method: Function-level chunking with class context preservation
- Boundary detection: Function declarations, class methods, export statements
- Context: Each chunk includes the parent class/module name and import statements
- Metadata per chunk: file_path, function_name, class_name, line_range, language

## Retrieved Chunks (top 3)
Chunk 1: src/payments/refund-service.ts (lines 45-92)
\`\`\`typescript
export class RefundService {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly logger: Logger,
    private readonly config: RefundConfig
  ) {}

  async processRefund(params: RefundParams): Promise<RefundResult> {
    this.logger.info('Processing refund', { orderId: params.orderId });
    const validation = this.validateRefundParams(params);
    if (!validation.success) {
      throw new RefundValidationError(validation.errors);
    }
    return this.executeWithRetry(() =>
      this.paymentGateway.refund({
        transactionId: params.originalTransactionId,
        amount: params.amount ?? params.originalAmount,
        reason: params.reason,
        idempotencyKey: params.idempotencyKey,
      })
    );
  }
}
\`\`\`

Chunk 2: src/payments/refund-service.ts (lines 94-128)
\`\`\`typescript
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.config.maxRetries) throw error;
      if (!this.isRetryableError(error)) throw error;
      const delay = this.config.baseDelay * Math.pow(2, attempt - 1);
      await this.sleep(delay);
      return this.executeWithRetry(operation, attempt + 1);
    }
  }
\`\`\`

Chunk 3: src/payments/types.ts (lines 12-34)
\`\`\`typescript
export interface RefundParams {
  orderId: string;
  originalTransactionId: string;
  amount?: number; // partial refund amount; omit for full refund
  originalAmount: number;
  reason: RefundReason;
  idempotencyKey: string;
}

export type RefundReason = 'customer_request' | 'duplicate' | 'fraudulent' | 'product_defect';
\`\`\`
</code_chunking>`,
    },
    {
      id: "ast-indexing",
      name: "AST-Aware Indexing",
      shortName: "AST",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 170,
      description: "Parses code into abstract syntax trees, indexing by symbol names, types, call relationships, and structural patterns.",
      content: `<ast_index>
## AST Analysis: RefundService

### Symbol Table
- RefundService (class) — src/payments/refund-service.ts:45
  ├── processRefund (public method) → returns Promise<RefundResult>
  │   ├── params: RefundParams (type reference)
  │   ├── calls: validateRefundParams, executeWithRetry, paymentGateway.refund
  │   └── throws: RefundValidationError
  ├── executeWithRetry (private method) → returns Promise<T>
  │   ├── pattern: exponential backoff retry
  │   ├── calls: isRetryableError, sleep
  │   └── config: maxRetries, baseDelay
  ├── processPartialRefund (public method) → returns Promise<RefundResult>
  │   ├── calls: processRefund with amount parameter
  │   └── validation: amount must be > 0 and <= originalAmount
  └── validateRefundParams (private method) → returns ValidationResult

### Type Hierarchy
RefundParams → used by processRefund, processPartialRefund
RefundResult → { success: boolean, refundId: string, amount: number, status: RefundStatus }
RefundStatus → 'pending' | 'completed' | 'failed' | 'partial'
RefundConfig → { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 }

### Call Graph (processRefund)
processRefund
  → validateRefundParams → RefundValidationError
  → executeWithRetry
    → paymentGateway.refund (external API call)
    → isRetryableError (checks for network/timeout errors)
    → sleep (delay utility)

### Patterns Detected
- Retry pattern: Exponential backoff with configurable limits
- Idempotency: Uses idempotencyKey to prevent duplicate refunds
- Partial refund: amount parameter is optional; omit for full refund
</ast_index>`,
    },
    {
      id: "semantic-search",
      name: "Semantic Search",
      shortName: "Search",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 150,
      description: "Code-optimized embeddings that understand programming concepts, API patterns, and natural language queries about code.",
      content: `<semantic_search>
## Model: CodeSage-large (code-optimized embeddings)
- Trained on code + docstrings + Stack Overflow Q&A pairs
- Understands: "process refund" ≈ "issue payment reversal" ≈ "refundService.processRefund()"

## Query: "How to process a refund with retries and partial refunds"

## Search Results (ranked by relevance)
1. [0.95] RefundService.processRefund — Core refund method with retry wrapper
2. [0.93] RefundService.executeWithRetry — Exponential backoff retry implementation
3. [0.91] RefundService.processPartialRefund — Partial refund convenience method
4. [0.88] RefundParams interface — Parameter types and optional amount field
5. [0.85] RefundConfig — Retry configuration (maxRetries, baseDelay)
6. [0.82] PaymentGateway.refund — Gateway API contract
7. [0.79] RefundValidationError — Error types and handling
8. [0.74] tests/refund-service.test.ts — Test cases showing usage patterns
9. [0.68] RetryPolicy utility — Generic retry utility (used elsewhere too)
10. [0.61] OrderService.cancelOrder — Related but different (order cancellation, not refund)

## Key Semantic Matches
- "retries" → matched executeWithRetry AND RetryPolicy AND RefundConfig.maxRetries
- "partial refunds" → matched processPartialRefund AND RefundParams.amount (optional)
- "correct pattern" → matched test files showing canonical usage
</semantic_search>`,
    },
    {
      id: "usage-examples",
      name: "Usage Examples",
      shortName: "Examples",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 190,
      description: "Retrieved real usage examples from tests, integration code, and internal documentation showing proven patterns.",
      content: `<usage_examples>
## Example 1: Full refund (from tests/refund-service.test.ts)
\`\`\`typescript
it('should process a full refund with retry on network error', async () => {
  const params: RefundParams = {
    orderId: 'ORD-123',
    originalTransactionId: 'TXN-456',
    originalAmount: 99.99,
    reason: 'customer_request',
    idempotencyKey: \`refund-\${Date.now()}-ORD-123\`,
  };

  // First call fails with network error, second succeeds
  mockGateway.refund
    .mockRejectedValueOnce(new NetworkError('timeout'))
    .mockResolvedValueOnce({ refundId: 'REF-789', status: 'completed' });

  const result = await refundService.processRefund(params);
  expect(result.success).toBe(true);
  expect(mockGateway.refund).toHaveBeenCalledTimes(2);
});
\`\`\`

## Example 2: Partial refund (from services/order-handler.ts)
\`\`\`typescript
async handlePartialRefund(orderId: string, amount: number): Promise<void> {
  const order = await this.orderRepo.findById(orderId);
  const result = await this.refundService.processRefund({
    orderId: order.id,
    originalTransactionId: order.transactionId,
    amount, // partial amount — less than originalAmount
    originalAmount: order.totalAmount,
    reason: 'customer_request',
    idempotencyKey: \`partial-refund-\${orderId}-\${Date.now()}\`,
  });
  if (result.status === 'partial') {
    await this.orderRepo.updateStatus(orderId, 'partially_refunded');
  }
}
\`\`\`

## Example 3: Error handling pattern (from docs/error-handling.md)
\`\`\`typescript
try {
  const result = await refundService.processRefund(params);
} catch (error) {
  if (error instanceof RefundValidationError) {
    // Invalid params — do not retry
  } else if (error instanceof GatewayTimeoutError) {
    // All retries exhausted — alert on-call
  }
}
\`\`\`
</usage_examples>`,
    },
    {
      id: "api-docs",
      name: "API Docs Context",
      shortName: "APIDocs",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 160,
      description: "Structured API documentation including method signatures, parameter descriptions, return types, and important caveats.",
      content: `<api_docs>
## RefundService API Reference

### processRefund(params: RefundParams): Promise<RefundResult>
Process a refund for a completed transaction. Automatically retries on transient errors.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | The order ID to refund |
| originalTransactionId | string | Yes | Transaction ID from the payment gateway |
| amount | number | No | Partial refund amount. Omit for full refund |
| originalAmount | number | Yes | Original transaction amount (for validation) |
| reason | RefundReason | Yes | One of: customer_request, duplicate, fraudulent, product_defect |
| idempotencyKey | string | Yes | Unique key to prevent duplicate refunds |

**Returns:** RefundResult { success, refundId, amount, status }

**Throws:**
- RefundValidationError — invalid parameters (do NOT retry)
- GatewayTimeoutError — all retry attempts exhausted
- InsufficientFundsError — merchant account balance too low

**Important Notes:**
- Always generate a unique idempotencyKey per refund attempt (not per retry)
- Partial refund amount must be > 0 and <= originalAmount
- Retry behavior: 3 attempts, exponential backoff (1s, 2s, 4s)
- Only network and timeout errors are retried; validation errors are not
- Refunds to expired cards are automatically redirected to bank account

### processPartialRefund(orderId: string, amount: number): Promise<RefundResult>
Convenience wrapper for partial refunds. Loads order data automatically.
</api_docs>`,
    },
    {
      id: "dependency-graph",
      name: "Dependency Graph",
      shortName: "DepGraph",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 130,
      description: "Maps module dependencies, showing what to import, how to instantiate, and what configuration is required.",
      content: `<dependency_graph>
## To use RefundService, you need:

### Direct Dependencies
\`\`\`
RefundService
├── PaymentGateway (injected via constructor)
│   └── Requires: PAYMENT_GATEWAY_API_KEY, GATEWAY_BASE_URL
│   └── Import: import { PaymentGateway } from '@acme/payment-sdk'
├── Logger (injected via constructor)
│   └── Import: import { Logger } from '@acme/observability'
└── RefundConfig (injected via constructor)
    └── Default: { maxRetries: 3, baseDelay: 1000, maxDelay: 30000 }
    └── Import: import { DEFAULT_REFUND_CONFIG } from '@acme/payment-sdk/config'
\`\`\`

### Initialization Pattern
\`\`\`typescript
import { PaymentGateway } from '@acme/payment-sdk';
import { RefundService } from '@acme/payment-sdk/services';
import { DEFAULT_REFUND_CONFIG } from '@acme/payment-sdk/config';
import { Logger } from '@acme/observability';

const gateway = new PaymentGateway({
  apiKey: process.env.PAYMENT_GATEWAY_API_KEY!,
  baseUrl: process.env.GATEWAY_BASE_URL!,
});

const refundService = new RefundService(
  gateway,
  new Logger('refund-service'),
  DEFAULT_REFUND_CONFIG
);
\`\`\`

### Required Environment Variables
- PAYMENT_GATEWAY_API_KEY — API key for the payment gateway
- GATEWAY_BASE_URL — Gateway API endpoint (staging vs production)

### Related Modules (often used together)
- OrderService — for loading order data before refunding
- NotificationService — for sending refund confirmation emails
- AuditLog — for compliance logging of refund operations
</dependency_graph>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Generic Guess",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "To process a refund, you'd typically call some kind of refund API with the order ID and amount. For retries, you could wrap it in a loop with a try-catch. For partial refunds, just pass a smaller amount.\n\n```javascript\nfor (let i = 0; i < 3; i++) {\n  try {\n    await refundAPI.process(orderId, amount);\n    break;\n  } catch (e) {\n    if (i === 2) throw e;\n    await sleep(1000);\n  }\n}\n```\n\nYou'll need to check your specific SDK documentation for the exact method names and parameters.",
      issues: [
        "Completely fabricated API — none of these methods exist in the codebase",
        "Missing idempotency key — could cause duplicate refunds in production",
        "Naive retry without exponential backoff or error classification",
        "JavaScript instead of TypeScript — doesn't match codebase conventions",
        "No mention of RefundService, RefundParams, or any actual types",
      ],
      strengths: [],
    },
    {
      id: "chunking-only",
      label: "Raw Code Chunks",
      requiredComponents: ["code-chunking"],
      score: 20,
      agentResponse:
        "I found these relevant code sections:\n\n**refund-service.ts (lines 45-92):** The `RefundService` class has a `processRefund` method that takes `RefundParams` and returns `Promise<RefundResult>`. It validates params and then calls `executeWithRetry`.\n\n**refund-service.ts (lines 94-128):** The `executeWithRetry` method implements exponential backoff retry logic.\n\n**types.ts (lines 12-34):** `RefundParams` requires `orderId`, `originalTransactionId`, `originalAmount`, `reason`, and `idempotencyKey`. The `amount` field is optional for partial refunds.\n\nYou should use these classes and methods for your implementation.",
      issues: [
        "Describes code but doesn't show how to use it",
        "No complete usage example",
        "Doesn't explain the partial refund pattern",
        "Missing imports, initialization, and error handling",
        "No explanation of the idempotency key pattern",
      ],
      strengths: [
        "Found the correct source files and methods",
        "Identified the right types (RefundParams)",
        "Mentions the optional amount field for partial refunds",
      ],
    },
    {
      id: "chunking-ast",
      label: "Structured Code",
      requiredComponents: ["code-chunking", "ast-indexing"],
      score: 35,
      agentResponse:
        "The `RefundService` class in `src/payments/refund-service.ts` handles refunds. Here's the structure:\n\n**Public Methods:**\n- `processRefund(params: RefundParams): Promise<RefundResult>` — main refund method with built-in retry\n- `processPartialRefund(orderId, amount): Promise<RefundResult>` — convenience wrapper for partial refunds\n\n**How it works:**\n1. `processRefund` validates parameters, then calls `executeWithRetry`\n2. `executeWithRetry` implements exponential backoff (max 3 retries, starting at 1s)\n3. Only retryable errors (network/timeout) are retried; validation errors are thrown immediately\n\n**For partial refunds:** Pass the `amount` field in `RefundParams` (must be > 0 and <= originalAmount).\n\n**Key types:**\n- `RefundParams`: orderId, originalTransactionId, amount (optional), originalAmount, reason, idempotencyKey\n- `RefundResult`: success, refundId, amount, status\n- `RefundReason`: 'customer_request' | 'duplicate' | 'fraudulent' | 'product_defect'",
      issues: [
        "No runnable code example — developer still has to figure out usage",
        "Missing import paths and initialization",
        "No error handling pattern shown",
        "Doesn't explain idempotencyKey best practices",
        "No information about required dependencies or setup",
      ],
      strengths: [
        "AST-derived call graph explains the flow clearly",
        "Correct method signatures and types",
        "Identifies retry behavior and non-retryable errors",
        "Partial refund pattern explained",
        "Type hierarchy is clear",
      ],
    },
    {
      id: "chunking-ast-search",
      label: "Semantically Found",
      requiredComponents: ["code-chunking", "ast-indexing", "semantic-search"],
      score: 50,
      agentResponse:
        "Use `RefundService.processRefund()` for refunds with built-in retry logic. Here's how:\n\n```typescript\nconst params: RefundParams = {\n  orderId: 'ORD-123',\n  originalTransactionId: 'TXN-456',\n  originalAmount: 99.99,\n  reason: 'customer_request',\n  idempotencyKey: `refund-${Date.now()}-ORD-123`,\n};\n\n// Full refund (omit amount)\nconst fullResult = await refundService.processRefund(params);\n\n// Partial refund (include amount)\nconst partialResult = await refundService.processRefund({\n  ...params,\n  amount: 49.99,\n  idempotencyKey: `partial-refund-${Date.now()}-ORD-123`,\n});\n```\n\n**Retry behavior:** Automatically retries up to 3 times with exponential backoff (1s, 2s, 4s). Only network and timeout errors trigger retries.\n\n**Types:** `RefundReason` can be 'customer_request', 'duplicate', 'fraudulent', or 'product_defect'.",
      issues: [
        "Missing imports and initialization — developer can't run this code as-is",
        "No error handling shown",
        "Doesn't explain what happens when retries are exhausted",
        "Missing dependency setup (PaymentGateway, Logger, config)",
        "No information about related services (OrderService, NotificationService)",
      ],
      strengths: [
        "Runnable code example with actual types",
        "Shows both full and partial refund patterns",
        "Correct retry behavior explanation",
        "Semantic search found RefundParams.amount for partial refunds",
        "Idempotency key pattern demonstrated",
      ],
    },
    {
      id: "chunking-ast-search-examples",
      label: "Pattern-Aware",
      requiredComponents: ["code-chunking", "ast-indexing", "semantic-search", "usage-examples"],
      score: 65,
      agentResponse:
        "Here's the correct pattern for processing refunds with retries and partial refund support, based on actual usage in the codebase:\n\n**Full refund with retry:**\n```typescript\nconst params: RefundParams = {\n  orderId: 'ORD-123',\n  originalTransactionId: order.transactionId,\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `refund-${Date.now()}-${order.id}`,\n};\n\nconst result = await refundService.processRefund(params);\n// Retries automatically on network errors (up to 3 attempts, exponential backoff)\n```\n\n**Partial refund:**\n```typescript\nconst result = await refundService.processRefund({\n  orderId: order.id,\n  originalTransactionId: order.transactionId,\n  amount: 49.99, // partial amount\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `partial-refund-${order.id}-${Date.now()}`,\n});\n\nif (result.status === 'partial') {\n  await orderRepo.updateStatus(order.id, 'partially_refunded');\n}\n```\n\n**Error handling (from codebase patterns):**\n```typescript\ntry {\n  const result = await refundService.processRefund(params);\n} catch (error) {\n  if (error instanceof RefundValidationError) {\n    // Invalid params — do not retry\n  } else if (error instanceof GatewayTimeoutError) {\n    // All retries exhausted — alert on-call\n  }\n}\n```\n\n**Important:** The idempotencyKey must be unique per refund operation (not per retry attempt) to prevent duplicate refunds.",
      issues: [
        "Still missing import statements and service initialization",
        "Doesn't explain required dependencies (PaymentGateway, Logger)",
        "Missing environment variable setup",
        "No mention of related services to wire up",
      ],
      strengths: [
        "Code examples pulled from actual test and service files",
        "Error handling pattern matches codebase conventions",
        "Partial refund status update pattern from real code",
        "Idempotency key best practice highlighted",
        "Both full and partial refund patterns shown",
        "Retry behavior clearly documented",
      ],
    },
    {
      id: "chunking-ast-search-examples-docs",
      label: "Fully Documented",
      requiredComponents: ["code-chunking", "ast-indexing", "semantic-search", "usage-examples", "api-docs"],
      score: 80,
      agentResponse:
        "Here's a complete guide to processing refunds using the PaymentSDK, with retries and partial refund support.\n\n## API Reference\n`processRefund(params: RefundParams): Promise<RefundResult>`\n\n| Param | Type | Required | Description |\n|-------|------|----------|-------------|\n| orderId | string | Yes | The order ID |\n| originalTransactionId | string | Yes | Gateway transaction ID |\n| amount | number | No | Partial refund amount (omit for full) |\n| originalAmount | number | Yes | Original amount (for validation) |\n| reason | RefundReason | Yes | customer_request, duplicate, fraudulent, product_defect |\n| idempotencyKey | string | Yes | Unique key per refund operation |\n\n## Full Refund with Retry\n```typescript\nconst result = await refundService.processRefund({\n  orderId: order.id,\n  originalTransactionId: order.transactionId,\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `refund-${Date.now()}-${order.id}`,\n});\n```\n\n## Partial Refund\n```typescript\nconst result = await refundService.processRefund({\n  orderId: order.id,\n  originalTransactionId: order.transactionId,\n  amount: 49.99,\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `partial-refund-${order.id}-${Date.now()}`,\n});\nif (result.status === 'partial') {\n  await orderRepo.updateStatus(order.id, 'partially_refunded');\n}\n```\n\n## Error Handling\n```typescript\ntry {\n  const result = await refundService.processRefund(params);\n} catch (error) {\n  if (error instanceof RefundValidationError) { /* do not retry */ }\n  else if (error instanceof GatewayTimeoutError) { /* all retries exhausted */ }\n  else if (error instanceof InsufficientFundsError) { /* merchant balance too low */ }\n}\n```\n\n## Retry Behavior\n- 3 attempts with exponential backoff (1s, 2s, 4s)\n- Only network/timeout errors trigger retries\n- Validation errors throw immediately\n\n**Important:** Generate idempotencyKey once per refund, not per retry. Refunds to expired cards are auto-redirected to bank account.",
      issues: [
        "Missing import paths — developer doesn't know where to import from",
        "No initialization code — how to construct RefundService?",
        "Doesn't mention required environment variables",
        "No awareness of related modules (OrderService, NotificationService)",
      ],
      strengths: [
        "Complete API reference with parameter table",
        "Full refund and partial refund patterns with code",
        "Error handling with all 3 error types documented",
        "Retry behavior clearly specified",
        "Idempotency key best practice from API docs",
        "Expired card edge case mentioned",
        "Matches actual codebase patterns from usage examples",
      ],
    },
    {
      id: "all",
      label: "Precise Code-Aware Answer",
      requiredComponents: ["code-chunking", "ast-indexing", "semantic-search", "usage-examples", "api-docs", "dependency-graph"],
      score: 95,
      agentResponse:
        "Here's the complete pattern for processing refunds with retries and partial refund support.\n\n## Setup\n```typescript\nimport { PaymentGateway } from '@acme/payment-sdk';\nimport { RefundService } from '@acme/payment-sdk/services';\nimport { DEFAULT_REFUND_CONFIG } from '@acme/payment-sdk/config';\nimport { Logger } from '@acme/observability';\nimport type { RefundParams } from '@acme/payment-sdk/types';\n\n// Requires: PAYMENT_GATEWAY_API_KEY, GATEWAY_BASE_URL env vars\nconst gateway = new PaymentGateway({\n  apiKey: process.env.PAYMENT_GATEWAY_API_KEY!,\n  baseUrl: process.env.GATEWAY_BASE_URL!,\n});\n\nconst refundService = new RefundService(\n  gateway,\n  new Logger('refund-service'),\n  DEFAULT_REFUND_CONFIG // { maxRetries: 3, baseDelay: 1000 }\n);\n```\n\n## Full Refund (with automatic retry)\n```typescript\nconst result = await refundService.processRefund({\n  orderId: order.id,\n  originalTransactionId: order.transactionId,\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `refund-${Date.now()}-${order.id}`,\n});\n// Retry: 3 attempts, exponential backoff (1s, 2s, 4s)\n// Only network/timeout errors are retried\n```\n\n## Partial Refund\n```typescript\nconst result = await refundService.processRefund({\n  orderId: order.id,\n  originalTransactionId: order.transactionId,\n  amount: 49.99, // must be > 0 and <= originalAmount\n  originalAmount: order.totalAmount,\n  reason: 'customer_request',\n  idempotencyKey: `partial-refund-${order.id}-${Date.now()}`,\n});\n\nif (result.status === 'partial') {\n  await orderRepo.updateStatus(order.id, 'partially_refunded');\n}\n```\n\n## Error Handling\n```typescript\ntry {\n  const result = await refundService.processRefund(params);\n} catch (error) {\n  if (error instanceof RefundValidationError) {\n    // Invalid params — do NOT retry\n  } else if (error instanceof GatewayTimeoutError) {\n    // All 3 retries exhausted — alert on-call\n  } else if (error instanceof InsufficientFundsError) {\n    // Merchant account balance too low\n  }\n}\n```\n\n## Key Points\n- **Idempotency**: Generate `idempotencyKey` once per refund operation, not per retry\n- **Retry config**: Override `DEFAULT_REFUND_CONFIG` to customize retry behavior\n- **Expired cards**: Refunds to expired cards auto-redirect to bank account\n- **Related services**: Use `OrderService` to load order data, `NotificationService` for confirmation emails, `AuditLog` for compliance\n\n## API Quick Reference\n| Param | Type | Required | Notes |\n|-------|------|----------|-------|\n| orderId | string | Yes | — |\n| originalTransactionId | string | Yes | From payment gateway |\n| amount | number | No | Omit for full refund |\n| originalAmount | number | Yes | For validation |\n| reason | RefundReason | Yes | customer_request, duplicate, fraudulent, product_defect |\n| idempotencyKey | string | Yes | Unique per refund |",
      issues: [
        "Could link to the internal documentation portal for more details",
      ],
      strengths: [
        "Complete setup with imports, initialization, and env vars",
        "Both full and partial refund patterns with real code",
        "Error handling with all error types from API docs",
        "Dependency graph resolved — developer knows exactly what to import",
        "Related services mentioned for the complete workflow",
        "Idempotency, retry config, and edge cases documented",
        "API reference table from docs",
        "Code matches actual codebase patterns from test examples",
        "Developer can copy-paste and run this code immediately",
      ],
    },
    {
      id: "search-only",
      label: "Semantic Fragments",
      requiredComponents: ["semantic-search"],
      score: 12,
      agentResponse:
        "I found several relevant code symbols matching your query:\n\n- `RefundService.processRefund` (relevance: 0.95)\n- `RefundService.executeWithRetry` (relevance: 0.93)\n- `RefundService.processPartialRefund` (relevance: 0.91)\n- `RefundParams` interface (relevance: 0.88)\n- `RefundConfig` (relevance: 0.85)\n\nThese are located in `src/payments/refund-service.ts` and `src/payments/types.ts`. The semantic search matched \"retries\" to `executeWithRetry` and \"partial refunds\" to the optional `amount` field.\n\nI'd recommend looking at these files directly for the implementation details.",
      issues: [
        "Lists symbols but doesn't show any code",
        "No usage examples or patterns",
        "Defers to the developer to read source files manually",
        "No API documentation or parameter descriptions",
        "Essentially a glorified file search",
      ],
      strengths: [
        "Correctly identified all relevant symbols",
        "Semantic matching is accurate",
        "File paths are correct",
      ],
    },
  ],
  principles: [
    {
      id: "code-needs-structure",
      title: "Code Needs Structural Awareness",
      description:
        "Text chunking at arbitrary boundaries breaks functions, loses type context, and splits imports from their usage. AST-aware indexing preserves function boundaries, type hierarchies, and call graphs — turning code into a navigable structure instead of text fragments.",
      linkedComponents: ["code-chunking", "ast-indexing"],
    },
    {
      id: "examples-over-docs",
      title: "Examples Beat Documentation",
      description:
        "API docs tell you what methods exist. Usage examples from tests and real code show you how to actually use them — including error handling patterns, idempotency key conventions, and status update workflows that documentation rarely covers.",
      linkedComponents: ["usage-examples", "api-docs"],
    },
    {
      id: "dependency-completion",
      title: "Dependencies Complete the Picture",
      description:
        "Knowing HOW to call a method is useless without knowing how to import and initialize it. The dependency graph turns a code snippet into runnable code by resolving imports, constructor parameters, environment variables, and related services.",
      linkedComponents: ["dependency-graph"],
    },
    {
      id: "code-embeddings-matter",
      title: "Code Embeddings Are Not Text Embeddings",
      description:
        "Standard text embeddings fail on code because they don't understand that 'process refund' and 'refundService.processRefund()' are the same concept. Code-optimized embeddings bridge natural language questions and programmatic answers.",
      linkedComponents: ["semantic-search", "code-chunking"],
    },
  ],
};
