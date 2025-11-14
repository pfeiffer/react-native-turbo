package com.reactnativehotwirewebview

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.reactnativehotwirewebview.RNVisitableView

enum class RNVisitableViewEvent(val jsCallbackName: String) {
  VISIT_PROPOSAL("onVisitProposal"),
  ERROR("onError"),
  LOAD("onLoad"),
  MESSAGE("onMessage"),
  OPEN_EXTERNAL_URL("onOpenExternalUrl"),
  WEB_ALERT("onWebAlert"),
  WEB_CONFIRM("onWebConfirm"),
  FORM_SUBMISSION_STARTED("onFormSubmissionStarted"),
  FORM_SUBMISSION_FINISHED("onFormSubmissionFinished"),
  SHOW_LOADING("onShowLoading"),
  HIDE_LOADING("onHideLoading"),
  CONTENT_PROCESS_DID_TERMINATE("onContentProcessDidTerminate")
}

private const val REACT_CLASS = "RNVisitableView"

class RNVisitableViewManager(
  private val callerContext: ReactApplicationContext
) : SimpleViewManager<RNVisitableView>() {

  override fun getName() = REACT_CLASS

  @ReactProp(name = "url")
  fun setUrl(view: RNVisitableView, url: String) {
    view.url = url
  }

  @ReactProp(name = "sessionHandle")
  fun setSessionHandle(view: RNVisitableView, sessionHandle: String) {
    view.sessionHandle = sessionHandle
  }

  @ReactProp(name = "applicationNameForUserAgent")
  fun setApplicationNameForUserAgent(view: RNVisitableView, applicationNameForUserAgent: String?) {
    view.applicationNameForUserAgent = applicationNameForUserAgent
  }

  @ReactProp(name = "pullToRefreshEnabled")
  fun pullToRefreshEnabled(view: RNVisitableView, pullToRefreshEnabled: Boolean) {
    view.pullToRefreshEnabled = pullToRefreshEnabled
  }

  @ReactProp(name = "scrollEnabled")
  fun setScrollEnabled(view: RNVisitableView, scrollEnabled: Boolean) {
    view.scrollEnabled = scrollEnabled
  }

  @ReactProp(name = "progressViewOffset")
  fun setProgressViewOffset(view: RNVisitableView, progressViewOffset: ReadableMap?) {
    view.progressViewOffset = progressViewOffset
  }

  @ReactProp(name = "webViewDebuggingEnabled")
  fun setWebViewDebuggingEnabled(view: RNVisitableView, webViewDebuggingEnabled: Boolean) {
    view.webViewDebuggingEnabled = webViewDebuggingEnabled
  }

  override fun receiveCommand(root: RNVisitableView, commandId: String, args: ReadableArray?) {
    when (commandId) {
      "injectJavaScript" -> {
        args?.getString(0)?.let {
          root.injectJavaScript(it)
        }
      }
      "reload" -> root.reload(true)
      "refresh" -> root.refresh()
      "sendAlertResult" -> root.sendAlertResult()
      "sendConfirmResult" -> {
        args?.getBoolean(0)?.let {
          root.sendConfirmResult(it)
        }
      }
    }
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return RNVisitableViewEvent.values().associate {
      it.jsCallbackName to mapOf("registrationName" to it.jsCallbackName)
    }
  }

  override fun createViewInstance(reactContext: ThemedReactContext) =
    RNVisitableView(
      callerContext
    )

  override fun onDropViewInstance(view: RNVisitableView) {
    super.onDropViewInstance(view)

    // If the applicationContext is null, it can indicate that the application
    // has not been fully created yet or the application process is being terminated.
    // In such cases, we stop the execution of the method. The similar check is done
    // in the `onDropViewInstance` method of the `ViewManager`.
    if (callerContext.applicationContext == null) {
      return
    }

    view.detachWebView()
  }

}
