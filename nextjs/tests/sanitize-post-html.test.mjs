import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizePostHtml } from '../lib/sanitize-post-html.mjs';

test('removes executable markup and unsafe URLs from stored/editor HTML', () => {
  const clean = sanitizePostHtml('<script>alert(1)</script><img src="x" onerror="alert(1)"><a href="javascript:alert(1)">link</a><svg onload="alert(1)"></svg><iframe src="https://example.com"></iframe>');
  assert.equal(clean, '<img src="x" /><a>link</a>');
});

test('preserves editor formatting, lists, uploaded images and raster previews', () => {
  const clean = sanitizePostHtml('<p class="ql-align-center" style="color: rgb(255, 0, 0);position:fixed"><strong>hello</strong></p><ol><li data-list="bullet">item</li></ol><img src="/uploads/test.png"><img src="data:image/png;base64,aGVsbG8=">');
  assert.match(clean, /class="ql-align-center"/);
  assert.match(clean, /color:rgb\(255, 0, 0\)/);
  assert.match(clean, /data-list="bullet"/);
  assert.match(clean, /src="\/uploads\/test.png"/);
  assert.match(clean, /data:image\/png;base64,aGVsbG8=/);
  assert.doesNotMatch(clean, /position/);
});

test('rejects SVG data images and handles missing content', () => {
  assert.equal(sanitizePostHtml('<img src="data:image/svg+xml;base64,PHN2Zz4=">'), '');
  assert.equal(sanitizePostHtml(null), '');
});
