const BridgeGame = require('./BridgeGame');
const BridgeMaker = require('./BridgeMaker');
const BridgeRandomNumberGenerator = require('./BridgeRandomNumberGenerator');
const { GAME_GUIDE_MESSAGES } = require('./constants');
const InputView = require('./InputView');
const OutputView = require('./OutputView');
const { Console } = require('@woowacourse/mission-utils');

class Controller {
	constructor() {
		this.bridgeGameModel = new BridgeGame();
		this.bridgeGameView = {
			OutputView,
			InputView,
		};
	}

	start() {
		this.bridgeGameView.OutputView.printMessage(GAME_GUIDE_MESSAGES.START);
		this.createBridge();
	}

	createBridge() {
		this.bridgeGameView.InputView.readBridgeSize(sizeInput => {
			const answerBridge = BridgeMaker.makeBridge(Number(sizeInput), BridgeRandomNumberGenerator.generate);
			this.bridgeGameModel.setState({ answerBridge });
			this.playRound();
		});
	}

	playRound() {
		this.bridgeGameView.InputView.readMoving(directionInput => {
			this.bridgeGameModel.move(directionInput);

			const { isSurvive, currentLocation, answerBridge, currentUserBridge } = this.bridgeGameModel.state;
			this.bridgeGameView.OutputView.printMap(currentUserBridge);

			if (!isSurvive) {
				this.chooseRetryOrEnd();
			} else if (currentLocation === answerBridge.length)		{
				this.endGame();
			} else {
				this.playRound();
			}
		});
	}

	chooseRetryOrEnd() {
		this.bridgeGameView.InputView.readGameCommand(commandInput => {
			if (commandInput === 'R') {
				this.bridgeGameModel.retry();
				this.playRound();
			} else if (commandInput === 'Q') {
				this.endGame();
			}
		});
	}

	endGame() {
		Console.close();
	}
}

module.exports = {
	Controller,
};
