import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRecipe } from "../api/recipes.js";
import "./RecipeAddModal.css";

const RecipeAddModal = ({ onClose }) => {
  // 입력창에 들어가는 값들은 state로 관리
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // 파일 객체를 저장하도록 변경
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]); // 재료 상태 추가
  const [directions, setDirections] = useState([""]); // 단계별 레시피 상태 추가
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. 현재 로그인한 유저 정보 가져오기
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(savedUser);

    // 레시피 추가 기능
    try {
      // 이미지를 포함한 폼 데이터를 만들기 위해 FormData 사용
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image); // 파일 추가
      }
      // 재료 배열을 JSON 문자열로 변환하여 폼 데이터에 추가
      formData.append("ingredients", JSON.stringify(ingredients));
      // 만드는 방법 배열을 JSON 문자열로 변환하여 폼 데이터에 추가
      formData.append("directions", JSON.stringify(directions));

      const response = await addRecipe(formData);

      if (response.ok) {
        alert("레시피가 추가되었습니다.");
        onClose(); // 모달 닫기
        window.location.reload(); // 새로 추가된 레시피를 화면에 반영하기 위해 새로고침
      } else {
        alert("레시피 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>레시피 추가</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="레시피 이름 입력"
          />
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files[0])} // 선택한 파일 객체 저장
          />
          <input
            className="input"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="레시피 설명 입력"
          />

          <div
            style={{ width: "100%", marginBottom: "15px", textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{ fontSize: "14px", fontWeight: "bold", color: "#444" }}
              >
                재료
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#f0f0f0",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                + 추가
              </button>
            </div>
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <input
                  className="input"
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  placeholder="재료명 (예: 럼)"
                  style={{ flex: 2, margin: 0 }}
                />
                <input
                  className="input"
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, "amount", e.target.value)
                  }
                  placeholder="용량 (예: 45ml)"
                  style={{ flex: 1, margin: 0 }}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff4d4f",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: "0 5px",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div
            style={{ width: "100%", marginBottom: "20px", textAlign: "left" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label
                style={{ fontSize: "14px", fontWeight: "bold", color: "#444" }}
              >
                만드는 방법
              </label>
              <button
                type="button"
                onClick={handleAddDirection}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#f0f0f0",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
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
                  gap: "8px",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    color: "#666",
                    minWidth: "20px",
                  }}
                >
                  {index + 1}.
                </span>
                <input
                  className="input"
                  type="text"
                  value={direction}
                  onChange={(e) => handleDirectionChange(index, e.target.value)}
                  placeholder={`단계 ${index + 1} 설명`}
                  style={{ flex: 1, margin: 0 }}
                />
                {directions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDirection(index)}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#ff4d4f",
                      cursor: "pointer",
                      fontWeight: "bold",
                      padding: "0 5px",
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="btn">추가하기</button>
        </form>
      </div>
    </div>
  );
};
export default RecipeAddModal;
