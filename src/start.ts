import '@pefish/js-node-assist'
import Starter from '@pefish/js-util-starter'
import ConfigUtil from '@pefish/js-util-config'
import AV from 'leancloud-storage'
import CommentNotify from './comment';
import { Log4js, GcloudLogging } from '@pefish/js-helper-logger'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: {[x: string]: any};
      debug: boolean;
    }
  }
}

global.config = ConfigUtil.loadYamlConfig()
global.debug = global.config.env !== 'prod'
if (global.debug) {
  global.logger = new Log4js()
} else {
  global.logger = new GcloudLogging()
}

Starter.startAsync(async () => { 
  AV.init({
    appId: global.config.valine.appid,
    appKey: global.config.valine.appkey,
    serverURLs: ""
  });
  new CommentNotify().start()
}, null, false)


