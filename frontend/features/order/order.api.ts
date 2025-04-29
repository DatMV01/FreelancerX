import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

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
