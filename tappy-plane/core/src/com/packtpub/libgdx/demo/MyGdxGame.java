package com.packtpub.libgdx.demo;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.assets.AssetManager;

public class MyGdxGame extends Game {
	private final AssetManager assetManager = new AssetManager();
	
	@Override
	public void create () {
		//setScreen(new GameScreen());
		setScreen(new StartScreen(this));
	}

	public AssetManager getAssetManager() {
		// TODO Auto-generated method stub
		return assetManager;
		
	}

}
