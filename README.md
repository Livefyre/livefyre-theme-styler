livefyre-theme-styler
=====================

Sets namespaced CSS styles for a given Appkit Component

## Theme styler
Provides ability to apply themes to the DOM for a specific text CSS string. This is also instance specific based on the provided prefix attribute.

The CSS file that you wish to be themed will look almost exactly like a regular CSS file. Instead of values for the variables, you will use this format:
`var(--varName)`. The `varName` string is the name of the attribute in the theme object that will be used to replace this string.

A full example of a rule is:
```css
.testSelector {
    background: var(--testBackground);
    color: var(--testColor);
}
```
When calling `applyTheme`, the theme object passed in will then have:
```
{
    testBackground: '#f00',
    testColor: '#00f'
}
```
Those replacements will be made and the resulting style will be:
```css
.testSelector {
    background: #f00;
    color: #00f;
}
```

If one of the attributes is left off, the entire line will be removed:
```
{
    testBackground: '#f00'
}
.testSelector {
    background: #f00;
}
```

If there are no remaining items within a rule, the entire rule is removed.


Example implementation:
```javascript
var ts = new ThemeStyler({
    css: themableCssString,
    prefix: '[lf-app-prefix="someuidstring"] '
});
ts.applyTheme({});
```

In the above example, the `themableCssString` variable is a text CSS file. Often created like `require('text!path/to/file.css')`. This is the file that this
instance of ThemeStyler will each time `applyTheme` is called.

The `prefix` attribute is an instance-specific selector which will be added at
the beginning of *each* line of CSS in the `themableCssString` file. A simple
example is:
```
themableCssString = '.testSelector {}'
prefix = '[lf-app-prefix="someuidstring"] '
// Run through applyTheme
'[lf-app-prefix="someuidstring"] .testSelector {}'
```

If you wish to have the prefix be the root selector for your themable CSS, then
you would make `:host` be the selector for your CSS rules, like this:
```
themableCssString = ':host {}'
```

Once the theme is applied, you would end up with this:
```
'[lf-app-prefix="someuidstring"] {}'
```

Also, if you want to use multiple selectors at the top level, you could do this:
```
themableCssString = ':host.testSelector {}'
prefix = '[lf-app-prefix="someuidstring"]'
// Run through applyTheme
'[lf-app-prefix="someuidstring"].testSelector {}'
```

Notice that the prefix does not have a trailing space. The :host replacement
removes a single space in front of it, so any selectors that are attached to the
:host selectors will be automatically attached to the prefix.


## Color generator
A simple generator for colors. This takes a config object along with the prefix
you'd like to add to the styles and the root color.

Here is a good example:
```
generateColors('linkAttachment', backgroundColor, {
    light: {
        backgroundColor: {fn: 'darken', amt: 5},
        borderColor: {color: 'rgba(0,0,0,0.3)'},
        textColor: {color: '#000', fn: 'lighten', amt: 40}
    },
    dark: {
        backgroundColor: {fn: 'lighten', amt: 5},
        borderColor: {color: 'rgba(0,0,0,0.5)'},
        textColor: {color: '#fff', fn: 'darken', amt: 40}
    }
})
```

The generator will determine whether the `backgroundColor` argument is light or
dark and use the appropriate config object (if provided). If light/dark is not
provided, the object must contain attribute: color object config pairs.

Color object config attributes:
- `color`: The color to use for the root. By itself, this will be the final color.
when used in conjunction with `fn`, this value will be modified.
- `fn`: The color function to apply to the color. If no color is specified, the
`backgroundColor` value is used.
- `amt`: The amount to adjust the color. This must be used in conjunction with the
`fn` attribute.

Function config options:
- `blacken`: Blacken the color by `amt`.
- `darken`: Darken the color by `amt`.
- `lighten`: Lighten the color by `amt`.
