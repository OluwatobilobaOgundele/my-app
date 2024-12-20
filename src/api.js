const API_URL = "https://jsonplaceholder.typicode.com";

export const fetchTodos = async (page = 1) => {
  const response = await fetch(`${API_URL}/todos?_page=${page}&_limit=10`);
  if (!response.ok) throw new Error("Failed to fetch todos");
  
  const todos = await response.json();
  const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
  
  return {
    data: todos,
    totalCount: totalCount
  };
};

export const fetchTodoDetails = async (id) => {
  if (!id) {
    throw new Error("Invalid todo ID. Cannot fetch details.");
  }

  try {
    const response = await fetch(`${API_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch todo details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching todo details:", error);
    throw new Error("Invalid todo ID. Cannot fetch details.");
  }
};

