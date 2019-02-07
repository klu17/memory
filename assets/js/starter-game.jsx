import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {
            tiles: [],
            numClicks: 0,
            numMatches: 0,
            shownTiles: {}
        };

        this.channel.join()
            .receive("ok", resp => {
                console.log("Joined successfully", resp);
                this.setState(resp.game);
                setTimeout(this.clearClicked.bind(this, resp.game.shownTiles), 1500);
            })
            .receive("error", resp => { console.log("Unable to join", resp); });
    }

    reset(ev) {
        this.channel.push("reset", {})
            .receive("ok", (resp) => {this.setState(resp.game);});
    }

    tileClick(ii, ev) {
        this.channel.push("tileClick", {tileNum: ii})
            .receive("ok", (resp) => {this.setState(resp.game);setTimeout(this.clearClicked.bind(this, resp.game.shownTiles), 1500);});
    }
    
    clearClicked(tiles) {
        if (_.isEqual(this.state.shownTiles, tiles)) {
            this.setState({shownTiles: []});
        }
    }


    render() {
        let tile_list = _.map(this.state.tiles, (tile, ii) => {
            if (ii in this.state.shownTiles) {
                return <button className="button button-outline memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>{this.state.shownTiles[ii]}</button>;
            } else if(tile == "*") {
                return <button className="button button-clear memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>&nbsp;</button>;
            }else if(tile == " ") {
                return <button className="button memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>&nbsp;</button>;
            } else {
                return <button className="button button-outline memory-button" onClick={this.tileClick.bind(this, ii)} key={ii}>{tile}</button>;
            }
        });
        if(this.state.numMatches == 8) {
            return(
                <div>
                    <div>Score: {this.state.numClicks}</div>
                    <div>Game Over! Your final score is {this.state.numClicks}!</div>
                    <button id="reset" onClick={this.reset.bind(this)}>Reset</button>
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
                    <button id="reset" onClick={this.reset.bind(this)}>Reset</button>
                </div>
            );
        }
    }

    
}


