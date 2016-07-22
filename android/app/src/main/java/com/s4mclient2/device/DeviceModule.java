package com.s4mclient2.device;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.res.Configuration;
import android.support.annotation.Nullable;
import android.text.InputType;
import android.util.Log;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.Context;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.common.ReactConstants;

public class DeviceModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private ReactContext reactContext;
  final BroadcastReceiver receiver;

  public DeviceModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    final ReactApplicationContext ctx = reactContext;

    receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        int orientation = ctx.getResources().getConfiguration().orientation;
        String orientationValue = orientation == 1 ? "PORTRAIT" : "LANDSCAPE";

        DisplayMetrics displayMetrics = ctx.getResources().getDisplayMetrics();
        WindowManager wm = (WindowManager) ctx.getSystemService(Context.WINDOW_SERVICE);
        Display display = wm.getDefaultDisplay();
        display.getRealMetrics(displayMetrics);

        WritableMap params = Arguments.createMap();
        float scaledDensity = displayMetrics.scaledDensity;
        params.putString("orientation", orientationValue);
        params.putDouble("width", displayMetrics.widthPixels / scaledDensity);
        params.putDouble("height", displayMetrics.heightPixels / scaledDensity);

        if (ctx.hasActiveCatalystInstance()) {
          ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
             .emit("orientation", params);
        }
      }
    };

    ctx.addLifecycleEventListener(this);

  }

  @Override
  public String getName() {
    return "DeviceInfo";
  }

  /*
  private void emitEvent(String eventName, @Nullable WritableMap params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  public void configurationUpdate(Configuration config) {
    WritableMap params = new WritableNativeMap();
    if(config.orientation == Configuration.ORIENTATION_LANDSCAPE){
      params.putString("orientation", "LANDSCAPE");
    }else{
      params.putString("orientation", "PORTRAIT");
    }
    this.emitEvent("orientation", params);
  }*/

  @ReactMethod
  public void getDeviceName(Promise promise) {
      promise.resolve(android.os.Build.MODEL);
  }

  @ReactMethod
  public void getDeviceOrientation(Promise promise) {
    promise.resolve(reactContext.getResources().getConfiguration().orientation);
  }
    @Override
    public void onHostResume() {
        Log.d("Device", "onHostResumt()");
        final Activity activity = getCurrentActivity();

        assert activity != null;
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_CONFIGURATION_CHANGED);
        activity.registerReceiver(receiver, filter);
    }

    @Override
    public void onHostPause() {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        try
        {
            activity.unregisterReceiver(receiver);
        }
        catch (java.lang.IllegalArgumentException e) {
            FLog.e(ReactConstants.TAG, "receiver already unregistered", e);
        }
    }

    @Override
    public void onHostDestroy() {
        final Activity activity = getCurrentActivity();
        if (activity == null) return;
        try
        {
            activity.unregisterReceiver(receiver);
        }
        catch (java.lang.IllegalArgumentException e) {
            FLog.e(ReactConstants.TAG, "receiver already unregistered", e);
        }
    }
}
