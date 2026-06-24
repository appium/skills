---
owner: appium
policy_scope: "contexts/tools/appium/setup/profiles/mac2.md"
id: appium.setup.profiles.mac2
network_allowed: true
external_upload_allowed: false
secrets_allowed: false
allowed_data:
  - contexts/tools/appium/setup/profiles/mac2.md local workflow inputs, public URLs, and sanitized diagnostics
  - contexts/tools/appium/setup/profiles/mac2.md bounded command output, local paths, driver names, IDs, and logs

---

# Mac2 Setup Profile

Base skill: `skills/setup/SKILL.md`

Use this profile for macOS desktop app automation through Appium Mac2 Driver.

- Load macOS, Node.js, and Mac2 references.
- Validate macOS host, Xcode command-line tooling, Appium Mac2 driver installation, doctor output, and server smoke evidence.
- Treat Accessibility, Screen Recording, and other macOS privacy prompts as explicit user authorization steps, not automatic setup.
