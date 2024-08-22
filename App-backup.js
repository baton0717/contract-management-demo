import React, { useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import logo from './assets/images/doosan2.png';

const NavBar = () => {
  return (
    <div className="flex items-center justify-between p-4" style={{ backgroundColor: '#0861B5' }}>
      <img src={logo} alt="Doosan Logo" className="h-8" />
      <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">
        권한신청
      </button>
    </div>
  );
};

const LoginPage = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-3xl font-bold mb-6">Doosan Digital Innovation AI Contract Solution</h1>
    <button onClick={onLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
      로그인
    </button>
  </div>
);

const Dashboard = ({ recentProjects }) => {
  const data = {
    labels: ['8/15', '8/16', '8/17', '8/18', '8/19', '8/20', '8/21'],
    datasets: [
      {
        label: '날짜별 접속자 수',
        data: [150, 200, 170, 220, 210, 230, 250],
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
      {
        label: 'AI 솔루션 계약서 검토 횟수',
        data: [30, 40, 35, 45, 50, 60, 70],
        fill: false,
        backgroundColor: 'green',
        borderColor: 'green',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">대시보드</h2>
      <div className="mb-8">
        <Line data={data} options={options} />
      </div>
      <h3 className="text-xl font-semibold mb-4">최근 업로드된 프로젝트</h3>
      <ul>
        {recentProjects.map((project) => (
          <li key={project.id} className="mb-2">
            {project.name} - {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProjectList = ({ projects = [], onProjectClick, onLoadNewProject, newProjects = [], uploadedFiles, handleFileUpload, handleFileDownload }) => {
  const [showNewProjects, setShowNewProjects] = useState(false);

  const handleLoadNewProject = useCallback((project) => {
    onLoadNewProject(project);
    setShowNewProjects(false);
  }, [onLoadNewProject]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">프로젝트 목록</h2>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">프로젝트명</th>
            <th className="border border-gray-300 p-2">설명</th>
            <th className="border border-gray-300 p-2">액션</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{project.name}</td>
              <td className="border border-gray-300 p-2">{project.description}</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="file"
                  multiple
                  onChange={(event) => handleFileUpload(project.id, event)}
                  className="mb-2"
                />
                {uploadedFiles[project.id] && uploadedFiles[project.id].length > 0 && (
                  <div className="mb-2">
                    {uploadedFiles[project.id].map((file, index) => (
                      <div key={index}>
                        <a
                          href="#"
                          onClick={() => handleFileDownload(file)}
                          className="text-blue-500 hover:underline"
                        >
                          {file.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {uploadedFiles[project.id] && uploadedFiles[project.id].length > 0 && (
                  <button
                    onClick={() => onProjectClick(project)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    AI 체크리스트 검토
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => setShowNewProjects(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        신규 프로젝트 불러오기
      </button>
      {showNewProjects && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">신규 프로젝트 목록</h3>
            {newProjects.length > 0 ? (
              <ul>
                {newProjects.map((project) => (
                  <li key={project.id} className="mb-2">
                    <button
                      onClick={() => handleLoadNewProject(project)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      <span className="font-semibold">{project.name}</span>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>불러올 수 있는 신규 프로젝트가 없습니다.</p>
            )}
            <button
              onClick={() => setShowNewProjects(false)}
              className="mt-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AIChecklist = ({ project }) => {
  const checklistItems = [
    {
      category: '기본사항',
      items: [
        { name: '계약대상 업체명', result: 'PASS', comments: '' },
        { name: '계약대상 대표자', result: 'FAIL', comments: '' },
        { name: '계약대상 주소', result: '검토 필요', comments: '' },
        { name: '계약목적', result: 'PASS', comments: '' },
        { name: '계약조건', result: 'PASS', comments: '' },
        { name: '계약의무', result: '검토 필요', comments: '' },
        { name: '계약기간', result: 'FAIL', comments: '' },
        { name: '계약일', result: 'PASS', comments: '' },
        { name: '계약금액', result: 'PASS', comments: '' },
        { name: '대금지급', result: '검토 필요', comments: '' },
        { name: '대금지급시기', result: 'PASS', comments: '' },
        { name: '대금지급 방법', result: 'PASS', comments: '' },
      ],
    },
    {
      category: '보증',
      items: [
        { name: '선급금이행보증', result: 'PASS', comments: '' },
        { name: '계약이행보증', result: 'FAIL', comments: '' },
        { name: '하자이행보증', result: '검토 필요', comments: '' },
      ],
    },
    {
      category: '무상 하자보증 기간',
      items: [{ name: '무상 하자보증 기간', result: '검토 필요', comments: '' }],
    },
    {
      category: '계약의 변경',
      items: [
        { name: '계약변경', result: 'PASS', comments: '' },
        { name: '계약변경 사유', result: 'PASS', comments: '' },
        { name: '계약변경 절차', result: 'FAIL', comments: '' },
        { name: '계약기간 변경', result: '검토 필요', comments: '' },
        { name: '계약금액 변경', result: 'PASS', comments: '' },
        { name: '손해배상청구 불가 규정', result: 'PASS', comments: '' },
      ],
    },
    {
      category: '과업착수',
      items: [{ name: '수행계획서 자동 승인 기간', result: 'PASS', comments: '' }],
    },
    {
      category: '원시자료',
      items: [{ name: '원시자료의 정확성 의무', result: 'FAIL', comments: '' }],
    },
    {
      category: '작업장소',
      items: [{ name: '작업장소 지정 불가', result: '검토 필요', comments: '' }],
    },
    {
      category: '납기 및 납품',
      items: [
        { name: '납기절차', result: 'PASS', comments: '' },
        { name: '납품절차', result: 'FAIL', comments: '' },
      ],
    },
    {
      category: '지체상금',
      items: [
        { name: '지체상금 예외 규정', result: 'PASS', comments: '' },
        { name: '지체상금 지급 규정', result: '검토 필요', comments: '' },
        { name: '지체상금 비율', result: 'FAIL', comments: '' },
        { name: '지체상금 상한', result: 'PASS', comments: '' },
      ],
    },
    {
      category: '수령, 검사 및 인수',
      items: [
        { name: '산출물 검사 기준 정의', result: 'PASS', comments: '' },
        { name: '검사결과 통보기한', result: 'FAIL', comments: '' },
      ],
    },
  ];

  const [checklist, setChecklist] = useState(checklistItems);

  const handleCommentChange = (categoryIndex, itemIndex, value) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[categoryIndex].items[itemIndex].comments = value;
    setChecklist(updatedChecklist);
  };

  const handleReviewComplete = () => {
    alert('최종 검토가 완료되었습니다.');
  };

  const handlePdfDownload = () => {
    alert('PDF 다운로드 기능은 아직 구현되지 않았습니다.');
  };

  if (!project) {
    return <div className="p-4">프로젝트를 선택해주세요.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">AI 체크리스트 - {project.name}</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-center">대분류</th>
            <th className="border border-gray-300 p-2 text-center">세부 항목</th>
            <th className="border border-gray-300 p-2 text-center">검토 결과</th>
            <th className="border border-gray-300 p-2 text-center">의견 작성</th>
          </tr>
        </thead>
        <tbody>
          {checklist.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              {category.items.map((item, itemIndex) => (
                <tr key={itemIndex} style={{ backgroundColor: categoryIndex % 2 === 0 ? '#f9fafb' : '#f3f4f6' }}>
                  {itemIndex === 0 && (
                    <td
                      className="border border-gray-300 p-2 text-center font-semibold"
                      rowSpan={category.items.length}
                      style={{ backgroundColor: categoryIndex % 2 === 0 ? '#e5e7eb' : '#d1d5db' }}
                    >
                      {category.category}
                    </td>
                  )}
                  <td className="border border-gray-300 p-2 text-center">{item.name}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded ${
                        item.result === 'PASS'
                          ? 'bg-green-200 text-green-800'
                          : item.result === 'FAIL'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {item.result}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="text"
                      value={item.comments}
                      onChange={(e) =>
                        handleCommentChange(categoryIndex, itemIndex, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-1"
                      placeholder="의견을 작성하세요"
                    />
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleReviewComplete}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          최종 검토 완료
        </button>
        <button
          onClick={handlePdfDownload}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          PDF 다운로드
        </button>
      </div>
    </div>
  );
};

const ContractManagementDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [projects, setProjects] = useState([
    { id: 1, name: '프로젝트 A', description: 'AI 기반 고객 서비스 개선' },
    { id: 2, name: '프로젝트 B', description: '데이터 분석 플랫폼 구축' },
  ]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjects, setNewProjects] = useState([
    { id: 'new1', name: '신규 프로젝트 A', description: '새로운 AI 기반 솔루션 개발' },
    { id: 'new2', name: '신규 프로젝트 B', description: '기존 시스템 업그레이드' },
    { id: 'new3', name: '신규 프로젝트 C', description: '클라우드 마이그레이션' },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleLogin = useCallback(() => setIsLoggedIn(true), []);
  
  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setCurrentPage('ai-checklist');
  }, []);

  const handleLoadNewProject = useCallback((newProject) => {
    setProjects(prevProjects => [...prevProjects, { ...newProject, id: prevProjects.length + 1 }]);
    setNewProjects(prevNewProjects => prevNewProjects.filter(project => project.id !== newProject.id));
  }, []);

  const handleFileUpload = useCallback((projectId, event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadedFiles(prevFiles => ({
        ...prevFiles,
        [projectId]: [...(prevFiles[projectId] || []), ...files],
      }));
    }
  }, []);

  const handleFileDownload = useCallback((file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const renderContent = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard recentProjects={projects.slice(-3)} />;
      case 'projects':
        return (
          <ProjectList 
            projects={projects} 
            onProjectClick={handleProjectClick}
            onLoadNewProject={handleLoadNewProject}
            newProjects={newProjects}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            handleFileDownload={handleFileDownload}
          />
        );
      case 'ai-checklist':
        return <AIChecklist project={selectedProject} />;
      default:
        return <Dashboard />;
    }
  }, [currentPage, projects, handleProjectClick, handleLoadNewProject, newProjects, selectedProject, uploadedFiles, handleFileUpload, handleFileDownload]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div>
      <NavBar /> {/* 상단 바 추가 */}
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold mb-6">계약 관리 시스템</h1>
          <nav>
            <ul>
              <li className="mb-2">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`w-full text-left p-2 rounded ${
                    currentPage === 'dashboard' ? 'bg-blue-500' : 'hover:bg-gray-700'
                  }`}
                >
                  대시보드
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={() => {
                    setCurrentPage('projects');
                    setSelectedProject(null);
                  }}
                  className={`w-full text-left p-2 rounded ${
                    currentPage === 'projects' ? 'bg-blue-500' : 'hover:bg-gray-700'
                  }`}
                >
                  프로젝트 목록
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ContractManagementDemo;
