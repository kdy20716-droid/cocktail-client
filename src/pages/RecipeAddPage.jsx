import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../api/recipes";
import "./RecipeAddPage.css";

const RecipeAddPage = () => {
  // 입력창에 들어가는 값들은 state로 관리
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // 파일 객체를 저장하도록 변경
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]); // 재료 상태 관리
  const [directions, setDirections] = useState([""]); // 단계별 레시피 상태 관리
  const navigate = useNavigate();

  // 재료 입력값 변경 핸들러
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 재료 입력칸 추가 핸들러
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  // 재료 입력칸 삭제 핸들러
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

  // 레시피 단계 입력칸 추가 핸들러
  const handleAddDirection = () => {
    setDirections([...directions, ""]);
  };

  // 레시피 단계 입력칸 삭제 핸들러
  const handleRemoveDirection = (index) => {
    const newDirections = directions.filter((_, i) => i !== index);
    setDirections(newDirections);
  };

  // 컴포넌트가 처음 화면에 나타날 때 로그인 상태를 확인합니다.
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. localStorage에서 로그인한 사용자 정보를 가져옵니다.
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(savedUser);

    try {
      // 2. 이미지를 포함한 폼 데이터를 만들기 위해 FormData 사용
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image); // 파일 추가
      }
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("directions", JSON.stringify(directions));

      const response = await addRecipe(formData);
      if (response.ok) {
        alert("레시피가 추가되었습니다.");
        navigate("/"); // 성공 시 메인 페이지로 이동
      } else {
        alert("레시피 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("레시피 추가 중 오류 발생:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="recipe-add-container">
      <h2>레시피 추가</h2>
      <form className="recipe-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="레시피 이름 입력"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files[0])} // 선택한 파일 객체 저장
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="레시피 설명 입력"
          required
        />

        <div style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
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
            <div
              key={index}
              style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
            >
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                placeholder="재료명 (예: 레몬즙)"
                style={{ flex: 2, marginBottom: 0 }}
                required
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) =>
                  handleIngredientChange(index, "amount", e.target.value)
                }
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <label style={{ fontWeight: "bold", color: "#444" }}>
              만드는 방법
            </label>
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
            <div
              key={index}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontWeight: "bold", color: "#666", minWidth: "20px" }}
              >
                {index + 1}.
              </span>
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
          레시피 추가
        </button>
      </form>
    </div>
  );
};
export default RecipeAddPage;
