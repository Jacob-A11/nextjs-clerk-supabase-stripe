# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/onboarding/page.tsx

- **onboarding_form_submitted**: Tracks when a user submits the onboarding form with their details.

### app/page.tsx

- **landing-page-upload-document-clicked**: User clicked the 'Upload a Document' button in the hero section of the landing page.
- **landing-page-signup-submitted**: User submitted their email in the signup form on the landing page.

### components/GeoSelect.tsx

- **geo_option_selected**: Fires when a user selects a country or city from the geographic location dropdown.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
