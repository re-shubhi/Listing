#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTI18nUtil.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"Listing";
  [GMSServices provideAPIKey:@"AIzaSyBJyl4-vSvO8UYDpJZzhRy1I6_sVhtu_-Q"]; 
  [[RCTI18nUtil sharedInstance] allowRTL:YES]; 
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
