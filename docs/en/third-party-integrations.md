---
title: third-party-integrations
source: https://code.claude.com/docs/en/third-party-integrations.md
fetched: 2025-11-15T09:17:22.338Z
---

# third-party-integrations

\# Enterprise deployment overview > Learn how Claude Code can integrate with various third-party services and infrastructure to meet enterprise deployment requirements. This page provides an overview of available deployment options and helps you choose the right configuration for your organization. ## Provider comparison

Feature

Anthropic

Amazon Bedrock

Google Vertex AI

Regions

Supported \[countries\](https://www.anthropic.com/supported-countries)

Multiple AWS \[regions\](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html)

Multiple GCP \[regions\](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/locations)

Prompt caching

Enabled by default

Enabled by default

Enabled by default

Authentication

API key

AWS credentials (IAM)

GCP credentials (OAuth/Service Account)

Cost tracking

Dashboard

AWS Cost Explorer

GCP Billing

Enterprise features

Teams, usage monitoring

IAM policies, CloudTrail

IAM roles, Cloud Audit Logs

\## Cloud providers Use Claude models through AWS infrastructure with IAM-based authentication and AWS-native monitoring Access Claude models via Google Cloud Platform with enterprise-grade security and compliance \## Corporate infrastructure Configure Claude Code to work with your organization's proxy servers and SSL/TLS requirements Deploy centralized model access with usage tracking, budgeting, and audit logging \## Configuration overview Claude Code supports flexible configuration options that allow you to combine different providers and infrastructure: Understand the difference between: \* \*\*Corporate proxy\*\*: An HTTP/HTTPS proxy for routing traffic (set via \`HTTPS\_PROXY\` or \`HTTP\_PROXY\`) \* \*\*LLM Gateway\*\*: A service that handles authentication and provides provider-compatible endpoints (set via \`ANTHROPIC\_BASE\_URL\`, \`ANTHROPIC\_BEDROCK\_BASE\_URL\`, or \`ANTHROPIC\_VERTEX\_BASE\_URL\`) Both configurations can be used in tandem. \### Using Bedrock with corporate proxy Route Bedrock traffic through a corporate HTTP/HTTPS proxy: \`\`\`bash theme={null} # Enable Bedrock export CLAUDE\_CODE\_USE\_BEDROCK=1 export AWS\_REGION=us-east-1 # Configure corporate proxy export HTTPS\_PROXY='https://proxy.example.com:8080' \`\`\` ### Using Bedrock with LLM Gateway Use a gateway service that provides Bedrock-compatible endpoints: \`\`\`bash theme={null} # Enable Bedrock export CLAUDE\_CODE\_USE\_BEDROCK=1 # Configure LLM gateway export ANTHROPIC\_BEDROCK\_BASE\_URL='https://your-llm-gateway.com/bedrock' export CLAUDE\_CODE\_SKIP\_BEDROCK\_AUTH=1 # If gateway handles AWS auth \`\`\` ### Using Vertex AI with corporate proxy Route Vertex AI traffic through a corporate HTTP/HTTPS proxy: \`\`\`bash theme={null} # Enable Vertex export CLAUDE\_CODE\_USE\_VERTEX=1 export CLOUD\_ML\_REGION=us-east5 export ANTHROPIC\_VERTEX\_PROJECT\_ID=your-project-id # Configure corporate proxy export HTTPS\_PROXY='https://proxy.example.com:8080' \`\`\` ### Using Vertex AI with LLM Gateway Combine Google Vertex AI models with an LLM gateway for centralized management: \`\`\`bash theme={null} # Enable Vertex export CLAUDE\_CODE\_USE\_VERTEX=1 # Configure LLM gateway export ANTHROPIC\_VERTEX\_BASE\_URL='https://your-llm-gateway.com/vertex' export CLAUDE\_CODE\_SKIP\_VERTEX\_AUTH=1 # If gateway handles GCP auth \`\`\` ### Authentication configuration Claude Code uses the \`ANTHROPIC\_AUTH\_TOKEN\` for the \`Authorization\` header when needed. The \`SKIP\_AUTH\` flags (\`CLAUDE\_CODE\_SKIP\_BEDROCK\_AUTH\`, \`CLAUDE\_CODE\_SKIP\_VERTEX\_AUTH\`) are used in LLM gateway scenarios where the gateway handles provider authentication. ## Choosing the right deployment configuration Consider these factors when selecting your deployment approach: ### Direct provider access Best for organizations that: \* Want the simplest setup \* Have existing AWS or GCP infrastructure \* Need provider-native monitoring and compliance ### Corporate proxy Best for organizations that: \* Have existing corporate proxy requirements \* Need traffic monitoring and compliance \* Must route all traffic through specific network paths ### LLM Gateway Best for organizations that: \* Need usage tracking across teams \* Want to dynamically switch between models \* Require custom rate limiting or budgets \* Need centralized authentication management ## Debugging When debugging your deployment: \* Use the \`claude /status\` \[slash command\](/en/slash-commands). This command provides observability into any applied authentication, proxy, and URL settings. \* Set environment variable \`export ANTHROPIC\_LOG=debug\` to log requests. ## Best practices for organizations ### 1. Invest in documentation and memory We strongly recommend investing in documentation so that Claude Code understands your codebase. Organizations can deploy CLAUDE.md files at multiple levels: \* \*\*Organization-wide\*\*: Deploy to system directories like \`/Library/Application Support/ClaudeCode/CLAUDE.md\` (macOS) for company-wide standards \* \*\*Repository-level\*\*: Create \`CLAUDE.md\` files in repository roots containing project architecture, build commands, and contribution guidelines. Check these into source control so all users benefit \[Learn more\](/en/memory). ### 2. Simplify deployment If you have a custom development environment, we find that creating a "one click" way to install Claude Code is key to growing adoption across an organization. ### 3. Start with guided usage Encourage new users to try Claude Code for codebase Q\\&A, or on smaller bug fixes or feature requests. Ask Claude Code to make a plan. Check Claude's suggestions and give feedback if it's off-track. Over time, as users understand this new paradigm better, then they'll be more effective at letting Claude Code run more agentically. ### 4. Configure security policies Security teams can configure managed permissions for what Claude Code is and is not allowed to do, which cannot be overwritten by local configuration. \[Learn more\](/en/security). ### 5. Leverage MCP for integrations MCP is a great way to give Claude Code more information, such as connecting to ticket management systems or error logs. We recommend that one central team configures MCP servers and checks a \`.mcp.json\` configuration into the codebase so that all users benefit. \[Learn more\](/en/mcp). At Anthropic, we trust Claude Code to power development across every Anthropic codebase. We hope you enjoy using Claude Code as much as we do! ## Next steps \* \[Set up Amazon Bedrock\](/en/amazon-bedrock) for AWS-native deployment \* \[Configure Google Vertex AI\](/en/google-vertex-ai) for GCP deployment \* \[Configure Enterprise Network\](/en/network-config) for network requirements \* \[Deploy LLM Gateway\](/en/llm-gateway) for enterprise management \* \[Settings\](/en/settings) for configuration options and environment variables