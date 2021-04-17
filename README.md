# select-input

## improvements

- unit tests
- storybook
- menuOptions with virtualized list to improve performance
- customized value and options

## ux - suggestions

- use the keyboard to navigate in the menu of options
- make the whole value clickable to improve mobile/tablet experience
- remove the hover behaviors of this component (hover shows remove icon), they dont exist on mobile. These make the UI less user friendly
- use backspace to delete selected values
- show disabled/loading state when the options are not ready yet

# deviation from the project design

- the menu of options has the same size of the search component, this allows for more predictable component's
  behavior and easier to use on smaller screens(tablet, mobile) because the menu will be bigger and always on the
  same position.
- implemented a loading spinner that shows when the options are being loaded
- filter options based on input text value
- use backspace to delete options (not fully implemented, needs improvement)
- show no results on menu of options
