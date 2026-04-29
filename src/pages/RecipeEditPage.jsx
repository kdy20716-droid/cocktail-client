import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById, updateRecipe } from "../api/recipes";
import "./RecipeAddPage.css"; // 재사용

const RecipeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 입력창에 들어가는 값들은 state로 관리
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(""); // 기존 이미지 URL
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const [directions, setDirections] = useState([""]);
  const [loading, setLoading] = useState(true);

  // 재료 입력값 변경 핸들러
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // 레시피 단계 입력값 변경 핸들러
  const handleDirectionChange = (index, value) => {
    const newDirections = [...directions];
    newDirections[index] = value;
    setDirections(newDirections);
  };

  const handleAddDirection = () => {
    setDirections([...directions, ""]);
  };

  const handleRemoveDirection = (index) => {
    const newDirections = directions.filter((_, i) => i !== index);
    setDirections(newDirections);
  };

  // 컴포넌트 마운트 시 로그인 상태 확인 및 레시피 데이터 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(savedUser);

    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        
        // 권한 확인 (관리자 또는 작성자 본인)
        if (user.email !== "admin@cocktail.com" && data.user_id !== user.id) {
          alert("수정 권한이 없습니다.");
          navigate(-1);
          return;
        }

        setName(data.name || "");
        setDescription(data.description || "");
        setCurrentImage(data.image || "");

        try {
          const parsedIngredients = data.ingredients ? JSON.parse(data.ingredients) : [{ name: "", amount: "" }];
          setIngredients(Array.isArray(parsedIngredients) && parsedIngredients.length > 0 ? parsedIngredients : [{ name: "", amount: "" }]);
        } catch (e) {
          setIngredients([{ name: "", amount: "" }]);
        }

        try {
          const parsedDirections = data.directions ? JSON.parse(data.directions) : [""];
          setDirections(Array.isArray(parsedDirections) && parsedDirections.length > 0 ? parsedDirections : [""]);
        } catch (e) {
          setDirections([""]);
        }
      } catch (error) {
        console.error("레시피를 불러오는데 실패했습니다.", error);
        alert("레시피를 불러오는데 실패했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image); // 새로운 이미지 파일 추가
      }
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("directions", JSON.stringify(directions));

      const response = await updateRecipe(id, formData);
      if (response.ok) {
        alert("레시피가 성공적으로 수정되었습니다.");
        navigate(`/recipes/${id}`); // 수정 완료 후 상세 페이지로 이동
      } else {
        alert("레시피 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("레시피 수정 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>;
  }

  return (
    <div className="recipe-add-container">
      <h2>레시피 수정</h2>
      <form className="recipe-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="레시피 이름 입력"
          required
        />
        
        <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
          <label style={{ fontWeight: "bold", color: "#444", display: "block", marginBottom: "10px" }}>레시피 이미지</label>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentImage && !image && (
              <div style={{ position: "relative", display: "inline-block", width: "fit-content" }}>
                <img src={currentImage} alt="현재 이미지" style={{ width: "150px", height: "150px", borderRadius: "8px", objectFit: "cover", border: "1px solid #ddd" }} />
                <button
                  type="button"
                  onClick={() => setCurrentImage("")}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  title="현재 이미지 삭제"
                >
                  ✕
                </button>
              </div>
            )}
            
            {image && (
              <div style={{ position: "relative", display: "inline-block", width: "fit-content" }}>
                <img src={URL.createObjectURL(image)} alt="새로운 이미지" style={{ width: "150px", height: "150px", borderRadius: "8px", objectFit: "cover", border: "2px solid #28a745" }} />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                  title="새로운 이미지 취소"
                >
                  ✕
                </button>
              </div>
            )}

            {(!currentImage || currentImage === "") && !image ? (
               <input
                 type="file"
                 accept="image/*"
                 onChange={(event) => setImage(event.target.files[0])}
                 required={true}
               />
            ) : (
               (!image && currentImage !== "") && (
                 <input
                   type="file"
                   accept="image/*"
                   onChange={(event) => setImage(event.target.files[0])}
                   style={{ marginTop: "5px" }}
                 />
               )
            )}
          </div>
        </div>
        
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="레시피 설명 입력"
          required
        />

        <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", color: "#444" }}>재료</label>
            <button
              type="button"
              onClick={handleAddIngredient}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              + 재료 추가
            </button>
          </div>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                placeholder="재료명 (예: 레몬즙)"
                style={{ flex: 2, marginBottom: 0 }}
                required
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                placeholder="용량 (예: 15ml)"
                style={{ flex: 1, marginBottom: 0 }}
                required
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                  style={{
                    padding: "0 10px",
                    background: "none",
                    border: "none",
                    color: "#ff4d4f",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", color: "#444" }}>만드는 방법</label>
            <button
              type="button"
              onClick={handleAddDirection}
              style={{
                padding: "6px 12px",
                backgroundColor: "#f0f0f0",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              + 단계 추가
            </button>
          </div>
          {directions.map((direction, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <span style={{ fontWeight: "bold", color: "#666", minWidth: "20px" }}>{index + 1}.</span>
              <input
                type="text"
                value={direction}
                onChange={(e) => handleDirectionChange(index, e.target.value)}
                placeholder={`단계 ${index + 1} 설명`}
                style={{ flex: 1, marginBottom: 0 }}
                required
              />
              {directions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDirection(index)}
                  style={{
                    padding: "0 10px",
                    background: "none",
                    border: "none",
                    color: "#ff4d4f",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="recipe-add-button" type="submit">
          레시피 수정 완료
        </button>
      </form>
    </div>
  );
};
export default RecipeEditPage;
