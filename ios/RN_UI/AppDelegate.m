/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

//#import <FBSDKCoreKit/FBSDKCoreKit.h>

//@import Firebase;
#import <Firebase.h>

#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"

//#import <TwitterKit/TWTRKit.h>

#import "RNSplashScreen.h"  // here

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  // firebase
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [RNFirebaseNotifications configure];
  
  [FIRDatabase database].persistenceEnabled = YES;
  
  // fb
//  [[FBSDKApplicationDelegate sharedInstance] application:application
//                           didFinishLaunchingWithOptions:launchOptions];
  
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"RN_UI"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@"  %@", name);
    }
  }
  
  [RNSplashScreen show];  // here
  
  return YES;
}
  
// twitter - fb
//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
//  //  return [[Twitter sharedInstance] application:app openURL:url options:options];
//
//  if ([Twitter.sharedInstance application:app openURL:url options:options])
//  {
//
//    return YES;
//
//  }
//
//  return [[FBSDKApplicationDelegate sharedInstance] application:app
//                                                        openURL:url
//                                              sourceApplication:[options objectForKey:UIApplicationOpenURLOptionsSourceApplicationKey] annotation:[options objectForKey:UIApplicationOpenURLOptionsAnnotationKey]];
//
//}
// twitter - fb

// fb
//- (BOOL)application:(UIApplication *)application
//              openURL:(NSURL *)url
//    sourceApplication:(NSString *)sourceApplication
//           annotation:(id)annotation {
//    return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation];
//}
  
  
//  Push Notifications
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
    [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
  
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}
  
-(void) userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
  
  [[RNFirebaseMessaging instance] didReceiveRemoteNotification:response.notification.request.content.userInfo];
  completionHandler();
}
//  Push Notifications

@end
