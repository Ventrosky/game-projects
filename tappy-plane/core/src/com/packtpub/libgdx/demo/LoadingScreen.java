package com.packtpub.libgdx.demo;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.assets.loaders.BitmapFontLoader;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureAtlas;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.utils.Logger;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;

public class LoadingScreen extends ScreenAdapter{
	private static final float WORLD_WIDTH = 480;
	private static final float WORLD_HEIGHT = 640;
	private static final float PROGRESS_BAR_WIDTH = 100;
	private static final float PROGRESS_BAR_HEIGHT = 25;
	private ShapeRenderer shapeRenderer;
	private Viewport viewport;
	private Camera camera;
	private float progress = 0;
	private final MyGdxGame planeGame;
	public LoadingScreen(MyGdxGame flappeeBeeGame) {
		this.planeGame = flappeeBeeGame;
	}
	@Override
	public void resize(int width, int height) {
		viewport.update(width, height);
	}
	@Override
	public void show() {
		camera = new OrthographicCamera();
		camera.position.set(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 0);
		camera.update();
		viewport = new FitViewport(WORLD_WIDTH, WORLD_HEIGHT, camera);
		shapeRenderer = new ShapeRenderer();
		
		planeGame.getAssetManager().getLogger().setLevel(Logger.DEBUG);
		
		//planeGame.getAssetManager().load("background.png", Texture.class);
		//planeGame.getAssetManager().load("Explosion.png", Texture.class);
		//planeGame.getAssetManager().load("groundCave.png", Texture.class);
		//planeGame.getAssetManager().load("rockDown.png", Texture.class);
		//planeGame.getAssetManager().load("rockGrass.png", Texture.class);
		//planeGame.getAssetManager().load("plane1.png", Texture.class);
		//planeGame.getAssetManager().finishLoading();
		
		planeGame.getAssetManager().load("flappee_plane_assets.atlas", TextureAtlas.class);
		
		BitmapFontLoader.BitmapFontParameter bitmapFontParameter =	new BitmapFontLoader.BitmapFontParameter();
		bitmapFontParameter.atlasName = "flappee_plane_assets.atlas";
		planeGame.getAssetManager().load("score1.fnt", BitmapFont.class, bitmapFontParameter);
		
		planeGame.getAssetManager().finishLoading();
		
	}
	@Override
	public void render(float delta) {
		update();
		clearScreen();
		draw();
	}
	@Override
	public void dispose() {
		shapeRenderer.dispose();
	}
	private void update() {
		if (planeGame.getAssetManager().update()) {
			planeGame.setScreen(new GameScreen(planeGame));
		} else {
			progress = planeGame.getAssetManager().getProgress();
		}
	}
	private void clearScreen() {
		Gdx.gl.glClearColor(Color.BLACK.r, Color.BLACK.g, Color.BLACK.b, Color.BLACK.a);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
	}
	private void draw() {
		shapeRenderer.setProjectionMatrix(camera.projection);
		shapeRenderer.setTransformMatrix(camera.view);
		shapeRenderer.begin(ShapeRenderer.ShapeType.Filled);
		shapeRenderer.setColor(Color.WHITE);
		shapeRenderer.rect(	(WORLD_WIDTH - PROGRESS_BAR_WIDTH) / 2, (WORLD_HEIGHT -	PROGRESS_BAR_HEIGHT / 2), progress * PROGRESS_BAR_WIDTH, PROGRESS_BAR_HEIGHT);
		shapeRenderer.end();
	}
}
