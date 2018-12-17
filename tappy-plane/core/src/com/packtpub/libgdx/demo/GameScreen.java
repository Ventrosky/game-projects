package com.packtpub.libgdx.demo;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.assets.AssetManager;
import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureAtlas;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.ImageButton;
import com.badlogic.gdx.scenes.scene2d.utils.ActorGestureListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Logger;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;

public class GameScreen extends ScreenAdapter{
	
	private static final float WORLD_WIDTH = 800;
	private static final float WORLD_HEIGHT = 480;
	
	private ShapeRenderer shapeRenderer;
	private Viewport viewport;
	private Camera camera;
	private SpriteBatch batch;
	
	
	private Plane flappee;
	//private Obstacle rock = new Obstacle();
	private Array<Obstacle> obstacles = new Array<Obstacle>();
	private static final float GAP_BETWEEN_OBSTACLES = 200F;
	
	private int score = 0;
	private BitmapFont bitmapFont;
	private GlyphLayout glyphLayout;
	
	private TextureRegion background;
	private TextureRegion rockBottom;
	private TextureRegion rockTop;
	private TextureRegion planeTexture;
	
	private TextureRegion explosionTexture;
	
	private Ground floor;
	private TextureRegion floorTexture;
	
	private TextureRegion refresh;
	private ImageButton play;
	private Stage stage;
	private MyGdxGame planeGame;
	
	public GameScreen(MyGdxGame planeGame) {
		
		this.planeGame = planeGame;
		
		
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
		batch = new SpriteBatch();
		//flappee.setPosition(WORLD_WIDTH / 4, WORLD_HEIGHT / 2);
		TextureAtlas textureAtlas = planeGame.getAssetManager().get("flappee_plane_assets.atlas");
		
		bitmapFont = planeGame.getAssetManager().get("score1.fnt");
		
		//bitmapFont = new BitmapFont(new BitmapFont.BitmapFontData(Gdx.files.internal("score.fnt"), false), textureAtlas.findRegion("score"), true);
		glyphLayout = new GlyphLayout();
		
		
		background = textureAtlas.findRegion("background");
		rockBottom = textureAtlas.findRegion("rockGrass");
		rockTop = textureAtlas.findRegion("rockDown");
		
		explosionTexture = textureAtlas.findRegion("Explosion");
		
		planeTexture = textureAtlas.findRegion("plane1");
		flappee = new Plane(planeTexture, explosionTexture);
		flappee.setPosition(WORLD_WIDTH / 4, WORLD_HEIGHT / 2);
		
		floorTexture = textureAtlas.findRegion("groundCave");
		floor = new Ground(floorTexture);
		
		stage = new Stage(new FitViewport(WORLD_WIDTH, WORLD_HEIGHT));
		Gdx.input.setInputProcessor(stage);
		
		
		refresh = textureAtlas.findRegion("refresh");
		play = new ImageButton(new TextureRegionDrawable(new TextureRegion(refresh)), new TextureRegionDrawable(new	TextureRegion(refresh)));
		play.setPosition(-WORLD_WIDTH, -WORLD_HEIGHT, Align.center);
		stage.addActor(play);
		play.addListener(new ActorGestureListener() {
			@Override
			public void tap(InputEvent event, float x, float y, int count, int button) {
				super.tap(event, x, y, count, button);
				//System.out.println(x+ " " + y);
				restart();
			}
		});
	}
	
	@Override
	public void render(float delta) {
		clearScreen();
		batch.setProjectionMatrix(camera.projection);
		batch.setTransformMatrix(camera.view);
		batch.begin();
		batch.draw(background, 0, 0);
		drawObstacles();
		flappee.draw(batch);
		
		
		
		
		drawScore();
		//play.draw(batch, 1);
		play.draw(batch, 1);
		
		batch.end();
		
		//drawDebug(delta);
		
		update(delta);
	}
	
	private void drawDebug(float delta){

		shapeRenderer.setProjectionMatrix(camera.projection);
		shapeRenderer.setTransformMatrix(camera.view);
		shapeRenderer.begin(ShapeRenderer.ShapeType.Line);
		
		flappee.drawDebug(shapeRenderer);
		
		//rock.drawDebug(shapeRenderer);
		for (Obstacle obstacle : obstacles) {
			obstacle.drawDebug(shapeRenderer);
		}
		floor.drawDebug(shapeRenderer);
		
		shapeRenderer.end();
	}
	
	private void drawObstacles() {
		
		for (Obstacle rock : obstacles) {
			rock.draw(batch);
		}
		floor.draw(batch);
	}
	
	private void update(float delta) {
		updatePlane(delta);
		if (!flappee.isCrushed()){
			updateObstacles(delta);
			updateScore();
		}
		if (!flappee.isCrushed() && checkForCollision()) {
			flappee.kill();
			addRefresh();
		}

		if (Gdx.input.isKeyPressed(Input.Keys.R) && flappee.isCrushed())
			restart();
	}
	private void updatePlane(float delta) {
		flappee.update(delta);
		if ((Gdx.input.isKeyPressed(Input.Keys.SPACE)||Gdx.input.isTouched()) && !flappee.isCrushed()) {
			flappee.flyUp();
		}
		blockFlappeeLeavingTheWorld();
	}
	private void updateObstacles(float delta) {
		for (Obstacle obstacle : obstacles) {
			obstacle.update(delta);
		}
		floor.update(delta);
		checkIfNewObstacleIsNeeded();
		removeObstaclesIfPassed();
	}
	
	private void blockFlappeeLeavingTheWorld() {
		flappee.setPosition(flappee.getX(),	MathUtils.clamp(flappee.getY(), 0, WORLD_HEIGHT));
	}
	
	private void createNewObstacle() {
		Obstacle newObstacle = new Obstacle(rockBottom, rockTop);
		newObstacle.setPosition(WORLD_WIDTH + Obstacle.WIDTH);
		obstacles.add(newObstacle);
	}
	
	private void checkIfNewObstacleIsNeeded() {
		if (obstacles.size == 0) {
			createNewObstacle();
		} else {
			Obstacle obstacle = obstacles.peek();
			if (obstacle.getX() < WORLD_WIDTH - GAP_BETWEEN_OBSTACLES) {
				createNewObstacle();
			}
		}
	}
	
	private void removeObstaclesIfPassed() {
		if (obstacles.size > 0) {
			Obstacle firstObstacle = obstacles.first();
			if (firstObstacle.getX() < -Obstacle.WIDTH) {
				obstacles.removeValue(firstObstacle, true);
			}
		}
	}
	
	private boolean checkForCollision() {
		for (Obstacle obstacle : obstacles) {
			if (obstacle.isPlaneColliding(flappee)) {
				return true;
			}
		}
		if (floor.isPlaneColliding(flappee)) {
			return true;
		}
		return false;
	}
	
	private void updateScore() {
		Obstacle obstacle = obstacles.first();
		if (obstacle.getX() < flappee.getX() && !obstacle.isPointClaimed()) {
			obstacle.markPointClaimed();
			score++;
		}
	}
	
    private void addRefresh(){
    	play.setPosition(WORLD_WIDTH - play.getWidth(),play.getHeight(), Align.center);
    	
		
    }
	
	private void drawScore() {
		String scoreAsString = Integer.toString(score);
		glyphLayout.setText(bitmapFont, scoreAsString);
		bitmapFont.draw(batch, scoreAsString, (viewport.getWorldWidth()/2 - glyphLayout.width / 2), (4 * viewport.getWorldHeight() / 5) -	glyphLayout.height / 2);
	}
	
	private void restart() {
		flappee.setPosition(WORLD_WIDTH / 4, WORLD_HEIGHT / 2);
		obstacles.clear();
		flappee.resurrect();
		score = 0;
		play.setPosition(-WORLD_WIDTH, -WORLD_HEIGHT, Align.center);
	}
	private void clearScreen() {
		Gdx.gl.glClearColor(Color.BLACK.r, Color.BLACK.g, Color.BLACK.b, Color.BLACK.a);
		Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
	}
}
