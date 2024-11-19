import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/koras/',
  head: [
    ['link', {rel:'stylesheet', href:'./index.css'}],
    ['script', { src: './demos/demos.js', type: 'module' }],
    ['script', { src: './app.js'}],
    ['script', { type:'module', src: './test.js'}],
  ],
  title: "koras.jsx",
  description: "Enjoy no-build JSX",
  lang: 'en-US',
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    logo: "hero-logo.svg",
    siteTitle: "$render",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Docs", link: "/documentations/get-started" },
      { text: "Contact", link: "/documentations/contact" },
      {
        text: "Changelog",
        items: [
          { text: "v0.0.1", link: "/item-1" },
          { text: "v0.0.2", link: "/item-2" },
          { text: "v0.0.3", link: "/item-3" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/codingnninja/render" },
      { icon: "twitter", link: "https://twitter.com/renderJSX" },
      { icon: "discord", link: "..." },
      {
        icon: {
          svg: '<svg role="img" width="26.01" height="32" viewBox="0 0 256 315"><path d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615c-.35 1.116-6.599 22.563-21.757 44.716c-13.104 19.153-26.705 38.235-48.13 38.63c-21.05.388-27.82-12.483-51.888-12.483c-24.061 0-31.582 12.088-51.51 12.871c-20.68.783-36.428-20.71-49.64-39.793c-27-39.033-47.633-110.3-19.928-158.406c13.763-23.89 38.36-39.017 65.056-39.405c20.307-.387 39.475 13.662 51.889 13.662c12.406 0 35.699-16.895 60.186-14.414c10.25.427 39.026 4.14 57.503 31.186c-1.49.923-34.335 20.044-33.978 59.822M174.24 50.199c10.98-13.29 18.369-31.79 16.353-50.199c-15.826.636-34.962 10.546-46.314 23.828c-10.173 11.763-19.082 30.589-16.678 48.633c17.64 1.365 35.66-8.964 46.64-22.262"/></svg>',
        },
        link: "https://redeemjs.com",
      },
    ],
    sidebar: [
      {
        text: "Introduction",
        collapsible:true,
        items: [
          {text: "Getting started", link: "/documentations/get-started"}
        ],
      },
      {
        text: "Utils",
        collapsible: true,
        items: [
          { text: "$select", link: "/documentations/utils/$select" },
          { text: "$render", link: "/documentations/utils/$render" },
          { text: "Fetchers", link: "/documentations/utils/fetchers" },
          { text: "$register", link: "/documentations/utils/$register" },
          { text: "Stringify", link: "/documentations/utils/stringify" },
          { text: "$purify", link: "/documentations/utils/$purify" },
        ],
      },
      {
        text: "Core concepts",
        collapsible: true,
        items: [
          { text: "Components", link: "/documentations/concepts/components" },
          { text: "Context", link: "/documentations/concepts/context" },
          { text: "Hydration", link: "/documentations/concepts/hydration" },
          { text: "Props", link: "/documentations/concepts/props" },
          { text: "Rendering", link: "/documentations/concepts/rendering" },
          { text: "Resumability", link: "/documentations/concepts/resumability" },
          { text: "State", link: "/documentations/concepts/state" },
          { text: "Utils", link: "/documentations/concepts/utils" },
          { text: "Interoperability", link: "/documentations/concepts/interoperability" },
        ],
      },
      {
        text: "Components",
        collapsible: true,
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
        collapsible: true,
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
      pattern: 'https://github.com/codingnninja/render',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present @render.jsx",
    },
    markdown: {
      theme: "material-palenight",
      lineNumbers: true,
    },
    returnToTopLabel: 'Go to Top',
    sidebarMenuLabel: 'Menu',
  },
})
