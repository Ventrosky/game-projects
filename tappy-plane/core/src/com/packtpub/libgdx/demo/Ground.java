package com.packtpub.libgdx.demo;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Circle;
import com.badlogic.gdx.math.Intersector;
import com.badlogic.gdx.math.Polygon;
import com.badlogic.gdx.math.Vector2;

public class Ground {
	
	private final Polygon floorCollisionPolygon;
	private final Polygon floorCollisionPolygon2;
	
	private final Polygon roofCollisionPolygon;
	private final Polygon roofCollisionPolygon2;
	
	private static final float WIDTH = 808F;
	private static final float HEIGHT = 71F;
	private static final float MAX_SPEED_PER_SECOND = 100F;
	private float x = 0;
	private float x2 = 0;
	private float y = 0;
	
	private final TextureRegion floorTexture;
	private final TextureRegion floorTexture2;
	
	public Ground(TextureRegion floorTexture){
		this.floorTexture = floorTexture;
		this.floorTexture2 = floorTexture;
		
		this.floorCollisionPolygon = new Polygon(groundVertex());
		this.floorCollisionPolygon2 = new Polygon(groundVertex());
		
		this.roofCollisionPolygon = new Polygon(groundVertex());
		this.roofCollisionPolygon.rotate(180);
		this.roofCollisionPolygon.setPosition(WIDTH, 492);
		
		this.roofCollisionPolygon2 = new Polygon(groundVertex());
		this.roofCollisionPolygon2.rotate(180);
		this.roofCollisionPolygon2.setPosition(WIDTH*2, 492);
		
		
		
		this.x2 = x + WIDTH;
		this.floorCollisionPolygon2.setPosition(x2, y);
	}
	
	public void draw(SpriteBatch batch) {
		batch.draw(floorTexture, x, y);
		batch.draw(floorTexture2, x2, y);
	}
	
	public void drawDebug(ShapeRenderer shapeRenderer) {
		shapeRenderer.polygon(floorCollisionPolygon.getTransformedVertices());
		shapeRenderer.polygon(floorCollisionPolygon2.getTransformedVertices());
		
		shapeRenderer.polygon(roofCollisionPolygon.getTransformedVertices());
		shapeRenderer.polygon(roofCollisionPolygon2.getTransformedVertices());
	}
	
	public void update(float delta) {
		float movement = MAX_SPEED_PER_SECOND * delta;
		setPosition(x - movement, x2 - movement);
	}
	
	public void setPosition(float x, float x2) {
		
		this.x = reposition(x, x2, WIDTH);
		this.x2 = reposition(x2, x, WIDTH);
		
		floorCollisionPolygon.setPosition(this.x, this.y);
		floorCollisionPolygon2.setPosition(this.x2, this.y);
		
		roofCollisionPolygon.setPosition(this.x + WIDTH, 492);
		roofCollisionPolygon2.setPosition(this.x2 + WIDTH, 492);
		
	}
	
	private float reposition(float x, float y, float resetPoint){
		if (x < - resetPoint){
			return y + resetPoint;
		} else {
			return x;
		}
	}
	
	private float[] groundVertex(){
		float[] vertex = new float[26];
		
		vertex[0] = 0;
		vertex[1] = 0;
		
		vertex[2] = 808;
		vertex[3] = 0;
		
		vertex[4] = 808;
		vertex[5] = 32;
		
		vertex[6] = 742;
		vertex[7] = 71;
		
		vertex[8] = 656;
		vertex[9] = 71;
		
		vertex[10] = 557;
		vertex[11] = 18;
		
		vertex[12] = 438;
		vertex[13] = 55;
		
		vertex[14] = 370;
		vertex[15] = 55;

		vertex[16] = 308;
		vertex[17] = 46;

		vertex[18] = 248;
		vertex[19] = 71;

		vertex[20] = 151;
		vertex[21] = 71;

		vertex[22] = 86;
		vertex[23] = 31;
		
		vertex[24] = 0;
		vertex[25] = 32;
		
		return vertex;
	}

	public boolean isPlaneColliding(Plane flappee) {
		Circle flappeeCollisionCircle = flappee.getCollisionCircle();
		return overlaps(floorCollisionPolygon, flappeeCollisionCircle) || overlaps(floorCollisionPolygon2, flappeeCollisionCircle) || overlaps(roofCollisionPolygon, flappeeCollisionCircle) || overlaps(roofCollisionPolygon2, flappeeCollisionCircle);
	}
	
	public static boolean overlaps(Polygon polygon, Circle circle) {
	    float []vertices=polygon.getTransformedVertices();
	    Vector2 center=new Vector2(circle.x, circle.y);
	    float squareRadius=circle.radius*circle.radius;
	    for (int i=0;i<vertices.length;i+=2){
	        if (i==0){
	            if (Intersector.intersectSegmentCircle(new Vector2(vertices[vertices.length - 2], vertices[vertices.length - 1]), new Vector2(vertices[i], vertices[i + 1]), center, squareRadius))
	                return true;
	        } else {
	            if (Intersector.intersectSegmentCircle(new Vector2(vertices[i-2], vertices[i-1]), new Vector2(vertices[i], vertices[i+1]), center, squareRadius))
	                return true;
	        }
	    }
	    return polygon.contains(circle.x, circle.y);
	}
}
