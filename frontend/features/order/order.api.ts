import { axiosInstanceV1, axiosInstanceV3 } from "@/lib/axios/axiosInstance";

const API_URL = "/orders";

export const fetchBuyerOrders = async ({
  page = 1,
  limit = 10,
  filters = "",
  fields,
}: {
  page: number;
  limit: number;
  filters: string;
  fields?: string;
}): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/buyer`, {
      params: {
        page,
        limit,
        filters,
        fields,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const fetchAdminOrders = async ({
  page = 1,
  limit = 10,
  filters = "",
  fields,
}: {
  page: number;
  limit: number;
  filters: string;
  fields?: string;
}): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/admin`, {
      params: {
        page,
        limit,
        filters,
        fields,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetchAdminOrders:", error);
    throw error;
  }
};

export const fetchOrdersByFreelancer = async (
  queryStr: string,
): Promise<any> => {
  const response = await axiosInstanceV1.get(
    `${API_URL}/freelancer?${queryStr}`,
  );
  return response;
};

export const fetchOrdersByBuyer = async (queryStr: string): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/buyer?${queryStr}`);
  return response;
};

export const fetchOrdersByAdmin = async (queryStr: string): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/admin?${queryStr}`);
  return response;
};

export const submitOrderAnswer = async (
  orderId: string,
  questionId: string,
  answer: string,
  file: any,
): Promise<any> => {
  const formData = new FormData();
  formData.append("id", questionId);
  formData.append("orderId", orderId);
  formData.append("answer", answer);

  if (file) {
    const newFileName = `order___${orderId}___${file.name.replaceAll(" ", "_")}`;
    const newFile = new File([file], newFileName, {
      type: file.type,
    });

    const fileForm = new FormData();
    fileForm.append("file", newFile);

    const { data, status } = await axiosInstanceV1.post(
      "/file/upload",
      fileForm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (status === 201) {
      console.log("File uploaded successfully", data);
      formData.append("file", JSON.stringify(data));
    }
  }

  const response = await axiosInstanceV1.patch(
    `/orders/questions-answers/${questionId}`,
    formData,
  );

  return response;
};

export const fetchFreelancerOrders = async ({
  page = 1,
  limit = 10,
  filters = "",
  fields,
}: {
  page: number;
  limit: number;
  filters: string;
  fields?: string;
}): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/freelancer`, {
      params: {
        page,
        limit,
        filters,
        fields,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by id:", error);
    throw error;
  }
};

export const getOrderReviewById = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(`/reviews/order/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order review by id:", error);
    throw error;
  }
};

export const updateOrderByAction = async (
  id: string,
  action: string,
): Promise<any> => {
  try {
    const response = await axiosInstanceV1.patch(`/orders/action/${id}`, {
      action: action,
    });

    return response;
  } catch (error) {
    console.error("Error updateOrderByAction :", error);
    throw error;
  }
};
