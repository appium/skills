# Enterprise Profile

Base skill: `skills/xcuitest-real-device-config/SKILL.md`

Use this profile when the WDA app is signed with an enterprise provisioning profile.

- Confirm the enterprise profile covers the WDA bundle ID and target device.
- Verify code signing before installation and again after any bundle modification.
- Avoid changing bundle IDs unless the profile requires explicit remapping.
