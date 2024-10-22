---
layout: home

# Hero section
hero:
  name: $render.jsx
  text: Cross-platform rendering...
  image:
    src: /hero-logo.svg
    alt: $render.jsx logo <$>
  tagline: Enjoy simple and no-build JSX in browsers and servers with vanilla JavaScript.
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: View on GitHub
      link: https://github.com/codingnninja/render/docs

# Features section
features:
  - icon: ⚡️⚡️
    title: Ship fast & more
    details: $render helps you ship fast by making hard features simple to implement.
  - icon: 🎀
    title: Stop burning money
    details: It is designed to cut unnecessary operations that cost you more money.
  - icon: ⚡️
    title: Scale with ease
    details: You don't need to worry about scaling as $render is simple to use and fun to scale.
  - icon: ⚡️
    title: Enjoy great experience
    details: Better life for users and developers out of the box without compromizing speed.
  - icon: ⚡️
    title: Simple learning curve
    details: It is easy to learn as it makes use of everything you already know to achieve its aims.
  - icon: 🔥
    title: Native SEO & accessibility
    details: No workaround is needed for basic SEO and accessibility. It just works.
  - icon: ⚡️
    title: Be stable and flexible
    details: Build applications that give you peace of mind to sleep at night but easy to update.
  - icon: 🎉
    title: Easy integration
    details: It works seamlessly with Ruby, Laravel, Django and others. It works everywhere.

# Meta property
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: $render.jsx docs
  - - meta
    - property: og:image
      content:
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite3
  - - meta
    - name: title
      content: $render docs
  - - meta
    - name: twitter:card
      content: https://user-images.githubusercontent.com/62628408/200117602-4b274d14-b1b2-4f61-8dcd-9f9482c677a0.png
  - - link
    - rel: icon
      type: image/svg
      href: render-logo.png
---

<div class="custom-layout">
<h1>Demo</h1>
Exploring demos is the best way to experience the power of `$render.jsx`, so below is a demo you can run instantly.

### Classic counter

A counter component displays numbers in sequence when trigger button is clicked.

<iframe src="counter.html"
  style="width:100%; height: 300px; border:0; border-radius: 4px; overflow:hidden;"
  title="Screen Recorder"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Static search/filter

Searching for elements among a group can simply be done in `$render.jsx` by adding `onkeyup="$select('tr[search|textContent=*' + this.value + ']')"` to the search input tag and target the right group of elements to search through.

In this case, we are searching through the rows of the table below:

<iframe src="static_search.html"
  style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Screen Recorder"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Screen Recorder

Record your screen with a simple component.

<iframe src="screen_coder.html"
  style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Screen Recorder"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

### Music player

A complete music player with swiping and other capabilities. Swiping only works on mobile.

<iframe src="https://codingnninja.github.io/lovePlay/"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Screen Recorder"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   
### Tailwind `CSS` color picker

Tailwind CSS color picker is a component that creatively regenerate `Tailwind CSS` color codes. It is also an interesting way to render multiple components that are not collocated.

<iframe src="color_picker.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Tailwind CSS color picker"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
</div>
