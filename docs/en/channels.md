---
title: channels
source: https://code.claude.com/docs/en/channels.md
---

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Push events into a running session with channels

> Use channels to push messages, alerts, and webhooks into your Claude Code session from an MCP server. Forward CI results, chat messages, and monitoring events so Claude can react while you're away.

<Note>
  Channels are in [research preview](#research-preview) and require Claude Code v2.1.80 or later. They require claude.ai login. Console and API key authentication is not supported. Team and Enterprise organizations must [explicitly enable them](#enterprise-controls).
</Note>

A channel is an MCP server that pushes events into your running Claude Code session, so Claude can react to things that happen while you're not at the terminal. Channels can be two-way: Claude reads the event and replies back through the same channel, like a chat bridge. Events only arrive while the session is open, so for an always-on setup you run Claude in a background process or persistent terminal.

You install a channel as a plugin and configure it with your own credentials. Telegram and Discord are included in the research preview.

This page covers:

* [Supported channels](#supported-channels): Telegram and Discord setup
* [Install and run a channel](#quickstart) with fakechat, a localhost demo
* [Who can push messages](#security): sender allowlists and how you pair
* [Enable channels for your organization](#enterprise-controls) on Team and Enterprise

To build your own channel, see the [Channels reference](/en/channels-reference).

## Supported channels

Each supported channel is a plugin. All of them require [Bun](https://bun.sh). The general flow is:

1. Install the plugin: `/plugin install <name>@claude-plugins-official`
2. Configure credentials with the `/<name>:configure` command the plugin adds
3. Restart with `claude --channels plugin:<name>@claude-plugins-official`

The table shows what each plugin needs. Each README has the full platform-specific walkthrough. For a hands-on demo of this flow, try the [fakechat quickstart](#quickstart).

| Plugin   | What you need first                                                                                                                                                                        | Configure after install                               | Setup instructions                                                                                  |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| Telegram | A bot token from Telegram's [BotFather](https://t.me/BotFather)                                                                                                                            | `/telegram:configure <token>`, then [pair](#security) | [README](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/telegram) |
| Discord  | A bot from the [Developer Portal](https://discord.com/developers/applications) with [Message Content Intent](https://discord.com/developers/docs/events/gateway#message-content-intent) on | `/discord:configure <token>`, then [pair](#security)  | [README](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/discord)  |

You can also [build your own channel](/en/channels-reference) for systems that don't have a plugin yet.

## Quickstart

Fakechat is an officially supported demo channel that runs a chat UI on localhost, with nothing to authenticate and no external service to configure.

Once you install and enable fakechat, you can type in the browser and the message arrives in your Claude Code session. Claude replies, and the reply shows up back in the browser. After you've tested the fakechat interface, try out [Telegram](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/telegram) or [Discord](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/discord).

To try the fakechat demo, you'll need:

* Claude Code [installed and authenticated](/en/quickstart#step-1-install-claude-code) with a claude.ai account
* [Bun](https://bun.sh) installed. The pre-built channel plugins are Bun scripts. Check with `bun --version`; if that fails, [install Bun](https://bun.sh/docs/installation).
* **Team/Enterprise users**: your organization admin must [enable channels](#enterprise-controls) in managed settings

<Steps>
  <Step title="Install the fakechat channel plugin">
    Start a Claude Code session and run the install command:

    ```text  theme={null}
    /plugin install fakechat@claude-plugins-official
    ```

    Fakechat is in the `claude-plugins-official` marketplace, which is added automatically for most setups. If you don't have it, run `/plugin marketplace add anthropics/claude-plugins-official` first.
  </Step>

  <Step title="Restart with the channel enabled">
    Exit Claude Code, then restart with `--channels` and pass the fakechat plugin you installed:

    ```bash  theme={null}
    claude --channels plugin:fakechat@claude-plugins-official
    ```

    The fakechat server starts automatically.

    <Tip>
      You can pass several plugins to `--channels`, space-separated.
    </Tip>
  </Step>

  <Step title="Push a message in">
    Open the fakechat UI at [http://localhost:8787](http://localhost:8787) and type a message:

    ```text  theme={null}
    hey, what's in my working directory?
    ```

    The message arrives in your Claude Code session as a `<channel source="fakechat">` event. Claude reads it, does the work, and calls fakechat's `reply` tool. The answer shows up in the chat UI.
  </Step>
</Steps>

If Claude hits a permission prompt while you're away from the terminal, the session pauses until you approve locally. For unattended use, [`--dangerously-skip-permissions`](/en/permissions#permission-modes) bypasses prompts, but only use it in environments you trust.

## Security

Every approved channel plugin maintains a sender allowlist: only IDs you've added can push messages, and everyone else is silently dropped. Telegram and Discord bootstrap the list by pairing: you DM the bot, it replies with a code, you approve the code in your Claude Code session, and your ID is added. Each plugin's README walks through its setup.

On top of that, you control which servers are enabled each session with `--channels`, and on Team and Enterprise plans your organization controls availability with [`channelsEnabled`](#enterprise-controls).

Being in `.mcp.json` isn't enough to push messages: a server also has to be named in `--channels`.

## Enterprise controls

Channels are controlled by the `channelsEnabled` setting in [managed settings](/en/settings).

| Plan type                  | Default behavior                                               |
| :------------------------- | :------------------------------------------------------------- |
| Pro / Max, no organization | Channels available; users opt in per session with `--channels` |
| Team / Enterprise          | Channels disabled until an admin explicitly enables them       |

### Enable channels for your organization

Admins can enable channels from [**claude.ai → Admin settings → Claude Code → Channels**](https://claude.ai/admin-settings/claude-code), or by setting `channelsEnabled` to `true` in managed settings.

Once enabled, users in your organization can use `--channels` to opt channel servers into individual sessions. If the setting is disabled or unset, the MCP server still connects and its tools work, but channel messages won't arrive. A startup warning tells the user to have an admin enable the setting.

## Research preview

Channels are a research preview feature. Availability is rolling out gradually, and the `--channels` flag syntax and protocol contract may change based on feedback.

During the preview, `--channels` only accepts plugins from an Anthropic-maintained allowlist. The channel plugins in [claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins) are the approved set. If you pass something that isn't, Claude Code starts normally but the channel doesn't register, and the startup notice tells you why.

To test a channel you're building, use `--dangerously-load-development-channels`. See [Test during the research preview](/en/channels-reference#test-during-the-research-preview) for information about testing custom channels that you build.

Report issues or feedback on the [Claude Code GitHub repository](https://github.com/anthropics/claude-code/issues).

## Next steps

Once you have a channel running, explore these related features:

* [Build your own channel](/en/channels-reference) for systems that don't have plugins yet
* [Remote Control](/en/remote-control) to drive a local session from your phone instead of forwarding events into it
* [Scheduled tasks](/en/scheduled-tasks) to poll on a timer instead of reacting to pushed events
