/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <Firebase.h>
#import <TwitterKit/TWTRKit.h>

//#import "RNTwitterSignIn.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>

//import <>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // firebase
  [FIRApp configure];
  
  // fb
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  NSURL *jsCodeLocation;
  
  

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"rn2"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

// twitter
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
//  return [[Twitter sharedInstance] application:app openURL:url options:options];
  
  if ([Twitter.sharedInstance application:app openURL:url options:options])
  {
    
    return YES;
    
  }
  
  return [[FBSDKApplicationDelegate sharedInstance] application:app
                                                        openURL:url
                                              sourceApplication:[options objectForKey:UIApplicationOpenURLOptionsSourceApplicationKey] annotation:[options objectForKey:UIApplicationOpenURLOptionsAnnotationKey]];

}
// twitter


// fb
//- (BOOL)application:(UIApplication *)application
//            openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication
//         annotation:(id)annotation {
//  return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                        openURL:url
//                                              sourceApplication:sourceApplication
//                                                     annotation:annotation];
//}

//- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [FBSDKAppEvents activateApp];
//}
// fb

@end
