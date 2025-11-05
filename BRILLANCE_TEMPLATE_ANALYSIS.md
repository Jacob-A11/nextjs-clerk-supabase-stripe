# Brillance SaaS Template Analysis

## Template Overview

**Brillance** is a clean, modern SaaS landing page template with a minimalist aesthetic focused on clarity and conversion.

## Design Characteristics

### Color Palette
- Light background (cream/beige tint)
- Dark text (charcoal/black)
- Minimal use of color
- Clean, professional aesthetic

### Typography
- Serif font for headlines (elegant, classic)
- Sans-serif for body text
- Large, bold headlines
- Clear hierarchy

### Layout Structure
1. **Navigation** - Simple top nav with logo, links, and CTA
2. **Hero Section** - Large headline + subtext + CTA button
3. **Product Preview** - Screenshot/mockup below hero
4. **Features** - Feature blocks with icons/screenshots
5. **Integrations/Social Proof** - Logo grid or testimonials
6. **Pricing** - Simple pricing cards
7. **FAQ** - Accordion-style questions
8. **Footer** - Minimal footer with links

## Key Sections to Implement

### 1. Navigation
- Logo (left)
- Menu items: Products, Pricing, Docs
- CTA button: "Log in" or "Start for free"
- Clean, minimal design

### 2. Hero Section
**Headline:** "Effortless custom contract billing by Brillance"
**Subtext:** "Streamline your billing process with seamless automation for every custom contract, tailored by Brillance."
**CTA:** "Start for free" button (dark, prominent)

**For LetsReWise:**
- Headline: "Transform your documents into intelligent quizzes"
- Subtext: "Upload your notes, PDFs, or study materials and let AI create personalized quizzes, flashcards, and revision plans—automatically."
- CTA: "Start Learning Free"

### 3. Product Preview
- Screenshot or mockup of the product
- Shows the interface in action
- Adds credibility and visualization

**For LetsReWise:**
- Dashboard screenshot showing quiz generation
- Or quiz player interface
- Or document upload flow

### 4. Features Section
**Layout:** 2-3 column grid
**Each feature:**
- Icon or small screenshot
- Headline
- Description text
- Optional CTA

**For LetsReWise Features:**
1. **AI-Powered Quiz Generation**
   - Upload documents, get instant quizzes
   - Multiple question types
   - Adaptive difficulty

2. **Smart Flashcards**
   - Spaced repetition algorithm
   - Progress tracking
   - Mobile-friendly

3. **Analytics Dashboard**
   - Track your progress
   - Identify weak areas
   - Study insights

### 5. Social Proof / Integrations
**Options:**
- Logo grid of integrations/partners
- Testimonial quotes
- User statistics
- Trust badges

**For LetsReWise:**
- University logos (if partnerships exist)
- User testimonials
- Statistics: "Join 1,000+ students mastering their exams"

### 6. Pricing Section
**Layout:** 2-3 pricing cards side-by-side
**Each card:**
- Plan name
- Price
- Feature list
- CTA button

**For LetsReWise:**
- Free plan
- Starter: £9/month (108 credits)
- Pro: £29/month (348 credits)
- Team: £99/month (1,200 credits)

### 7. FAQ Section
**Layout:** Accordion-style
**Questions:**
- Common objections
- Technical questions
- Pricing questions
- Security/privacy

### 8. Footer
**Layout:** Simple, minimal
**Content:**
- Logo
- Links (Privacy, Terms, Contact)
- Social media icons
- Copyright

## Design Principles

1. **Whitespace** - Generous spacing between elements
2. **Hierarchy** - Clear visual hierarchy with typography
3. **Simplicity** - Minimal colors, clean lines
4. **Focus** - Each section has one clear purpose
5. **Readability** - Large, legible text
6. **Professional** - Elegant, trustworthy aesthetic

## Implementation Plan

1. Create new page.tsx with Brillance structure
2. Use shadcn/ui components throughout
3. Implement black/white color scheme (user preference)
4. Add LetsReWise content
5. Include credit-based pricing
6. Ensure responsive design
7. Add smooth animations
8. Test on all devices

## Color Adaptation

**Original Brillance:** Cream/beige background
**LetsReWise:** Black/white with light grey

**Light Mode:**
- Background: White or very light grey
- Text: Black/charcoal
- Accents: Orange gradient (user preference)
- Buttons: Black with white text

**Dark Mode:**
- Background: Black or very dark grey
- Text: White
- Accents: Orange gradient
- Buttons: White with black text

## Component Mapping

| Brillance Element | shadcn/ui Component |
|-------------------|---------------------|
| Navigation | Custom nav with Button |
| Hero headline | Typography (h1) |
| CTA buttons | Button (variant: default) |
| Product screenshot | Image with Card |
| Feature cards | Card component |
| Pricing cards | Card with Badge |
| FAQ | Accordion |
| Footer | Custom footer |

## Next Steps

1. Backup current page.tsx
2. Create new landing page with Brillance structure
3. Customize with LetsReWise branding
4. Add credit pricing information
5. Test responsiveness
6. Deploy and review
