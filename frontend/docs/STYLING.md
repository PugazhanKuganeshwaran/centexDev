# Application Styling Guide

## Color Palette

### Primary Colors
- Primary Blue: `#2563EB` / `#2A67FF` (dark mode)
- Primary Text: `#1A1A1A` / `#FFFFFF` (dark mode)
- Secondary Text: `#64748B` / `#999999` (dark mode)

### Background Colors
- Light Background: `#FFFFFF`
- Dark Background: `#121212`
- Card Background: `#F8FAFC` / `#1E1E1E` (dark mode)
- Input Background: `#F8FAFC` / `#1E1E1E` (dark mode)

### Border Colors
- Light Border: `#E2E8F0`
- Dark Border: `#333333`
- Active Border: `#2563EB`

### Status Colors
- Success: `#4CAF50`
- Warning: `#FF9800`
- Error: `#EF4444` / `#DC2626` (dark mode)

### Progress and Indicators
- Progress Bar: `#2563EB`
- Progress Background: `#E2E8F0` / `#333333` (dark mode)
- Active Step: `#2563EB`
- Inactive Step: `#E2E8F0` / `#333333` (dark mode)

## Typography

### Font Sizes
- Title: 28px
- Subtitle: 16px
- Section Title: 20px
- Body Text: 16px
- Small Text: 14px
- Extra Small: 12px

### Font Weights
- Bold: 700
- Semi-Bold: 600
- Medium: 500
- Regular: 400

## Spacing

### Padding
- Container Padding: 20px
- Card Padding: 16px
- Input Padding: 16px horizontal
- Button Padding: 12px vertical, 16px horizontal

### Margins
- Section Margin: 24px
- Component Margin: 16px
- Small Margin: 8px

### Gaps
- Form Gap: 16px
- Grid Gap: 16px
- Small Gap: 8px

## Border Radius
- Large: 16px
- Medium: 12px
- Small: 8px
- Extra Small: 4px

## Shadows
- Card Shadow: 
  ```css
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3
  ```

## Component-Specific Styles

### Buttons
- Primary Button:
  - Background: `#2563EB` / `#2A67FF` (dark mode)
  - Text Color: `#FFFFFF`
  - Border Radius: 8px
  - Height: 50px

- Secondary Button:
  - Background: `#F1F5F9` / `#2A2A2A` (dark mode)
  - Text Color: `#64748B` / `#999999` (dark mode)
  - Border: 1px solid `#E2E8F0` / `#333333` (dark mode)

### Inputs
- Height: 50px
- Border Width: 1px
- Border Radius: 8px
- Background: `#F8FAFC` / `#1E1E1E` (dark mode)
- Text Color: `#1A1A1A` / `#FFFFFF` (dark mode)
- Placeholder Color: `#999999` / `#666666` (dark mode)

### Cards
- Background: `#FFFFFF` / `#1E1E1E` (dark mode)
- Border Width: 1px
- Border Color: `#E8E8E8` / `#333333` (dark mode)
- Border Radius: 16px
- Padding: 16px

### Progress Bar
- Height: 4px
- Background: `#E2E8F0` / `#333333` (dark mode)
- Progress Color: `#2563EB`
- Step Circle Size: 24px
- Step Circle Border: 2px

## Theme Switching

### Light Theme
- Background: `#FFFFFF`
- Text: `#1A1A1A`
- Secondary Text: `#64748B`
- Borders: `#E2E8F0`
- Cards: `#F8FAFC`

### Dark Theme
- Background: `#121212`
- Text: `#FFFFFF`
- Secondary Text: `#999999`
- Borders: `#333333`
- Cards: `#1E1E1E`

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Grid System
- Columns: 12
- Gutter: 16px
- Container Max Width: 1200px

## Animation

### Transitions
- Default Duration: 300ms
- Easing: ease-in-out

### Hover Effects
- Scale: 0.98
- Opacity: 0.8

## Accessibility

### Contrast Ratios
- Text on Background: 7:1
- Secondary Text: 4.5:1
- Interactive Elements: 3:1

### Focus States
- Outline: 2px solid `#2563EB`
- Outline Offset: 2px

## Best Practices

1. Use semantic color names (e.g., `primary`, `secondary`) in components
2. Maintain consistent spacing using the defined scale
3. Follow the typography hierarchy
4. Ensure proper contrast ratios for accessibility
5. Use theme variables for dynamic theming
6. Keep component-specific styles modular
7. Document any custom styles or overrides 