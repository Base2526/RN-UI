package com.rn2;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;

import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.imagepicker.ImagePickerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  CallbackManager mCallbackManager = new CallbackManager.Factory().create();

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
//      mCallbackManager =
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FBSDKPackage(mCallbackManager),
            new TwitterSigninPackage(),
            new VectorIconsPackage(),
            new RNFirebasePackage(),
            new RNCameraPackage(),
            new ReactNativeContacts(),
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new FastImageViewPackage(),

            new RNFirebaseAuthPackage()
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


  // onActivityResult


  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
