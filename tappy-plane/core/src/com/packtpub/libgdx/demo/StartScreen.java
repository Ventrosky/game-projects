package com.packtpub.libgdx.demo;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.utils.ActorGestureListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;

public class StartScreen extends ScreenAdapter {
	private static final float WORLD_WIDTH = 800;
	private static final float WORLD_HEIGHT = 480;
	private Stage stage;
	private final MyGdxGame game;
	private Texture backgroundTexture;
	private Texture playTexture;
	private Texture playPressTexture;
	private Texture titleTexture;
	//private Texture squareButton;
	
	public StartScreen(MyGdxGame game) {
		this.game = game;
	}
	
	public void show() {
		stage = new Stage(new FitViewport(WORLD_WIDTH, WORLD_HEIGHT));
		Gdx.input.setInputProcessor(stage);
		backgroundTexture = new Texture(Gdx.files.internal("background.png"));
		Image background = new Image(backgroundTexture);
		stage.addActor(background);
		
		//squareButton = new Texture(Gdx.files.internal("buttonSmall.png"));
		//Image button = new Image(squareButton);
		//button.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 4, Align.center);
		//stage.addActor(button);
		
		playTexture = new Texture(Gdx.files.internal("button.png"));
		playPressTexture = new Texture(Gdx.files.internal("buttonClick.png"));
		ImageButton play = new ImageButton(new TextureRegionDrawable(new TextureRegion(playTexture)), new TextureRegionDrawable(new	TextureRegion(playPressTexture)));
		play.setPosition(WORLD_WIDTH / 2, WORLD_HEIGHT / 4, Align.center);
		stage.addActor(play);
		
		titleTexture = new Texture(Gdx.files.internal("textGetReady.png"));
		Image title = new Image(titleTexture);
		title.setPosition(WORLD_WIDTH /2, 3 * WORLD_HEIGHT / 4,	Align.center);
		stage.addActor(title);
		
		play.addListener(new ActorGestureListener() {
			@Override
			public void tap(InputEvent event, float x, float y, int count, int button) {
				super.tap(event, x, y, count, button);
				game.setScreen(new LoadingScreen(game));
				dispose();
			}
		});
	}
	
	public void resize(int width, int height) {
		stage.getViewport().update(width, height, true);
	}
	
	public void render(float delta) {
		stage.act(delta);
		stage.draw();
	}
	
	@Override
	public void dispose() {
		stage.dispose();
		backgroundTexture.dispose();
		playTexture.dispose();
		playPressTexture.dispose();
		titleTexture.dispose();
	}
}

