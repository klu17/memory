#Memory2 server-side logic in channel 

defmodule Memory.Game do

  def new do
    %{
      tiles: next_tiles(),
      numClicks: 0,
      numMatches: 0,
      clicked: [],
      shownTiles: %{},
    }
  end

  def client_view(game) do
    %{
      tiles: clientTiles(game.tiles),
      numClicks: game.numClicks,
      numMatches: game.numMatches,
      shownTiles: game.shownTiles,
    }  
  end

  # List[Tile] -> List[grapheme]
  # Given a list of tiles returns a
  # list of characters: letters (front of tile), 
  # "*"(clear tile), " "(back of tile)
  def clientTiles(realTiles) do
    Enum.map(realTiles, fn x -> tileToDisplayString(x) end) 
  end

  def tileToDisplayString(tile) do
    cond do
    tile.completeHuh -> "*"
    tile.hiddenHuh -> " "
    true -> tile.letter
    end
  end

  def reset(_game) do
    new()
  end

  def setState(game, newTiles, newClicks, newMatches, newClicked, newShownTiles) do  
    game
    |> Map.put(:tiles, newTiles)
    |> Map.put(:numClicks, newClicks)
    |> Map.put(:numMatches, newMatches)
    |> Map.put(:clicked, newClicked)
    |> Map.put(:shownTiles, newShownTiles)
  end

  def tileClick(game, tileNum) do
    newTile = Enum.at(game.tiles, tileNum)
    |> Map.put(:hiddenHuh, false)

    newClicks = game.numClicks
    newMatches = game.numMatches
    newClicked = game.clicked
    newShownTiles = %{}
    newTiles = List.replace_at(game.tiles, tileNum, newTile)
    if (newTile.completeHuh) do
      game
    else 
      cond do
        length(game.clicked) == 0 -> 
          newClicked  = newClicked ++ [tileNum]
          newClicks = newClicks + 1
          setState(game, newTiles, newClicks, newMatches, newClicked, newShownTiles)
        length(game.clicked) == 1 && tileNum != hd(newClicked) ->
          #newClicked = newClicked ++ [tileNum]
          newClicked = []
          newTiles = List.replace_at(newTiles, hd(game.clicked), Enum.at(newTiles, hd(game.clicked)) |> Map.put(:hiddenHuh, true))
          newTiles = List.replace_at(newTiles, tileNum, newTile |> Map.put(:hiddenHuh, true))
          newShownTiles = %{}
            |> Map.put(hd(game.clicked), Enum.at(newTiles, hd(game.clicked)).letter)
            |> Map.put(tileNum, newTile.letter)
          if Enum.at(newTiles, hd(game.clicked)).letter == newTile.letter do
            newMatches = newMatches + 1;
            newClicks = newClicks + 1;
            if !(newTile.completeHuh && hd(game.clicked).completeHuh) do
              newTile = newTile |> Map.put(:completeHuh, true)
              newTiles = List.replace_at(newTiles, tileNum, newTile)
              newClickedHd = Enum.at(newTiles, hd(game.clicked)) |> Map.put(:completeHuh, true)
              newTiles = List.replace_at(newTiles, hd(game.clicked), newClickedHd)
              setState(game, newTiles, newClicks, newMatches, newClicked, newShownTiles)
            else
              setState(game, newTiles, newClicks, newMatches, newClicked, newShownTiles)
            end
          else
            newClicks = newClicks + 1;
            setState(game, newTiles, newClicks, newMatches, newClicked, newShownTiles)
          end
        true -> game
      end
    end
  end



  def next_tiles do
    "AABBCCDDEEFFGGHH"
    |> String.graphemes
    |> Enum.map(fn x -> createTile(x) end)
    |> Enum.shuffle()
  end

  def createTile(letter) do
    %{hiddenHuh: true, letter: letter, completeHuh: false};
  end

end   


