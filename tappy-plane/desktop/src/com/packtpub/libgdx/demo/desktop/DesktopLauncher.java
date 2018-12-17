package com.packtpub.libgdx.demo.desktop;

import com.badlogic.gdx.backends.lwjgl.LwjglApplication;
import com.badlogic.gdx.backends.lwjgl.LwjglApplicationConfiguration;
import com.badlogic.gdx.tools.texturepacker.TexturePacker;
import com.packtpub.libgdx.demo.MyGdxGame;

public class DesktopLauncher {
	public static void main (String[] arg) {
		LwjglApplicationConfiguration config = new LwjglApplicationConfiguration();
		config.height = 480;
		config.width = 800;
		TexturePacker.process("D:\\Users\\ventr\\workspace\\demo\\android\\assets", "D:\\Users\\ventr\\workspace\\demo\\android\\assets", "flappee_plane_assets");
		new LwjglApplication(new MyGdxGame(), config);
	}
}
