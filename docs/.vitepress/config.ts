import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/koras/',
  title: "koras.jsx",
  description: "Enjoy no-build JSX",
  lang: 'en-US',
  cleanUrls: true,
  ignoreDeadLinks: true,
  
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    logo: "hero-logo.svg",
    siteTitle: "koras",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Docs", link: "/documentations/get-started" },
      { text: "Contact", link: "/documentations/contact" },
      {
        text: "Changelog",
        items: [
          { text: "v0.0.1", link: "/" }
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/codingnninja/koras" },
      { icon: "twitter", link: "https://twitter.com/korasjs" },
      { icon: "discord", link: "..." },
    ],
    sidebar: [
      {
        text: "Introduction",
        collapsed: false,
        items: [
          {text: "Getting started", link: "/documentations/get-started"}
        ],
      },
      {
        text: "Utils",
        collapsed: false,
        items: [
          { text: "$select", link: "/documentations/utils/$select" },
          { text: "$render", link: "/documentations/utils/$render" },
          { text: "Fetchers", link: "/documentations/utils/fetchers" },
          { text: "$register", link: "/documentations/utils/$register" },
          { text: "Stringify", link: "/documentations/utils/stringify" },
          { text: "$purify", link: "/documentations/utils/$purify" },
          { text: "$trigger", link: "/documentations/utils/trigger" },
          { text: "RenderErrorLogger", link: "/documentations/utils/RenderErrorLogger" },
          { text: "RenderDomPurifier", link: "/documentations/utils/RenderDomPurifier" },
        ],
      },
      {
        text: "Core concepts",
        collapsed: false,
        items: [
          { text: "Components", link: "/documentations/concepts/components" },
          { text: "Context", link: "/documentations/concepts/context" },
          { text: "Hydration", link: "/documentations/concepts/hydration" },
          { text: "Props", link: "/documentations/concepts/props" },
          { text: "Rendering", link: "/documentations/concepts/rendering" },
          { text: "Resumability", link: "/documentations/concepts/resumability" },
          { text: "State", link: "/documentations/concepts/state" },
          { text: "Utils", link: "/documentations/concepts/utils" },
          { text: "Interoperability", link: "/documentations/concepts/interoperability" }
        ],
      },
      {
        text: "Components",
        collapsed: false,
        items: [
          { text: "Notes", link: "/documentations/components/Notes" },
          { text: "Gallery", link: "/documentations/components/Gallery" },
          { text: "Modal", link: "/documentations/components/Modal" },
          { text: "PlaceHolder", link: "/documentations/components/PlaceHolder" },
          { text: "List", link: "/documentations/components/List" },
          { text: "Defer", link: "/documentations/components/Defer" },
          { text: "Menu", link: "/documentations/components/Menu" },
          { text: "ColorPicker", link: "/documentations/components/ColorPicker" },
          { text: "RenderErrorLogger", link: "/documentations/components/RenderErrorLogger" },
          { text: "RenderDomPurifier", link: "/documentations/components/RenderDomPurifier" },
        ],
      },
      {
        text: " Setups",
        collapsed: false,
        items: [
          { text: "Laravel setup", link: "/documentations/setups/laravel" },
        ],
      },
      {
        text: "Common errors",
        link: "/documentations/errors/common_errors",
        items: [],
      },
    ],
    docFooter: {
      prev: true,
      next: true,
    },
    editLink: {
      pattern: 'https://github.com/codingnninja/koras',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present @koras.jsx",
    },
    returnToTopLabel: 'Go to Top',
    sidebarMenuLabel: 'Menu',
  }
})