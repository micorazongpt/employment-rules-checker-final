import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API 호출됨');
    
    const body = await request.json();
    console.log('요청 데이터:', body);
    
    const { content, fileName } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: '분석할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    // 환경변수 확인
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log('API 키 존재:', !!apiKey);
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 간단한 테스트 응답
    const testResult = {
      fileName: fileName || '테스트파일',
      analyzedAt: new Date().toISOString(),
      summary: {
        totalIssues: 3,
        riskLevel: 'MEDIUM' as const,
        complianceScore: 75
      },
      analysis: `테스트 분석 결과입니다.

파일명: ${fileName || '테스트파일'}
분석 시간: ${new Date().toLocaleString()}

1. 근로시간 규정
- 1일 8시간, 주 40시간 원칙 준수
- 연장근로 한도 및 절차 명시 필요

2. 휴가제도
- 연차휴가 규정 보완 필요
- 경조휴가 등 부가 휴가 명시

3. 개선 권고사항
- 근로기준법 준수를 위한 규정 세분화
- 직원 복리후생 제도 확충`,
      recommendations: [
        {
          priority: 'HIGH' as const,
          description: '근로시간 규정 명시',
          category: '근로시간'
        },
        {
          priority: 'MEDIUM' as const,
          description: '휴가제도 보완',
          category: '휴가'
        }
      ],
      legalRisks: [
        {
          severity: 'MEDIUM' as const,
          description: '근로기준법 준수 사항 점검 필요',
          suggestion: '전문가 상담 권장'
        }
      ]
    };

    console.log('응답 전송:', testResult);
    return NextResponse.json(testResult);

  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
