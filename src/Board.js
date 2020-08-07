import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
    static defaultProps = {
        nrows: 5,
        ncols: 5,
        chanceLightStartsOn: .25,
    };

    constructor(props) {
        super(props);

        this.state = {
            hasWon: false,
            board: this.createBoard()
        };
    }

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

    createBoard() {
        let board = [];
        // create array-of-arrays of true/false values
        for (let i = 0; i < this.props.nrows; i++) {
			let row = [];
            for (let j = 0; j < this.props.ncols; j++) {
				row.push(Math.random() < this.props.chanceLightStartsOn);
            }
			board.push(row);
        }
        return board;
    }

    /** handle changing a cell: update board & determine if winner */

    flipCellsAround(coord) {
        let { ncols, nrows } = this.props;
        let board = this.state.board;
        let [y, x] = coord.split('-').map(Number);

        function flipCell(y, x) {
            // if this coord is actually on board, flip it

            if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                board[y][x] = !board[y][x];
            }
        }

        // flip this cell and the cells around it
		flipCell(y,x);
		flipCell(y+1,x);
		flipCell(y-1,x);
		flipCell(y,x+1);
		flipCell(y,x-1);
        // win when every cell is turned off
		let hasWon = board.every(row => row.every(cell => !cell));
		this.setState({ board: board, hasWon: hasWon });
    }

    /** Render game board or winning message. */
    render() {
		// if the game is won, just show a winning msg & render nothing else
		let gameBoard = this.state.hasWon 
		? <div className='winner'>
            <span className='neon-orange'>YOU</span>
            <span className='neon-blue'>WIN!</span>
          </div>
		: <div>
			<div className='Board-title'>
				<div className='neon-orange'>Lights</div>
				<div className='neon-blue'>Out</div>
			</div>
			<table className="Board">
				<tbody>
					{this.state.board.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((col, colIndex) => 
								<Cell 
									isLit={col}
									key={`${rowIndex}-${colIndex}`}
									flipCellsAroundMe={() => this.flipCellsAround(`${rowIndex}-${colIndex}`)}
								/>)}
						</tr>
					))}
				</tbody>
			</table>
		</div>

        return (
		<div>
			{gameBoard}
		</div>
		);
    }
}

export default Board;