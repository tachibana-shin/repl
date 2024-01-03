import * as e from '../../core/sdk/sdk.js'
import * as t from '../../core/common/common.js'
import * as i from '../../core/i18n/i18n.js'
import * as s from '../../ui/legacy/legacy.js'
import * as n from '../../core/host/host.js'

class o extends e.SDKModel.SDKModel {
  inputAgent
  activeTouchOffsetTop
  activeTouchParams
  constructor(e) {
    super(e),
      (this.inputAgent = e.inputAgent()),
      (this.activeTouchOffsetTop = null),
      (this.activeTouchParams = null)
  }
  emitKeyEvent(e) {
    let t
    switch (e.type) {
      case 'keydown':
        t = 'keyDown'
        break
      case 'keyup':
        t = 'keyUp'
        break
      case 'keypress':
        t = 'char'
        break
      default:
        return
    }
    const i = e,
      s = 'keypress' === e.type ? String.fromCharCode(i.charCode) : void 0
    this.inputAgent.invoke_dispatchKeyEvent({
      type: t,
      modifiers: this.modifiersForEvent(i),
      text: s,
      unmodifiedText: s ? s.toLowerCase() : void 0,
      keyIdentifier: i.keyIdentifier,
      code: i.code,
      key: i.key,
      windowsVirtualKeyCode: i.keyCode,
      nativeVirtualKeyCode: i.keyCode,
      autoRepeat: !1,
      isKeypad: !1,
      isSystemKey: !1,
    })
  }
  emitTouchFromMouseEvent(e, t, i) {
    const s = ['none', 'left', 'middle', 'right'],
      n = {
        mousedown: 'mousePressed',
        mouseup: 'mouseReleased',
        mousemove: 'mouseMoved',
        mousewheel: 'mouseWheel',
      },
      o = e.type
    if (!(o in n)) return
    const a = e
    if (!(a.which in s)) return
    if ('mousewheel' !== o && 'none' === s[a.which]) return
    ;('mousedown' !== o && null !== this.activeTouchOffsetTop) ||
      (this.activeTouchOffsetTop = t)
    const r = Math.round(a.offsetX / i)
    let l = Math.round(a.offsetY / i)
    l = Math.round(l - this.activeTouchOffsetTop)
    const h = {
      type: n[o],
      x: r,
      y: l,
      modifiers: 0,
      button: s[a.which],
      clickCount: 0,
    }
    if ('mousewheel' === e.type) {
      const e = a
      ;(h.deltaX = e.deltaX / i), (h.deltaY = -e.deltaY / i)
    } else this.activeTouchParams = h
    'mouseup' === e.type && (this.activeTouchOffsetTop = null),
      this.inputAgent.invoke_emulateTouchFromMouseEvent(h)
  }
  cancelTouch() {
    if (null !== this.activeTouchParams) {
      const e = this.activeTouchParams
      ;(this.activeTouchParams = null),
        (e.type = 'mouseReleased'),
        this.inputAgent.invoke_emulateTouchFromMouseEvent(e)
    }
  }
  modifiersForEvent(e) {
    return (
      (e.altKey ? 1 : 0) |
      (e.ctrlKey ? 2 : 0) |
      (e.metaKey ? 4 : 0) |
      (e.shiftKey ? 8 : 0)
    )
  }
}
e.SDKModel.SDKModel.register(o, {
  capabilities: e.Target.Capability.Input,
  autostart: !1,
})
var a = Object.freeze({ __proto__: null, InputModel: o })
const r = new CSSStyleSheet()
r.replaceSync(
  '.screencast{overflow:hidden}.screencast-navigation{flex-direction:row;display:flex;flex:24px 0 0;position:relative;padding-left:1px;border-bottom:1px solid var(--color-details-hairline);background-origin:padding-box;background-clip:padding-box}.screencast-navigation button{border-radius:2px;background-color:transparent;background-image:-webkit-image-set(var(--image-file-navigationControls) 1x,var(--image-file-navigationControls_2x) 2x);background-clip:content-box;background-origin:content-box;background-repeat:no-repeat;border:1px solid transparent;height:23px;padding:2px;width:23px}.screencast-navigation button:focus,.screencast-navigation button:hover{border-color:var(--legacy-accent-color-hover)}.screencast-navigation button:active{border-color:var(--color-background-elevation-2)}.screencast-navigation button[disabled]{opacity:50%}.screencast-navigation button.back{background-position-x:-1px}.screencast-navigation button.forward{background-position-x:-18px}.screencast-navigation button.reload{background-position-x:-37px}.screencast-navigation input{flex:1;margin:2px;max-height:19px}.screencast-navigation .progress{--override-progress-background-color:rgb(66 129 235);background-color:var(--override-progress-background-color);height:3px;left:0;position:absolute;top:100%;width:0;z-index:2}.-theme-with-dark-background .screencast-navigation .progress,:host-context(.-theme-with-dark-background) .screencast-navigation .progress{--override-progress-background-color:rgb(20 83 189)}.screencast-viewport{display:flex;border:1px solid var(--color-details-hairline);border-radius:20px;flex:none;padding:20px;margin:10px;background-color:var(--color-background-elevation-2)}.screencast-canvas-container{flex:auto;display:flex;border:1px solid var(--color-details-hairline);position:relative;cursor:-webkit-image-set(var(--image-file-touchCursor) 1x,var(--image-file-touchCursor_2x) 2x),default}.screencast canvas{flex:auto;position:relative}.screencast-element-title{position:absolute;z-index:10}.screencast-tag-name{color:var(--color-token-tag)}.screencast-attribute{color:var(--color-token-attribute)}.screencast-dimension{--override-dimension-color:hsl(0deg 0% 45%);color:var(--override-dimension-color)}.screencast-glasspane{background-color:var(--color-background-opacity-80);font-size:30px;z-index:100;display:flex;justify-content:center;align-items:center}\n/*# sourceURL=screencastView.css */\n'
)
const l = {
    screencastViewOfDebugTarget: 'Screencast view of debug target',
    theTabIsInactive: 'The tab is inactive',
    profilingInProgress: 'Profiling in progress',
    back: 'back',
    forward: 'forward',
    reload: 'reload',
    addressBar: 'Address bar',
  },
  h = i.i18n.registerUIStrings('panels/screencast/ScreencastView.ts', l),
  c = i.i18n.getLocalizedString.bind(void 0, h)
class d extends s.Widget.VBox {
  screenCaptureModel
  domModel
  overlayModel
  resourceTreeModel
  networkManager
  inputModel
  shortcuts
  scrollOffsetX
  scrollOffsetY
  screenZoom
  screenOffsetTop
  pageScaleFactor
  imageElement
  viewportElement
  glassPaneElement
  canvasElement
  titleElement
  context
  imageZoom
  tagNameElement
  attributeElement
  nodeWidthElement
  nodeHeightElement
  model
  highlightConfig
  navigationUrl
  navigationBack
  navigationForward
  canvasContainerElement
  isCasting
  checkerboardPattern
  targetInactive
  deferredCasting
  highlightNode
  config
  node
  inspectModeConfig
  navigationBar
  navigationReload
  navigationProgressBar
  historyIndex
  historyEntries
  constructor(t) {
    super(),
      (this.screenCaptureModel = t),
      (this.domModel = t.target().model(e.DOMModel.DOMModel)),
      (this.overlayModel = t.target().model(e.OverlayModel.OverlayModel)),
      (this.resourceTreeModel = t
        .target()
        .model(e.ResourceTreeModel.ResourceTreeModel)),
      (this.networkManager = t.target().model(e.NetworkManager.NetworkManager)),
      (this.inputModel = t.target().model(o)),
      this.setMinimumSize(150, 150),
      (this.shortcuts = {}),
      (this.scrollOffsetX = 0),
      (this.scrollOffsetY = 0),
      (this.screenZoom = 1),
      (this.screenOffsetTop = 0),
      (this.pageScaleFactor = 1),
      (this.imageZoom = 1)
  }
  initialize() {
    this.element.classList.add('screencast'),
      this.createNavigationBar(),
      (this.viewportElement = this.element.createChild(
        'div',
        'screencast-viewport hidden'
      )),
      (this.canvasContainerElement = this.viewportElement.createChild(
        'div',
        'screencast-canvas-container'
      )),
      (this.glassPaneElement = this.canvasContainerElement.createChild(
        'div',
        'screencast-glasspane fill hidden'
      )),
      (this.canvasElement = this.canvasContainerElement.createChild('canvas')),
      s.ARIAUtils.setAccessibleName(
        this.canvasElement,
        c(l.screencastViewOfDebugTarget)
      ),
      (this.canvasElement.tabIndex = 0),
      this.canvasElement.addEventListener(
        'mousedown',
        this.handleMouseEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'mouseup',
        this.handleMouseEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'mousemove',
        this.handleMouseEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'mousewheel',
        this.handleMouseEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'click',
        this.handleMouseEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'contextmenu',
        this.handleContextMenuEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'keydown',
        this.handleKeyEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'keyup',
        this.handleKeyEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'keypress',
        this.handleKeyEvent.bind(this),
        !1
      ),
      this.canvasElement.addEventListener(
        'blur',
        this.handleBlurEvent.bind(this),
        !1
      ),
      (this.titleElement = this.canvasContainerElement.createChild(
        'div',
        'screencast-element-title monospace hidden'
      )),
      (this.tagNameElement = this.titleElement.createChild(
        'span',
        'screencast-tag-name'
      )),
      (this.attributeElement = this.titleElement.createChild(
        'span',
        'screencast-attribute'
      )),
      s.UIUtils.createTextChild(this.titleElement, ' ')
    const t = this.titleElement.createChild('span', 'screencast-dimension')
    ;(this.nodeWidthElement = t.createChild('span')),
      s.UIUtils.createTextChild(t, ' × '),
      (this.nodeHeightElement = t.createChild('span')),
      (this.titleElement.style.top = '0'),
      (this.titleElement.style.left = '0'),
      (this.imageElement = new Image()),
      (this.isCasting = !1),
      (this.context = this.canvasElement.getContext('2d')),
      (this.checkerboardPattern = this.createCheckerboardPattern(this.context)),
      (this.shortcuts[
        s.KeyboardShortcut.KeyboardShortcut.makeKey(
          'l',
          s.KeyboardShortcut.Modifiers.Ctrl
        )
      ] = this.focusNavigationBar.bind(this)),
      e.TargetManager.TargetManager.instance().addEventListener(
        e.TargetManager.Events.SuspendStateChanged,
        this.onSuspendStateChange,
        this
      ),
      this.updateGlasspane()
  }
  wasShown() {
    this.startCasting(), this.registerCSSFiles([r])
  }
  willHide() {
    this.stopCasting()
  }
  startCasting() {
    if (e.TargetManager.TargetManager.instance().allTargetsSuspended()) return
    if (this.isCasting) return
    this.isCasting = !0
    const t = this.viewportDimensions()
    if (t.width < 0 || t.height < 0) this.isCasting = !1
    else {
      ;(t.width *= window.devicePixelRatio),
        (t.height *= window.devicePixelRatio),
        this.screenCaptureModel.startScreencast(
          'jpeg',
          80,
          Math.floor(Math.min(2048, t.width)),
          Math.floor(Math.min(2048, t.height)),
          void 0,
          this.screencastFrame.bind(this),
          this.screencastVisibilityChanged.bind(this)
        )
      for (const t of e.TargetManager.TargetManager.instance().models(
        e.EmulationModel.EmulationModel
      ))
        t.overrideEmulateTouch(!0)
      this.overlayModel && this.overlayModel.setHighlighter(this)
    }
  }
  stopCasting() {
    if (this.isCasting) {
      ;(this.isCasting = !1), this.screenCaptureModel.stopScreencast()
      for (const t of e.TargetManager.TargetManager.instance().models(
        e.EmulationModel.EmulationModel
      ))
        t.overrideEmulateTouch(!1)
      this.overlayModel && this.overlayModel.setHighlighter(null)
    }
  }
  screencastFrame(e, t) {
    ;(this.imageElement.onload = () => {
      ;(this.pageScaleFactor = t.pageScaleFactor),
        (this.screenOffsetTop = t.offsetTop),
        (this.scrollOffsetX = t.scrollOffsetX),
        (this.scrollOffsetY = t.scrollOffsetY)
      const e = t.deviceHeight / t.deviceWidth,
        i = this.viewportDimensions()
      ;(this.imageZoom = Math.min(
        i.width / this.imageElement.naturalWidth,
        i.height / (this.imageElement.naturalWidth * e)
      )),
        this.viewportElement.classList.remove('hidden')
      const s = g
      this.imageZoom < 1.01 / window.devicePixelRatio &&
        (this.imageZoom = 1 / window.devicePixelRatio),
        (this.screenZoom =
          (this.imageElement.naturalWidth * this.imageZoom) / t.deviceWidth),
        (this.viewportElement.style.width =
          t.deviceWidth * this.screenZoom + s + 'px'),
        (this.viewportElement.style.height =
          t.deviceHeight * this.screenZoom + s + 'px')
      const n = this.highlightNode
        ? { node: this.highlightNode, selectorList: void 0 }
        : { clear: !0 }
      this.updateHighlightInOverlayAndRepaint(n, this.highlightConfig)
    }),
      (this.imageElement.src = 'data:image/jpg;base64,' + e)
  }
  isGlassPaneActive() {
    return !this.glassPaneElement.classList.contains('hidden')
  }
  screencastVisibilityChanged(e) {
    ;(this.targetInactive = !e), this.updateGlasspane()
  }
  onSuspendStateChange() {
    e.TargetManager.TargetManager.instance().allTargetsSuspended()
      ? this.stopCasting()
      : this.startCasting(),
      this.updateGlasspane()
  }
  updateGlasspane() {
    this.targetInactive
      ? ((this.glassPaneElement.textContent = c(l.theTabIsInactive)),
        this.glassPaneElement.classList.remove('hidden'))
      : e.TargetManager.TargetManager.instance().allTargetsSuspended()
        ? ((this.glassPaneElement.textContent = c(l.profilingInProgress)),
          this.glassPaneElement.classList.remove('hidden'))
        : this.glassPaneElement.classList.add('hidden')
  }
  async handleMouseEvent(e) {
    if (this.isGlassPaneActive()) return void e.consume()
    if (!this.pageScaleFactor || !this.domModel) return
    if (!this.inspectModeConfig || 'mousewheel' === e.type)
      return (
        this.inputModel &&
          this.inputModel.emitTouchFromMouseEvent(
            e,
            this.screenOffsetTop,
            this.screenZoom
          ),
        e.preventDefault(),
        void ('mousedown' === e.type && this.canvasElement.focus())
      )
    const i = this.convertIntoScreenSpace(e),
      s = await this.domModel.nodeForLocation(
        Math.floor(i.x / this.pageScaleFactor + this.scrollOffsetX),
        Math.floor(i.y / this.pageScaleFactor + this.scrollOffsetY),
        t.Settings.Settings.instance().moduleSetting('showUAShadowDOM').get()
      )
    s &&
      ('mousemove' === e.type
        ? (this.updateHighlightInOverlayAndRepaint(
            { node: s, selectorList: void 0 },
            this.inspectModeConfig
          ),
          this.domModel.overlayModel().nodeHighlightRequested({ nodeId: s.id }))
        : 'click' === e.type &&
          this.domModel
            .overlayModel()
            .inspectNodeRequested({ backendNodeId: s.backendNodeId() }))
  }
  handleKeyEvent(e) {
    if (this.isGlassPaneActive()) return void e.consume()
    const t = s.KeyboardShortcut.KeyboardShortcut.makeKeyFromEvent(e),
      i = this.shortcuts[t]
    i && i(e)
      ? e.consume()
      : (this.inputModel && this.inputModel.emitKeyEvent(e),
        e.consume(),
        this.canvasElement.focus())
  }
  handleContextMenuEvent(e) {
    e.consume(!0)
  }
  handleBlurEvent(e) {
    this.inputModel && this.inputModel.cancelTouch()
  }
  convertIntoScreenSpace(e) {
    return {
      x: Math.round(e.offsetX / this.screenZoom),
      y: Math.round(e.offsetY / this.screenZoom - this.screenOffsetTop),
    }
  }
  onResize() {
    this.deferredCasting &&
      (clearTimeout(this.deferredCasting), delete this.deferredCasting),
      this.stopCasting(),
      (this.deferredCasting = window.setTimeout(
        this.startCasting.bind(this),
        100
      ))
  }
  highlightInOverlay(e, t) {
    this.updateHighlightInOverlayAndRepaint(e, t)
  }
  async updateHighlightInOverlayAndRepaint(t, i) {
    let s = null
    if (
      ('node' in t && (s = t.node),
      !s && 'deferredNode' in t && (s = await t.deferredNode.resolvePromise()),
      !s && 'object' in t)
    ) {
      const i = t.object.runtimeModel().target().model(e.DOMModel.DOMModel)
      i && (s = await i.pushObjectAsNodeToFrontend(t.object))
    }
    if (((this.highlightNode = s), (this.highlightConfig = i), !s))
      return (
        (this.model = null),
        (this.config = null),
        (this.node = null),
        this.titleElement.classList.add('hidden'),
        void this.repaint()
      )
    ;(this.node = s),
      s.boxModel().then((e) => {
        e && this.pageScaleFactor
          ? ((this.model = this.scaleModel(e)),
            (this.config = i),
            this.repaint())
          : this.repaint()
      })
  }
  scaleModel(e) {
    function t(e) {
      for (let t = 0; t < e.length; t += 2)
        (e[t] = e[t] * this.pageScaleFactor * this.screenZoom),
          (e[t + 1] =
            (e[t + 1] * this.pageScaleFactor + this.screenOffsetTop) *
            this.screenZoom)
    }
    return (
      t.call(this, e.content),
      t.call(this, e.padding),
      t.call(this, e.border),
      t.call(this, e.margin),
      e
    )
  }
  repaint() {
    const e = this.model,
      t = this.config,
      i = this.canvasElement.getBoundingClientRect().width,
      s = this.canvasElement.getBoundingClientRect().height
    if (
      ((this.canvasElement.width = window.devicePixelRatio * i),
      (this.canvasElement.height = window.devicePixelRatio * s),
      this.context.save(),
      this.context.scale(window.devicePixelRatio, window.devicePixelRatio),
      this.context.save(),
      this.checkerboardPattern &&
        (this.context.fillStyle = this.checkerboardPattern),
      this.context.fillRect(0, 0, i, this.screenOffsetTop * this.screenZoom),
      this.context.fillRect(
        0,
        this.screenOffsetTop * this.screenZoom +
          this.imageElement.naturalHeight * this.imageZoom,
        i,
        s
      ),
      this.context.restore(),
      e && t)
    ) {
      this.context.save()
      const i = [],
        s = (e) => Boolean(e.a && 0 === e.a)
      e.content &&
        t.contentColor &&
        !s(t.contentColor) &&
        i.push({ quad: e.content, color: t.contentColor }),
        e.padding &&
          t.paddingColor &&
          !s(t.paddingColor) &&
          i.push({ quad: e.padding, color: t.paddingColor }),
        e.border &&
          t.borderColor &&
          !s(t.borderColor) &&
          i.push({ quad: e.border, color: t.borderColor }),
        e.margin &&
          t.marginColor &&
          !s(t.marginColor) &&
          i.push({ quad: e.margin, color: t.marginColor })
      for (let e = i.length - 1; e > 0; --e)
        this.drawOutlinedQuadWithClip(i[e].quad, i[e - 1].quad, i[e].color)
      i.length > 0 && this.drawOutlinedQuad(i[0].quad, i[0].color),
        this.context.restore(),
        this.drawElementTitle(),
        (this.context.globalCompositeOperation = 'destination-over')
    }
    this.context.drawImage(
      this.imageElement,
      0,
      this.screenOffsetTop * this.screenZoom,
      this.imageElement.naturalWidth * this.imageZoom,
      this.imageElement.naturalHeight * this.imageZoom
    ),
      this.context.restore()
  }
  cssColor(e) {
    return e
      ? t.Color.Color.fromRGBA([
          e.r,
          e.g,
          e.b,
          void 0 !== e.a ? e.a : 1,
        ]).asString(t.Color.Format.RGBA) || ''
      : 'transparent'
  }
  quadToPath(e) {
    return (
      this.context.beginPath(),
      this.context.moveTo(e[0], e[1]),
      this.context.lineTo(e[2], e[3]),
      this.context.lineTo(e[4], e[5]),
      this.context.lineTo(e[6], e[7]),
      this.context.closePath(),
      this.context
    )
  }
  drawOutlinedQuad(e, t) {
    this.context.save(),
      (this.context.lineWidth = 2),
      this.quadToPath(e).clip(),
      (this.context.fillStyle = this.cssColor(t)),
      this.context.fill(),
      this.context.restore()
  }
  drawOutlinedQuadWithClip(e, t, i) {
    ;(this.context.fillStyle = this.cssColor(i)),
      this.context.save(),
      (this.context.lineWidth = 0),
      this.quadToPath(e).fill(),
      (this.context.globalCompositeOperation = 'destination-out'),
      (this.context.fillStyle = 'red'),
      this.quadToPath(t).fill(),
      this.context.restore()
  }
  drawElementTitle() {
    if (!this.node) return
    const e = this.canvasElement.getBoundingClientRect().width,
      t = this.canvasElement.getBoundingClientRect().height,
      i = this.node.localName() || this.node.nodeName().toLowerCase()
    ;(this.tagNameElement.textContent = i),
      (this.attributeElement.textContent = (function (e) {
        const t = e.getAttribute('id'),
          i = e.getAttribute('class')
        let s = t ? '#' + t : ''
        i && (s += '.' + i.trim().replace(/\s+/g, '.'))
        s.length > 50 && (s = s.substring(0, 50) + '…')
        return s
      })(this.node)),
      (this.nodeWidthElement.textContent = String(
        this.model ? this.model.width : 0
      )),
      (this.nodeHeightElement.textContent = String(
        this.model ? this.model.height : 0
      )),
      this.titleElement.classList.remove('hidden')
    const s = this.titleElement.offsetWidth + 6,
      n = this.titleElement.offsetHeight + 4,
      o = this.model ? this.model.margin[1] : 0,
      a = this.model ? this.model.margin[7] : 0
    let r,
      l = !1,
      h = !1,
      c = Math.max(2, this.model ? this.model.margin[0] : 0)
    c + s > e && (c = e - s - 2),
      o > t
        ? ((r = t - n - 7), (h = !0))
        : a < 0
          ? ((r = 7), (l = !0))
          : a + n + 7 < t
            ? ((r = a + 7 - 4), (l = !0))
            : o - n - 7 > 0
              ? ((r = o - n - 7 + 3), (h = !0))
              : (r = 7),
      this.context.save(),
      this.context.translate(0.5, 0.5),
      this.context.beginPath(),
      this.context.moveTo(c, r),
      l &&
        (this.context.lineTo(c + 14, r),
        this.context.lineTo(c + 21, r - 7),
        this.context.lineTo(c + 28, r)),
      this.context.lineTo(c + s, r),
      this.context.lineTo(c + s, r + n),
      h &&
        (this.context.lineTo(c + 28, r + n),
        this.context.lineTo(c + 21, r + n + 7),
        this.context.lineTo(c + 14, r + n)),
      this.context.lineTo(c, r + n),
      this.context.closePath(),
      (this.context.fillStyle = 'rgb(255, 255, 194)'),
      this.context.fill(),
      (this.context.strokeStyle = 'rgb(128, 128, 128)'),
      this.context.stroke(),
      this.context.restore(),
      (this.titleElement.style.top = r + 3 + 'px'),
      (this.titleElement.style.left = c + 3 + 'px')
  }
  viewportDimensions() {
    const e = g
    return {
      width: this.element.offsetWidth - e - 30,
      height: this.element.offsetHeight - e - 30 - u,
    }
  }
  setInspectMode(e, t) {
    return (this.inspectModeConfig = 'none' !== e ? t : null), Promise.resolve()
  }
  highlightFrame(e) {}
  createCheckerboardPattern(e) {
    const t = document.createElement('canvas'),
      i = 32
    ;(t.width = 64), (t.height = 64)
    const s = t.getContext('2d')
    return (
      (s.fillStyle = 'rgb(195, 195, 195)'),
      s.fillRect(0, 0, 64, 64),
      (s.fillStyle = 'rgb(225, 225, 225)'),
      s.fillRect(0, 0, i, i),
      s.fillRect(i, i, i, i),
      e.createPattern(t, 'repeat')
    )
  }
  createNavigationBar() {
    ;(this.navigationBar = this.element.createChild(
      'div',
      'screencast-navigation'
    )),
      (this.navigationBack = this.navigationBar.createChild('button', 'back')),
      (this.navigationBack.disabled = !0),
      s.ARIAUtils.setAccessibleName(this.navigationBack, c(l.back)),
      (this.navigationForward = this.navigationBar.createChild(
        'button',
        'forward'
      )),
      (this.navigationForward.disabled = !0),
      s.ARIAUtils.setAccessibleName(this.navigationForward, c(l.forward)),
      (this.navigationReload = this.navigationBar.createChild(
        'button',
        'reload'
      )),
      s.ARIAUtils.setAccessibleName(this.navigationReload, c(l.reload)),
      (this.navigationUrl = s.UIUtils.createInput()),
      s.ARIAUtils.setAccessibleName(this.navigationUrl, c(l.addressBar)),
      this.navigationBar.appendChild(this.navigationUrl),
      (this.navigationUrl.type = 'text'),
      (this.navigationProgressBar = new p(
        this.resourceTreeModel,
        this.networkManager,
        this.navigationBar.createChild('div', 'progress')
      )),
      this.resourceTreeModel &&
        (this.navigationBack.addEventListener(
          'click',
          this.navigateToHistoryEntry.bind(this, -1),
          !1
        ),
        this.navigationForward.addEventListener(
          'click',
          this.navigateToHistoryEntry.bind(this, 1),
          !1
        ),
        this.navigationReload.addEventListener(
          'click',
          this.navigateReload.bind(this),
          !1
        ),
        this.navigationUrl.addEventListener(
          'keyup',
          this.navigationUrlKeyUp.bind(this),
          !0
        ),
        this.requestNavigationHistory(),
        this.resourceTreeModel.addEventListener(
          e.ResourceTreeModel.Events.MainFrameNavigated,
          this.requestNavigationHistoryEvent,
          this
        ),
        this.resourceTreeModel.addEventListener(
          e.ResourceTreeModel.Events.CachedResourcesLoaded,
          this.requestNavigationHistoryEvent,
          this
        ))
  }
  navigateToHistoryEntry(e) {
    if (!this.resourceTreeModel) return
    const t = (this.historyIndex || 0) + e
    !this.historyEntries ||
      t < 0 ||
      t >= this.historyEntries.length ||
      (this.resourceTreeModel.navigateToHistoryEntry(this.historyEntries[t]),
      this.requestNavigationHistory())
  }
  navigateReload() {
    this.resourceTreeModel && this.resourceTreeModel.reloadPage()
  }
  navigationUrlKeyUp(e) {
    if ('Enter' !== e.key) return
    let t = this.navigationUrl.value
    t &&
      (t.match(v) || (t = 'http://' + t),
      this.resourceTreeModel &&
        this.resourceTreeModel.navigate(encodeURI(decodeURI(t))),
      this.canvasElement.focus())
  }
  requestNavigationHistoryEvent() {
    this.requestNavigationHistory()
  }
  async requestNavigationHistory() {
    const e = this.resourceTreeModel
      ? await this.resourceTreeModel.navigationHistory()
      : null
    if (!e) return
    ;(this.historyIndex = e.currentIndex),
      (this.historyEntries = e.entries),
      (this.navigationBack.disabled = 0 === this.historyIndex),
      (this.navigationForward.disabled =
        this.historyIndex === this.historyEntries.length - 1)
    let t = this.historyEntries[this.historyIndex].url
    const i = t.match(m)
    i && (t = i[1]),
      n.InspectorFrontendHost.InspectorFrontendHostInstance.inspectedURLChanged(
        t
      ),
      (this.navigationUrl.value = decodeURI(t))
  }
  focusNavigationBar() {
    return this.navigationUrl.focus(), this.navigationUrl.select(), !0
  }
}
const g = 44,
  u = 29,
  m = /^http:\/\/(.+)/,
  v = /^(https?|about|chrome):/
class p {
  element
  requestIds
  startedRequests
  finishedRequests
  maxDisplayedProgress
  constructor(t, i, s) {
    ;(this.element = s),
      t &&
        (t.addEventListener(
          e.ResourceTreeModel.Events.MainFrameNavigated,
          this.onMainFrameNavigated,
          this
        ),
        t.addEventListener(e.ResourceTreeModel.Events.Load, this.onLoad, this)),
      i &&
        (i.addEventListener(
          e.NetworkManager.Events.RequestStarted,
          this.onRequestStarted,
          this
        ),
        i.addEventListener(
          e.NetworkManager.Events.RequestFinished,
          this.onRequestFinished,
          this
        )),
      (this.requestIds = null),
      (this.startedRequests = 0),
      (this.finishedRequests = 0),
      (this.maxDisplayedProgress = 0)
  }
  onMainFrameNavigated() {
    ;(this.requestIds = new Map()),
      (this.startedRequests = 0),
      (this.finishedRequests = 0),
      (this.maxDisplayedProgress = 0),
      this.updateProgress(0.1)
  }
  onLoad() {
    ;(this.requestIds = null),
      this.updateProgress(1),
      setTimeout(() => {
        this.navigationProgressVisible() || this.displayProgress(0)
      }, 500)
  }
  navigationProgressVisible() {
    return null !== this.requestIds
  }
  onRequestStarted(e) {
    if (!this.navigationProgressVisible()) return
    const i = e.data.request
    i.resourceType() !== t.ResourceType.resourceTypes.WebSocket &&
      (this.requestIds && this.requestIds.set(i.requestId(), i),
      ++this.startedRequests)
  }
  onRequestFinished(e) {
    if (!this.navigationProgressVisible()) return
    const t = e.data
    ;(this.requestIds && !this.requestIds.has(t.requestId())) ||
      (++this.finishedRequests,
      setTimeout(() => {
        this.updateProgress(
          (this.finishedRequests / this.startedRequests) * 0.9
        )
      }, 500))
  }
  updateProgress(e) {
    this.navigationProgressVisible() &&
      (this.maxDisplayedProgress >= e ||
        ((this.maxDisplayedProgress = e), this.displayProgress(e)))
  }
  displayProgress(e) {
    this.element.style.width = 100 * e + '%'
  }
}
var f = Object.freeze({
  __proto__: null,
  ScreencastView: d,
  BORDERS_SIZE: g,
  NAVBAR_HEIGHT: u,
  HTTP_REGEX: m,
  SCHEME_REGEX: v,
  ProgressTracker: p,
})
const b = { toggleScreencast: 'Toggle screencast' },
  E = i.i18n.registerUIStrings('panels/screencast/ScreencastApp.ts', b),
  x = i.i18n.getLocalizedString.bind(void 0, E)
let y, w, M
class C {
  enabledSetting
  toggleButton
  rootSplitWidget
  screenCaptureModel
  screencastView
  constructor() {
    globalThis.chii
      ? (this.enabledSetting = t.Settings.Settings.instance().createSetting(
          'screencastEnabled',
          !1
        ))
      : (this.enabledSetting = t.Settings.Settings.instance().createSetting(
          'screencastEnabled',
          !0
        )),
      (this.toggleButton = new s.Toolbar.ToolbarToggle(
        x(b.toggleScreencast),
        'largeicon-phone'
      )),
      this.toggleButton.setToggled(this.enabledSetting.get()),
      this.toggleButton.setEnabled(!1),
      this.toggleButton.addEventListener(
        s.Toolbar.ToolbarButton.Events.Click,
        this.toggleButtonClicked,
        this
      ),
      e.TargetManager.TargetManager.instance().observeModels(
        e.ScreenCaptureModel.ScreenCaptureModel,
        this
      )
  }
  static instance() {
    return y || (y = new C()), y
  }
  presentUI(e) {
    const t = new s.RootView.RootView()
    ;(this.rootSplitWidget = new s.SplitWidget.SplitWidget(
      !1,
      !0,
      'InspectorView.screencastSplitViewState',
      300,
      300
    )),
      this.rootSplitWidget.setVertical(!0),
      this.rootSplitWidget.setSecondIsSidebar(!0),
      this.rootSplitWidget.show(t.element),
      this.rootSplitWidget.hideMain(),
      this.rootSplitWidget.setSidebarWidget(
        s.InspectorView.InspectorView.instance()
      ),
      s.InspectorView.InspectorView.instance().setOwnerSplit(
        this.rootSplitWidget
      ),
      t.attachToDocument(e),
      t.focus()
  }
  modelAdded(e) {
    this.screenCaptureModel ||
      ((this.screenCaptureModel = e),
      this.toggleButton.setEnabled(!0),
      (this.screencastView = new d(e)),
      this.rootSplitWidget &&
        this.rootSplitWidget.setMainWidget(this.screencastView),
      this.screencastView.initialize(),
      this.onScreencastEnabledChanged())
  }
  modelRemoved(e) {
    this.screenCaptureModel === e &&
      (delete this.screenCaptureModel,
      this.toggleButton.setEnabled(!1),
      this.screencastView &&
        (this.screencastView.detach(), delete this.screencastView),
      this.onScreencastEnabledChanged())
  }
  toggleButtonClicked() {
    const e = !this.toggleButton.toggled()
    this.enabledSetting.set(e), this.onScreencastEnabledChanged()
  }
  onScreencastEnabledChanged() {
    if (!this.rootSplitWidget) return
    const e = Boolean(this.enabledSetting.get() && this.screencastView)
    this.toggleButton.setToggled(e),
      e ? this.rootSplitWidget.showBoth() : this.rootSplitWidget.hideMain()
  }
}
class T {
  static instance(e = { forceNew: !1 }) {
    const { forceNew: t } = e
    return (w && !t) || (w = new T()), w
  }
  item() {
    return C.instance().toggleButton
  }
}
class S {
  static instance(e = { forceNew: !1 }) {
    const { forceNew: t } = e
    return (M && !t) || (M = new S()), M
  }
  createApp() {
    return C.instance()
  }
}
var k = Object.freeze({
  __proto__: null,
  ScreencastApp: C,
  ToolbarButtonProvider: T,
  ScreencastAppProvider: S,
})
export { a as InputModel, k as ScreencastApp, f as ScreencastView }
