import*as e from"../../core/common/common.js";import*as t from"../../ui/legacy/legacy.js";import*as o from"../../core/i18n/i18n.js";const n={sensors:"Sensors",geolocation:"geolocation",timezones:"timezones",locale:"locale",locales:"locales",accelerometer:"accelerometer",deviceOrientation:"device orientation",locations:"Locations",touch:"Touch",devicebased:"Device-based",forceEnabled:"Force enabled",emulateIdleDetectorState:"Emulate Idle Detector state",noIdleEmulation:"No idle emulation",userActiveScreenUnlocked:"User active, screen unlocked",userActiveScreenLocked:"User active, screen locked",userIdleScreenUnlocked:"User idle, screen unlocked",userIdleScreenLocked:"User idle, screen locked",showSensors:"Show Sensors",showLocations:"Show Locations"},i=o.i18n.registerUIStrings("panels/sensors/sensors-meta.ts",n),s=o.i18n.getLazilyComputedLocalizedString.bind(void 0,i);let l;async function a(){return l||(l=await import("./sensors.js")),l}t.ViewManager.registerViewExtension({location:"drawer-view",commandPrompt:s(n.showSensors),title:s(n.sensors),id:"sensors",persistence:"closeable",order:100,loadView:async()=>(await a()).SensorsView.SensorsView.instance(),tags:[s(n.geolocation),s(n.timezones),s(n.locale),s(n.locales),s(n.accelerometer),s(n.deviceOrientation)]}),t.ViewManager.registerViewExtension({location:"settings-view",id:"emulation-locations",commandPrompt:s(n.showLocations),title:s(n.locations),order:40,loadView:async()=>(await a()).LocationsSettingsTab.LocationsSettingsTab.instance(),settings:["emulation.locations"]}),t.ActionRegistration.registerActionExtension({actionId:"emulation.show-sensors",category:t.ActionRegistration.ActionCategory.SENSORS,loadActionDelegate:async()=>(await a()).SensorsView.ShowActionDelegate.instance(),title:s(n.sensors)}),e.Settings.registerSettingExtension({storageType:e.Settings.SettingStorageType.Synced,settingName:"emulation.locations",settingType:e.Settings.SettingType.ARRAY,defaultValue:[{title:"Berlin",lat:52.520007,long:13.404954,timezoneId:"Europe/Berlin",locale:"de-DE"},{title:"London",lat:51.507351,long:-.127758,timezoneId:"Europe/London",locale:"en-GB"},{title:"Moscow",lat:55.755826,long:37.6173,timezoneId:"Europe/Moscow",locale:"ru-RU"},{title:"Mountain View",lat:37.386052,long:-122.083851,timezoneId:"US/Pacific",locale:"en-US"},{title:"Mumbai",lat:19.075984,long:72.877656,timezoneId:"Asia/Kolkata",locale:"mr-IN"},{title:"San Francisco",lat:37.774929,long:-122.419416,timezoneId:"US/Pacific",locale:"en-US"},{title:"Shanghai",lat:31.230416,long:121.473701,timezoneId:"Asia/Shanghai",locale:"zh-Hans-CN"},{title:"São Paulo",lat:-23.55052,long:-46.633309,timezoneId:"America/Sao_Paulo",locale:"pt-BR"},{title:"Tokyo",lat:35.689487,long:139.691706,timezoneId:"Asia/Tokyo",locale:"ja-JP"}]}),e.Settings.registerSettingExtension({title:s(n.touch),reloadRequired:!0,settingName:"emulation.touch",settingType:e.Settings.SettingType.ENUM,defaultValue:"none",options:[{value:"none",title:s(n.devicebased),text:s(n.devicebased)},{value:"force",title:s(n.forceEnabled),text:s(n.forceEnabled)}]}),e.Settings.registerSettingExtension({title:s(n.emulateIdleDetectorState),settingName:"emulation.idleDetection",settingType:e.Settings.SettingType.ENUM,defaultValue:"none",options:[{value:"none",title:s(n.noIdleEmulation),text:s(n.noIdleEmulation)},{value:'{"isUserActive":true,"isScreenUnlocked":true}',title:s(n.userActiveScreenUnlocked),text:s(n.userActiveScreenUnlocked)},{value:'{"isUserActive":true,"isScreenUnlocked":false}',title:s(n.userActiveScreenLocked),text:s(n.userActiveScreenLocked)},{value:'{"isUserActive":false,"isScreenUnlocked":true}',title:s(n.userIdleScreenUnlocked),text:s(n.userIdleScreenUnlocked)},{value:'{"isUserActive":false,"isScreenUnlocked":false}',title:s(n.userIdleScreenLocked),text:s(n.userIdleScreenLocked)}]});