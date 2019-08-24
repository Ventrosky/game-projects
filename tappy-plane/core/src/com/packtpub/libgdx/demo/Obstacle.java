package com.packtpub.libgdx.demo;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Circle;
import com.badlogic.gdx.math.Intersector;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Polygon;
import com.badlogic.gdx.math.Vector2;

public class Obstacle {
	private static final float COLLISION_TRIANGLE_WIDTH = 120f;
	private static final float COLLISION_TRIANGLE_HEIGHT = 240f;
	private final Polygon floorCollisionTriangle;
	private final Polygon ceilingCollisionTriangle;
	private float x = 0;
	private float y = 0;
	private static final float MAX_SPEED_PER_SECOND = 100F;
	public static final float WIDTH = COLLISION_TRIANGLE_WIDTH;
	private static final float HEIGHT_OFFSET = -75f;
	private static final float DISTANCE_BETWEEN_FLOOR_AND_CEILING =	COLLISION_TRIANGLE_HEIGHT + 150F;
	private boolean pointClaimed = false;
	
	private final TextureRegion floorTexture;
	private final TextureRegion ceilingTexture;
	
	public Obstacle(TextureRegion floorTexture,TextureRegion ceilingTexture) {
		this.floorTexture = floorTexture;
		this.ceilingTexture = ceilingTexture;
		
		this.y = MathUtils.random(HEIGHT_OFFSET);
		this.floorCollisionTriangle = new Polygon(triangleToVertices(x,y,COLLISION_TRIANGLE_WIDTH, COLLISION_TRIANGLE_HEIGHT, false));
		
		this.ceilingCollisionTriangle = new Polygon(triangleToVertices(x,y,COLLISION_TRIANGLE_WIDTH, COLLISION_TRIANGLE_HEIGHT, true));
		
		
		//this.ceilingCollisionTriangle.rotate(180);
		//this.ceilingCollisionTriangle.translate(0, COLLISION_TRIANGLE_HEIGHT + DISTANCE_BETWEEN_FLOOR_AND_CEILING);
	}

	public void setPosition(float x) {
		this.x = x;
		floorCollisionTriangle.setPosition(this.x, this.y);
		
		ceilingCollisionTriangle.setPosition(this.x, this.y);
		//collisionTriangle.translate(x, 0);
		//System.out.println(x);
	}

	public void draw(SpriteBatch batch) {
		//batch.draw(floorTexture, floorCollisionTriangle.getX(),	floorCollisionTriangle.getY());
		//batch.draw(ceilingTexture, ceilingCollisionTriangle.getX(),	ceilingCollisionTriangle.getY() + DISTANCE_BETWEEN_FLOOR_AND_CEILING);
		
		float[] floorV = floorCollisionTriangle.getTransformedVertices();
		float[] ceilingV = ceilingCollisionTriangle.getTransformedVertices();

		
		batch.draw(floorTexture, floorV[0]-5, floorV[1]);
		batch.draw(ceilingTexture, ceilingV[2]-5,	ceilingV[1]);
	}
	
	public void drawDebug(ShapeRenderer shapeRenderer) {
		//shapeRenderer.setColor(127, 201, 88, 1);
		shapeRenderer.polygon(floorCollisionTriangle.getTransformedVertices());
		//shapeRenderer.setColor(129, 25, 112, 1);
		shapeRenderer.polygon(ceilingCollisionTriangle.getTransformedVertices());
	}
	
	public void update(float delta) {
		setPosition(x - (MAX_SPEED_PER_SECOND * delta));
	}
	
	public float getX(){
		return this.x;
	}
	
	public boolean isPlaneColliding(Plane flappee) {
		Circle flappeeCollisionCircle = flappee.getCollisionCircle();
		return overlaps(ceilingCollisionTriangle, flappeeCollisionCircle) || overlaps(floorCollisionTriangle, flappeeCollisionCircle);
	}
	
	public boolean isPointClaimed() {
		return pointClaimed;
	}
	
	public void markPointClaimed() {
		pointClaimed = true;
	}
	
	public static float[] triangleToVertices(float x, float y, float width, float height, boolean flip) {
	    float[] result = new float[6];
	    
	    if (flip == false){
	    	result[0] = x;
		    result[1] = y;
		    result[2] = x + width;
		    result[3] = y;
		    result[4] = x + (width/2);
		    result[5] = y + height;
	    } else {
	    	float offset = y + DISTANCE_BETWEEN_FLOOR_AND_CEILING;
	    	result[0] = x + (width/2);
		    result[1] = offset;
		    result[2] = x;
		    result[3] = offset + height;
		    result[4] = x + width;
		    result[5] = offset + height;
	    }
	    
	    return result;
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
