import React from 'react'
import './chessboard.css'
import BoardBorderRow from './BoardBorderRow'
import BoardCell from './BoardCell'
import classNames from 'classnames'
import MoveSelection from './MoveSelection'
import MoveSelectionCellsManager from './MoveSelectionCellsManager';


export type Props = { 
    board: string, 
    whiteToPlay: boolean
    availableMoves: string[],
    sourceLocationHighlights?:string[],
    destinationLocationHighlights?: string[],
    onMoveSelected?(move:string): void
};

const initialState = {
    board: '',
    whiteToPlay: false,
    availableMoves: [""],
    sourceLocationHighlights: [""],
    destinationLocationHighlights: [""]
}
export type State = Readonly<typeof initialState>

export default class ChessBoard extends React.Component<Props,State>  {
    readonly state: State = initialState;

    private blackCell:boolean = false;
    private cells:any = {dummy: ""};

    private moveSelection:MoveSelection;

    constructor(props:Props) {
        super(props);
        this.moveSelection = new MoveSelection(new MoveSelectionCellsManager(this.cells));
    }

    cellClicked(x:number, y:number, piece:string):void {
        let location = `${String.fromCharCode("a".charCodeAt(0) -1 + x)}${y}`;

        this.moveSelection.selected(location, this.props.availableMoves, this.props.whiteToPlay);

        if(this.moveSelection.haveMove) {
            this.setState({
                sourceLocationHighlights: [""],
                destinationLocationHighlights: [""]
            });
            this.performMove(this.moveSelection.move);
        }
        else{
            this.setState({
                sourceLocationHighlights: [this.moveSelection.from],
                destinationLocationHighlights: this.moveSelection.possibleDestinations
            });
        }
    }

    renderRow(rowIdx:number):any
    {
        
        if(this.props.board === undefined) return null;
        let rowcells = [];
        for(let x = 1; x <= 8; x++) {
            let location = `${String.fromCharCode("a".charCodeAt(0) -1 + x)}${rowIdx}`;
            let index = ((8 - rowIdx) * 8) + x - 1;

    
            let newCell = <BoardCell key={x + ',' + rowIdx} 
                IsBlackSquare={this.blackCell}
                Piece = {this.props.board[index]}
                X = {x}
                Y = {rowIdx}
                onCellClicked={() => this.cellClicked(x, rowIdx, this.props.board[index])}
                WhiteToPlay={this.props.whiteToPlay}
                IsSourceLocation={this.state.sourceLocationHighlights 
                    ? this.state.sourceLocationHighlights.includes(location) 
                    : false}
                IsDestinationLocation={this.state.destinationLocationHighlights 
                    ? this.state.destinationLocationHighlights.includes(location) 
                    : false}
                />;
                this.cells[location] = newCell;
            rowcells.push(newCell);
            this.blackCell = !this.blackCell;
        }
        
        return (
            <tr key={rowIdx}>
                <td className="board-border">{rowIdx}</td>
                {rowcells}
                <td className="board-border">{rowIdx}</td>
            </tr>
        );
    };

    renderRows() {
        var rows:any = [];
        this.clearDownCells();
        
        this.blackCell = false;

        for (let y = 8; y >= 1; y--)
        {
            rows.push(this.renderRow(y));
            this.blackCell = !this.blackCell;
        }
        return rows;
    }
    
    render() {
        // let board:string | undefined = props.Board;
        // let blackCell:boolean = false;
        // let cells:any = {};
        // let sourceLocationUpdaters:any = {};
            
        
        let classes = classNames({
            'white-to-play': this.props.whiteToPlay,
            'black-to-play': !this.props.whiteToPlay,
        });

        return (
            <div className="chessboard">
                <table className={classes}>
                <thead>
                <BoardBorderRow />
                </thead>
                <tbody>
                {this.renderRows()}
                </tbody>
                <tfoot>
                <BoardBorderRow />
                </tfoot>
                </table>
            </div>
        );
    }

    performMove(move: string) {
        if(this.props.onMoveSelected) {
            this.props.onMoveSelected(move);
            this.moveSelection.deselect();
        }
    }

    clearDownCells() {
        for(let y = 1; y <= 8; y++){
            for(let x = 1; x <= 8; x++) {
                let location = `${String.fromCharCode("a".charCodeAt(0) -1 + x)}${y}`;
                delete this.cells[location];
            }
        }
    }

}