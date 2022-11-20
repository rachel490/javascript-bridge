const { Controller } = require('./Controller');

class App {
	play() {
		const gameController = new Controller();
		gameController.start();
	}
}

module.exports = App;

const app = new App();
app.play();
