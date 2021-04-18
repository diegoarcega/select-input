[Live demo](http://select-input.surge.sh/)

# select-input

This project was bootstrapped with CRA + Storybook.

## Run

- `npm install`
- `npm run storybook` for the storybook version
- `npm start` for the CRA version

## improvements not implemented

- unit tests
- storybook
- menuOptions with virtualized list to improve performance
- customized value and options
- customized styles

## ux - suggestions

- use the keyboard to navigate in the menu of options
- make the whole value clickable to improve mobile/tablet experience
- the hover behaviors of this component (hover shows remove icon) don't exist on mobile. These make the UI less user friendly for tablet/mobile users, so we should display them differently on mobile
- show disabled/loading state when the options are not ready yet
- use backspace to delete selected options
- when typing and user clicks enter, it should select the first option of the list
- show error message under the component when there's validation error
- when the user clicks ENTER it should select the first item of the list if the term typed is in the first item
- clicking outside of the component should close the menu of options
- css animations when deleting and item, showing the menu, adding an item

# deviation from the project design

- the menu of options has the same size of the search component, this allows for more predictable component's
  behavior and easier to use on smaller screens(tablet, mobile) because the menu will be bigger and always on the
  same position. Also, if this component is in a small container(modal), the menu of options won't get clipped by the container overflow properties.
- implemented a loading spinner that shows when the options are being loaded
- filter options based on input text value
- show no results on menu of options
- show app state, so we know the Select Component is working
