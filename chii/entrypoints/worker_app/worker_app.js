Root.allDescriptors.push(...[]);Root.applicationDescriptor={"modules":[]};import*as RootModule from'../../core/root/root.js';import'../shell/shell.js';import'../../panels/browser_debugger/browser_debugger-meta.js';import'../../panels/developer_resources/developer_resources-meta.js';import'../../panels/elements/elements-meta.js';import'../../panels/help/help-meta.js';import'../../panels/issues/issues-meta.js';import'../../panels/layer_viewer/layer_viewer-meta.js';import'../../panels/mobile_throttling/mobile_throttling-meta.js';import'../../panels/network/network-meta.js';import'../../panels/application/application-meta.js';import'../../panels/timeline/timeline-meta.js';import'./WorkerMain.js';import*as Main from'../main/main.js';import*as Startup from'../startup/startup.js';new Main.MainImpl.MainImpl();Startup.RuntimeInstantiator.startApplication('worker_app');