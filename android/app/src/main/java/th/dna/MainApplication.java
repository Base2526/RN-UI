package th.dna;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import cl.json.RNSharePackage;
//import fr.snapp.imagebase64.RNImgToBase64Package;
//import com.RNFetchBlob.RNFetchBlobPackage;
//import io.fixd.rctlocale.RCTLocalePackage;
//import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import org.reactnative.camera.RNCameraPackage;

import cl.json.ShareApplication;
import io.invertase.firebase.RNFirebasePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;

import java.util.Arrays;
import java.util.List;


import org.pgsqlite.SQLitePluginPackage;


public class MainApplication extends Application implements ShareApplication, ReactApplication {

  CallbackManager mCallbackManager = new CallbackManager.Factory().create();

    @Override
    public String getFileProviderAuthority() {
        return "th.dna.provider";
    }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new RNSharePackage(),
//            new RNImgToBase64Package(),
//            new RNFetchBlobPackage(),
//            new RCTLocalePackage(),
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
            new SQLitePluginPackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseCrashlyticsPackage()
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
