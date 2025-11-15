---
title: Agents
source: https://code.claude.com/docs/en/sub-agents
fetched: 2025-11-15T09:17:21.144Z
---

# Agents

[Skip to main content](#content-area)

[Claude Code Docs home page![light logo](https://mintcdn.com/claude-code/o69F7a6qoW9vboof/logo/light.svg?fit=max&auto=format&n=o69F7a6qoW9vboof&q=85&s=536eade682636e84231afce2577f9509)![dark logo](https://mintcdn.com/claude-code/o69F7a6qoW9vboof/logo/dark.svg?fit=max&auto=format&n=o69F7a6qoW9vboof&q=85&s=0766b3221061e80143e9f300733e640b)](/docs)

![US](https://d3gk2c5xim1je2.cloudfront.net/flags/US.svg)

English

Search...

⌘K

Search...

Navigation

Build with Claude Code

Subagents

[Getting started

](/docs/en/overview)[Build with Claude Code

](/docs/en/sub-agents)[Deployment

](/docs/en/third-party-integrations)[Administration

](/docs/en/setup)[Configuration

](/docs/en/settings)[Reference

](/docs/en/cli-reference)[Resources

](/docs/en/legal-and-compliance)

##### Build with Claude Code

-   [
    
    Subagents
    
    
    
    ](/docs/en/sub-agents)
-   [
    
    Plugins
    
    
    
    ](/docs/en/plugins)
-   [
    
    Agent Skills
    
    
    
    ](/docs/en/skills)
-   [
    
    Output styles
    
    
    
    ](/docs/en/output-styles)
-   [
    
    Hooks
    
    
    
    ](/docs/en/hooks-guide)
-   [
    
    Headless mode
    
    
    
    ](/docs/en/headless)
-   [
    
    GitHub Actions
    
    
    
    ](/docs/en/github-actions)
-   [
    
    GitLab CI/CD
    
    
    
    ](/docs/en/gitlab-ci-cd)
-   [
    
    Model Context Protocol (MCP)
    
    
    
    ](/docs/en/mcp)
-   [
    
    Migrate to Claude Agent SDK
    
    
    
    ](/docs/en/sdk/migration-guide)
-   [
    
    Troubleshooting
    
    
    
    ](/docs/en/troubleshooting)

On this page

-   [What are subagents?](#what-are-subagents)
-   [Key benefits](#key-benefits)
-   [Quick start](#quick-start)
-   [Subagent configuration](#subagent-configuration)
-   [File locations](#file-locations)
-   [Plugin agents](#plugin-agents)
-   [CLI-based configuration](#cli-based-configuration)
-   [File format](#file-format)
-   [Configuration fields](#configuration-fields)
-   [Model selection](#model-selection)
-   [Available tools](#available-tools)
-   [Managing subagents](#managing-subagents)
-   [Using the /agents command (Recommended)](#using-the-/agents-command-recommended)
-   [Direct file management](#direct-file-management)
-   [Using subagents effectively](#using-subagents-effectively)
-   [Automatic delegation](#automatic-delegation)
-   [Explicit invocation](#explicit-invocation)
-   [Built-in subagents](#built-in-subagents)
-   [Plan subagent](#plan-subagent)
-   [Example subagents](#example-subagents)
-   [Code reviewer](#code-reviewer)
-   [Debugger](#debugger)
-   [Data scientist](#data-scientist)
-   [Best practices](#best-practices)
-   [Advanced usage](#advanced-usage)
-   [Chaining subagents](#chaining-subagents)
-   [Dynamic subagent selection](#dynamic-subagent-selection)
-   [Resumable subagents](#resumable-subagents)
-   [Performance considerations](#performance-considerations)
-   [Related documentation](#related-documentation)

Custom subagents in Claude Code are specialized AI assistants that can be invoked to handle specific types of tasks. They enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window.

## 

[​

](#what-are-subagents)

What are subagents?

Subagents are pre-configured AI personalities that Claude Code can delegate tasks to. Each subagent:

-   Has a specific purpose and expertise area
-   Uses its own context window separate from the main conversation
-   Can be configured with specific tools it’s allowed to use
-   Includes a custom system prompt that guides its behavior

When Claude Code encounters a task that matches a subagent’s expertise, it can delegate that task to the specialized subagent, which works independently and returns results.

## 

[​

](#key-benefits)

Key benefits

## Context preservation

Each subagent operates in its own context, preventing pollution of the main conversation and keeping it focused on high-level objectives.

## Specialized expertise

Subagents can be fine-tuned with detailed instructions for specific domains, leading to higher success rates on designated tasks.

## Reusability

Once created, subagents can be used across different projects and shared with your team for consistent workflows.

## Flexible permissions

Each subagent can have different tool access levels, allowing you to limit powerful tools to specific subagent types.

## 

[​

](#quick-start)

Quick start

To create your first subagent:

1

Open the subagents interface

Run the following command:

Copy

Ask AI

```
/agents

```

2

Select 'Create New Agent'

Choose whether to create a project-level or user-level subagent

3

Define the subagent

-   **Recommended**: Generate with Claude first, then customize to make it yours
-   Describe your subagent in detail and when it should be used
-   Select the tools you want to grant access to (or leave blank to inherit all tools)
-   The interface shows all available tools, making selection easy
-   If you’re generating with Claude, you can also edit the system prompt in your own editor by pressing `e`

4

Save and use

Your subagent is now available! Claude will use it automatically when appropriate, or you can invoke it explicitly:

Copy

Ask AI

```
> Use the code-reviewer subagent to check my recent changes

```

## 

[​

](#subagent-configuration)

Subagent configuration

### 

[​

](#file-locations)

File locations

Subagents are stored as Markdown files with YAML frontmatter in two possible locations:

Type

Location

Scope

Priority

**Project subagents**

`.claude/agents/`

Available in current project

Highest

**User subagents**

`~/.claude/agents/`

Available across all projects

Lower

When subagent names conflict, project-level subagents take precedence over user-level subagents.

### 

[​

](#plugin-agents)

Plugin agents

[Plugins](/docs/en/plugins) can provide custom subagents that integrate seamlessly with Claude Code. Plugin agents work identically to user-defined agents and appear in the `/agents` interface. **Plugin agent locations**: Plugins include agents in their `agents/` directory (or custom paths specified in the plugin manifest). **Using plugin agents**:

-   Plugin agents appear in `/agents` alongside your custom agents
-   Can be invoked explicitly: “Use the code-reviewer agent from the security-plugin”
-   Can be invoked automatically by Claude when appropriate
-   Can be managed (viewed, inspected) through `/agents` interface

See the [plugin components reference](/docs/en/plugins-reference#agents) for details on creating plugin agents.

### 

[​

](#cli-based-configuration)

CLI-based configuration

You can also define subagents dynamically using the `--agents` CLI flag, which accepts a JSON object:

Copy

Ask AI

```
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'

```

**Priority**: CLI-defined subagents have lower priority than project-level subagents but higher priority than user-level subagents. **Use case**: This approach is useful for:

-   Quick testing of subagent configurations
-   Session-specific subagents that don’t need to be saved
-   Automation scripts that need custom subagents
-   Sharing subagent definitions in documentation or scripts

For detailed information about the JSON format and all available options, see the [CLI reference documentation](/docs/en/cli-reference#agents-flag-format).

### 

[​

](#file-format)

File format

Each subagent is defined in a Markdown file with this structure:

Copy

Ask AI

```
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all tools if omitted
model: sonnet  # Optional - specify model alias or 'inherit'
---
Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach
to solving problems.
Include specific instructions, best practices, and any constraints
the subagent should follow.

```

#### 

[​

](#configuration-fields)

Configuration fields

Field

Required

Description

`name`

Yes

Unique identifier using lowercase letters and hyphens

`description`

Yes

Natural language description of the subagent’s purpose

`tools`

No

Comma-separated list of specific tools. If omitted, inherits all tools from the main thread

`model`

No

Model to use for this subagent. Can be a model alias (`sonnet`, `opus`, `haiku`) or `'inherit'` to use the main conversation’s model. If omitted, defaults to the [configured subagent model](/docs/en/model-config)

### 

[​

](#model-selection)

Model selection

The `model` field allows you to control which [AI model](/docs/en/model-config) the subagent uses:

-   **Model alias**: Use one of the available aliases: `sonnet`, `opus`, or `haiku`
-   **`'inherit'`**: Use the same model as the main conversation (useful for consistency)
-   **Omitted**: If not specified, uses the default model configured for subagents (`sonnet`)

Using `'inherit'` is particularly useful when you want your subagents to adapt to the model choice of the main conversation, ensuring consistent capabilities and response style throughout your session.

### 

[​

](#available-tools)

Available tools

Subagents can be granted access to any of Claude Code’s internal tools. See the [tools documentation](/docs/en/settings#tools-available-to-claude) for a complete list of available tools.

**Recommended:** Use the `/agents` command to modify tool access - it provides an interactive interface that lists all available tools, including any connected MCP server tools, making it easier to select the ones you need.

You have two options for configuring tools:

-   **Omit the `tools` field** to inherit all tools from the main thread (default), including MCP tools
-   **Specify individual tools** as a comma-separated list for more granular control (can be edited manually or via `/agents`)

**MCP Tools**: Subagents can access MCP tools from configured MCP servers. When the `tools` field is omitted, subagents inherit all MCP tools available to the main thread.

## 

[​

](#managing-subagents)

Managing subagents

### 

[​

](#using-the-/agents-command-recommended)

Using the /agents command (Recommended)

The `/agents` command provides a comprehensive interface for subagent management:

Copy

Ask AI

```
/agents

```

This opens an interactive menu where you can:

-   View all available subagents (built-in, user, and project)
-   Create new subagents with guided setup
-   Edit existing custom subagents, including their tool access
-   Delete custom subagents
-   See which subagents are active when duplicates exist
-   **Easily manage tool permissions** with a complete list of available tools

### 

[​

](#direct-file-management)

Direct file management

You can also manage subagents by working directly with their files:

Copy

Ask AI

```
# Create a project subagent
mkdir -p .claude/agents
echo '---
name: test-runner
description: Use proactively to run tests and fix failures
---
You are a test automation expert. When you see code changes, proactively run the appropriate tests. If tests fail, analyze the failures and fix them while preserving the original test intent.' > .claude/agents/test-runner.md
# Create a user subagent
mkdir -p ~/.claude/agents
# ... create subagent file

```

## 

[​

](#using-subagents-effectively)

Using subagents effectively

### 

[​

](#automatic-delegation)

Automatic delegation

Claude Code proactively delegates tasks based on:

-   The task description in your request
-   The `description` field in subagent configurations
-   Current context and available tools

To encourage more proactive subagent use, include phrases like “use PROACTIVELY” or “MUST BE USED” in your `description` field.

### 

[​

](#explicit-invocation)

Explicit invocation

Request a specific subagent by mentioning it in your command:

Copy

Ask AI

```
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error

```

## 

[​

](#built-in-subagents)

Built-in subagents

Claude Code includes built-in subagents that are available out of the box:

### 

[​

](#plan-subagent)

Plan subagent

The Plan subagent is a specialized built-in agent designed for use during plan mode. When Claude is operating in plan mode (non-execution mode), it uses the Plan subagent to conduct research and gather information about your codebase before presenting a plan. **Key characteristics:**

-   **Model**: Uses Sonnet for more capable analysis
-   **Tools**: Has access to Read, Glob, Grep, and Bash tools for codebase exploration
-   **Purpose**: Searches files, analyzes code structure, and gathers context
-   **Automatic invocation**: Claude automatically uses this agent when in plan mode and needs to research the codebase

**How it works:** When you’re in plan mode and Claude needs to understand your codebase to create a plan, it delegates research tasks to the Plan subagent. This prevents infinite nesting of agents (subagents cannot spawn other subagents) while still allowing Claude to gather the necessary context. **Example scenario:**

Copy

Ask AI

```
User: [In plan mode] Help me refactor the authentication module
Claude: Let me research your authentication implementation first...
[Internally invokes Plan subagent to explore auth-related files]
[Plan subagent searches codebase and returns findings]
Claude: Based on my research, here's my proposed plan...

```

The Plan subagent is only used in plan mode. In normal execution mode, Claude uses the general-purpose agent or other custom subagents you’ve created.

## 

[​

](#example-subagents)

Example subagents

### 

[​

](#code-reviewer)

Code reviewer

Copy

Ask AI

```
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---
You are a senior code reviewer ensuring high standards of code quality and security.
When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately
Review checklist:
- Code is simple and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed
Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)
Include specific examples of how to fix issues.

```

### 

[​

](#debugger)

Debugger

Copy

Ask AI

```
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---
You are an expert debugger specializing in root cause analysis.
When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works
Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states
For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations
Focus on fixing the underlying issue, not just symptoms.

```

### 

[​

](#data-scientist)

Data scientist

Copy

Ask AI

```
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---
You are a data scientist specializing in SQL and BigQuery analysis.
When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly
Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations
For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data
Always ensure queries are efficient and cost-effective.

```

## 

[​

](#best-practices)

Best practices

-   **Start with Claude-generated agents**: We highly recommend generating your initial subagent with Claude and then iterating on it to make it personally yours. This approach gives you the best results - a solid foundation that you can customize to your specific needs.
-   **Design focused subagents**: Create subagents with single, clear responsibilities rather than trying to make one subagent do everything. This improves performance and makes subagents more predictable.
-   **Write detailed prompts**: Include specific instructions, examples, and constraints in your system prompts. The more guidance you provide, the better the subagent will perform.
-   **Limit tool access**: Only grant tools that are necessary for the subagent’s purpose. This improves security and helps the subagent focus on relevant actions.
-   **Version control**: Check project subagents into version control so your team can benefit from and improve them collaboratively.

## 

[​

](#advanced-usage)

Advanced usage

### 

[​

](#chaining-subagents)

Chaining subagents

For complex workflows, you can chain multiple subagents:

Copy

Ask AI

```
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them

```

### 

[​

](#dynamic-subagent-selection)

Dynamic subagent selection

Claude Code intelligently selects subagents based on context. Make your `description` fields specific and action-oriented for best results.

### 

[​

](#resumable-subagents)

Resumable subagents

Subagents can be resumed to continue previous conversations, which is particularly useful for long-running research or analysis tasks that need to be continued across multiple invocations. **How it works:**

-   Each subagent execution is assigned a unique `agentId`
-   The agent’s conversation is stored in a separate transcript file: `agent-{agentId}.jsonl`
-   You can resume a previous agent by providing its `agentId` via the `resume` parameter
-   When resumed, the agent continues with full context from its previous conversation

**Example workflow:** Initial invocation:

Copy

Ask AI

```
> Use the code-analyzer agent to start reviewing the authentication module
[Agent completes initial analysis and returns agentId: "abc123"]

```

Resume the agent:

Copy

Ask AI

```
> Resume agent abc123 and now analyze the authorization logic as well
[Agent continues with full context from previous conversation]

```

**Use cases:**

-   **Long-running research**: Break down large codebase analysis into multiple sessions
-   **Iterative refinement**: Continue refining a subagent’s work without losing context
-   **Multi-step workflows**: Have a subagent work on related tasks sequentially while maintaining context

**Technical details:**

-   Agent transcripts are stored in your project directory
-   Recording is disabled during resume to avoid duplicating messages
-   Both synchronous and asynchronous agents can be resumed
-   The `resume` parameter accepts the agent ID from a previous execution

**Programmatic usage:** If you’re using the Agent SDK or interacting with the AgentTool directly, you can pass the `resume` parameter:

Copy

Ask AI

```
{
  "description": "Continue analysis",
  "prompt": "Now examine the error handling patterns",
  "subagent_type": "code-analyzer",
  "resume": "abc123"  // Agent ID from previous execution
}

```

Keep track of agent IDs for tasks you may want to resume later. Claude Code displays the agent ID when a subagent completes its work.

## 

[​

](#performance-considerations)

Performance considerations

-   **Context efficiency**: Agents help preserve main context, enabling longer overall sessions
-   **Latency**: Subagents start off with a clean slate each time they are invoked and may add latency as they gather context that they require to do their job effectively.

## 

[​

](#related-documentation)

Related documentation

-   [Plugins](/docs/en/plugins) - Extend Claude Code with custom agents through plugins
-   [Slash commands](/docs/en/slash-commands) - Learn about other built-in commands
-   [Settings](/docs/en/settings) - Configure Claude Code behavior
-   [Hooks](/docs/en/hooks) - Automate workflows with event handlers

[Plugins](/docs/en/plugins)

⌘I