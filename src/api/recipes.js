const BASE_URL = "http://localhost:4000/recipes";

// 레시피 목록 조회 API
export const getRecipes = async (searchTerm) => {
  const url = searchTerm ? `${BASE_URL}?query=${searchTerm}` : BASE_URL;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// 레시피 추가 API
export const addRecipe = async (recipeData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      // 로컬 스토리지에 토큰이 있을 경우, Authorization 헤더에 담아 보냅니다.
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: recipeData, // FormData 객체를 그대로 전송합니다. Content-Type은 브라우저가 자동 설정합니다.
  });
  return response;
};

// 특정 사용자의 레시피 목록 조회 API
export const getRecipesByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// 특정 레시피 상세 조회 API
export const getRecipeById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// 레시피 삭제 API
export const deleteRecipe = async (id, email) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }), // 관리자 확인을 위해 이메일 전달
  });
  return response;
};

// 특정 레시피의 댓글 목록 조회 API
export const getComments = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/${recipeId}/comments`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// 특정 레시피에 댓글 추가 API
export const addComment = async (recipeId, commentData) => {
  const response = await fetch(`${BASE_URL}/${recipeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });
  return response;
};

// 특정 레시피 좋아요 토글 API
export const toggleLike = async (recipeId, userId) => {
  const response = await fetch(`${BASE_URL}/${recipeId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return response;
};

// 특정 레시피의 댓글 삭제 API
export const deleteComment = async (recipeId, commentId, userId) => {
  const response = await fetch(
    `${BASE_URL}/${recipeId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    },
  );
  return response;
};
