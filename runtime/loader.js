(function () {	
	Confirmit.pageView.registerCustomQuestion(
		"83f8d1ad-7949-4c53-9cda-aa424ece246b",
		function (question, customQuestionSettings, questionViewSettings) {
			console.log("in register");

			new customQuestionsLibrary.SliderOpenQuestionView(question, questionViewSettings, customQuestionSettings);
		}
	);
})();
