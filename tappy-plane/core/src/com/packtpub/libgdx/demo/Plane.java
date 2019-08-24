package com.packtpub.libgdx.demo;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Animation;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Circle;

public class Plane {
	private static final float COLLISION_RADIUS = 34f;
	private final Circle collisionCircle;
	private float x = 0;
	private float y = 0;
	private static final float DIVE_ACCEL = 0.30F;
	private float ySpeed = 0;
	private static final float FLY_ACCEL = 5F;
	
	//private final TextureRegion planeTexture;
	private final Animation animation;
	private static final float FRAME_DURATION = 0.05F;
	private float animationTimer = 0;
	
	private static final int TILE_WIDTH = 88;
	private static final int TILE_HEIGHT = 73;
	
	private float rotation;
	private boolean alive = true;
	private final Animation explodeAnim;
	private static final float EXPLODE_DURATION = 0.15F;
	private float explodeTimer = 0;
	private static final int TILE_EXPLOSION = 118;
	
	public Plane(TextureRegion planeTexture, TextureRegion explodeTexture) {
		//this.planeTexture = new	TextureRegion(planeTexture).split(TILE_WIDTH, TILE_HEIGHT)[0][0];;
		TextureRegion[][] planeTextures = new TextureRegion(planeTexture).split(TILE_WIDTH, TILE_HEIGHT);
		animation = new Animation(FRAME_DURATION,planeTextures[0][0], planeTextures[0][1], planeTextures[0][2]);
		animation.setPlayMode(Animation.PlayMode.LOOP);
		
		TextureRegion[][] expTexts = new TextureRegion(explodeTexture).split(TILE_EXPLOSION, TILE_EXPLOSION);
		System.out.println(expTexts[0].length);
		explodeAnim = new Animation(EXPLODE_DURATION,expTexts[0][0], expTexts[0][1], expTexts[0][2], expTexts[0][3], expTexts[0][4]);
		
		
		
		collisionCircle = new Circle(x,y, COLLISION_RADIUS);
	}
	
	public boolean isCrushed(){
		return !alive;
	}
	
	public void kill(){
		explodeAnim.setPlayMode(Animation.PlayMode.NORMAL);
		alive = false;
	}
	
	public void resurrect(){
		alive = true;
		explodeTimer = 0;
		ySpeed = 0;
	}
	
	public void draw(SpriteBatch batch) {
		
			TextureRegion planeTexture = (TextureRegion) animation.getKeyFrame(animationTimer);
			float textureX = collisionCircle.x - planeTexture.getRegionWidth() / 2;
			float textureY = collisionCircle.y - planeTexture.getRegionHeight() / 2;
			batch.draw(planeTexture, textureX, textureY, planeTexture.getRegionWidth()/2, planeTexture.getRegionHeight()/2, planeTexture.getRegionWidth(), planeTexture.getRegionHeight(), 1f, 1f, rotation);
			
		if (!alive){
			
			drawExplosion(batch);
		}
		//
	}

	public void drawExplosion(SpriteBatch batch){
		if ((!alive) && !explodeAnim.isAnimationFinished(explodeTimer)) {
			  batch.draw((TextureRegion)explodeAnim.getKeyFrame(explodeTimer), this.getX() - TILE_EXPLOSION / 2, this.getY() - TILE_EXPLOSION/2);
		}
	}
	
	public void drawDebug(ShapeRenderer shapeRenderer) {
		shapeRenderer.circle(collisionCircle.x, collisionCircle.y, collisionCircle.radius);
	}
	
	public void setPosition(float x, float y) {
		this.x = x;
		this.y = y;
		updateCollisionCircle();
	}
	
	public float getX(){
		return x;
	}
	
	public float getY(){
		return y;
	}
	
	public float getRotation(){
		return rotation;
	}
	
	private void updateCollisionCircle() {
		collisionCircle.setX(x);
		collisionCircle.setY(y);
	}
	
	public void update(float delta) {
		animationTimer += delta;
		
		if (!alive){
			explodeTimer += delta;
		}
		
		ySpeed -= DIVE_ACCEL;
		setPosition(x, y + ySpeed);
		
		//System.out.println("Speed: " + ySpeed + " - Rotation: " + rotation);
		
		// Rotate counterclockwise
        if (ySpeed > 0) {
            rotation += 240 * delta;

            if (rotation > 20) {
                rotation = 20;
            }
        }
        // Rotate clockwise
        if (isFalling()) {
            rotation -= 240 * delta;
            if (rotation < -20) {
                rotation = -20;
            }

        }
	}
	
	public void flyUp() {
		ySpeed = FLY_ACCEL;
		setPosition(x, y + ySpeed);
	}

	public Circle getCollisionCircle() {
		return collisionCircle;
	}
	

	public boolean isFalling() {
	    return ySpeed < 0;
	}

	public boolean shouldntFlap() {
	    return ySpeed > 0;
	}
}
