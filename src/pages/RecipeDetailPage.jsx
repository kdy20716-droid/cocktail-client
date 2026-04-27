import { useEffect } from "react";
import "./RecipeDetailPage.css";

const RecipeDetailPage = () => {
  useEffect(() => {}, []);

  return (
    <div className="detail-page">
      <h3>재료</h3>
      <ul className="ingredient-list"></ul>

      <h3>만드는 방법</h3>
      <ol className="direction-list"></ol>
    </div>
  );
};

export default RecipeDetailPage;
