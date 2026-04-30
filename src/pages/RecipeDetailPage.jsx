import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, toggleLike } from "../api/recipes";
import "./RecipeDetailPage.css";

const RecipeDetailPage = () => {
  const { id } = useParams(); // URL 주소에 있는 id 값을 가져옵니다.
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수 상태

  // 로그인한 사용자 정보 가져오기
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setLikeCount(data.like_count || 0); // 서버에서 받은 좋아요 수 저장
      } catch (error) {
        console.error("레시피를 불러오는데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    try {
      const response = await toggleLike(id, user.id);
      const data = await response.json();
      if (response.ok) {
        if (data.isLiked) {
          setLikeCount((prev) => prev + 1);
        } else {
          setLikeCount((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중이거나 데이터가 없을 때의 화면
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
    );
  }
  if (!recipe) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        레시피 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // DB에 문자열(JSON)로 저장된 재료와 만드는 방법을 배열로 변환 (오류 방지를 위해 try-catch 사용)
  let ingredients = [];
  let directions = [];
  try {
    ingredients = recipe.ingredients ? JSON.parse(recipe.ingredients) : [];
    if (!Array.isArray(ingredients)) ingredients = []; // 배열이 아니면 빈 배열로 강제 변환
  } catch (e) {
    console.error("재료 데이터 파싱 오류:", e);
  }
  try {
    directions = recipe.directions ? JSON.parse(recipe.directions) : [];
    if (!Array.isArray(directions)) directions = []; // 배열이 아니면 빈 배열로 강제 변환
  } catch (e) {
    console.error("만드는 방법 데이터 파싱 오류:", e);
  }

  return (
    <div className="detail-page">
      {/* 레시피 이미지 */}
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}

      {/* 레시피 제목과 설명 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>{recipe.name}</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* 수정 버튼 (작성자 또는 관리자만 표시) */}
          {user &&
            (user.email === "admin@cocktail.com" ||
              user.id === recipe.user_id) && (
              <button
                onClick={() => navigate(`/recipes/${id}/edit`)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  color: "#333",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0e0e0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
              >
                수정
              </button>
            )}
          {/* 좋아요 버튼 추가 */}
          <button
            onClick={handleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 16px",
              backgroundColor: "#fff",
              border: "1px solid #ff6b81",
              borderRadius: "20px",
              color: "#ff6b81",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#fff0f2")
            }
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            <span style={{ fontSize: "18px" }}>❤️</span>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize: "14px", color: "#888", margin: "10px 0 15px 0" }}>
        작성자: {recipe.author_name || "알 수 없음"}
      </p>
      <p>{recipe.description}</p>

      <h3>재료</h3>
      <ul className="ingredient-list">
        {ingredients.map((ing, index) => (
          <li key={index}>
            <span>{ing.name}</span>
            <span style={{ fontWeight: "bold", color: "#4b3a2f" }}>
              {ing.amount}
            </span>
          </li>
        ))}
      </ul>

      <h3>만드는 방법</h3>
      <ol className="direction-list">
        {directions.map((dir, index) => (
          <li key={index}>
            <span className="step-num">{index + 1}</span>
            <span>{dir}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetailPage;
