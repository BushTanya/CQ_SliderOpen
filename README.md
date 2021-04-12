
# Custom Slider

Custom Slider is a library for adding a slider to a custom question.

## Usage

1) Create an object SliderOpenQuestionView
```js
new customQuestionsLibrary.SliderOpenQuestionView(question, questionViewSettings, customQuestionSettings);
```
2) In slider-open-question-view.js set defaultSettings. It should be the same as defaultSettings in design/index.js

```js
var defaultSettings = {
  isVertical: true,
  isQuestionValue: true,
  isCustomScale: true,
  customScale: {
    min: -10,
    max: 10,
    start: 0
  }
}
```
- If isQuestionValue = true then a slider will set a value of a question, if it's false, only a slider value will change. 
- isCustomScale should be true for OpenForm, and false for SingleForm, GridForm. If it's true the slider takes a form of a scale 
with a range from customScale.min to customScale.max and customScale.start as a start point.

