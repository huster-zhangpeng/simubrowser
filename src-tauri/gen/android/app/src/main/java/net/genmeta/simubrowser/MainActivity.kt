package net.genmeta.simubrowser

import android.util.Log
import androidx.webkit.ProxyConfig
import androidx.webkit.ProxyController
import androidx.webkit.WebViewFeature
import java.util.concurrent.Executor


class MainActivity : TauriActivity() {
  override fun onStart() {
    super.onStart()

    if (WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
      Log.i("Info", "设置代理")
      //设置代理
      val proxyConfig = ProxyConfig.Builder()
        .addProxyRule("http://127.0.0.1:5380")
        .addDirect()
        .build()

      ProxyController.getInstance().setProxyOverride(
        proxyConfig,
        Executor {
          //do nothing
          Log.i("Info", "代理设置完成")
        }
      ) {
        Log.w("Wanning", "WebView代理 改变")
      }
    }
  }
}