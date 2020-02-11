import AV from 'leancloud-storage'
import TimeUtil from '@pefish/js-util-time';
import Email from './util/email';

export default class CommentNotify {
  private currentCount: number = 0

  async start() {
    const email = new Email()
    while (true) {
      global.logger.debug(`检测中...`)
      try {
        await TimeUtil.timeout(async () => {
          const query = new AV.Query('Comment')
          const commentCount: number = await query.count()
          global.logger.debug(`评论总数：${commentCount}, 当前数量：${this.currentCount}`)
          if (commentCount > this.currentCount && this.currentCount !== 0) {
            const count = commentCount - this.currentCount
            global.logger.info(`新增${count}条记录`)
            // 查询多出来的记录
            query.addDescending(`insertedAt`)
            query.limit(commentCount - this.currentCount)
            const comments: any[] = await query.find()
            // 发邮件通知
            for (const comment of comments) {
              const messageId = await email.sendEmail(`您在您的博客收到了新的评论`, `
              <p>Hi, 主人</p>
              <p>
              您的文章 ${comment._serverData.url} 在 ${TimeUtil.toLocalStr(comment._serverData.insertedAt)} 收到了新的评论：
              </p>
              <p>
              ---------------------------
              </p>
              ${comment._serverData.comment}
              <p>
              ---------------------------
              </p>
              <p>
              请点击回复：
              </p>
              <p><a href="${global.config.blogUrl}${comment._serverData.url}" style="display: inline-block; padding: 10px 20px; border-radius: 4px; background-color: #3090e4; color: #fff; text-decoration: none;">马上回复</a></p>
              `)
              global.logger.info(`messageId: ${messageId}`)
            }
          }
          this.currentCount = commentCount
        }, 3000)
      } catch (err) {
        global.logger.error(err)
      }
      await TimeUtil.sleep(global.config.interval)
    }
  }
}
