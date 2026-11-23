# Elia Esquivel — Mexican Restaurant, Wyoming, Michigan

Single-page marketing site for a Mexican restaurant in Wyoming, Michigan. Built to win
inbound requests: dine-in tables, takeout orders and catering for group events.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire site (hero, services, menu categories, service area, contact form) |
| `styles.css` | Design system and all layout — mobile first |
| `main.js` | Form validation + fetch submission, `_page` field, confirmation message, footer year |
| `favicon.svg` | Favicon placeholder |
| `robots.txt` | Crawler directives |

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Primary call to action

One action is used site-wide: **"Send your request"**, which targets the contact form.
It appears in the header, hero, after the services section, in the service-area section,
in the footer and in a sticky mobile action bar. No phone number was supplied for this
business, so no `tel:` link is published.

## Form

The contact form posts to LeadrVision:

```
POST https://vision.leadrai.com/api/forms/00a385446fd99d291e542978c4311333
```

It works without JavaScript (plain HTML POST, confirmation shown on return via
`?submitted=1`). With JavaScript it posts JSON to the same URL and shows the same
confirmation inline. Hidden fields: `_form`, `_page`, and a `_gotcha` honeypot.

## Content policy

All copy is limited to the facts provided: the owner's name, the cuisine, the location
and the services offered. No reviews, ratings, hours, prices, award claims or years in
business are stated anywhere, because none were supplied. The footer and contact section
link to `/review`, which is provided by the hosting platform.
