# 📚 Claude Code Documentation Tracker

[日本語](README.ja.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically fetch and track changes in Claude Code's official documentation using Git-based scraping.

## 🎯 Features

- 🔄 **Automated Updates**: Twice daily (9:00, 21:00 JST)
- 📝 **Pure Markdown**: Direct storage from source
- 📊 **Git-based Tracking**: Complete change history
- 🚀 **TypeScript**: Type-safe implementation
- ⚡ **Lightweight**: Minimal dependencies

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/oikon48/cc-doc-tracker.git
cd cc-doc-tracker

# Install
npm install

# Fetch docs
npm run fetch-docs
```

## 📁 Structure

```
cc-doc-tracker/
├── docs/en/          # Fetched documentation (45 files)
├── metadata/         # Fetch statistics
├── src/              # TypeScript source
└── .github/          # GitHub Actions
```

## 📊 Usage

### Track Changes

```bash
# View updates
git log --oneline --grep="📝 Update"

# Compare dates
git diff 'HEAD@{yesterday}' HEAD -- docs/

# File history
git log --follow docs/en/overview.md
```

### Development

```bash
npm run dev        # Development mode
npm run build      # Build TypeScript
npm run lint       # Lint code
```

## 🤖 Automation

Runs automatically at:
- **9:00 JST** (0:00 UTC)
- **21:00 JST** (12:00 UTC)

Manual trigger: Actions tab → "Run workflow"

## 📈 Statistics

Current success rate: **97.8%** (45/46 documents)

```json
{
  "totalDocs": 46,
  "successfulFetch": 45,
  "failedFetch": 1
}
```

## 🛠️ Tech Stack

- `node-fetch` - HTTP client
- `dotenv` - Environment variables
- TypeScript 5.3
- GitHub Actions

## 🤝 Contributing

PRs welcome! Keep it simple and maintainable.

## 📝 License

MIT

## ⚠️ Disclaimer

Unofficial tool. Not affiliated with Claude Code or Anthropic.

---

Made with ❤️ for the Claude Code community