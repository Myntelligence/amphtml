---
$category@: presentation
formats:
  - websites
  - email
teaser:
  text: Fill this in with teaser text to improve SEO. Use the component description.
---

<!--
  All documentation starts with frontmatter. Front matter organizes documentation on amp.dev
  and improves SEO.
  * Include the relevant category(ies): ads-analytics, dynamic-content, layout, media, presentation, social, personalization
  * List applicable format(s): websites, ads, stories, email
  * Do not include markdown formatting in the frontmatter - plain text and punctionation only!
  * Remove this comment!
-->

<!--
Copyright 2020 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# `amp-myvideo-player`

The `amp-myvideo-player` displays the MyVideo player used in [theoutplay.com](http://www.theoutplay.com/) Video Platform.

## Example

The `width` and `height` attributes determine the aspect ratio of the player embedded in responsive layouts.

Example:

```html
<amp-myvideo-player
  data-widget="mediacenter"
  data-publisher="998"
  data-selection="203"
  data-configuration="633"
  data-hash="8ad989d0050b4bb2cefd13807be3d702"
  layout="responsive"
  width="480"
  height="270"
></amp-myvideo-player>
```

## Attributes

<tr>
  <td width="40%"><strong>data-widget</strong></td>
  <td>The type of widget to use, example: Mediacenter.</td>
</tr>
<tr>
  <td width="40%"><strong>data-publisher</strong></td>
  <td>The MyVideo publisher ID.</td>
</tr>
<tr>
  <td width="40%"><strong>data-selection</strong></td>
  <td>The id of the video selection.</td>
</tr>
<tr>
  <td width="40%"><strong>data-configuration</strong></td>
  <td>The id of the widget configuration to use.</td>
</tr>
<tr>
  <td width="40%"><strong>data-hash</strong></td>
  <td>Use the hash that is generated during the Widget Configuration creation.</td>
</tr>
