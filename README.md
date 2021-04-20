
# Custom Slider

Custom Slider is a library for adding a slider to a custom question.

## Usage

1) Create a SliderOpenQuestionView object
```js
new customQuestionsLibrary.SliderOpenQuestionView(question, questionViewSettings, customQuestionSettings);
```
2) Before creating a SliderOpenQuestionView object you can change slider's settings in customQuestionSettings. For instance: 

```js
customQuestionSettings.sliderSettings = {
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
Default slider's settings are the following:

```js
 const DEFAULT_SLIDER_SETTINGS = {
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

Properties isQuestionValue and isCustomScale imply the following meaning: 
- If isQuestionValue = true then a slider will set a value of a question, if it's false, only a slider value will change. 
- isCustomScale should be true for OpenForm, and false for SingleForm, GridForm. If it's true the slider will take a form of a scale 
with a range from customScale.min to customScale.max and customScale.start as a start point.

3) An example of how you can implement slider options on Custom Settings page is in the design/index.html (see comments there).
4) Properties isQuestionValue and isCustomScale should be also set in design/index.js and should be equal to the previous ones (see examples for fields' validation there).
