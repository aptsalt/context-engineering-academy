import type { PlaygroundScenario } from "@/lib/playground-data";

export const customerSupportScenario: PlaygroundScenario = {
  id: "customer-support",
  name: "Customer Support Agent",
  emphasis: "full-pipeline",
  emphasisLabel: "Full Pipeline",
  meta: {
    title: "Live Scenario",
    description:
      "A customer support agent handles a damaged product complaint. Each context component you enable gives the agent more information. Watch how response quality improves as you build up the context window.",
    infoCards: [
      { icon: "User", label: "Customer", value: "Sarah Chen — Pro tier" },
      { icon: "Package", label: "Product", value: "AcmeCloud Pro Hub — $189.99" },
      { icon: "CreditCard", label: "Issue", value: "Cracked screen — wants refund" },
    ],
  },
  customerMessage:
    "Hi, I received my AcmeCloud Pro Hub yesterday and the screen is cracked. I'd like a refund please. My order number is AC-2024-7891.",
  recommendedBuildOrder: [
    "system-prompt",
    "tools",
    "rag",
    "history",
    "few-shot",
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
      tokens: 320,
      description: "Defines the agent's role, behavior guidelines, and escalation rules.",
      content: `<system>
You are a senior customer support agent for AcmeCloud, a cloud hardware company.

## Role
- Help customers with orders, returns, refunds, and technical issues
- Be empathetic, professional, and solution-oriented
- Mirror the customer's communication style

## Guidelines
- Always verify customer identity before account changes
- For damaged products: offer replacement first, then refund
- Refunds over $200 require manager approval — escalate gracefully
- Never guess product specs — use the product catalog tool
- Cite policy numbers when referencing company policies

## Escalation Rules
- Abusive language → politely warn, then escalate to human
- Legal threats → immediately escalate to legal team
- Repeated contacts (3+) about same issue → escalate to senior support
</system>`,
    },
    {
      id: "tools",
      name: "Tool Definitions",
      shortName: "Tools",
      color: "text-red-400",
      bgColor: "bg-red-500",
      borderColor: "border-red-500/30",
      tokens: 280,
      description: "APIs and functions the agent can invoke to take actions.",
      content: `<tools>
[
  {
    "name": "get_customer",
    "description": "Retrieve customer profile by ID or email",
    "parameters": { "customer_id": "string", "email": "string (optional)" }
  },
  {
    "name": "get_order",
    "description": "Retrieve order details including items, status, and shipping",
    "parameters": { "order_id": "string" }
  },
  {
    "name": "process_refund",
    "description": "Issue a refund for an order. Returns confirmation number.",
    "parameters": { "order_id": "string", "reason": "string", "amount": "number (optional, defaults to full)" }
  },
  {
    "name": "search_products",
    "description": "Search product catalog by name or SKU",
    "parameters": { "query": "string" }
  },
  {
    "name": "create_ticket",
    "description": "Escalate issue to human agent with context summary",
    "parameters": { "priority": "low|medium|high", "summary": "string", "customer_id": "string" }
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
      tokens: 350,
      description: "Worked examples showing the agent how to handle similar scenarios.",
      content: `<examples>
## Example 1: Damaged Product — Replacement Accepted
Customer: "My AcmeCloud Mini arrived with a dent on the side."
Agent: I'm sorry to hear your AcmeCloud Mini arrived damaged. Let me pull up your order to get this resolved quickly.
[calls get_order("AC-2024-5523")]
I can see your order. Per our policy (POL-RET-001), for items damaged during shipping, we can send a replacement right away or issue a full refund. Which would you prefer?
Customer: "Replacement please."
Agent: Done! I've initiated a replacement shipment. You'll receive tracking within 24 hours. You can keep or recycle the damaged unit — no need to return it.

## Example 2: Refund Request — Over $200 Threshold
Customer: "I want a refund for my AcmeCloud Pro Station. Order AC-2024-6102."
Agent: I understand you'd like a refund for your Pro Station. Let me look into this.
[calls get_order("AC-2024-6102")]
I see your order — the Pro Station was $349. Since refunds over $200 require a brief manager review, I'll escalate this now. You should receive confirmation within 2 business hours. Is there anything else I can help with?
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
      description: "Prior turns in this conversation establishing customer context.",
      content: `<conversation_history>
[Turn 1]
Customer: "Hi, I need help with a recent order."
Agent: "Hello! I'd be happy to help. Could you provide your order number or the email associated with your account?"

[Turn 2]
Customer: "Sure, my email is sarah.chen@example.com"
Agent: "Thank you, Sarah. I've pulled up your account."
[called get_customer(email="sarah.chen@example.com") → { id: "CUST-4921", name: "Sarah Chen", tier: "Pro", orders: 7, member_since: "2023-01" }]

[Turn 3]
Agent: "I can see you're a Pro-tier member since January 2023. How can I help you today?"
</conversation_history>`,
    },
    {
      id: "rag",
      name: "RAG Documents",
      shortName: "RAG",
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
      tokens: 300,
      description: "Retrieved policy documents and product information.",
      content: `<retrieved_documents>
[Source 1: Refund Policy v4.1 — POL-RET-001]
- Physical products: Full refund within 30 days of delivery
- Damaged items: Immediate replacement or refund, no return required
- Refunds over $200: Require manager approval (SLA: 2 business hours)
- Refund method: Original payment method within 5-7 business days
- Pro-tier members: Expedited processing (2-3 business days)

[Source 2: Product Catalog — AcmeCloud Pro Hub]
- SKU: ACH-PRO-2024
- Price: $189.99
- Category: Smart Home Hub
- Display: 7" touchscreen, Gorilla Glass 5
- Warranty: 2 years standard, 3 years for Pro members
- Known issue: Batch AC24-Q3 had reports of screen defects (resolved in Q4)
- Replacement SKU for damaged units: ACH-PRO-2024-R
</retrieved_documents>`,
    },
    {
      id: "memory",
      name: "Memory",
      shortName: "Memory",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      borderColor: "border-cyan-500/30",
      tokens: 180,
      description: "Agent scratchpad and long-term customer preferences.",
      content: `<memory>
## Agent Scratchpad (this session)
- Customer identified: Sarah Chen (CUST-4921)
- Issue type: Damaged product (cracked screen)
- Product: AcmeCloud Pro Hub ($189.99)
- Order: AC-2024-7891
- Refund amount under $200 — no escalation needed
- Customer is Pro-tier — eligible for expedited refund

## Long-Term Memory (cross-session)
- Sarah has been a customer since 2023, 7 orders total
- Previous interaction (2024-08): Positive experience with replacement
- Communication preference: Direct and concise
- Has never requested a refund before — high loyalty indicator
- Pro-tier member — prioritize retention
</memory>`,
    },
  ],
  responses: [
    {
      id: "none",
      label: "Broken",
      requiredComponents: [],
      score: 5,
      agentResponse:
        "I don't have enough context to help you. Can you tell me who you are and what you need?",
      issues: [
        "No role or personality defined",
        "Cannot access any customer data",
        "No knowledge of products or policies",
        "Cannot take any actions",
        "No memory of prior conversation",
      ],
      strengths: [],
    },
    {
      id: "system-only",
      label: "Aware but Helpless",
      requiredComponents: ["system-prompt"],
      score: 25,
      agentResponse:
        "I understand you received a damaged AcmeCloud Pro Hub and would like a refund. I'm sorry about this experience. However, I'm currently unable to look up your order details or process any refunds. Could you please contact us through another channel where I can access your account information?",
      issues: [
        "Cannot look up order or customer data",
        "Cannot verify the product or price",
        "Cannot process the refund",
        "No knowledge of refund policy",
      ],
      strengths: [
        "Professional tone and empathy",
        "Understands it's a support interaction",
      ],
    },
    {
      id: "system-tools",
      label: "Capable but Uninformed",
      requiredComponents: ["system-prompt", "tools"],
      score: 45,
      agentResponse:
        "I'm sorry to hear about the cracked screen on your AcmeCloud Pro Hub. Let me look into this right away.\n\n[calls get_order(\"AC-2024-7891\")]\n\nI've found your order. I can see the product details. I'd like to process a refund for you, but I want to make sure I'm following the correct procedure. Could you confirm the purchase amount? I'll initiate the refund process once verified.",
      issues: [
        "Doesn't know the refund policy — has to ask unnecessary questions",
        "Doesn't know if this needs escalation or not",
        "No awareness of the product's known issues",
        "Generic response — doesn't leverage customer history",
      ],
      strengths: [
        "Professional and empathetic tone",
        "Correctly uses tools to look up order",
        "Takes action toward resolution",
      ],
    },
    {
      id: "system-tools-rag",
      label: "Good",
      requiredComponents: ["system-prompt", "tools", "rag"],
      score: 65,
      agentResponse:
        "I'm sorry about the cracked screen on your AcmeCloud Pro Hub. Let me pull up your order.\n\n[calls get_order(\"AC-2024-7891\")]\n\nI can see your order for the AcmeCloud Pro Hub ($189.99). Per our refund policy (POL-RET-001), damaged items qualify for an immediate refund with no return required. Since this is under $200, I can process it right now.\n\nAlternatively, I can send a replacement unit — would you prefer that instead?\n\n[ready to call process_refund(\"AC-2024-7891\", \"damaged — cracked screen\")]",
      issues: [
        "Doesn't know the customer or their history",
        "Doesn't mention Pro-tier benefits (expedited processing)",
        "Doesn't reference the known batch issue",
        "No awareness of prior conversation turns",
      ],
      strengths: [
        "Cites specific policy number",
        "Knows no escalation needed (under $200)",
        "Offers replacement alternative",
        "Ready to take action immediately",
      ],
    },
    {
      id: "system-tools-rag-history",
      label: "Very Good",
      requiredComponents: ["system-prompt", "tools", "rag", "history"],
      score: 75,
      agentResponse:
        "Sarah, I'm sorry to hear the Pro Hub arrived with a cracked screen. Let me check the order details.\n\n[calls get_order(\"AC-2024-7891\")]\n\nI can see your AcmeCloud Pro Hub ($189.99). Per our policy (POL-RET-001), damaged items qualify for an immediate refund — no return needed. Since it's under $200, I can process this right now.\n\nAs a Pro-tier member, your refund will be expedited to 2-3 business days instead of the standard 5-7. Would you like me to go ahead, or would you prefer a replacement unit?",
      issues: [
        "Doesn't reference the known screen defect batch issue",
        "Doesn't leverage long-term customer loyalty data",
        "Response style not tailored to customer's communication preference",
      ],
      strengths: [
        "Addresses customer by name",
        "Cites policy number",
        "Mentions Pro-tier expedited processing",
        "Offers replacement option",
        "Smooth, personalized interaction",
      ],
    },
    {
      id: "all-minus-memory",
      label: "Excellent",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag"],
      score: 85,
      agentResponse:
        "Sarah, I'm sorry about the cracked screen on your Pro Hub. Let me get this sorted.\n\n[calls get_order(\"AC-2024-7891\")]\n\nI've confirmed your order — AcmeCloud Pro Hub at $189.99. Per our damaged item policy (POL-RET-001), you're entitled to an immediate refund with no need to return the unit. Since the amount is under $200, no additional approval is needed.\n\nAs a Pro-tier member, your refund will process in 2-3 business days to your original payment method.\n\nAlternatively, I can ship a replacement right away — you'd have tracking within 24 hours and can recycle the damaged unit. Which would you prefer?",
      issues: [
        "Doesn't know about the batch screen defect issue",
        "Doesn't leverage Sarah's loyalty history or preferences",
        "Slightly more verbose than the customer might prefer",
      ],
      strengths: [
        "Response structure matches few-shot examples",
        "Offers both replacement and refund (per examples)",
        "Mentions no-return policy for damaged items",
        "Pro-tier expedited timeline cited",
        "Clear next steps for both options",
      ],
    },
    {
      id: "all",
      label: "Production-Ready",
      requiredComponents: ["system-prompt", "tools", "few-shot", "history", "rag", "memory"],
      score: 95,
      agentResponse:
        "Sarah, sorry about the cracked screen. Let me resolve this quickly.\n\n[calls get_order(\"AC-2024-7891\")]\n\nConfirmed — your Pro Hub ($189.99) is from batch AC24-Q3, which had a known screen defect. Since this is a documented issue:\n\n- **Full refund**: $189.99 to your original payment, expedited 2-3 days (Pro-tier benefit). No return needed.\n- **Replacement**: Ships within 24 hours from the updated batch. Keep or recycle the damaged unit.\n\nGiven your positive experience with a replacement last August, would you like to go that route again? Either way, I can process it right now.\n\n[ready to call process_refund(\"AC-2024-7891\", \"known batch defect — cracked screen\") or initiate replacement]",
      issues: ["Could proactively offer a small goodwill credit for the inconvenience"],
      strengths: [
        "Concise and direct (matches Sarah's communication preference)",
        "References known batch defect — builds trust",
        "Leverages past positive replacement experience",
        "Both options clearly laid out with timelines",
        "Pro-tier benefits highlighted",
        "No unnecessary questions — ready to act",
        "Policy citation included",
        "Demonstrates full context engineering pipeline",
      ],
    },
    {
      id: "tools-only",
      label: "Confused Robot",
      requiredComponents: ["tools"],
      score: 15,
      agentResponse:
        "Processing request. Let me query the system.\n\n[calls get_order(\"AC-2024-7891\")]\n[calls get_customer(customer_id=\"unknown\")]\n[calls search_products(query=\"Pro Hub\")]\n\nOrder found. Product found. Customer not verified. I can call process_refund but I have no guidelines on when refunds are appropriate. Should I proceed? Please advise on refund policy.",
      issues: [
        "No personality or empathy — robotic tone",
        "Calls tools randomly without strategy",
        "Cannot make decisions without policy knowledge",
        "No customer rapport or communication skills",
        "Asks the customer to advise on policy",
      ],
      strengths: ["Can technically access data and tools"],
    },
    {
      id: "rag-only",
      label: "Walking Policy Manual",
      requiredComponents: ["rag"],
      score: 20,
      agentResponse:
        "According to our Refund Policy v4.1 (POL-RET-001), physical products are eligible for a full refund within 30 days of delivery. For damaged items, an immediate replacement or refund is available with no return required. Refunds over $200 require manager approval with a 2-hour SLA. Pro-tier members receive expedited processing of 2-3 business days.\n\nThe AcmeCloud Pro Hub (SKU: ACH-PRO-2024) is priced at $189.99 and features a 7-inch touchscreen with Gorilla Glass 5.\n\nI hope this information is helpful.",
      issues: [
        "Recites policy without applying it to the situation",
        "Cannot look up the actual order",
        "Cannot process any refund",
        "No conversational ability or empathy",
        "Doesn't acknowledge the customer's specific problem",
      ],
      strengths: [
        "Has accurate policy and product information",
        "Cites sources correctly",
      ],
    },
    {
      id: "system-fewshot",
      label: "Good Manners, No Action",
      requiredComponents: ["system-prompt", "few-shot"],
      score: 30,
      agentResponse:
        "I'm so sorry to hear your AcmeCloud Pro Hub arrived with a cracked screen, that must be really frustrating. I want to help get this resolved for you right away.\n\nUnfortunately, I'm not able to look up your order AC-2024-7891 at the moment, and I don't have access to our current refund policies. Let me connect you with a team member who can pull up your order and process the refund.\n\nIs there anything else I can note for them before I transfer you?",
      issues: [
        "Cannot access any data or take actions",
        "Has to defer to another agent",
        "No knowledge of policies or products",
        "Adds unnecessary delay to resolution",
      ],
      strengths: [
        "Excellent tone and empathy (matches few-shot style)",
        "Professional escalation approach",
        "Good conversational structure",
        "Acknowledges the specific issue",
      ],
    },
  ],
  principles: [
    {
      id: "incremental-value",
      title: "Incremental Value",
      description: "Each context component adds measurable value. The system prompt provides personality, tools enable action, RAG provides knowledge, and memory personalizes. None alone is sufficient.",
      linkedComponents: ["system-prompt", "tools", "rag", "memory"],
    },
    {
      id: "synergy-over-isolation",
      title: "Synergy Over Isolation",
      description: "Components are more powerful together than alone. Tools + RAG lets the agent act on knowledge. History + Memory lets the agent personalize across sessions.",
      linkedComponents: ["tools", "rag", "history", "memory"],
    },
    {
      id: "build-order-matters",
      title: "Build Order Matters",
      description: "Start with identity (system prompt), then capabilities (tools), then knowledge (RAG), then context (history), then polish (few-shot, memory). This mirrors how humans learn a job.",
      linkedComponents: ["system-prompt", "tools", "rag", "history", "few-shot", "memory"],
    },
    {
      id: "diminishing-returns",
      title: "Know When You're Done",
      description: "Going from 85 to 95 requires memory — a specialized component. In production, evaluate whether the last 10% justifies the added complexity and token cost.",
      linkedComponents: ["memory"],
    },
  ],
};
