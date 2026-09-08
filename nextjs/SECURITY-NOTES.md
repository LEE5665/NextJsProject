# Dependency maintenance

Run npm commands in `nextjs/`, where the application's package.json lives.

- Next.js and eslint-config-next are aligned at 15.5.25, with React 19.
- NextAuth uses Credentials, not its optional Email provider. Application email
  imports `app-nodemailer`, an npm alias for Nodemailer 10. This keeps the patched
  mailer separate from NextAuth 4's optional Nodemailer 7 peer requirement.
  Revisit this arrangement before enabling NextAuth's Email provider.
- react-quill-new supports Quill 2 and React 19. The incompatible Quill major
  override was removed. Unused multer and the global uuid override were removed.
- `npm run build` generates Prisma Client first; it does not migrate the database.

## Remaining advisory

Quill 2.0.3 has an HTML export XSS advisory without a published patch:
https://github.com/advisories/GHSA-v3m3-f69x-jf25

Audit reports two low entries (quill and its react-quill-new parent) for this one
cause. Do not force a downgrade just to suppress the report. Editor input,
post creation/update and rendered post HTML are sanitized using the shared
`lib/sanitize-post-html.mjs` allowlist, including previously stored posts.
These application mitigations do not patch Quill itself or clear its advisory.
Upgrade when a patched release is available, or migrate away from Quill to
eliminate the dependency advisory entirely.

Validation commands:

```sh
npm audit
npm ls --depth=0
npm test
npm run lint
npm run build
```

Login, database-backed post creation/editing, image upload and real SMTP delivery
also need a functional check against the intended test environment.
