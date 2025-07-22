from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # 前端地址（本地开发或部署后请更改）
    base_url = "http://glitterpapersourcing.com"

    # 构造重置链接
    reset_url = f"{base_url}/reset-password-form/{reset_password_token.key}"

    # HTML 邮件正文（带超链接）
    email_html_message = f"""
        <p>您好，</p>
        <p>您申请了重置密码，请点击以下链接设置新密码：</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>如果您没有申请此操作，请忽略此邮件。</p>
        <p>感谢使用科瑞特采购系统。</p>
    """

    # 纯文本邮件内容
    email_plaintext_message = (
        f"您好，\n\n"
        f"您申请了重置密码，请复制以下链接到浏览器中打开以设置新密码：\n"
        f"{reset_url}\n\n"
        f"如果您没有申请此操作，请忽略此邮件。\n\n"
        f"感谢使用科瑞特采购系统。"
    )

    # 发送邮件
    send_mail(
        subject="【Glitter Paper】密码重置链接",
        message=email_plaintext_message,
        from_email='福州科瑞特 <1620993903@qq.com>',
        recipient_list=[reset_password_token.user.email],
        fail_silently=False,
        html_message=email_html_message
    )
