package com.reactnativehotwirewebview

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout

/**
 * Workaround for ghost parent references on Android.
 *
 * When a fullScreenModal (react-native-screens) is dismissed, the Fragment
 * animation system may remove the WebView from its parent's children array
 * without clearing the WebView's mParent field. In that state:
 * - removeView() silently fails (indexOfChild returns -1)
 * - addView() throws IllegalStateException ("already has a parent")
 * - mParent cannot be cleared via reflection (hidden API restriction)
 *
 * This helper uses the protected ViewGroup.attachViewToParent() method to
 * temporarily claim ownership of the view (overwriting the ghost mParent),
 * then removes it normally — leaving mParent properly null.
 */
class WebViewReparentHelper(context: Context) : FrameLayout(context) {

  fun clearGhostParent(child: View) {
    val params = child.layoutParams
      ?: ViewGroup.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      )

    // attachViewToParent is protected and sets child.mParent = this
    // without checking if mParent is already set.
    attachViewToParent(child, 0, params)

    // Now child IS in our mChildren array and mParent == this.
    // removeView will find it (indexOfChild >= 0) and properly null mParent.
    removeView(child)
  }
}
