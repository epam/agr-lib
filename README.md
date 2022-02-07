# AGR: Amazing Grid Library

A simple and intuitive library for building grid functionality

___

## Description

This library allows you to make the functionality of the grid (without rendering) and can be using with any frameworks.

##Features
* Column management(reorder, pin, group)
* Plain and Multi-level grid
* Multi-level filtering
* Multiple sorting
* Multi-level footer calculation (Sum, Average, Min, Max)
* Export to Excel file

## Get Started

### Install the library:

`npm i agr-lib`

### Import and initialize grid using definition

```javascript
import {gridEndgine} from 'agr-lib';

const grid = new gridEngine(
  [
    {
      title: 'First Name',
      field: 'firstName'
    },
    {
      title: 'Last Name',
      field: 'lastName'
    }
  ]
)
```

### Assign some data to grid

```javascript
  grid.data = [
  {
    firstName: 'John',
    lastName:'Paul'
  },
  {
    firstName: 'Amanda',
    lastName:'Rottenberg'
  }
]
```


After this grid object contains:
  * property `header` - columns for rendering header part of table;
  * property `body` - columns for rendering body part of table
  * property `rows` - rows from data for rendering aligned by columns from `body` 

##License

This project is licensed under the MIT license. See the [LICENSE file](LICENSE.txt) for more info.
