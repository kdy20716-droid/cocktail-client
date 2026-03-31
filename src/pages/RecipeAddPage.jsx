import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeAddPage = () => {
  // 입력창에 들어가는 값들은 state로 관리
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, image, description }),
    }).then((response) => {
      if (response.ok) {
        alert("레시피가 추가되었습니다.");
        setName("");
        setImage("");
        setDescription("");
      } else {
        alert("레시피 추가에 실패했습니다.");
      }
    });
    navigate("/");
  };
  return (
    <>
      <h2>레시피 추가</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="레시피 이름 입력"
        />
        <input
          type="text"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="레시피 이미지 URL 입력"
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="레시피 설명 입력"
        />
        <button>레시피 추가</button>
      </form>
    </>
  );
};
export default RecipeAddPage;
