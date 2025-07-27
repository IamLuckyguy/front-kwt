import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend('re_ENGMXpad_9ogGJwZZXmRF3qPfDRk6D5D8');

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 emails per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkRateLimit(fingerprint: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(fingerprint);
  
  if (!userLimit) {
    rateLimitMap.set(fingerprint, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (now > userLimit.resetTime) {
    rateLimitMap.set(fingerprint, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  console.log('Email API called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    const { sender, subject, content, fingerprint } = body;

    // Validation
    if (!sender || !subject || !content || !fingerprint) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(sender)) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(fingerprint)) {
      return NextResponse.json(
        { error: '시간당 전송 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }
    
    console.log('Validation passed, attempting to send email...');

    // Send email
    const emailHtml = `
      <div style="font-family: monospace; background-color: #000; color: #00ff00; padding: 20px;">
        <h2 style="color: #00ff00; border-bottom: 1px solid #00ff00; padding-bottom: 10px;">
          KWT.CO.KR 연락하기 - 새로운 문의
        </h2>
        
        <div style="margin: 20px 0;">
          <strong>보내는 사람:</strong> ${sender}<br>
          <strong>제목:</strong> ${subject}<br>
          <strong>전송 시간:</strong> ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
        </div>
        
        <div style="border: 1px solid #00ff00; padding: 15px; margin: 20px 0;">
          <strong>문의 내용:</strong><br><br>
          ${content.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #00ff00; font-size: 12px; color: #00aa00;">
          이 메일은 KWT.CO.KR 웹사이트의 연락하기 폼을 통해 전송되었습니다.<br>
          답변은 위의 보내는 사람 이메일 주소로 직접 회신해주세요.
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'contact@kwt.co.kr',
      to: 'kwt@kwt.co.kr',
      subject: `[KWT 문의] ${subject}`,
      html: emailHtml,
      replyTo: sender,
    });

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : '이메일 전송 중 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}