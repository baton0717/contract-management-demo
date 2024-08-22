import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';  
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import logo from './assets/images/doosan2.png';  // 로고 이미지 경로 수정

const generateProjectCode = (id) => {
  return `DS${String(id).padStart(6, '0')}`;
};

// Navigation 바
const NavBar = () => {
  return (
    <div className="flex items-center justify-between p-4 shadow-lg" style={{ backgroundColor: '#0861B5', opacity: 0.95 }}>
      <img src={logo} alt="Doosan Logo" className="h-10" />
      <button className="bg-white text-black px-4 py-2 rounded-full shadow-md hover:bg-gray-300 transition ease-in-out duration-300">
        권한신청
      </button>
    </div>
  );
};

// Login 페이지
const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
      <h1 className="text-4xl font-extrabold mb-6">Doosan Digital Innovation AI Contract Solution</h1>
      <div className="flex flex-col space-y-4">
        <input 
          type="text" 
          placeholder="ID" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          className="p-2 rounded-md text-black bg-white"
        />
        <input 
          type="password" 
          placeholder="PW" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="p-2 rounded-md text-black bg-white"
        />
        <button 
          onClick={onLogin} 
          className="bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-300 transition ease-in-out duration-300"
        >
          로그인
        </button>
        <button 
          onClick={() => navigate('/signup')} 
          className="bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-300 transition ease-in-out duration-300"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

// 회원가입 페이지
const SignUpPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log('가입정보:', { id, password, name });
    navigate('/', { state: { userName: name } });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">회원가입</h1>
      <input 
        type="text" 
        placeholder="이름" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input 
        type="text" 
        placeholder="Doosan AD 계정" 
        value={id} 
        onChange={(e) => setId(e.target.value)} 
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input 
        type="password" 
        placeholder="비밀번호" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="mb-6 p-2 border border-gray-300 rounded-md"
      />
      <button 
        onClick={handleSignUp} 
        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
      >
        가입하기
      </button>
    </div>
  );
};

// 권한 신청 페이지
const PermissionRequestPage = () => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const navigate = useNavigate();

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prevPermissions) => 
      prevPermissions.includes(permission) 
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  const handleSubmit = () => {
    console.log('신청한 권한:', selectedPermissions);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">권한 신청</h2>
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">신청할 권한을 선택하세요:</label>
        <div className="space-y-4">
          <label>
            <input 
              type="checkbox" 
              checked={selectedPermissions.includes('관리자')} 
              onChange={() => handlePermissionChange('관리자')} 
            />
            <span className="ml-2">관리자 권한</span>
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={selectedPermissions.includes('편집자')} 
              onChange={() => handlePermissionChange('편집자')} 
            />
            <span className="ml-2">편집자 권한</span>
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={selectedPermissions.includes('뷰어')} 
              onChange={() => handlePermissionChange('뷰어')} 
            />
            <span className="ml-2">뷰어 권한</span>
          </label>
        </div>
      </div>
      <div className="flex space-x-4">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-700 transition ease-in-out duration-300"
        >
          뒤로가기
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
        >
          권한 신청하기
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ projects }) => {
  const numReviewing = projects.filter(p => p.status === '검토중').length;
  const numReviewed = projects.filter(p => p.status === '검토 완료').length;
  const numNotReviewed = projects.filter(p => p.status === '미검토').length;

  const projectStatusData = {
    labels: ['검토중', '검토 완료', '미검토'],
    datasets: [
      {
        data: [numReviewing, numReviewed, numNotReviewed],
        backgroundColor: ['#f97316', '#10b981', '#ef4444'],
      },
    ],
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">대시보드</h2>
      <div className="p-6 bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4 col-span-1 md:col-span-2">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">프로젝트 상태</h3>
          <div className="w-40 h-40">
            <Pie data={projectStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">검토중</h3>
          <div className="w-40 h-40">
            <Pie data={{ ...projectStatusData, datasets: [{ data: [numReviewing, numReviewed + numNotReviewed], backgroundColor: ['#f97316', '#e5e7eb'] }] }} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">검토 완료</h3>
          <div className="w-40 h-40">
            <Pie data={{ ...projectStatusData, datasets: [{ data: [numReviewed, numReviewing + numNotReviewed], backgroundColor: ['#10b981', '#e5e7eb'] }] }} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800 mt-8">최근 업로드된 프로젝트</h3>
      <ul>
        {projects
          .slice()
          .sort((a, b) => b.uploadDate - a.uploadDate)
          .slice(0, 10)
          .map((project) => (
            <li key={project.id} className="mb-2">
              <div className="flex justify-between">
                <a href="#" onClick={() => window.location.href=`/ai-checklist/${project.id}`} className="text-blue-500 hover:underline">
                  {generateProjectCode(project.id)} - {project.name} - {project.description}
                </a>
                <span className={`font-semibold ${
                  project.status === '최종검토 완료'
                    ? 'text-green-600'
                    : project.status === '검토중'
                    ? 'text-yellow-600'
                    : project.status === '검토대기'
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}>
                  {project.status}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

const AIChecklist = ({ project, onComplete, setProjects }) => {
  const initialChecklistItems = [
    {
      category: '기본사항',
      items: [
        { name: '계약대상 업체명', result: 'PASS', comments: [], isChecked: false, currentComment: '' },
        { name: '계약대상 대표자', result: 'FAIL', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약대상 주소', result: '검토 필요', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약목적', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약조건', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약의무', result: '검토 필요', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약기간', result: 'FAIL', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약일', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
        { name: '계약금액', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
        { name: '대금지급', result: '검토 필요', comments: [], isChecked: false, currentComment: ''  },
        { name: '대금지급시기', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
        { name: '대금지급 방법', result: 'PASS', comments: [], isChecked: false, currentComment: ''  },
      ],
    },
    {
      category: '보증',
      items: [
        { name: '선급금이행보증', result: 'PASS', comments: [], isChecked: false, currentComment: '' },
        { name: '계약이행보증', result: 'FAIL', comments: [], isChecked: false, currentComment: '' },
        { name: '하자이행보증', result: '검토 필요', comments: [], isChecked: false, currentComment: '' },
      ],
    },
    // 추가 카테고리들...
  ];

  const [checklist, setChecklist] = useState(initialChecklistItems);
  const [isReviewComplete, setIsReviewComplete] = useState(project.isComplete || false);
  const [isPdfReady, setIsPdfReady] = useState(project.isComplete || false);
  const [allChecked, setAllChecked] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const allItemsChecked = checklist.every(category =>
      category.items.every(item => item.isChecked)
    );
    setAllChecked(allItemsChecked);
  }, [checklist]);

  const handleCommentChange = (e, categoryIndex, itemIndex) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[categoryIndex].items[itemIndex].currentComment = e.target.value;
    setChecklist(updatedChecklist);
  };

  const handleCommentKeyDown = (e, categoryIndex, itemIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter 키로 줄 바꿈을 방지
      handleAddComment(categoryIndex, itemIndex);
    }
  };

  const handleAddComment = (categoryIndex, itemIndex) => {
    const currentComment = checklist[categoryIndex].items[itemIndex].currentComment.trim();
    if (currentComment === '') return;

    const updatedChecklist = [...checklist];
    const timestamp = new Date().toLocaleString();
    const newComment = {
      text: currentComment,
      author: '작성자', // 필요에 따라 작성자 이름을 동적으로 설정
      time: timestamp,
    };
    updatedChecklist[categoryIndex].items[itemIndex].comments.unshift(newComment);
    updatedChecklist[categoryIndex].items[itemIndex].currentComment = ''; // 입력 후 입력란 초기화
    setChecklist(updatedChecklist);
  };

  const handleCheckboxChange = (categoryIndex, itemIndex) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[categoryIndex].items[itemIndex].isChecked = !updatedChecklist[categoryIndex].items[itemIndex].isChecked;
    setChecklist(updatedChecklist);
  };

  const handleReviewComplete = () => {
    if (allChecked) {
      setIsReviewComplete(true);
      setIsPdfReady(true);
      onComplete(project.id); // 최종 검토 완료 시 상태를 업데이트
    }
  };

  const handleReviewCancel = () => {
    setIsReviewComplete(false);
    setIsPdfReady(false);
  };

  const handlePdfDownload = () => {
    const input = contentRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`AIChecklist_${project.name}.pdf`);
      });
    } else {
      console.error("PDF 생성에 필요한 DOM 요소를 찾을 수 없습니다.");
    }
  };

  const handleExcelDownload = () => {
    const workbook = XLSX.utils.book_new();
    checklist.forEach((category) => {
      const worksheetData = category.items.map(item => ({
        '항목': item.name,
        '검토 결과': item.result,
        '의견': item.comments.map(c => `${c.author}: ${c.text}`).join('; '),
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, category.category);
    });
    XLSX.writeFile(workbook, `AIChecklist_${project.name}.xlsx`);
  };

  const handleSelectAll = (e) => {
    const updatedChecklist = [...checklist];
    updatedChecklist.forEach(category => {
      category.items.forEach(item => {
        item.isChecked = e.target.checked;
      });
    });
    setChecklist(updatedChecklist);
  };

  if (!project) {
    return <div className="p-4">프로젝트를 선택해주세요.</div>;
  }

   return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">AI 체크리스트 - {project.name}</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={handleSelectAll}
              disabled={isReviewComplete}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 font-medium">전체 확인 완료</span>
          </label>
        </div>
      </div>
      <div ref={contentRef}>
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-center font-semibold text-gray-700">대분류</th>
              <th className="p-4 text-center font-semibold text-gray-700">세부 항목</th>
              <th className="p-4 text-center font-semibold text-gray-700">검토 결과</th>
              <th className="p-4 text-center font-semibold text-gray-700">의견 작성</th>
              <th className="p-4 text-center font-semibold text-gray-700">확인 완료</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {checklist.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {category.items.map((item, itemIndex) => (
                  <tr key={itemIndex} className="bg-white">
                    {itemIndex === 0 && (
                      <>
                        <td
                          className="p-4 text-center font-semibold bg-gray-100"
                          rowSpan={category.items.length}
                        >
                          {category.category}
                        </td>
                      </>
                    )}
                    <td className="p-4 text-center">{item.name}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
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
                    <td className="p-4 text-center">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item.currentComment}
                          onChange={(e) => handleCommentChange(e, categoryIndex, itemIndex)}
                          onKeyDown={(e) => handleCommentKeyDown(e, categoryIndex, itemIndex)}
                          className="w-full border border-gray-300 rounded-full p-2"
                          placeholder="의견을 작성하세요"
                          disabled={isReviewComplete}
                        />
                        <button
                          onClick={() => handleAddComment(categoryIndex, itemIndex)}
                          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
                          style={{ minWidth: '80px' }}
                          disabled={isReviewComplete}
                        >
                          입력
                        </button>
                      </div>
                      <div className="mt-2 space-y-1">
                        {item.comments.map((comment, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span className="text-left">{comment.text}</span>
                            <span className="text-right">
                              <span className="font-semibold">{comment.author}</span> -{' '}
                              <span className="text-xs">{comment.time}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleCheckboxChange(categoryIndex, itemIndex)}
                        disabled={isReviewComplete}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end space-x-4">
        {isReviewComplete ? (
          <button
            onClick={handleReviewCancel}
            className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition ease-in-out duration-300"
          >
            검토 취소
          </button>
        ) : (
          <button
            onClick={handleReviewComplete}
            className={`bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition ease-in-out duration-300 ${
              allChecked ? 'hover:bg-blue-700' : 'cursor-not-allowed'
            }`}
            disabled={!allChecked}
          >
            최종 검토 완료
          </button>
        )}
        <button
          onClick={handlePdfDownload}
          className={`px-6 py-3 rounded-full shadow-lg transition ease-in-out duration-300 ${
            isPdfReady
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          disabled={!isPdfReady}
        >
          PDF 다운로드
        </button>
        <button
          onClick={handleExcelDownload}
          className={`px-6 py-3 rounded-full shadow-lg transition ease-in-out duration-300 ${
            isPdfReady
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
          disabled={!isPdfReady}
        >
          Excel 다운로드
        </button>
      </div>
    </>
  );
};

const ProjectList = ({ projects = [], onProjectClick, onLoadNewProject, newProjects = [], uploadedFiles, handleFileUpload, handleFileDownload }) => {
  const [showNewProjects, setShowNewProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('projectCode'); // 초기 검색 필드는 '프로젝트 코드'
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
  const [currentSearchPage, setCurrentSearchPage] = useState(1); // 검색 결과의 현재 페이지 상태
  const itemsPerPage = 5; // 페이지당 5개의 항목 표시

  // 검색 창 초기화 및 열기
  const handleOpenNewProjects = () => {
    setSearchQuery('');
    setSearchField('projectCode');
    setFilteredProjects([]);
    setShowNewProjects(true);
    setCurrentSearchPage(1);
  };

  // 검색 처리 함수
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert('검색어를 넣어주세요');
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = newProjects.filter((project) => {
      const inProjectList = projects.some(p => p.id === project.id);
      if (inProjectList) return false;

      switch (searchField) {
        case 'projectCode':
          return project.id.toLowerCase().includes(query);
        case 'projectName':
          return project.name.toLowerCase().includes(query);
        case 'projectManager':
          return (project.manager || '').toLowerCase().includes(query);
        case 'contractCompany':
          return (project.contractCompany || '').toLowerCase().includes(query);
        default:
          return false;
      }
    });
    setFilteredProjects(filtered);
    setCurrentSearchPage(1);
  };

  // Enter 키를 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLoadNewProject = useCallback((project) => {
    onLoadNewProject(project);
    setShowNewProjects(false);
  }, [onLoadNewProject]);

  const generateProjectCode = (id) => {
    return id; // 이미 프로젝트에 고정된 코드가 있다고 가정합니다.
  };

  const sortedProjects = projects
    .slice()
    .sort((a, b) => b.uploadDate - a.uploadDate); // 최근 추가된 프로젝트가 가장 위로 오도록 정렬

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage); // 전체 페이지 수 계산
  const totalSearchPages = Math.ceil(filteredProjects.length / itemsPerPage); // 검색 결과의 전체 페이지 수 계산

  const handleChangePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChangeSearchPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalSearchPages) {
      setCurrentSearchPage(pageNumber);
    }
  };

  const handleFileUploadProjectList = (projectId, event) => {
    handleFileUpload(projectId, event);
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, status: '검토대기' } : project
    );
    setFilteredProjects(updatedProjects); // 필터링된 목록에도 적용
  };

  const handleAIReviewClick = (project) => {
    const updatedProjects = projects.map((p) =>
      p.id === project.id ? { ...p, status: '검토중' } : p
    );
    onProjectClick({ ...project, status: '검토중' });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">프로젝트 목록</h2>
        <button
          onClick={handleOpenNewProjects}
          className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition ease-in-out duration-300"
        >
          신규 프로젝트 불러오기
        </button>
      </div>
      <div className="overflow-hidden border border-gray-300 rounded-md" style={{ minHeight: '400px' }}> {/* 프레임 설정 */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left font-semibold text-gray-700">프로젝트 코드</th>
              <th className="p-4 text-left font-semibold text-gray-700">프로젝트명</th>
              <th className="p-4 text-left font-semibold text-gray-700">설명</th>
              <th className="p-4 text-left font-semibold text-gray-700">상태</th>
              <th className="p-4 text-left font-semibold text-gray-700">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProjects
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((project) => (
                <tr key={project.id} className="bg-white hover:bg-gray-50 transition ease-in-out duration-300">
                  <td className="p-4">{generateProjectCode(project.id)}</td>
                  <td className="p-4">{project.name}</td>
                  <td className="p-4">{project.description}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${
                      project.status === '최종검토 완료'
                        ? 'text-green-600'
                        : project.status === '검토중'
                        ? 'text-yellow-600'
                        : project.status === '검토대기'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <input
                      type="file"
                      multiple
                      onChange={(event) => handleFileUploadProjectList(project.id, event)}
                      className="mb-2"
                    />
                    {uploadedFiles[project.id] && uploadedFiles[project.id].length > 0 && (
                      <div className="mb-2">
                        {uploadedFiles[project.id].map((file, index) => (
                          <div key={index}>
                            <a
                              href="#"
                              onClick={() => handleFileDownload(file)}
                              className="text-blue-600 hover:underline"
                            >
                              {file.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    {uploadedFiles[project.id] && uploadedFiles[project.id].length > 0 && (
                      <button
                        onClick={() => handleAIReviewClick(project)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition ease-in-out duration-300"
                      >
                        AI 체크리스트 검토
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {sortedProjects.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-600">프로젝트가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handleChangePage(currentPage - 1)} // 이전 페이지로 이동
          disabled={currentPage === 1}
          className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
        >
          이전
        </button>
        <span className="text-gray-600">{currentPage} / {totalPages}</span> {/* 페이지 번호 표시 */}
        <button
          onClick={() => handleChangePage(currentPage + 1)} // 다음 페이지로 이동
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
        >
          다음
        </button>
      </div>
      {showNewProjects && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">신규 프로젝트 검색</h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">검색 방법:</label>
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="projectCode">프로젝트 코드</option>
                <option value="projectName">프로젝트 명</option>
                <option value="projectManager">프로젝트 담당자</option>
                <option value="contractCompany">계약 업체</option>
              </select>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition ease-in-out duration-300 mb-4"
            >
              검색
            </button>
            <ul className="space-y-2">
              {filteredProjects
                .slice((currentSearchPage - 1) * itemsPerPage, currentSearchPage * itemsPerPage)
                .map((project, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition ease-in-out duration-300">
                    <button
                      onClick={() => handleLoadNewProject(project)}
                      className="w-full text-left"
                    >
                      <span className="font-semibold text-gray-800">{project.id} - {project.name}</span>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </button>
                  </li>
                ))}
              {filteredProjects.length === 0 && (
                <p className="text-center text-gray-600">검색 결과가 없습니다.</p>
              )}
            </ul>
            {filteredProjects.length > itemsPerPage && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleChangeSearchPage(currentSearchPage - 1)}
                  disabled={currentSearchPage === 1}
                  className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
                >
                  이전
                </button>
                <span className="text-gray-600">{currentSearchPage} / {totalSearchPages}</span>
                <button
                  onClick={() => handleChangeSearchPage(currentSearchPage + 1)}
                  disabled={currentSearchPage === totalSearchPages}
                  className="bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300"
                >
                  다음
                </button>
              </div>
            )}
            <button
              onClick={() => setShowNewProjects(false)}
              className="mt-4 bg-gray-300 text-black px-4 py-2 rounded-full hover:bg-gray-400 transition ease-in-out duration-300 w-full"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ContractManagementDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [projects, setProjects] = useState([
    { id: 'DS000001', name: '프로젝트 A', description: 'AI 기반 고객 서비스 개선', status: '검토중', uploadDate: new Date('2024-08-20'), isComplete: false },
    { id: 'DS000002', name: '프로젝트 B', description: '데이터 분석 플랫폼 구축', status: '검토대기', uploadDate: new Date('2024-08-18'), isComplete: false },
    { id: 'DS000003', name: '프로젝트 C', description: '클라우드 마이그레이션 프로젝트', status: '최종검토 완료', uploadDate: new Date('2024-08-19'), isComplete: true },
  ]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjects, setNewProjects] = useState([
    { id: 'DS000021', name: '신규 프로젝트 A', description: '새로운 AI 기반 솔루션 개발' },
    { id: 'DS000022', name: '신규 프로젝트 B', description: '기존 시스템 업그레이드' },
    { id: 'DS000003', name: '신규 프로젝트 C', description: '클라우드 마이그레이션' },
    { id: 'DS000004', name: '신규 프로젝트 D', description: '고객 관리 시스템 개선' },
    { id: 'DS000005', name: '신규 프로젝트 E', description: '데이터 시각화 툴 개발' },
    { id: 'DS000006', name: '신규 프로젝트 F', description: '사내 교육 플랫폼 구축' },
    { id: 'DS000007', name: '신규 프로젝트 G', description: '이커머스 플랫폼 업그레이드' },
    { id: 'DS000008', name: '신규 프로젝트 H', description: '보안 시스템 강화' },
    { id: 'DS000009', name: '신규 프로젝트 I', description: '인공지능 고객 서비스 도입' },
    { id: 'DS000010', name: '신규 프로젝트 J', description: '클라우드 기반 백업 솔루션' },
    { id: 'DS000011', name: '신규 프로젝트 K', description: '자동화 시스템 개발' },
    { id: 'DS000012', name: '신규 프로젝트 L', description: '빅데이터 분석 시스템 구축' },
    { id: 'DS000013', name: '신규 프로젝트 M', description: '데이터 웨어하우스 구축' },
    { id: 'DS000014', name: '신규 프로젝트 N', description: '모바일 앱 개발' },
    { id: 'DS000015', name: '신규 프로젝트 O', description: '스마트 팩토리 구축' },
    { id: 'DS000016', name: '신규 프로젝트 P', description: 'AI 기반 예측 시스템 개발' },
    { id: 'DS000017', name: '신규 프로젝트 Q', description: '마케팅 자동화 시스템 개발' },
    { id: 'DS000018', name: '신규 프로젝트 R', description: '고객 데이터 분석 툴 개발' },
    { id: 'DS000019', name: '신규 프로젝트 S', description: '사물인터넷(IoT) 플랫폼 개발' },
    { id: 'DS000020', name: '신규 프로젝트 T', description: '자동차 자율주행 시스템 개발' },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState({});

  const handleLogin = useCallback(() => setIsLoggedIn(true), []);
  
  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setCurrentPage('ai-checklist');
  }, []);

  const handleLoadNewProject = useCallback((newProject) => {
    setProjects(prevProjects => [
      ...prevProjects,
      {
        ...newProject,
        id: prevProjects.length + 1,
        status: '계약서 업로드 대기중',
        uploadDate: new Date(),
        isComplete: false
      }
    ]);
    setNewProjects(prevNewProjects => prevNewProjects.filter(project => project.id !== newProject.id));
  }, []);

  const handleFileUpload = useCallback((projectId, event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadedFiles(prevFiles => ({
        ...prevFiles,
        [projectId]: [...(prevFiles[projectId] || []), ...files],
      }));
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId ? { ...project, status: '검토대기' } : project
        )
      );
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

  const handleReviewComplete = useCallback((projectId) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? { ...project, status: '최종검토 완료', isComplete: true } : project
      )
    );
    setCurrentPage('projects');
  }, []);

  const renderContent = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard projects={projects} />;
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
          setProjects={setProjects}
          />
        );
      case 'ai-checklist':
        return <AIChecklist project={selectedProject} onComplete={handleReviewComplete} setProjects={setProjects} />; // setProjects 전달
      default:
        return <Dashboard />;
    }
  }, [currentPage, projects, handleProjectClick, handleLoadNewProject, newProjects, selectedProject, uploadedFiles, handleFileUpload, handleFileDownload, handleReviewComplete, setProjects]);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div>
      <NavBar />
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

// 앱 전체 라우팅 설정
// MainApp 컴포넌트
const MainApp = () => {
  const location = useLocation();
  const hideNavBarRoutes = ["/", "/signup"];

  return (
    <>
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/permission" element={<PermissionRequestPage />} />
        <Route path="/" element={<ContractManagementDemo />} />
      </Routes>
    </>
  );
};

// App 컴포넌트
const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};


export default App;
