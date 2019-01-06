## Doujinshi.info

Doujinshi.info is an information database containing data on self-published works known as doujinshi. The goal of the site is to catalog, tag, and categorize as many doujinshi as possible. With this community driven data, we are able to provide interesting statistics regarding the doujinshi scene as a whole. Such as average page counts, most common themes, average prices, etc. Along with this, users are able to catalog their physical doujinshi collections to keep track of what they own, as well as follow their favorite artists, or tags, to discover newly released doujinshi.

This site's goals are purely academic, and does not offer the ability to download any of the doujinshi on the site. Only information and statistics about the doujinshi are provided.

This repository is for the frontend client which users interactive with.

Development and Community:
[![Discord](https://img.shields.io/badge/Discord-Doujinshi.info-%237289DA.svg)](https://discord.gg/GX2VKug)

---

## Requirements

For development, you will need [Node.js](https://nodejs.org/en/) installed.

Please also use the appropriate [Editorconfig](https://editorconfig.org) plugin for your editor.

## Installation

```console
git clone https://github.com/doujinshi-info/frontend.git
cd frontend
npm install
```

### Configuration

Copy `.env.example` to `.env` then edit the variables within it.

## Development

This will run a local webserver for the frontend, will open your browser to localhost:8000 and watch for any changes and re-compile live.

```console
npm run dev
```

## Building for Production

This will pack up the files and build them for production use.

```console
npm run build
```