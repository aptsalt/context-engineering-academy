import type { PlaygroundScenario } from "@/lib/playground-data";

export const toolSelectionScenario: PlaygroundScenario = {
  id: "tool-selection",
  name: "Tool Selection at Scale",
  emphasis: "token-efficiency",
  emphasisLabel: "Token Efficiency",
  inputLabel: "Engineer",
  meta: {
    title: "Tool Selection Scenario",
    description:
      "An agent has access to 30+ tools but must select the right ones for each task. Dumping all tool definitions into the context window wastes tokens and confuses the model. Toggle selection strategies to see how accuracy improves while token usage drops.",
    infoCards: [
      { icon: "Search", label: "Tool Count", value: "34 tools across 6 categories" },
      { icon: "Code", label: "Challenge", value: "Right tool from 30+ options" },
      { icon: "AlertTriangle", label: "Risk", value: "Wrong tool = wasted API calls" },
    ],
  },
  customerMessage:
    "Find the customer's most recent order, check if the payment went through, and send them a shipping confirmation email.",
  recommendedBuildOrder: [
    "tool-registry",
    "tool-descriptions",
    "category-routing",
    "rag-over-tools",
    "usage-frequency",
    "dynamic-loading",
  ],
  components: [
    {
      id: "tool-registry",
      name: "Tool Registry",
      shortName: "Registry",
      color: "text-green-400",
      bgColor: "bg-green-500",
      borderColor: "border-green-500/30",
      tokens: 240,
      description: "Centralized registry of all 34 tools with names and one-line summaries.",
      content: `<tool_registry>
## Complete Tool Registry (34 tools)

### Orders (6 tools)
- get_order — Retrieve order by ID
- list_orders — List orders with filters
- create_order — Create a new order
- update_order — Update order status or details
- cancel_order — Cancel an existing order
- get_order_history — Get full order history for a customer

### Payments (5 tools)
- get_payment — Get payment details by payment ID
- process_payment — Charge a payment method
- refund_payment — Issue a full or partial refund
- get_payment_status — Check if a payment succeeded or failed
- list_payment_methods — List customer's saved payment methods

### Customers (5 tools)
- get_customer — Get customer profile by ID
- search_customers — Search customers by name, email, or phone
- update_customer — Update customer profile fields
- get_customer_orders — Get all orders for a customer
- get_customer_preferences — Get notification and communication preferences

### Notifications (5 tools)
- send_email — Send a templated email to a customer
- send_sms — Send an SMS message
- send_push_notification — Send a mobile push notification
- get_notification_history — Get past notifications sent to a customer
- get_email_templates — List available email templates

### Products (6 tools)
- get_product — Get product details by SKU
- search_products — Search product catalog
- check_inventory — Check stock levels for a product
- get_product_reviews — Get customer reviews for a product
- update_inventory — Adjust stock levels
- get_product_recommendations — Get recommended products for a customer

### Analytics (7 tools)
- get_sales_report — Generate sales report for a date range
- get_customer_lifetime_value — Calculate CLV for a customer
- get_conversion_funnel — Get conversion metrics
- get_churn_prediction — Predict customer churn risk
- get_revenue_by_segment — Revenue breakdown by customer segment
- get_top_products — Get best-selling products
- get_cohort_analysis — Analyze customer cohorts
</tool_registry>`,
    },
    {
      id: "tool-descriptions",
      name: "Tool Descriptions",
      shortName: "Descriptions",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 280,
      description: "Detailed descriptions with parameters, return types, and usage guidance.",
      content: `<tool_descriptions>
## Detailed Tool Descriptions (Selection-Relevant Tools)

### get_customer_orders
Get all orders for a customer, sorted by date (newest first).
Use this to find a customer's most recent order when you don't have an order ID.
Parameters: { customer_id: string, status?: "pending" | "shipped" | "delivered" | "cancelled", limit?: number }
Returns: { orders: Order[], total_count: number }
Note: Returns order IDs that can be passed to get_order for full details.

### get_payment_status
Check whether a specific payment succeeded, failed, or is pending.
Use this after finding an order to verify the payment went through.
Parameters: { payment_id: string }
Returns: { status: "succeeded" | "failed" | "pending" | "refunded", amount: number, currency: string, last_updated: string }
Note: The payment_id is found in the order object from get_order.

### send_email
Send a templated email to a customer. Requires a valid template ID.
Use get_email_templates first to find the right template.
Parameters: { customer_id: string, template_id: string, variables: Record<string, string> }
Returns: { sent: boolean, message_id: string, template_used: string }
Note: For shipping confirmations, use template "shipping_confirmation".

### get_email_templates
List available email templates with their required variables.
Use this before send_email to find the correct template ID.
Parameters: { category?: string }
Returns: { templates: { id: string, name: string, required_vars: string[] }[] }
Note: Categories: "order", "shipping", "marketing", "account"
</tool_descriptions>`,
    },
    {
      id: "category-routing",
      name: "Category Routing",
      shortName: "Routing",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500/30",
      tokens: 200,
      description: "Intent classifier that routes queries to the correct tool category.",
      content: `<category_routing>
## Intent-to-Category Router

Classify the user's intent, then load only tools from matching categories:

### Routing Rules
| Intent Pattern | Categories to Load | Example |
|---|---|---|
| "find order" / "recent order" / "order status" | Orders, Customers | "Find their last order" |
| "payment" / "charge" / "refund" | Payments, Orders | "Did the payment go through?" |
| "send email" / "notify" / "confirm" | Notifications | "Send shipping confirmation" |
| "product info" / "inventory" / "stock" | Products | "Is this item in stock?" |
| "report" / "analytics" / "metrics" | Analytics | "Show me sales this month" |
| Multi-intent (compound query) | Union of matched categories | "Find order + check payment + send email" |

### Routing Logic
\`\`\`typescript
function routeToCategories(query: string): string[] {
  const categories = new Set<string>();
  const lowerQuery = query.toLowerCase();

  if (/order|purchase|bought/.test(lowerQuery)) categories.add("orders");
  if (/payment|charge|paid|refund/.test(lowerQuery)) categories.add("payments");
  if (/email|notify|send|confirm/.test(lowerQuery)) categories.add("notifications");
  if (/product|item|inventory|stock/.test(lowerQuery)) categories.add("products");
  if (/report|analytics|metrics|revenue/.test(lowerQuery)) categories.add("analytics");

  // Always include customers for context
  if (categories.size > 0) categories.add("customers");

  return Array.from(categories);
}
\`\`\`

For the current query, route to: Orders + Payments + Notifications + Customers (16 tools instead of 34)
</category_routing>`,
    },
    {
      id: "rag-over-tools",
      name: "RAG Over Tools",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 260,
      description: "Semantic search over tool descriptions to find the most relevant tools.",
      content: `<rag_over_tools>
## Semantic Tool Retrieval

Instead of dumping all 34 tools into context, embed tool descriptions
and retrieve only the most relevant ones per query.

### How It Works
1. Each tool description is embedded into a vector store
2. User query is embedded at runtime
3. Top-K most similar tools are retrieved (K=5-8)
4. Only retrieved tools are loaded into the context window

### Query: "Find the customer's most recent order, check payment, send shipping email"

Retrieval results (cosine similarity):
| Tool | Similarity | Selected |
|------|-----------|----------|
| get_customer_orders | 0.94 | Yes |
| get_payment_status | 0.91 | Yes |
| send_email | 0.89 | Yes |
| get_email_templates | 0.85 | Yes |
| get_order | 0.82 | Yes |
| list_orders | 0.71 | No (redundant with get_customer_orders) |
| get_customer | 0.68 | No (ID already available) |
| process_payment | 0.55 | No (checking, not processing) |

### Result
5 tools loaded instead of 34. Token savings: ~2,800 tokens.
The model sees only relevant tools, reducing selection confusion.

### Reranking Step
After retrieval, rerank by:
1. Direct match to query intent (highest)
2. Required dependency (e.g., get_email_templates needed before send_email)
3. Frequency of co-usage with other selected tools
</rag_over_tools>`,
    },
    {
      id: "usage-frequency",
      name: "Usage Frequency",
      shortName: "Frequency",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
      tokens: 180,
      description: "Historical usage data that prioritizes commonly-used tool combinations.",
      content: `<usage_frequency>
## Tool Usage Analytics

Historical data showing which tools are called together most often:

### Top Tool Chains (last 30 days)
1. get_customer_orders -> get_payment_status -> send_email (847 calls)
   Pattern: "Order check + payment verify + notify"
2. search_customers -> get_customer_orders -> get_order (612 calls)
   Pattern: "Find customer + find order + get details"
3. get_order -> refund_payment -> send_email (445 calls)
   Pattern: "Order lookup + refund + confirmation"
4. check_inventory -> get_product -> update_inventory (389 calls)
   Pattern: "Stock check + details + adjust"

### Tool Call Frequency (top 10)
| Tool | Calls/day | Avg latency |
|------|-----------|-------------|
| get_customer_orders | 1,240 | 45ms |
| get_order | 1,180 | 32ms |
| get_payment_status | 890 | 28ms |
| send_email | 720 | 120ms |
| search_customers | 650 | 85ms |
| get_product | 520 | 22ms |
| refund_payment | 340 | 250ms |
| check_inventory | 310 | 18ms |

### Insight for Current Query
The exact chain "get_customer_orders -> get_payment_status -> send_email"
is the #1 most common pattern. Prioritize these 3 tools + get_email_templates
(required dependency for send_email).
</usage_frequency>`,
    },
    {
      id: "dynamic-loading",
      name: "Dynamic Loading",
      shortName: "Dynamic",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 220,
      description: "Load tool definitions on-demand as the agent progresses through steps.",
      content: `<dynamic_loading>
## Dynamic Tool Loading Strategy

Instead of loading all tools upfront, load them step-by-step as the
agent's plan unfolds:

### Step-Based Loading
\`\`\`
Initial context: 0 tools loaded (just the task description)

Agent plans: "I need to: 1) find order, 2) check payment, 3) send email"

Step 1: Load order tools
-> get_customer_orders loaded (45 tokens)
-> Agent calls get_customer_orders({ customer_id: "cust_123", limit: 1 })
-> Result: order_id: "ord_456", payment_id: "pay_789"

Step 2: Load payment tools (order tools unloaded)
-> get_payment_status loaded (38 tokens)
-> Agent calls get_payment_status({ payment_id: "pay_789" })
-> Result: status: "succeeded"

Step 3: Load notification tools (payment tools unloaded)
-> get_email_templates loaded (42 tokens)
-> send_email loaded (50 tokens)
-> Agent calls get_email_templates({ category: "shipping" })
-> Agent calls send_email({ customer_id: "cust_123", template_id: "shipping_confirmation", variables: { order_id: "ord_456" } })
\`\`\`

### Token Comparison
| Strategy | Tokens Used | Tools in Context |
|----------|-------------|-----------------|
| All tools always loaded | 4,200 | 34 |
| Category routing | 1,800 | 16 |
| RAG over tools | 1,100 | 5 |
| Dynamic loading | 650 | 1-2 per step |

### When to Use Dynamic Loading
- Agent has 20+ tools
- Tasks are sequential (step-by-step)
- Token budget is tight
- Each step uses different tool categories
</dynamic_loading>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Wrong Tool Every Time",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I'll help with that order.\n\nsearch_products({ query: \"recent order\" })\n-> No products found matching 'recent order'\n\nget_sales_report({ date_range: \"last week\" })\n-> Error: date_range must be { start: string, end: string }\n\nI'm not sure which tools to use for this task. There are too many options and I can't determine the right ones.",
      issues: [
        "Picks completely wrong tools (search_products for finding an order)",
        "Tries analytics tools for a customer support task",
        "No understanding of tool purposes",
        "Random tool selection — wastes API calls and tokens",
        "Cannot recover from wrong tool choices",
      ],
      strengths: [],
    },
    {
      id: "registry-only",
      label: "Knows Tools Exist",
      requiredComponents: ["tool-registry"],
      score: 15,
      agentResponse:
        "Looking at the registry, I need tools from Orders, Payments, and Notifications.\n\nget_order({ order_id: ??? })\n-> I don't have the order ID. I see list_orders and get_order_history but I'm not sure which one to use.\n\nget_payment_status({ payment_id: ??? })\n-> I don't have the payment ID either.\n\nsend_email({ customer_id: \"cust_123\", template_id: ??? })\n-> I need a template ID but I don't know how to find one.\n\nI can see the right categories but I don't have enough detail to call the tools correctly.",
      issues: [
        "Right categories but wrong tools (get_order instead of get_customer_orders)",
        "Doesn't know how to chain tools to get required IDs",
        "Missing parameter values with no strategy to obtain them",
        "Doesn't know about get_email_templates as a prerequisite",
        "One-line summaries aren't enough for correct usage",
      ],
      strengths: [
        "Identifies correct categories (Orders, Payments, Notifications)",
        "Knows the general tools that exist",
        "Understands the task requires multiple tools",
      ],
    },
    {
      id: "registry-descriptions",
      label: "Right Tools, Clumsy Calls",
      requiredComponents: ["tool-registry", "tool-descriptions"],
      score: 35,
      agentResponse:
        "I'll use get_customer_orders to find the most recent order, then check payment, then send email.\n\nget_customer_orders({ customer_id: \"cust_123\", limit: 1 })\n-> { orders: [{ id: \"ord_456\", payment_id: \"pay_789\", status: \"shipped\" }], total_count: 15 }\n\nget_payment_status({ payment_id: \"pay_789\" })\n-> { status: \"succeeded\", amount: 89.99 }\n\nsend_email({ customer_id: \"cust_123\", template_id: \"shipping_confirmation\", variables: { order_id: \"ord_456\" } })\n-> { sent: true }\n\nDone. But I loaded all 34 tool definitions to do this — that's ~4,200 tokens spent on tool descriptions when I only needed 4 tools.",
      issues: [
        "All 34 tools loaded into context (4,200 tokens wasted)",
        "Model has to scan through irrelevant tools to find right ones",
        "Slower response due to larger context window",
        "No optimization for repeated similar queries",
        "Higher cost per request due to token usage",
      ],
      strengths: [
        "Selects correct tools based on detailed descriptions",
        "Chains tools correctly (orders -> payment -> email)",
        "Uses get_customer_orders (not get_order) since no order ID",
        "Knows send_email needs template_id from descriptions",
        "Task completed successfully",
      ],
    },
    {
      id: "registry-descriptions-routing",
      label: "Category-Filtered",
      requiredComponents: ["tool-registry", "tool-descriptions", "category-routing"],
      score: 55,
      agentResponse:
        "Routing query to categories: Orders + Payments + Notifications + Customers.\nLoading 16/34 tools (53% reduction).\n\nget_customer_orders({ customer_id: \"cust_123\", limit: 1 })\n-> { orders: [{ id: \"ord_456\", payment_id: \"pay_789\", status: \"shipped\" }] }\n\nget_payment_status({ payment_id: \"pay_789\" })\n-> { status: \"succeeded\", amount: 89.99 }\n\nget_email_templates({ category: \"shipping\" })\n-> { templates: [{ id: \"shipping_confirmation\", required_vars: [\"order_id\", \"tracking_url\"] }] }\n\nsend_email({ customer_id: \"cust_123\", template_id: \"shipping_confirmation\", variables: { order_id: \"ord_456\" } })\n-> { sent: true }\n\nTask complete. 16 tools loaded instead of 34 — saved ~1,800 tokens.",
      issues: [
        "Still loads 16 tools when only 4-5 are needed",
        "Category routing is coarse — entire categories loaded",
        "No learning from past queries for optimization",
        "Analytics and Product tools filtered, but Customers fully loaded unnecessarily",
      ],
      strengths: [
        "Category routing reduces tools from 34 to 16",
        "Correct intent detection for multi-intent query",
        "Token savings of ~53%",
        "Looks up email template before sending",
        "Clean tool chain execution",
      ],
    },
    {
      id: "registry-descriptions-routing-rag",
      label: "Semantically Selected",
      requiredComponents: ["tool-registry", "tool-descriptions", "category-routing", "rag-over-tools"],
      score: 70,
      agentResponse:
        "RAG retrieval: Top 5 tools by semantic similarity.\nLoading 5/34 tools (85% token reduction).\n\nSelected tools:\n1. get_customer_orders (0.94 similarity)\n2. get_payment_status (0.91)\n3. send_email (0.89)\n4. get_email_templates (0.85)\n5. get_order (0.82)\n\nExecution:\nget_customer_orders({ customer_id: \"cust_123\", limit: 1 })\n-> Order found: ord_456, payment: pay_789, status: shipped\n\nget_payment_status({ payment_id: \"pay_789\" })\n-> Payment succeeded, $89.99\n\nget_email_templates({ category: \"shipping\" })\n-> Template: shipping_confirmation\n\nsend_email({ customer_id: \"cust_123\", template_id: \"shipping_confirmation\", variables: { order_id: \"ord_456\" } })\n-> Email sent successfully\n\nTask complete. 5 tools loaded, ~1,100 tokens for tool definitions. Reranking placed get_email_templates higher due to dependency on send_email.",
      issues: [
        "No awareness of common tool chains for optimization",
        "Static retrieval — doesn't adapt as task progresses",
        "get_order retrieved but not needed (redundant with get_customer_orders)",
        "Retrieval latency adds to response time",
      ],
      strengths: [
        "85% token reduction (5 tools vs 34)",
        "Semantic similarity finds the exact tools needed",
        "Reranking catches dependency (get_email_templates for send_email)",
        "No irrelevant tools to confuse the model",
        "Precise tool selection on first attempt",
      ],
    },
    {
      id: "registry-descriptions-routing-rag-frequency",
      label: "Pattern-Optimized",
      requiredComponents: ["tool-registry", "tool-descriptions", "category-routing", "rag-over-tools", "usage-frequency"],
      score: 82,
      agentResponse:
        "Query matches top tool chain pattern #1: get_customer_orders -> get_payment_status -> send_email (847 calls/month).\n\nLoading 4 tools (known chain + dependency):\n1. get_customer_orders (chain step 1)\n2. get_payment_status (chain step 2)\n3. send_email (chain step 3)\n4. get_email_templates (required dependency)\n\nExecution:\nget_customer_orders({ customer_id: \"cust_123\", limit: 1 })\n-> { orders: [{ id: \"ord_456\", payment_id: \"pay_789\", status: \"shipped\", items: [...] }] }\n\nget_payment_status({ payment_id: \"pay_789\" })\n-> { status: \"succeeded\", amount: 89.99, currency: \"USD\" }\n\nget_email_templates({ category: \"shipping\" })\n-> { templates: [{ id: \"shipping_confirmation\", required_vars: [\"order_id\", \"tracking_url\"] }] }\n\nsend_email({ customer_id: \"cust_123\", template_id: \"shipping_confirmation\", variables: { order_id: \"ord_456\" } })\n-> { sent: true, message_id: \"msg_321\" }\n\nComplete. 4 tools loaded (~650 tokens). Pattern match confirmed — this exact chain runs 847 times/month with 98% success rate.",
      issues: [
        "All tools loaded upfront — could save tokens with step-by-step loading",
        "Cannot handle unexpected branches mid-execution",
      ],
      strengths: [
        "Recognizes the exact tool chain pattern from usage data",
        "Only 4 tools loaded (88% token reduction)",
        "Pattern confidence from 847 historical executions",
        "No redundant tools (get_order excluded)",
        "Dependency chain pre-computed (email templates)",
        "98% success rate from historical data",
      ],
    },
    {
      id: "all",
      label: "Optimal Selection",
      requiredComponents: ["tool-registry", "tool-descriptions", "category-routing", "rag-over-tools", "usage-frequency", "dynamic-loading"],
      score: 95,
      agentResponse:
        "Query analysis: 3-step task matching pattern #1 (847 calls/month, 98% success).\nStrategy: Dynamic loading — load tools per step.\n\nStep 1/3 — Find recent order\nLoaded: get_customer_orders (45 tokens)\nget_customer_orders({ customer_id: \"cust_123\", limit: 1 })\n-> { id: \"ord_456\", payment_id: \"pay_789\", status: \"shipped\" }\nUnloaded: get_customer_orders\n\nStep 2/3 — Verify payment\nLoaded: get_payment_status (38 tokens)\nget_payment_status({ payment_id: \"pay_789\" })\n-> { status: \"succeeded\", amount: 89.99 }\nUnloaded: get_payment_status\n\nStep 3/3 — Send confirmation\nLoaded: get_email_templates + send_email (92 tokens)\nget_email_templates({ category: \"shipping\" })\n-> Template: shipping_confirmation, vars: [order_id, tracking_url]\nsend_email({ customer_id: \"cust_123\", template_id: \"shipping_confirmation\", variables: { order_id: \"ord_456\" } })\n-> { sent: true, message_id: \"msg_321\" }\n\nComplete.\n- Tools loaded per step: 1 -> 1 -> 2 (max 2 in context at once)\n- Total tool tokens: 175 (vs 4,200 for all tools = 96% savings)\n- Pattern match: #1 chain, 98% historical success\n- All 3 subtasks completed on first attempt.",
      issues: ["Could cache tool definitions across similar requests to reduce retrieval latency"],
      strengths: [
        "Dynamic loading: 1-2 tools in context at any time",
        "96% token savings vs loading all 34 tools",
        "Pattern matching identifies the optimal tool chain",
        "Tools unloaded after use — minimal context pollution",
        "Historical success rate validates the approach",
        "Zero wrong tool selections",
        "Each step has exactly the tools it needs, nothing more",
        "Scales to 100+ tools without context window pressure",
      ],
    },
  ],
  principles: [
    {
      id: "less-is-more",
      title: "Less Is More",
      description: "Loading all tools into context is the most common mistake with large tool sets. The model performs better with 4 relevant tools than 34 tools where 30 are noise. Fewer tools means fewer wrong selections and lower costs.",
      linkedComponents: ["rag-over-tools", "dynamic-loading"],
    },
    {
      id: "selection-is-a-pipeline",
      title: "Selection Is a Pipeline",
      description: "Tool selection works best as a multi-stage pipeline: registry (what exists) -> routing (narrow by category) -> RAG (semantic match) -> frequency (validate with data) -> dynamic loading (minimize context). Each stage reduces noise.",
      linkedComponents: ["tool-registry", "category-routing", "rag-over-tools", "usage-frequency"],
    },
    {
      id: "descriptions-drive-accuracy",
      title: "Descriptions Drive Accuracy",
      description: "The model selects tools primarily by matching query intent to tool descriptions. 'When to use' and 'When NOT to use' annotations in descriptions eliminate the most common selection errors.",
      linkedComponents: ["tool-descriptions", "tool-registry"],
    },
    {
      id: "data-beats-heuristics",
      title: "Data Beats Heuristics",
      description: "Usage frequency data reveals which tools are actually called together. This empirical signal is more reliable than hand-crafted routing rules. The top tool chain for this query has a 98% success rate from 847 historical executions.",
      linkedComponents: ["usage-frequency", "dynamic-loading"],
    },
  ],
};
