# Bipul Sarkar portfolio

A static portfolio built with plain HTML, CSS, and JavaScript. No build step or framework is required. Open `index.html` in a browser or deploy this folder as a static site.

## Replace a portfolio video

Open `script.js` and paste the unlisted YouTube URL into the matching project's `youtube` field. For example:

```js
{ title: 'Into the quiet', ..., youtube: 'https://youtu.be/VIDEO_ID' }
```

Supported links include `youtube.com/watch?v=…`, `youtu.be/…`, and YouTube embed or Shorts URLs. The thumbnail images and project names are illustrative placeholders and can be changed in the same `projects` list.

The home page background uses `assets/hero-background.mp4` in a native muted, inline, looping video element. Replace that file to change the hero background. The YouTube URL input above remains available for the individual portfolio cards.

## Before launch

- Update the sample project cards, portrait, email, social destinations, and sample stats/testimonials as needed.
- Deploy by connecting this repository to Vercel as a static site. No build command or output directory is needed.
