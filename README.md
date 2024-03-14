# Frontend Types

This project contain classes with literal strings, for server side render.

The porpuse of this project is to facilitate the works of fullstack developers
who wants to focus on the backend. I want to integrate the fronend using htmx like stacks.

# Key Concepts

- Server Side Render, using literal strings ``

- Common API contracts for multiple css styling libraries.

- Easy to switch libraries.

- Use multiple css librarys can componets.

- Rely on CDN

- Response with plain HTML

- Use Jquery for UI interactivity

- Use HTMX for flow and state managment

# Dev guideliness

- always return string

- func have one and only one argument

- Include a parm for optional class injection
- Include a parm for optional html attributes injection

# Foundation Layer

this layer contains basic, shared, or stantrds between css libs.

## Layout

- Container
- Row
- Col
- Grid
- Mansory grid

## From

- Fieldset
- Field
- Label
- Textarea
- Checkbox
- Select

## Utilities

- Iframe
- z_index

# Application Layer

This layer contains componets and extends from the foundation layer

- Tabs
- Buttons
- Card
- Pagination
- Nav bar (vertical, horizontal)
- Progress bar
- loaders
- alerts
- popups
- collapse
