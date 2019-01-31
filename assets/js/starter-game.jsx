import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Memory />, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiles: [],
            numClicks: 0,
            numMatches: 0,
            clicked: [],
        };
        let values = "AABBCCDDEEFFGGHH";
        let sortedTiles = values.split("").map(this.createTile.bind(this));
        this.state.tiles = this.shuffle(sortedTiles);
    }

    resetClick(ev) {
        var newState = { tiles: [], numClicks: 0, numMatches: 0, clicked: []};
        let values = "AABBCCDDEEFFGGHH";
        let sortedTiles = values.split("").map(this.createTile.bind(this));
        newState.tiles = this.shuffle(sortedTiles);
        this.setState(newState);
    }


    shuffle(src) {
        let dest = [];
        while(src.length > 0) {
            let idx = Math.floor(Math.random() * src.length);
            dest.push(src.splice(idx, 1)[0]);
        }
        return dest;
    }

    createTile(letter) {
        return {hiddenHuh: true, value: letter, completeHuh: false};
    }
    
    clearClicked(copy, ii, ev) {
        copy.numClicks = this.state.numClicks;
        copy.numMatches = this.state.numMatches;
        copy.tiles[ii].hiddenHuh = true;
        copy.clicked[0].hiddenHuh = true;
        copy.clicked = [];
        this.setState(copy);
    }

    tileClick(ii, ev) {
        var copy = _.cloneDeep(this.state);
        copy.tiles[ii].hiddenHuh = false;

        if (copy.tiles[ii].completeHuh) {
            return;
        }

        if(this.state.clicked.length == 0) {
            copy.clicked.push(copy.tiles[ii]);
            copy.numClicks++;
            this.setState(copy);
        } else if (this.state.clicked.length == 1 && !_.isEqual(this.state.clicked[0], this.state.tiles[ii])){
            copy.clicked.push(copy.tiles[ii]);
            if(this.state.clicked[0].value == this.state.tiles[ii].value){ //match!
                copy.numMatches++;
                copy.numClicks++;
                this.setState(copy);
                copy = _.cloneDeep(this.state);
                if(!(copy.tiles[ii].completeHuh && copy.clicked[0].completeHuh)){
                    copy.tiles[ii].completeHuh = true;
                    copy.clicked[0].completeHuh = true;
                }
                setTimeout(()=>{this.clearClicked(copy, ii, ev);}, 600);
            } else {
                copy.numClicks++;
                this.setState(copy);
                setTimeout(()=>{this.clearClicked(copy, ii, ev);}, 600);
            }
        } 
        console.log({copy});
    }


    render() {
        let tile_list = _.map(this.state.tiles, (tile, ii) => {
            if(tile.completeHuh) {
                return <button className="button button-clear memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>&nbsp;</button>;
            }else if(!tile.hiddenHuh) {
                return <button className="button button-outline memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>{tile.value}</button>;
            } else if(tile.hiddenHuh){
                return <button className="button memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>&nbsp;</button>;
            }
        });
        if(this.state.numMatches == 8) {
            return(
                <div>
                    <div>Score: {this.state.numClicks}</div>
                    <div>Game Over! Your final score is {this.state.numClicks}!</div>
                    <button class="reset" onClick={this.resetClick.bind(this)}>Reset</button>
                </div>
            );
        } else {
            return(
                <div>
                    <div>The lower the score, the better ;)</div>
                    <div>Score: {this.state.numClicks}</div>
                    <div>Matches: {this.state.numMatches}</div>
                    <div>{tile_list.slice(0,4)}</div>
                    <div>{tile_list.slice(4,8)}</div>
                    <div>{tile_list.slice(8,12)}</div>
                    <div>{tile_list.slice(12,16)}</div>
                    <button class="reset" onClick={this.resetClick.bind(this)}>Reset</button>
                </div>
            );
        }
    }

    
}


