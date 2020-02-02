import nodemailer from 'nodemailer'

export default class Email {
  private transporter: any;

  constructor () {
    this.transporter = nodemailer.createTransport(global.config.email);
  }

  async sendEmail (subject: string, html: string): Promise<string> {
    global.logger.debug(`发送邮件中...`)

    let info = await this.transporter.sendMail({
      from: global.config.email.auth.user,
      to: global.config.emailTarget,
      subject: subject,
      html: html,
    });
  
    return info.messageId
  }
}
