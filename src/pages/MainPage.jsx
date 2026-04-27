import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getRecipes, deleteRecipe } from "../api/recipes";
import "./MainPage.css"; // CSS 파일 불러오기
import RecipeAddModal from "../components/RecipeAddModal";

const MainPage = () => {
  {
    /*
    JSX : JavaScrirt 안에서 HTML 처럼 작성하는 문법 
    useState : 화면에 보여줄 값을 저장하는 공간
    => const [현재 상태의 변수, 변수값 상태를 바꾸는 함수] = use state(초기값) 
    useEffect : 바뀌는 시점을 찾는 때 사용
    => []이 비어있는 경우 처음에만 실행
    */
  }
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장할 새로운 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [searchParams, setSearchParams] = useSearchParams(); // 주소창의 쿼리 파라미터 관리
  const searchTerm = searchParams.get("query") || ""; // 주소창에서 query 값을 가져옴
  const [Keyword, setKeyword] = useState(searchTerm); // 입력창 상태 (초기값은 주소창의 keyword)
  const [user, setUser] = useState(null); // 로그인한 사용자 정보 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 열림/닫힘 상태 관리
  const [sortOption, setSortOption] = useState("latest_desc"); // 정렬 상태

  // 컴포넌트가 처음 렌더링될 때 localStorage에서 로그인 정보를 확인합니다.
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // 문자열을 다시 객체로 변환하여 저장
    }
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true); // 검색할 때마다 로딩 상태를 보여주기 위해 추가
      try {
        const data = await getRecipes(searchTerm, sortOption);
        setRecipes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [searchTerm, sortOption]); // 검색어나 정렬 조건이 변경될 때마다 실행됨

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 레시피를 삭제하시겠습니까?")) {
      try {
        // 삭제 API 호출 시 현재 로그인한 사용자의 이메일도 함께 전달
        const response = await deleteRecipe(id, user.email);
        if (response.ok) {
          alert("삭제되었습니다.");
          // 삭제 성공 시 화면(state)에서도 해당 레시피를 즉시 제거합니다.
          setRecipes(recipes.filter((recipe) => recipe.id !== id));
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제 중 서버 통신 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // 검색 버튼 클릭 시 주소창의 URL을 변경합니다. (예: /?query=레몬)
    if (Keyword.trim() === "") {
      setSearchParams({}); // 검색어가 없으면 파라미터 삭제
    } else {
      setSearchParams({ query: Keyword }); // 검색어가 있으면 파라미터 추가
    }
    // URL에 쿼리스트링으로 keyword를 저장
  };

  return (
    <div className="main-container">
      {/* 1. 상단 환영 메시지 영역 */}
      <div className="main-header-section">
        {user ? (
          <h2 className="welcome-title">
            🎉 {user.name}님, 어떤 칵테일을 찾아볼까요?
          </h2>
        ) : (
          <h2 className="welcome-title">
            🍸 다양한 칵테일 레시피를 만나보세요!
          </h2>
        )}
      </div>

      {/* 2. 컨트롤 바 영역 (검색, 정렬, 추가 버튼을 하나의 박스로 깔끔하게 그룹화) */}
      <div className="controls-container">
        <form className="search-form" onSubmit={handleSubmit}>
          {/* 왼쪽: 검색창 */}
          <div className="search-wrapper">
            <input
              type="text"
              name="keyword"
              placeholder="원하는 레시피 검색..."
              value={Keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <button className="search-btn" type="submit">
              검색
            </button>
          </div>

          {/* 오른쪽: 정렬 옵션 및 레시피 추가 버튼 */}
          <div className="action-wrapper">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="latest_desc">최신순 (내림차순)</option>
              <option value="latest_asc">최신순 (오름차순)</option>
              <option value="popular">인기순 (좋아요 많은 순)</option>
              <option value="name_asc">이름순 (ㄱ~ㅎ)</option>
              <option value="name_desc">이름순 (ㅎ~ㄱ)</option>
            </select>

            {user && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="add-recipe-btn"
              >
                + 레시피 추가
              </button>
            )}
          </div>
        </form>
      </div>

      {loading && <p>레시피를 불러오는 중...</p>}
      {error && <p>레시피를 불러오는데 오류가 발생했습니다: {error.message}</p>}
      {!loading && !error && (
        <>
          {recipes.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <ul className="recipe-list">
              {recipes.map((recipe) => (
                // key : 리액트가 각 항목을 구분할 때 사용하는 고유값 (목록 출력시)
                <li
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* 이미지가 저장된 경로가 URL이라면 src에 그대로 넣고, 파일명만 있다면 서버 주소를 붙여야 할 수도 있습니다. */}
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="recipe-image"
                    />
                  )}
                  <div className="recipe-content">
                    <h4>{recipe.name}</h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#999",
                        margin: "0 0 10px 0",
                      }}
                    >
                      작성자: {recipe.author_name || "알 수 없음"}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#e84393",
                        fontWeight: "bold",
                        margin: "0 0 10px 0",
                      }}
                    >
                      ❤️ 좋아요 {recipe.like_count || 0}
                    </p>
                    <p>{recipe.description}</p>
                    {/* 현재 로그인한 사용자의 이메일이 관리자 이메일일 때만 삭제 버튼 표시 */}
                    {user && user.email === "admin@cocktail.com" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 카드 클릭(상세 이동) 이벤트가 실행되지 않도록 막음
                          handleDelete(recipe.id);
                        }}
                        className="delete-button"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* isModalOpen이 true일 때만 화면에 모달창을 렌더링합니다. */}
      {isModalOpen && <RecipeAddModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MainPage;
