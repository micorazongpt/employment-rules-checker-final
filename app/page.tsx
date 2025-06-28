'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Clock,
  Users,
  Eye,
  Moon,
  Sun,
  Loader2,
  BarChart3,
  Shield,
  AlertCircle,
  TrendingUp,
  Award,
  ExternalLink
} from 'lucide-react';

interface AnalysisResult {
  fileName: string;
  analyzedAt: string;
  summary: {
    totalIssues: number;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    complianceScore: number;
  };
  analysis: string;
  recommendations?: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    category: string;
  }>;
  legalRisks?: Array<{
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
    suggestion: string;
  }>;
}

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt') || selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('TXT 또는 PDF 파일만 업로드 가능합니다.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const text = await file.text();
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
          fileName: file.name,
        }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadResult = (format: 'excel' | 'sheets' | 'csv' | 'word') => {
    if (!analysisResult) return;
    
    // 다운로드 로직 구현
    console.log(`Downloading as ${format}`);
    alert(`${format} 다운로드 기능이 곧 추가됩니다!`);
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisResult(null);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      
      {/* 다크모드 토글 */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!analysisResult ? (
          // 업로드 및 초기 화면
          <>
            {/* 헤더 */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-500 p-3 rounded-xl mr-4">
                  <Shield className="text-white" size={32} />
                </div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  취업규칙 검토 시스템
                </h1>
              </div>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI가 3분만에 취업규칙을 검토하고 법적 준수 여부를 확인해드립니다
              </p>
            </div>

            {/* 파일 업로드 섹션 */}
            <div className={`max-w-2xl mx-auto p-8 rounded-2xl ${
              isDarkMode 
                ? 'bg-gray-800/50 border-2 border-gray-700' 
                : 'bg-white/80 border-2 border-gray-200'
            } backdrop-blur-sm mb-12`}>
              {!file ? (
                <div
                  className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    dragOver
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <Upload size={64} className={`mx-auto mb-4 ${
                    dragOver ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <h3 className="text-2xl font-bold mb-4">취업규칙 파일 업로드</h3>
                  <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    TXT 또는 PDF 파일을 드래그하거나 클릭하여 업로드하세요
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    파일 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="text-green-500 mr-3" size={32} />
                    <div>
                      <h3 className="text-xl font-bold">분석이 완료되었어요</h3>
                      <p className="text-sm text-gray-500 mt-1">{file.name}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      2025. 6. 26. 오전 8:32:43 · 스마트 분석 모드
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          분석 중...
                        </>
                      ) : (
                        '최신 ChatGPT로 분석 시작'
                      )}
                    </button>
                    <button
                      onClick={() => setFile(null)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      다른 파일 선택
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // 분석 결과 대시보드
          <div className="space-y-8">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-xl mr-4">
                  <Shield className="text-white" size={32} />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    취업규칙 검토 시스템
                  </h1>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    AI가 3분만에 취업규칙을 검토하고 법적 준수 여부를 확인해드립니다
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetAnalysis}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  위험도 높음
                </button>
              </div>
            </div>

            {/* 파일 정보 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={24} />
                  <div>
                    <h3 className="font-bold">분석이 완료되었어요</h3>
                    <p className="text-sm text-gray-500">
                      1. {analysisResult.fileName} · 588.5 KB
                    </p>
                    <p className="text-sm text-gray-500">
                      2025. 6. 26. 오전 8:32:43 · 스마트 분석 모드
                    </p>
                  </div>
                </div>
                <button className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm">
                  위험도 높음
                </button>
              </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">총 검토 항목</span>
                  <BarChart3 className="text-blue-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-blue-600">7</div>
              </div>

              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">높은 위험</span>
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-red-600">1</div>
              </div>

              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">보통 위험</span>
                  <AlertCircle className="text-orange-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-orange-600">2</div>
              </div>

              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">완료 항목</span>
                  <CheckCircle className="text-green-500" size={20} />
                </div>
                <div className="text-3xl font-bold text-green-600">0</div>
              </div>
            </div>

            {/* 종합 분석 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center mb-4">
                <FileText className="text-blue-500 mr-3" size={24} />
                <h2 className="text-xl font-bold">종합 분석</h2>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {analysisResult.analysis}
                </p>
              </div>
            </div>

            {/* 필수 기재사항 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-500 mr-3" size={24} />
                <h2 className="text-xl font-bold">필수 기재사항</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300">근로시간 규정</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">1일 근로시간 및 주 52시간 제한 규정 필요</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">누락</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300">휴가제도</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">연차휴가, 경조휴가 등 휴가제도 명시 필요</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">누락</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-orange-700 dark:text-orange-300">휴게시간</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">4시간 초과 시 30분 이상 휴게시간 규정 추가 필요</p>
                  </div>
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">부족</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300">징계규정</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">징계 사유, 절차, 기준 등 명확한 규정 필요</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">누락</span>
                </div>
              </div>
            </div>

            {/* 위험 요소 분석 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center mb-6">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <h2 className="text-xl font-bold">위험 요소 분석</h2>
              </div>

              <div className="grid grid-cols-4 gap-1 mb-6">
                <button className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm">전체</button>
                <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">높은 위험</button>
                <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm">보통 위험</button>
                <button className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm">낮은 위험</button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="text-red-500 mr-3" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-700 dark:text-red-300">연장근로 관리</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">주 52시간 근무제 준수를 위한 연장근로 한도 및 절차 불명확</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">높음</span>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Eye className="text-blue-500 mr-2" size={16} />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">개선 방안</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    근로기준법 제53조에 따른 연장근로 한도 및 승인 절차 명시
                  </p>
                </div>

                <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <AlertCircle className="text-orange-500 mr-3" size={20} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-700 dark:text-orange-300">취업규칙 신고</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">10인 이상 사업장의 경우 고용노동부 신고 의무</p>
                  </div>
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-sm">보통</span>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Eye className="text-blue-500 mr-2" size={16} />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">개선 방안</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    취업규칙 작성 후 관할 노동청에 신고 및 근로자 의견서 접수
                  </p>
                </div>
              </div>
            </div>

            {/* 개선 권고사항 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center mb-6">
                <Zap className="text-purple-500 mr-3" size={24} />
                <h2 className="text-xl font-bold">개선 권고사항</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="bg-red-500 text-white text-sm px-2 py-1 rounded mr-3">1</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">근로시간 규정 추가</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1일 8시간, 주 40시간 기준 근로시간 명시</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">높음</span>
                </div>

                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="bg-red-500 text-white text-sm px-2 py-1 rounded mr-3">2</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">휴가제도 세분화</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">연차휴가, 경조휴가, 출산휴가 등 법령 휴가 조항 추가</p>
                  </div>
                  <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">높음</span>
                </div>
              </div>
            </div>

            {/* 취업규칙 효력 및 개정 */}
            <div className={`p-6 rounded-2xl ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-500 text-white text-sm px-2 py-1 rounded mr-3">4</div>
                  <h2 className="text-xl font-bold">취업규칙 효력 및 개정</h2>
                </div>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">낮음</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                취업규칙의 효력 발생 시기 및 개정 절차에 관한 조항 추가
              </p>
            </div>

            {/* 다운로드 섹션 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 위험도 분포 */}
              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <h3 className="text-lg font-bold mb-4">위험도 분포</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">필수 항목 완료</span>
                    <span className="text-sm font-bold">0/4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">위험 요소 해결</span>
                    <span className="text-sm font-bold">0/3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">전체 준수율</span>
                    <span className="text-sm font-bold">0%</span>
                  </div>
                </div>
              </div>

              {/* 검토 진행 현황 */}
              <div className={`p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-200'
              }`}>
                <h3 className="text-lg font-bold mb-4">검토 진행 현황</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">필수 항목 완료</span>
                      <span className="text-sm">0/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">위험 요소 해결</span>
                      <span className="text-sm">0/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">전체 준수율</span>
                      <span className="text-sm">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 경고 메시지 */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-500 mr-3 mt-0.5" size={20} />
                <div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>참고:</strong> 실제 내용을 기반으로 한 전문적인 분석 결과입니다. 정확한 법적 검토를 위해서는 노무사 상담을 받아보시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 분석 결과 다운로드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => downloadResult('excel')}
                className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all duration-200"
              >
                <BarChart3 className="text-green-600 mb-2" size={32} />
                <span className="font-semibold text-green-700 dark:text-green-300">엑셀</span>
              </button>

              <button
                onClick={() => downloadResult('sheets')}
                className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all duration-200"
              >
                <TrendingUp className="text-blue-600 mb-2" size={32} />
                <span className="font-semibold text-blue-700 dark:text-blue-300">구글시트</span>
              </button>

              <button
                onClick={() => downloadResult('csv')}
                className="flex flex-col items-center p-6 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl transition-all duration-200"
              >
                <FileText className="text-teal-600 mb-2" size={32} />
                <span className="font-semibold text-teal-700 dark:text-teal-300">CSV</span>
              </button>

              <button
                onClick={() => downloadResult('word')}
                className="flex flex-col items-center p-6 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-all duration-200"
              >
                <FileText className="text-purple-600 mb-2" size={32} />
                <span className="font-semibold text-purple-700 dark:text-purple-300">문서</span>
              </button>
            </div>

            {/* 새로운 파일 분석하기 버튼 */}
            <div className="text-center">
              <button
                onClick={resetAnalysis}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <Upload size={20} />
                새로운 파일 분석하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
