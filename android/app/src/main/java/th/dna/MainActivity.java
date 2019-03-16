package th.dna;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.devio.rn.splashscreen.SplashScreen;

//import org.pgsqlite.SQLitePluginPackage;

public class MainActivity extends ReactActivity implements DefaultHardwareBackBtnHandler {

//    private ReactInstanceManager mReactInstanceManager;
//    private ReactRootView mReactRootView;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "RN_UI";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        new MainApplication().getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
     protected ReactActivityDelegate createReactActivityDelegate() {
            return new ReactActivityDelegate(this, getMainComponentName()) {
                @Override
                protected ReactRootView createRootView() {
                          return new RNGestureHandlerEnabledRootView(MainActivity.this);

                }
            };
    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        try {
//            PackageInfo info = getPackageManager().getPackageInfo(
//                    "com.rn2",
//                    PackageManager.GET_SIGNATURES);
//
//            for (Signature signature : info.signatures) {
//                MessageDigest md = MessageDigest.getInstance("SHA");
//                md.update(signature.toByteArray());
//                Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
//            }
//        } catch (PackageManager.NameNotFoundException e) {
//            Log.d("", "");
//        } catch (NoSuchAlgorithmException e) {
//            Log.d("", "");
//        }
//    }

//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        mReactRootView = new ReactRootView(this);
//        mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(getApplication())
//                .setBundleAssetName("index.android.bundle")  // this is dependant on how you name you JS files, example assumes index.android.js
//                .setJSMainModuleName("index.android")        // this is dependant on how you name you JS files, example assumes index.android.js
//                .addPackage(new MainReactPackage())
//                .addPackage(new SQLitePluginPackage())       // register SQLite Plugin here
//                .setUseDeveloperSupport(BuildConfig.DEBUG)
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();
//        mReactRootView.startReactApplication(mReactInstanceManager, "AwesomeProject", null); //change "AwesomeProject" to name of your app
//        setContentView(mReactRootView);
//    }
}
