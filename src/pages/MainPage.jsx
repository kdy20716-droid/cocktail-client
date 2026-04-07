import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
  const [count, setCount] = useState(0); // 기존 카운트 상태
  const [recipes, setRecipes] = useState([]); // 레시피 데이터를 저장할 새로운 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [Keyword, setKeyword] = useState(""); // 네임
  const [searchTerm, setSearchTerm] = useState(""); // 검색 버튼 클릭 시 저장할 검색어

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:4000/recipes");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행됨

  const handleSubmit = (event) => {
    event.preventDefault();

    // 검색 버튼 클릭 시 폼에 입력된 Keyword를 실제 검색어 상태로 설정합니다.
    setSearchTerm(Keyword);
  };

  // 전체 레시피 중 이름(name)에 검색어(searchTerm)가 포함된 레시피만 필터링합니다.
  const filteredRecipes = recipes.filter((recipe) =>
    (recipe.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="keyword"
          placeholder="검색어를 입력하세요"
          value={Keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <input type="submit" value="검색"></input>
        <button>검색</button>
      </form>
      <h3>현재 숫자 : {count}</h3>
      <button onClick={() => setCount(count - 10)}>-10</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count + 10)}>+10</button>
      <button onClick={() => setCount(0)}>reset</button>

      {/* 레시피 데이터 표시 (선택 사항) */}
      <h2>칵테일 레시피</h2>
      {loading && <p>레시피를 불러오는 중...</p>}
      {error && <p>레시피를 불러오는데 오류가 발생했습니다: {error.message}</p>}
      {!loading && !error && (
        <>
          {filteredRecipes.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <ul>
              {filteredRecipes.map((recipe) => (
                // key : 리액트가 각 항목을 구분할 때 사용하는 고유값 (목록 출력시)
                <li
                  key={recipe.id}
                  style={{ marginBottom: "20px", listStyle: "none" }}
                >
                  <h4>{recipe.name}</h4>
                  {/* 이미지가 저장된 경로가 URL이라면 src에 그대로 넣고, 파일명만 있다면 서버 주소를 붙여야 할 수도 있습니다. */}
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      style={{ width: "150px", display: "block" }}
                    />
                  )}
                  <p>{recipe.description}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default MainPage;
