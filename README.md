# 📚 Claude Code Documentation Tracker

[日本語](README.ja.md)

[![Fetch Docs](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml/badge.svg)](https://github.com/oikon48/cc-doc-tracker/actions/workflows/fetch-docs.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically fetch and track changes in Claude Code's official documentation using Git-based scraping.

## 🎯 Features

- 🔄 **Automated Updates**: 4 times daily (3:00, 9:00, 15:00, 21:00 JST)
- 📝 **Pure Markdown**: Direct storage from source
- 📊 **Git-based Tracking**: Complete change history
- 🗑️ **Full Sync**: Adds new docs, updates existing, removes deleted
- 🚀 **TypeScript**: Type-safe implementation
- ⚡ **Lightweight**: Minimal dependencies

## 🔍 How It Works

### System Architecture

```
1. Fetch docs_map.md
   ├── Parse all documentation links
   └── Extract metadata (last updated time)

2. Sync Local Files
   ├── Compare docs_map with local files
   └── Delete orphaned files (not in docs_map)

3. Fetch Each Document
   ├── Direct Markdown fetch (no HTML conversion)
   ├── Add minimal frontmatter (title, source)
   └── Save to docs/en/[filename].md

4. Git Tracking
   ├── New files → "Added [file]"
   ├── Changed files → "Modified [file]"
   └── Deleted files → "Deleted [file]"
```

### Data Flow

```
https://code.claude.com/docs/en/claude_code_docs_map.md
                    ↓
            [Parse Links: 46 docs]
                    ↓
         [Sync: Remove orphaned files]
                    ↓
        [Fetch: Get Markdown directly]
                    ↓
          [Git: Track all changes]
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `docs_map.md` | Master list of all documentation |
| `syncLocalFiles()` | Remove files not in docs_map |
| `fetchDoc()` | Fetch and save individual docs |
| `metadata/` | Track statistics and failures |

## 🤖 Automation

Runs automatically at:
- **3:00 JST** (18:00 UTC)
- **9:00 JST** (0:00 UTC)
- **15:00 JST** (6:00 UTC)
- **21:00 JST** (12:00 UTC)

Manual trigger: Actions tab → "Run workflow"

## 📈 Statistics

Current success rate: **97.8%** (45/46 documents)

Last successful update: **2025-11-20 18:04:45 UTC**

```json
{
  "totalDocs": 46,
  "successfulFetch": 45,
  "failedFetch": 1,
  "failedFiles": ["migration-guide.md"],
  "deletedFiles": 0
}
```

### Known Issues

- **migration-guide.md**: Currently failing to fetch (tracked in metadata)

## 🛠️ Tech Stack

- `node-fetch` - HTTP client
- `dotenv` - Environment variables
- TypeScript 5.3
- GitHub Actions

## 🔧 Troubleshooting

### Network Issues

If you encounter network errors when running locally:
```bash
# The fetch script requires internet access to code.claude.com
npm run fetch-docs
```

Network errors are expected in sandboxed or offline environments. The GitHub Actions workflow handles fetching automatically with proper network access.

### Failed Fetches

Check `metadata/last_update.json` for details on failed document fetches. Failed documents are tracked and reported in each run.

## 📝 License

MIT

## ⚠️ Disclaimer

Unofficial tool. Not affiliated with Claude Code or Anthropic.

---

Made with ❤️ for the Claude Code community
