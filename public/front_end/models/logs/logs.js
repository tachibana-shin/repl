import*as e from"../../core/common/common.js";import*as t from"../../core/sdk/sdk.js";import*as s from"../../core/i18n/i18n.js";import*as r from"../../core/platform/platform.js";const n={anonymous:"<anonymous>"},o=s.i18n.registerUIStrings("models/logs/NetworkLog.ts",n),a=s.i18n.getLocalizedString.bind(void 0,o);let i;class d extends e.ObjectWrapper.ObjectWrapper{requestsInternal;sentNetworkRequests;receivedNetworkResponses;requestsSet;requestsMap;pageLoadForManager;isRecording;modelListeners;initiatorData;unresolvedPreflightRequests;constructor(){super(),this.requestsInternal=[],this.sentNetworkRequests=[],this.receivedNetworkResponses=[],this.requestsSet=new Set,this.requestsMap=new Map,this.pageLoadForManager=new Map,this.isRecording=!0,this.modelListeners=new WeakMap,this.initiatorData=new WeakMap,t.TargetManager.TargetManager.instance().observeModels(t.NetworkManager.NetworkManager,this);const s=e.Settings.Settings.instance().moduleSetting("network_log.record-log");s.addChangeListener((()=>{!e.Settings.Settings.instance().moduleSetting("network_log.preserve-log").get()&&s.get()&&this.reset(!0),this.setIsRecording(s.get())}),this),this.unresolvedPreflightRequests=new Map}static instance(){return i||(i=new d),i}modelAdded(e){const s=[];s.push(e.addEventListener(t.NetworkManager.Events.RequestStarted,this.onRequestStarted,this)),s.push(e.addEventListener(t.NetworkManager.Events.RequestUpdated,this.onRequestUpdated,this)),s.push(e.addEventListener(t.NetworkManager.Events.RequestRedirected,this.onRequestRedirect,this)),s.push(e.addEventListener(t.NetworkManager.Events.RequestFinished,this.onRequestUpdated,this)),s.push(e.addEventListener(t.NetworkManager.Events.MessageGenerated,this.networkMessageGenerated.bind(this,e))),s.push(e.addEventListener(t.NetworkManager.Events.ResponseReceived,this.onResponseReceived,this));const r=e.target().model(t.ResourceTreeModel.ResourceTreeModel);r&&(s.push(r.addEventListener(t.ResourceTreeModel.Events.WillReloadPage,this.willReloadPage,this)),s.push(r.addEventListener(t.ResourceTreeModel.Events.MainFrameNavigated,this.onMainFrameNavigated,this)),s.push(r.addEventListener(t.ResourceTreeModel.Events.Load,this.onLoad,this)),s.push(r.addEventListener(t.ResourceTreeModel.Events.DOMContentLoaded,this.onDOMContentLoaded.bind(this,r)))),this.modelListeners.set(e,s)}modelRemoved(e){this.removeNetworkManagerListeners(e)}removeNetworkManagerListeners(t){e.EventTarget.removeEventListeners(this.modelListeners.get(t)||[])}setIsRecording(e){this.isRecording!==e&&(this.isRecording=e,e?t.TargetManager.TargetManager.instance().observeModels(t.NetworkManager.NetworkManager,this):(t.TargetManager.TargetManager.instance().unobserveModels(t.NetworkManager.NetworkManager,this),t.TargetManager.TargetManager.instance().models(t.NetworkManager.NetworkManager).forEach(this.removeNetworkManagerListeners.bind(this))))}requestForURL(e){return this.requestsInternal.find((t=>t.url()===e))||null}originalRequestForURL(e){return this.sentNetworkRequests.find((t=>t.url===e))||null}originalResponseForURL(e){return this.receivedNetworkResponses.find((t=>t.url===e))||null}requests(){return this.requestsInternal}requestByManagerAndId(e,s){for(let r=this.requestsInternal.length-1;r>=0;r--){const n=this.requestsInternal[r];if(s===n.requestId()&&e===t.NetworkManager.NetworkManager.forRequest(n))return n}return null}requestByManagerAndURL(e,s){for(const r of this.requestsInternal)if(s===r.url()&&e===t.NetworkManager.NetworkManager.forRequest(r))return r;return null}initializeInitiatorSymbolIfNeeded(e){let t=this.initiatorData.get(e);return t||(t={info:null,chain:null,request:void 0},this.initiatorData.set(e,t),t)}initiatorInfoForRequest(e){const s=this.initializeInitiatorSymbolIfNeeded(e);if(s.info)return s.info;let r=t.NetworkRequest.InitiatorType.Other,o="",i=-1/0,d=-1/0,u=null,l=null,g=null;const h=e.initiator(),c=e.redirectSource();if(c)r=t.NetworkRequest.InitiatorType.Redirect,o=c.url();else if(h)if("parser"===h.type)r=t.NetworkRequest.InitiatorType.Parser,o=h.url?h.url:o,i="number"==typeof h.lineNumber?h.lineNumber:i,d="number"==typeof h.columnNumber?h.columnNumber:d;else if("script"===h.type){for(let e=h.stack;e;){const s=e.callFrames.length?e.callFrames[0]:null;if(s){r=t.NetworkRequest.InitiatorType.Script,o=s.url||a(n.anonymous),i=s.lineNumber,d=s.columnNumber,u=s.scriptId;break}e=e.parent}!h.stack&&h.url&&(r=t.NetworkRequest.InitiatorType.Script,o=h.url,i=h.lineNumber||0),h.stack&&h.stack.callFrames&&h.stack.callFrames.length&&(l=h.stack||null)}else"preload"===h.type?r=t.NetworkRequest.InitiatorType.Preload:"preflight"===h.type?(r=t.NetworkRequest.InitiatorType.Preflight,g=e.preflightInitiatorRequest()):"SignedExchange"===h.type&&(r=t.NetworkRequest.InitiatorType.SignedExchange,o=h.url||"");return s.info={type:r,url:o,lineNumber:i,columnNumber:d,scriptId:u,stack:l,initiatorRequest:g},s.info}initiatorGraphForRequest(e){const s=new Map,r=t.NetworkManager.NetworkManager.forRequest(e);for(const n of this.requestsInternal){if(r===t.NetworkManager.NetworkManager.forRequest(n)&&this.initiatorChain(n).has(e)){const e=this.initiatorRequest(n);e&&s.set(n,e)}}return{initiators:this.initiatorChain(e),initiated:s}}initiatorChain(e){const t=this.initializeInitiatorSymbolIfNeeded(e);let s=t.chain;if(s)return s;s=new Set;let n=e;for(;n;){const e=this.initializeInitiatorSymbolIfNeeded(n);if(e.chain){r.SetUtilities.addAll(s,e.chain);break}if(s.has(n))break;s.add(n),n=this.initiatorRequest(n)}return t.chain=s,s}initiatorRequest(e){const s=this.initializeInitiatorSymbolIfNeeded(e);if(void 0!==s.request)return s.request;const r=this.initiatorInfoForRequest(e).url,n=t.NetworkManager.NetworkManager.forRequest(e);return s.request=n?this.requestByManagerAndURL(n,r):null,s.request}willReloadPage(){e.Settings.Settings.instance().moduleSetting("network_log.preserve-log").get()||this.reset(!0)}onMainFrameNavigated(s){const r=s.data,n=r.resourceTreeModel().target().model(t.NetworkManager.NetworkManager);if(!n||r.resourceTreeModel().target().parentTarget())return;if(r.url!==r.unreachableUrl()&&r.url.startsWith("chrome-error://"))return;const o=e.Settings.Settings.instance().moduleSetting("network_log.preserve-log").get(),a=this.requestsInternal,i=this.requestsInternal.filter((e=>t.NetworkManager.NetworkManager.forRequest(e)===n)),d=this.requestsSet;this.requestsInternal=[],this.sentNetworkRequests=[],this.receivedNetworkResponses=[],this.requestsSet=new Set,this.requestsMap.clear(),this.unresolvedPreflightRequests.clear(),this.dispatchEventToListeners(l.Reset,{clearIfPreserved:!o});let u=null;const g=[];for(const e of i)if(e.loaderId===r.loaderId){if(!u){u=new t.PageLoad.PageLoad(e);let s=e.redirectSource();for(;s;)g.push(s),s=s.redirectSource()}g.push(e)}const h=[];for(const e of a){if(!e.initiatedByServiceWorker())continue;g.some((t=>t.url()===e.url()&&t.issueTime()<=e.issueTime()))&&h.push(e)}g.push(...h);for(const e of g)u?.bindRequest(e),d.delete(e),this.addRequest(e);if(o)for(const e of d)this.addRequest(e),e.preserved=!0;u&&this.pageLoadForManager.set(n,u)}addRequest(e){this.requestsInternal.push(e),this.requestsSet.add(e);const t=this.requestsMap.get(e.requestId());t?t.push(e):this.requestsMap.set(e.requestId(),[e]),this.tryResolvePreflightRequests(e),this.dispatchEventToListeners(l.RequestAdded,e)}tryResolvePreflightRequests(e){if(e.isPreflightRequest()){const t=e.initiator();if(t&&t.requestId){const[s]=this.requestsForId(t.requestId);s?(e.setPreflightInitiatorRequest(s),s.setPreflightRequest(e)):this.unresolvedPreflightRequests.set(t.requestId,e)}}else{const t=this.unresolvedPreflightRequests.get(e.requestId());if(t){this.unresolvedPreflightRequests.delete(e.requestId()),e.setPreflightRequest(t),t.setPreflightInitiatorRequest(e);const s=this.initiatorData.get(t);s&&(s.info=null),this.dispatchEventToListeners(l.RequestUpdated,t)}}}importRequests(e){this.reset(!0),this.requestsInternal=[],this.sentNetworkRequests=[],this.receivedNetworkResponses=[],this.requestsSet.clear(),this.requestsMap.clear(),this.unresolvedPreflightRequests.clear();for(const t of e)this.addRequest(t)}onRequestStarted(e){const{request:s,originalRequest:r}=e.data;r&&this.sentNetworkRequests.push(r),this.requestsSet.add(s);const n=t.NetworkManager.NetworkManager.forRequest(s),o=n?this.pageLoadForManager.get(n):null;o&&o.bindRequest(s),this.addRequest(s)}onResponseReceived(e){const t=e.data.response;this.receivedNetworkResponses.push(t)}onRequestUpdated(e){const t=e.data;this.requestsSet.has(t)&&this.dispatchEventToListeners(l.RequestUpdated,t)}onRequestRedirect(e){this.initiatorData.delete(e.data)}onDOMContentLoaded(e,s){const r=e.target().model(t.NetworkManager.NetworkManager),n=r?this.pageLoadForManager.get(r):null;n&&(n.contentLoadTime=s.data)}onLoad(e){const s=e.data.resourceTreeModel.target().model(t.NetworkManager.NetworkManager),r=s?this.pageLoadForManager.get(s):null;r&&(r.loadTime=e.data.loadTime)}reset(e){this.requestsInternal=[],this.sentNetworkRequests=[],this.receivedNetworkResponses=[],this.requestsSet.clear(),this.requestsMap.clear(),this.unresolvedPreflightRequests.clear();const s=new Set(t.TargetManager.TargetManager.instance().models(t.NetworkManager.NetworkManager));for(const e of this.pageLoadForManager.keys())s.has(e)||this.pageLoadForManager.delete(e);this.dispatchEventToListeners(l.Reset,{clearIfPreserved:e})}networkMessageGenerated(e,s){const{message:r,warning:n,requestId:o}=s.data,a=new t.ConsoleModel.ConsoleMessage(e.target().model(t.RuntimeModel.RuntimeModel),"network",n?"warning":"info",r);this.associateConsoleMessageWithRequest(a,o),t.ConsoleModel.ConsoleModel.instance().addMessage(a)}associateConsoleMessageWithRequest(e,s){const r=e.target(),n=r?r.model(t.NetworkManager.NetworkManager):null;if(!n)return;const o=this.requestByManagerAndId(n,s);if(!o)return;u.set(e,o);const a=o.initiator();a&&(e.stackTrace=a.stack||void 0,a.url&&(e.url=a.url,e.line=a.lineNumber||0))}static requestForConsoleMessage(e){return u.get(e)||null}requestsForId(e){return this.requestsMap.get(e)||[]}}const u=new WeakMap;var l;!function(e){e.Reset="Reset",e.RequestAdded="RequestAdded",e.RequestUpdated="RequestUpdated"}(l||(l={}));var g=Object.freeze({__proto__:null,NetworkLog:d,get Events(){return l}});const h=new WeakMap;let c=null;class q{constructor(){t.TargetManager.TargetManager.instance().observeModels(t.LogModel.LogModel,this)}static instance({forceNew:e}={forceNew:!1}){return c&&!e||(c=new q),c}modelAdded(e){const s=[];s.push(e.addEventListener(t.LogModel.Events.EntryAdded,this.logEntryAdded,this)),h.set(e,s)}modelRemoved(t){const s=h.get(t);s&&e.EventTarget.removeEventListeners(s)}logEntryAdded(e){const{logModel:s,entry:r}=e.data,n=s.target(),o={url:r.url,line:r.lineNumber,parameters:[r.text,...r.args??[]],stackTrace:r.stackTrace,timestamp:r.timestamp,workerId:r.workerId,category:r.category,affectedResources:r.networkRequestId?{requestId:r.networkRequestId}:void 0},a=new t.ConsoleModel.ConsoleMessage(n.model(t.RuntimeModel.RuntimeModel),r.source,r.level,r.text,o);if(r.networkRequestId&&d.instance().associateConsoleMessageWithRequest(a,r.networkRequestId),"worker"===a.source){const e=a.workerId||"";if(t.TargetManager.TargetManager.instance().targetById(e))return;setTimeout((()=>{t.TargetManager.TargetManager.instance().targetById(e)||t.ConsoleModel.ConsoleModel.instance().addMessage(a)}),1e3)}else t.ConsoleModel.ConsoleModel.instance().addMessage(a)}}var R=Object.freeze({__proto__:null,LogManager:q});class M extends e.ResolverBase.ResolverBase{networkListener=null;networkLog;constructor(e=d.instance()){super(),this.networkLog=e}getForId(e){const t=this.networkLog.requestsForId(e);return t.length>0?t[0]:null}onRequestAdded(e){const t=e.data,s=t.backendRequestId();s&&this.onResolve(s,t)}startListening(){this.networkListener||(this.networkListener=this.networkLog.addEventListener(l.RequestAdded,this.onRequestAdded,this))}stopListening(){this.networkListener&&(e.EventTarget.removeEventListeners([this.networkListener]),this.networkListener=null)}}var p=Object.freeze({__proto__:null,RequestResolver:M});export{R as LogManager,g as NetworkLog,p as RequestResolver};
