import '@pefish/js-node-assist'
import Starter from '@pefish/js-util-starter'
import ConfigUtil from '@pefish/js-util-config'
import AV from 'leancloud-storage'
import CommentNotify from './comment';

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: {[x: string]: any};
      debug: boolean;
    }
  }
}

Starter.startAsync(async () => {
  global.config = ConfigUtil.loadYamlConfig()
  global.debug = global.config.env !== 'prod'
  
  AV.init({
    appId: global.config.valine.appid,
    appKey: global.config.valine.appkey,
    serverURLs: ""
  });
  new CommentNotify().start()
}, null, false)


