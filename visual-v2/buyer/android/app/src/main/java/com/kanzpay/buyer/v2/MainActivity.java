package com.kanzpay.buyer.v2;
import android.app.*;import android.os.*;import android.webkit.*;
public class MainActivity extends Activity{
 WebView w;
 public void onCreate(Bundle b){super.onCreate(b);w=new WebView(this);w.setBackgroundColor(0xff070707);WebSettings s=w.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setMediaPlaybackRequiresUserGesture(false);w.setWebChromeClient(new WebChromeClient());w.setWebViewClient(new WebViewClient());w.loadUrl("file:///android_asset/index.html");setContentView(w);}
 @Override public void onBackPressed(){if(w.canGoBack())w.goBack();else super.onBackPressed();}
}