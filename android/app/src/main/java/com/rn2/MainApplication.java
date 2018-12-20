package com.rn2;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
//import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import org.reactnative.camera.RNCameraPackage;
import io.invertase.firebase.RNFirebasePackage;

import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import org.reactnative.camera.RNCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import java.util.Arrays;
import java.util.List;


import org.pgsqlite.SQLitePluginPackage;


public class MainApplication extends Application implements ReactApplication {

  CallbackManager mCallbackManager = new CallbackManager.Factory().create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
//            new RNFetchBlobPackage(),
            new RNFirebasePackage(),
            new RNFirebaseDatabasePackage(),
            new FBSDKPackage(mCallbackManager),
            new RNGestureHandlerPackage(),
            new ReactNativeContacts(),
            new RNCameraPackage(),
            new ImagePickerPackage(),
            new FastImageViewPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo(),
            new SQLitePluginPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  public CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
