(function () {
	const defaultSettings = {
		isVertical: true,
		scaleMin: -10,
		scaleMax: 10,
		scaleStart: 0
	};
	//The parameter isCustomScaleOn should be set the same here and in the ".design/index.js"
	// For OpenForm it should be always true
	// For SingleForm, GridForm it should be false
	const isCustomScaleOn = true;
	const ifSetQuestionVal = false;

	function getDefaultSettingsIfNeeded(existingSettings) {
		var settings = existingSettings;

		if(!settings) {
			settings = defaultSettings;
		} else {
			for (var prop in defaultSettings) {
				if (!settings.hasOwnProperty(prop)) {
					settings[prop] = defaultSettings[prop];
				}

				for (var innerProp in defaultSettings[prop]) {
					if (!settings[prop].hasOwnProperty(innerProp) || (settings[prop].hasOwnProperty(innerProp) && settings[prop][innerProp] == "")) {
						settings[prop][innerProp] = defaultSettings[prop][innerProp];
					}
				}
			}
		}

		return settings;
	}

	function getNewStructuredSettings(settings) {
		var newSettings = {
			isVertical: true,
			scaleMin: '',
			scaleMax: '',
			scaleStart: ''
		};

		newSettings.isVertical = settings.isVertical;
		newSettings.scaleMin = settings.scaleMin;
		newSettings.scaleMax = settings.scaleMax;
		newSettings.scaleStart = settings.scaleStart;

		return newSettings;
	}
	Confirmit.pageView.registerCustomQuestion(
		"83f8d1ad-7949-4c53-9cda-aa424ece246b",
		function (question, customQuestionSettings, questionViewSettings) {
			console.log("in register");
			if(!!customQuestionSettings) {
				customQuestionSettings = getNewStructuredSettings(customQuestionSettings);
			}

			customQuestionSettings = getDefaultSettingsIfNeeded(customQuestionSettings);
			
			new customQuestionsLibrary.SliderOpenQuestionView(question, questionViewSettings, customQuestionSettings
															  , isCustomScaleOn, ifSetQuestionVal);
		}
	);
})();
